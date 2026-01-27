import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RentalNotificationRequest {
  rental_id: string;
  notification_type: 'new_rental' | 'status_change' | 'driver_assigned' | 'payment_update';
  new_status?: string;
  driver_name?: string;
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    active: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };
  return labels[status] || status;
};

const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    paid: 'Payé',
    partial: 'Partiel',
    refunded: 'Remboursé'
  };
  return labels[status] || status;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { rental_id, notification_type, new_status, driver_name }: RentalNotificationRequest = await req.json();

    if (!rental_id || !notification_type) {
      throw new Error("Missing required fields: rental_id and notification_type");
    }

    // Fetch rental details with vehicle info
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select(`
        *,
        vehicle:vehicles(brand, model, plate_number)
      `)
      .eq('id', rental_id)
      .single();

    if (rentalError || !rental) {
      throw new Error(`Rental not found: ${rentalError?.message}`);
    }

    // Get customer email from auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(rental.customer_id);
    
    if (userError || !userData?.user?.email) {
      console.log("Could not get customer email, skipping notification");
      return new Response(
        JSON.stringify({ success: true, message: "No email available for customer" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const customerEmail = userData.user.email;
    const vehicleInfo = rental.vehicle 
      ? `${rental.vehicle.brand} ${rental.vehicle.model} (${rental.vehicle.plate_number})`
      : 'Véhicule non spécifié';

    let subject = '';
    let htmlContent = '';

    const baseStyles = `
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { color: #6b7280; }
        .detail-value { font-weight: 600; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #d1fae5; color: #065f46; }
        .status-active { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #e0e7ff; color: #3730a3; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .highlight { background: #fff7ed; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    `;

    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    switch (notification_type) {
      case 'new_rental':
        subject = `🚗 Nouvelle réservation ${rental.rental_number} - AfriKoin`;
        htmlContent = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>🚗 Réservation Confirmée!</h1>
              <p style="margin:0; opacity: 0.9;">N° ${rental.rental_number}</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Votre demande de location a été enregistrée avec succès!</p>
              
              <div class="highlight">
                <h3 style="margin-top:0;">📋 Détails de la réservation</h3>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${vehicleInfo}</span></div>
                <div class="detail-row"><span class="detail-label">Du</span><span class="detail-value">${formatDate(rental.start_date)}</span></div>
                <div class="detail-row"><span class="detail-label">Au</span><span class="detail-value">${formatDate(rental.end_date)}</span></div>
                <div class="detail-row"><span class="detail-label">Durée</span><span class="detail-value">${rental.total_days} jour(s)</span></div>
                <div class="detail-row"><span class="detail-label">Avec chauffeur</span><span class="detail-value">${rental.with_driver ? 'Oui' : 'Non'}</span></div>
                <div class="detail-row"><span class="detail-label">Lieu de prise</span><span class="detail-value">${rental.pickup_address}</span></div>
              </div>

              <div class="highlight" style="background: #f0fdf4;">
                <h3 style="margin-top:0;">💰 Tarification</h3>
                <div class="detail-row"><span class="detail-label">Tarif journalier</span><span class="detail-value">${rental.daily_rate.toLocaleString()} ${rental.currency}</span></div>
                ${rental.with_driver ? `<div class="detail-row"><span class="detail-label">Tarif chauffeur/jour</span><span class="detail-value">${rental.driver_daily_rate.toLocaleString()} ${rental.currency}</span></div>` : ''}
                <div class="detail-row"><span class="detail-label">Sous-total</span><span class="detail-value">${rental.subtotal.toLocaleString()} ${rental.currency}</span></div>
                <div class="detail-row"><span class="detail-label">Caution</span><span class="detail-value">${rental.deposit.toLocaleString()} ${rental.currency}</span></div>
                <div class="detail-row" style="border-bottom:none;"><span class="detail-label" style="font-weight:bold;">Total</span><span class="detail-value" style="font-size:1.2em; color:#059669;">${rental.total_amount.toLocaleString()} ${rental.currency}</span></div>
              </div>

              <p>Notre équipe va traiter votre demande et vous contacter sous peu pour confirmer la disponibilité.</p>
            </div>
            <div class="footer">
              <p>Merci de votre confiance! 🙏</p>
              <p>© ${new Date().getFullYear()} AfriKoin Transport</p>
            </div>
          </div>
        `;
        break;

      case 'status_change':
        const statusClass = `status-${new_status || rental.status}`;
        subject = `📝 Mise à jour location ${rental.rental_number} - ${getStatusLabel(new_status || rental.status)}`;
        htmlContent = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>📝 Mise à jour de votre location</h1>
              <p style="margin:0; opacity: 0.9;">N° ${rental.rental_number}</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Le statut de votre location a été mis à jour.</p>
              
              <div class="highlight" style="text-align: center;">
                <p style="margin-bottom: 5px;">Nouveau statut:</p>
                <span class="status-badge ${statusClass}">${getStatusLabel(new_status || rental.status)}</span>
              </div>

              <div class="highlight">
                <h3 style="margin-top:0;">📋 Rappel de la réservation</h3>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${vehicleInfo}</span></div>
                <div class="detail-row"><span class="detail-label">Période</span><span class="detail-value">${formatDate(rental.start_date)} - ${formatDate(rental.end_date)}</span></div>
                <div class="detail-row"><span class="detail-label">Total</span><span class="detail-value">${rental.total_amount.toLocaleString()} ${rental.currency}</span></div>
              </div>

              ${new_status === 'confirmed' ? '<p style="color:#059669;">✅ Votre véhicule est réservé et vous attend!</p>' : ''}
              ${new_status === 'active' ? '<p style="color:#2563eb;">🚗 Bonne route! N\'hésitez pas à nous contacter en cas de besoin.</p>' : ''}
              ${new_status === 'completed' ? '<p style="color:#7c3aed;">🎉 Merci d\'avoir utilisé nos services! Nous espérons vous revoir bientôt.</p>' : ''}
              ${new_status === 'cancelled' ? '<p style="color:#dc2626;">La location a été annulée. Contactez-nous pour plus d\'informations.</p>' : ''}
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AfriKoin Transport</p>
            </div>
          </div>
        `;
        break;

      case 'driver_assigned':
        subject = `🧑‍✈️ Chauffeur assigné - Location ${rental.rental_number}`;
        htmlContent = `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>🧑‍✈️ Chauffeur Assigné!</h1>
              <p style="margin:0; opacity: 0.9;">N° ${rental.rental_number}</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Un chauffeur a été assigné à votre location!</p>
              
              <div class="highlight" style="text-align: center; background: #dbeafe;">
                <p style="margin-bottom: 5px;">Votre chauffeur:</p>
                <p style="font-size: 1.3em; font-weight: bold; margin: 0; color: #1e40af;">${driver_name || 'Chauffeur professionnel'}</p>
              </div>

              <div class="highlight">
                <h3 style="margin-top:0;">📋 Détails de la location</h3>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${vehicleInfo}</span></div>
                <div class="detail-row"><span class="detail-label">Date de début</span><span class="detail-value">${formatDate(rental.start_date)}</span></div>
                <div class="detail-row"><span class="detail-label">Lieu de prise</span><span class="detail-value">${rental.pickup_address}</span></div>
              </div>

              <p>Votre chauffeur vous contactera avant le début de la location.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AfriKoin Transport</p>
            </div>
          </div>
        `;
        break;

      case 'payment_update':
        subject = `💳 Mise à jour paiement - Location ${rental.rental_number}`;
        htmlContent = `
          ${baseStyles}
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #10b981, #059669);">
              <h1>💳 Mise à jour du paiement</h1>
              <p style="margin:0; opacity: 0.9;">N° ${rental.rental_number}</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Le statut de paiement de votre location a été mis à jour.</p>
              
              <div class="highlight" style="text-align: center; background: #d1fae5;">
                <p style="margin-bottom: 5px;">Statut du paiement:</p>
                <span class="status-badge status-confirmed">${getPaymentStatusLabel(rental.payment_status)}</span>
              </div>

              <div class="highlight">
                <h3 style="margin-top:0;">📋 Récapitulatif</h3>
                <div class="detail-row"><span class="detail-label">N° Location</span><span class="detail-value">${rental.rental_number}</span></div>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${vehicleInfo}</span></div>
                <div class="detail-row"><span class="detail-label">Montant total</span><span class="detail-value">${rental.total_amount.toLocaleString()} ${rental.currency}</span></div>
                <div class="detail-row"><span class="detail-label">Mode de paiement</span><span class="detail-value">${rental.payment_method}</span></div>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AfriKoin Transport</p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error(`Unknown notification type: ${notification_type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "AfriKoin Transport <noreply@afrikoin.app>",
      to: [customerEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Rental notification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", data: emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-rental-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
