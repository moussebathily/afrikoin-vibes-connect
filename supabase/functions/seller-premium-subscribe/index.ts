// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLANS: Record<string, { amount: number; days: number; label: string }> = {
  monthly: { amount: 5000, days: 30, label: "Premium Mensuel" },
  quarterly: { amount: 13500, days: 90, label: "Premium Trimestriel" },
  yearly: { amount: 48000, days: 365, label: "Premium Annuel" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) throw new Error("Unauthorized");
    const user = userData.user;

    const { plan, payment_method = "mobile_money" } = await req.json();
    const planConfig = PLANS[plan];
    if (!planConfig) throw new Error("Invalid plan");

    // Find seller profile
    const { data: seller } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!seller) throw new Error("Seller profile not found. Create your store first.");

    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + planConfig.days * 24 * 60 * 60 * 1000);

    // Create subscription record
    const { data: sub, error: subErr } = await supabase
      .from("seller_subscriptions")
      .insert({
        user_id: user.id,
        seller_id: seller.id,
        plan,
        status: "active",
        amount: planConfig.amount,
        currency: "XOF",
        payment_method,
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        auto_renew: true,
      })
      .select()
      .single();

    if (subErr) throw subErr;

    // Update seller_profile premium status
    await supabase
      .from("seller_profiles")
      .update({
        is_premium: true,
        premium_until: expiresAt.toISOString(),
      })
      .eq("id", seller.id);

    return new Response(
      JSON.stringify({
        success: true,
        subscription: sub,
        plan: planConfig.label,
        expires_at: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("seller-premium-subscribe error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
