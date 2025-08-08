import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CREATE-LIKE-CHECKOUT] Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log("[CREATE-LIKE-CHECKOUT] User authenticated", { userId: user.id, email: user.email });

    const { pack_id } = await req.json();
    
    // Define available packs
    const packs = {
      likes_1000: {
        name: "Pack 1000 Likes",
        likes_amount: 1000,
        price_amount: 299, // €2.99 in cents
        currency: "eur"
      }
    };

    const pack = packs[pack_id as keyof typeof packs];
    if (!pack) throw new Error("Invalid pack ID");

    console.log("[CREATE-LIKE-CHECKOUT] Pack selected", { pack_id, pack });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: pack.currency,
            product_data: { name: pack.name },
            unit_amount: pack.price_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/wallet`,
    });

    console.log("[CREATE-LIKE-CHECKOUT] Stripe session created", { sessionId: session.id });

    // Log the purchase as pending
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: insertError } = await supabaseService.from("like_purchases").insert({
      user_id: user.id,
      pack_name: pack.name,
      product_id: pack_id,
      likes_amount: pack.likes_amount,
      price_amount: pack.price_amount,
      currency: pack.currency,
      store_type: "stripe",
      purchase_token: session.id,
      status: "pending"
    });

    if (insertError) {
      console.error("[CREATE-LIKE-CHECKOUT] Error inserting purchase", insertError);
      throw new Error("Failed to log purchase");
    }

    console.log("[CREATE-LIKE-CHECKOUT] Purchase logged as pending");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[CREATE-LIKE-CHECKOUT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});