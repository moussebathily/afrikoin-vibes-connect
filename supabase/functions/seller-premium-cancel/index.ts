// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Find seller profile
    const { data: seller } = await supabase
      .from("seller_profiles")
      .select("id, premium_until, is_premium")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!seller) throw new Error("Seller profile not found");

    const now = new Date();

    // Cancel auto_renew on active subscriptions, mark cancelled_at
    const { data: subs, error: subErr } = await supabase
      .from("seller_subscriptions")
      .update({
        auto_renew: false,
        status: "cancelled",
        cancelled_at: now.toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "active")
      .select();

    if (subErr) throw subErr;

    // Premium remains active until premium_until expires naturally.
    // We do NOT set is_premium=false here unless already expired.
    const premiumUntil = seller.premium_until ? new Date(seller.premium_until) : null;
    const stillActive = premiumUntil && premiumUntil > now;

    if (!stillActive) {
      await supabase
        .from("seller_profiles")
        .update({ is_premium: false })
        .eq("id", seller.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        cancelled_subscriptions: subs?.length ?? 0,
        premium_until: seller.premium_until,
        active_until_expiry: stillActive,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("seller-premium-cancel error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
