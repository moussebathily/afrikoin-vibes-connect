import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TabaskiReservationRequest {
  reservationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  livestockName: string;
  livestockBreed: string;
  livestockPrice: number;
  sellerName: string;
  deliveryDate: string;
  deliveryAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TabaskiReservationRequest = await req.json();

    // Validate required fields
    if (!data.customerEmail || !data.reservationNumber || !data.customerName) {
      throw new Error("Missing required fields: customerEmail, reservationNumber, customerName");
    }

    const formattedPrice = new Intl.NumberFormat('fr-FR').format(data.livestockPrice);
    const formattedDate = new Date(data.deliveryDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailResponse = await resend.emails.send({
      from: "Afrikoin Tabaski <noreply@afrikoin.com>",
      to: [data.customerEmail],
      subject: `🐑 Confirmation de réservation Tabaski - ${data.reservationNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🐑 Tabaski 2025</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Réservation confirmée !</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Assalamou Alaykoum <strong>${data.customerName}</strong>,</p>
              
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Votre réservation pour la Tabaski a été enregistrée avec succès. Voici les détails de votre commande :
              </p>
              
              <!-- Reservation Card -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 15px 0; color: #92400e;">Détails de la réservation</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">N° Réservation</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #333; text-align: right;">${data.reservationNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Animal</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #333; text-align: right;">${data.livestockName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Race</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #333; text-align: right;">${data.livestockBreed}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Vendeur</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #333; text-align: right;">${data.sellerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Prix</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #ea580c; text-align: right; font-size: 18px;">${formattedPrice} FCFA</td>
                  </tr>
                </table>
              </div>
              
              <!-- Delivery Info -->
              <div style="background-color: #ecfdf5; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #10b981;">
                <h3 style="margin: 0 0 15px 0; color: #065f46;">🚚 Livraison</h3>
                <p style="margin: 5px 0; color: #333;"><strong>Date :</strong> ${formattedDate}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Adresse :</strong> ${data.deliveryAddress}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Téléphone :</strong> ${data.customerPhone}</p>
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #374151;">📋 Prochaines étapes</h3>
                <ol style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                  <li>Le vendeur va confirmer la disponibilité de l'animal</li>
                  <li>Vous recevrez un appel pour finaliser les détails</li>
                  <li>Le paiement sera effectué à la livraison</li>
                  <li>Livraison garantie avant Tabaski ! 🎉</li>
                </ol>
              </div>
              
              <p style="font-size: 14px; color: #666; line-height: 1.6;">
                Si vous avez des questions, n'hésitez pas à nous contacter via l'application Afrikoin.
              </p>
              
              <p style="font-size: 16px; color: #333; margin-top: 30px;">
                Bonne préparation de Tabaski !<br>
                <strong>L'équipe Afrikoin</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">
                © 2025 Afrikoin - La marketplace africaine
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Tabaski reservation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-tabaski-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
