import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Define pack configurations for validation
const PACK_CONFIGS = {
  likes_1000: {
    name: "Pack 1000 Likes",
    likes_amount: 1000,
    price_amount: 299, // €2.99 in cents
  }
} as const;

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

    const requestBody = await req.json();
    const { session_id } = requestBody;
    
    // Validate session_id format (basic UUID check)
    if (!session_id || typeof session_id !== 'string' || session_id.length < 10) {
      throw new Error("Invalid session ID format");
    }

    console.log("[VERIFY-LIKE-PAYMENT] Verifying session", { sessionId: session_id, userId: user.id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Verify payment status
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Verify the session belongs to this user (check customer email)
    if (session.customer_details?.email !== user.email && session.customer_email !== user.email) {
      console.error("[VERIFY-LIKE-PAYMENT] Email mismatch", { 
        sessionEmail: session.customer_details?.email || session.customer_email,
        userEmail: user.email 
      });
      throw new Error("Payment session does not belong to authenticated user");
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

    // Validate payment amount matches expected pack price
    const expectedPack = PACK_CONFIGS[existingPurchase.product_id as keyof typeof PACK_CONFIGS];
    if (!expectedPack) {
      console.error("[VERIFY-LIKE-PAYMENT] Unknown product_id", { product_id: existingPurchase.product_id });
      throw new Error("Invalid product configuration");
    }

    if (existingPurchase.price_amount !== expectedPack.price_amount) {
      console.error("[VERIFY-LIKE-PAYMENT] Price mismatch", {
        expected: expectedPack.price_amount,
        actual: existingPurchase.price_amount
      });
      throw new Error("Payment amount validation failed");
    }

    if (existingPurchase.likes_amount !== expectedPack.likes_amount) {
      console.error("[VERIFY-LIKE-PAYMENT] Likes amount mismatch", {
        expected: expectedPack.likes_amount,
        actual: existingPurchase.likes_amount
      });
      throw new Error("Likes amount validation failed");
    }

    // Verify payment amount from Stripe matches our records
    const sessionAmount = session.amount_total; // in cents
    if (sessionAmount !== existingPurchase.price_amount) {
      console.error("[VERIFY-LIKE-PAYMENT] Stripe amount mismatch", {
        stripeAmount: sessionAmount,
        recordedAmount: existingPurchase.price_amount
      });
      throw new Error("Payment amount mismatch with Stripe");
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

    // Credit the user's like balance atomically using SQL
    // This prevents race conditions by performing the increment in a single database operation
    const { data: updatedCredits, error: creditError } = await supabaseService.rpc('credit_likes', {
      p_user_id: user.id,
      p_likes_amount: existingPurchase.likes_amount
    });

    if (creditError) {
      console.error("[VERIFY-LIKE-PAYMENT] RPC credit_likes failed, trying fallback", creditError);
      
      // Fallback: Manual atomic update using PostgreSQL's built-in atomic operations
      const { data: currentCredits, error: fetchError } = await supabaseService
        .from("like_credits")
        .select("balance, total_purchased")
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw new Error("Failed to fetch current credits");

      const { data: updateResult, error: updateError } = await supabaseService
        .from("like_credits")
        .update({
          balance: (currentCredits.balance || 0) + existingPurchase.likes_amount,
          total_purchased: (currentCredits.total_purchased || 0) + existingPurchase.likes_amount,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id)
        .select("balance")
        .single();

      if (updateError) throw new Error("Failed to update like credits");
      
      const newBalance = updateResult.balance;
      console.log("[VERIFY-LIKE-PAYMENT] Like credits updated (fallback)", { newBalance });
    } else {
      const newBalance = updatedCredits;
      console.log("[VERIFY-LIKE-PAYMENT] Like credits updated (RPC)", { newBalance });
    }

    // Get final balance
    const { data: finalCredits } = await supabaseService
      .from("like_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    const newBalance = finalCredits?.balance || 0;

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