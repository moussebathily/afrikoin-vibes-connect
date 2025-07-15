import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UseLikeData {
  targetPostId?: string;
  targetUserId?: string;
  usageType?: 'manual' | 'automatic';
  likesCount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    const { 
      targetPostId, 
      targetUserId, 
      usageType = 'manual', 
      likesCount = 1 
    }: UseLikeData = await req.json();

    console.log('Processing like usage:', { 
      userId: userData.user.id, 
      targetPostId, 
      targetUserId, 
      usageType, 
      likesCount 
    });

    // Vérifier le solde disponible
    const { data: credits, error: creditsError } = await supabaseClient
      .from('like_credits')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (creditsError || !credits) {
      throw new Error("Impossible de récupérer votre solde de likes");
    }

    if (credits.balance < likesCount) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Solde de likes insuffisant',
        currentBalance: credits.balance,
        needed: likesCount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Déduire les likes du solde
    const { error: updateError } = await supabaseClient
      .from('like_credits')
      .update({
        balance: credits.balance - likesCount,
        total_used: credits.total_used + likesCount,
      })
      .eq('user_id', userData.user.id);

    if (updateError) throw updateError;

    // Enregistrer l'utilisation
    const { data: usage, error: usageError } = await supabaseClient
      .from('like_usage')
      .insert({
        user_id: userData.user.id,
        target_post_id: targetPostId,
        target_user_id: targetUserId,
        likes_used: likesCount,
        usage_type: usageType,
      })
      .select()
      .single();

    if (usageError) throw usageError;

    console.log('Like usage recorded:', { 
      usageId: usage.id, 
      remainingBalance: credits.balance - likesCount 
    });

    return new Response(JSON.stringify({ 
      success: true,
      usage,
      remainingBalance: credits.balance - likesCount,
      message: `${likesCount} like(s) utilisé(s) avec succès !`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Like usage error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});