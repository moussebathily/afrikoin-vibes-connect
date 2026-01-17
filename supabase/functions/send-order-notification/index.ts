import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  order_id: string;
  notification_type: "order_created" | "status_changed" | "payment_confirmed";
  new_status?: string;
}

interface OrderData {
  id: string;
  order_number: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    country: string;
  };
  created_at: string;
}

const formatPrice = (price: number, currency: string = "XOF") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
};

const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    mobile_money: "Mobile Money",
    cash_on_delivery: "Paiement à la livraison",
    stripe: "Carte bancaire",
  };
  return labels[method] || method;
};

const generateOrderCreatedEmail = (order: OrderData, buyerEmail: string) => {
  const shippingAddress = order.shipping_address;
  
  return {
    to: [buyerEmail],
    subject: `Confirmation de commande ${order.order_number} - AfriKoin`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Commande Confirmée!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${shippingAddress?.full_name || "Client"}</strong>,
          </p>
          
          <p style="font-size: 16px;">
            Merci pour votre commande sur AfriKoin ! Nous avons bien reçu votre commande et elle est en cours de traitement.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #FF6B35;">Détails de la commande</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Numéro de commande:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${order.order_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Date:</td>
                <td style="padding: 8px 0; text-align: right;">${new Date(order.created_at).toLocaleDateString("fr-FR", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Mode de paiement:</td>
                <td style="padding: 8px 0; text-align: right;">${getPaymentMethodLabel(order.payment_method)}</td>
              </tr>
              <tr style="border-top: 2px solid #FF6B35;">
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px; text-align: right; color: #FF6B35;">
                  ${formatPrice(order.total_amount, order.currency)}
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #FF6B35;">📍 Adresse de livraison</h2>
            <p style="margin: 0; color: #666;">
              ${shippingAddress?.full_name}<br>
              ${shippingAddress?.address_line1}<br>
              ${shippingAddress?.city}, ${shippingAddress?.country}<br>
              Tél: ${shippingAddress?.phone}
            </p>
          </div>
          
          ${order.payment_method === "mobile_money" ? `
          <div style="background: #FFF3E0; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #FF6B35;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #E65100;">📱 Instructions de paiement Mobile Money</h3>
            <p style="margin: 0; color: #666;">
              Vous recevrez une notification de paiement sur votre téléphone. Veuillez confirmer le paiement pour finaliser votre commande.
            </p>
          </div>
          ` : ""}
          
          ${order.payment_method === "cash_on_delivery" ? `
          <div style="background: #E8F5E9; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2E7D32;">💵 Paiement à la livraison</h3>
            <p style="margin: 0; color: #666;">
              Veuillez préparer le montant exact de ${formatPrice(order.total_amount, order.currency)} pour le paiement à la réception.
            </p>
          </div>
          ` : ""}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://afrikoin-app.lovable.app/tracking" style="display: inline-block; background: #FF6B35; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Suivre ma commande
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
            Merci de votre confiance !<br>
            L'équipe AfriKoin 🌍
          </p>
        </div>
      </body>
      </html>
    `,
  };
};

const generateStatusChangeEmail = (order: OrderData, buyerEmail: string, newStatus: string) => {
  const shippingAddress = order.shipping_address;
  const statusLabel = getStatusLabel(newStatus);
  
  let statusIcon = "📦";
  let statusColor = "#FF6B35";
  let statusMessage = "";
  
  switch (newStatus) {
    case "confirmed":
      statusIcon = "✅";
      statusColor = "#4CAF50";
      statusMessage = "Votre commande a été confirmée et sera bientôt préparée.";
      break;
    case "processing":
      statusIcon = "🔧";
      statusColor = "#FF9800";
      statusMessage = "Votre commande est en cours de préparation.";
      break;
    case "shipped":
      statusIcon = "🚚";
      statusColor = "#2196F3";
      statusMessage = "Bonne nouvelle ! Votre commande est en route vers vous.";
      break;
    case "delivered":
      statusIcon = "🎉";
      statusColor = "#4CAF50";
      statusMessage = "Votre commande a été livrée avec succès !";
      break;
    case "cancelled":
      statusIcon = "❌";
      statusColor = "#F44336";
      statusMessage = "Votre commande a été annulée. Si vous avez des questions, contactez-nous.";
      break;
  }
  
  return {
    to: [buyerEmail],
    subject: `${statusIcon} Mise à jour de votre commande ${order.order_number} - AfriKoin`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${statusColor}; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${statusIcon} ${statusLabel}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${shippingAddress?.full_name || "Client"}</strong>,
          </p>
          
          <p style="font-size: 16px;">
            ${statusMessage}
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Commande:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${order.order_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Nouveau statut:</td>
                <td style="padding: 8px 0; text-align: right;">
                  <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                    ${statusLabel}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Total:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${formatPrice(order.total_amount, order.currency)}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://afrikoin-app.lovable.app/tracking" style="display: inline-block; background: ${statusColor}; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Voir les détails
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
            L'équipe AfriKoin 🌍
          </p>
        </div>
      </body>
      </html>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received notification request");
  
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { order_id, notification_type, new_status }: OrderNotificationRequest = await req.json();

    console.log(`Processing ${notification_type} notification for order ${order_id}`);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      throw new Error(`Order not found: ${order_id}`);
    }

    console.log("Order found:", order.order_number);

    // Get buyer email from auth.users via profiles or directly
    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", order.buyer_id)
      .single();

    // For now, we'll use a placeholder - in production, you'd fetch from auth.users
    // Since we can't query auth.users directly, we should store email in profiles
    // For demonstration, we'll use the shipping address info
    const shippingAddress = order.shipping_address as OrderData["shipping_address"];
    
    // In a real app, you'd have the email stored in profiles
    // For now, we'll log and skip if no email available
    console.log("Order shipping address:", shippingAddress);

    // Check if we have a way to get the email
    // This is a placeholder - you should add email to your profiles table
    let buyerEmail = "";
    
    // Try to get email from the request if provided
    const requestBody = await req.clone().json();
    if (requestBody.buyer_email) {
      buyerEmail = requestBody.buyer_email;
    }

    if (!buyerEmail) {
      console.log("No buyer email available - skipping email notification");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification processed but no email sent (email not available)",
          order_number: order.order_number 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let emailConfig;

    switch (notification_type) {
      case "order_created":
        emailConfig = generateOrderCreatedEmail(order as OrderData, buyerEmail);
        break;
      case "status_changed":
        if (!new_status) {
          throw new Error("new_status is required for status_changed notification");
        }
        emailConfig = generateStatusChangeEmail(order as OrderData, buyerEmail, new_status);
        break;
      case "payment_confirmed":
        emailConfig = generateStatusChangeEmail(order as OrderData, buyerEmail, "confirmed");
        break;
      default:
        throw new Error(`Unknown notification type: ${notification_type}`);
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "AfriKoin <onboarding@resend.dev>",
      ...emailConfig,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        email_id: emailResponse.id,
        order_number: order.order_number 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-order-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
