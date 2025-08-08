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
    console.log("[VERIFY-LIKE-PAYMENT] Function started");

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
    if (!user) throw new Error("User not authenticated");

    const { session_id } = await req.json();
    if (!session_id) throw new Error("Session ID required");

    console.log("[VERIFY-LIKE-PAYMENT] Verifying session", { sessionId: session_id, userId: user.id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    console.log("[VERIFY-LIKE-PAYMENT] Payment confirmed by Stripe");

    // Use service role to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if already processed (idempotency)
    const { data: existingPurchase } = await supabaseService
      .from("like_purchases")
      .select("*")
      .eq("purchase_token", session_id)
      .eq("user_id", user.id)
      .single();

    if (!existingPurchase) {
      throw new Error("Purchase not found");
    }

    if (existingPurchase.status === "paid") {
      console.log("[VERIFY-LIKE-PAYMENT] Payment already processed");
      
      // Get current balance
      const { data: credits } = await supabaseService
        .from("like_credits")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      return new Response(JSON.stringify({ 
        success: true, 
        already_processed: true,
        new_balance: credits?.balance || 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Mark purchase as paid
    const { error: updateError } = await supabaseService
      .from("like_purchases")
      .update({
        status: "paid",
        verified_at: new Date().toISOString()
      })
      .eq("purchase_token", session_id)
      .eq("user_id", user.id);

    if (updateError) throw new Error("Failed to update purchase status");

    console.log("[VERIFY-LIKE-PAYMENT] Purchase marked as paid");

    // Credit the user's like balance
    const { data: updatedCredits, error: creditError } = await supabaseService
      .from("like_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (creditError) throw new Error("Failed to get current credits");

    const newBalance = (updatedCredits.balance || 0) + existingPurchase.likes_amount;

    const { error: balanceError } = await supabaseService
      .from("like_credits")
      .update({
        balance: newBalance,
        total_purchased: supabaseService.rpc('increment_total_purchased', {
          user_id_param: user.id,
          amount: existingPurchase.likes_amount
        })
      })
      .eq("user_id", user.id);

    if (balanceError) {
      // Fallback: direct update
      const { error: fallbackError } = await supabaseService
        .from("like_credits")
        .update({
          balance: newBalance,
          total_purchased: (updatedCredits.total_purchased || 0) + existingPurchase.likes_amount
        })
        .eq("user_id", user.id);

      if (fallbackError) throw new Error("Failed to update like credits");
    }

    console.log("[VERIFY-LIKE-PAYMENT] Like credits updated", { newBalance });

    // Create transaction record
    const { error: transactionError } = await supabaseService
      .from("transactions")
      .insert({
        user_id: user.id,
        transaction_type: "purchase",
        amount: existingPurchase.price_amount / 100, // Convert cents to euros
        status: "succeeded",
        reference_id: existingPurchase.id,
        metadata: {
          stripe_session_id: session_id,
          likes_purchased: existingPurchase.likes_amount,
          pack_name: existingPurchase.pack_name
        }
      });

    if (transactionError) {
      console.error("[VERIFY-LIKE-PAYMENT] Failed to create transaction record", transactionError);
      // Don't fail the whole process for this
    }

    console.log("[VERIFY-LIKE-PAYMENT] Payment verification completed successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      new_balance: newBalance,
      likes_added: existingPurchase.likes_amount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[VERIFY-LIKE-PAYMENT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});