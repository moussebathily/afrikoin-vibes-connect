// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId } = await req.json();
    if (!postId) {
      return new Response(JSON.stringify({ error: "postId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";

    // Client with end-user JWT (subject to RLS)
    const sbUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for privileged ops (bypasses RLS)
    const sbService = createClient(supabaseUrl, serviceKey);

    // Get current user
    const { data: userRes, error: userErr } = await sbUser.auth.getUser();
    if (userErr || !userRes.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userRes.user.id;

    // Fetch post and author
    const { data: post, error: postErr } = await sbService
      .from("posts")
      .select("id, user_id, like_count")
      .eq("id", postId)
      .maybeSingle();
    if (postErr || !post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get like credits
    const { data: credits, error: creditsErr } = await sbUser
      .from("like_credits")
      .select("id, balance")
      .eq("user_id", userId)
      .maybeSingle();

    const currentBalance = credits?.balance ?? 0;
    if (creditsErr) {
      console.error("like_credits fetch error", creditsErr);
    }

    if (currentBalance <= 0) {
      return new Response(
        JSON.stringify({ error: "INSUFFICIENT_CREDITS", message: "Solde de likes insuffisant" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrement like credits (user-scoped client to satisfy RLS)
    const { error: decErr } = await sbUser
      .from("like_credits")
      .update({ balance: currentBalance - 1, total_used: (credits?.total_used ?? 0) + 1 })
      .eq("user_id", userId);
    if (decErr) {
      console.error("decrement credits error", decErr);
      return new Response(JSON.stringify({ error: "FAILED_DEBIT" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment post like_count atomically (service client)
    const { data: updatedPost, error: upErr } = await sbService
      .from("posts")
      .update({ like_count: (post.like_count ?? 0) + 1, updated_at: new Date().toISOString() })
      .eq("id", postId)
      .select("id, like_count, user_id")
      .single();
    if (upErr) {
      console.error("increment like_count error", upErr);
      return new Response(JSON.stringify({ error: "FAILED_LIKE" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record usage (user client)
    const { error: usageErr } = await sbUser.from("like_usage").insert({
      user_id: userId,
      target_post_id: postId,
      likes_used: 1,
      usage_type: "manual",
    });
    if (usageErr) {
      console.error("like_usage insert error", usageErr);
    }

    // Optionally: reward author later via payouts logic

    return new Response(
      JSON.stringify({
        success: true,
        like_count: updatedPost.like_count,
        remaining_balance: currentBalance - 1,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: unknown) {
    console.error("like-post error", e);
    return new Response(JSON.stringify({ error: (e as Error)?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
