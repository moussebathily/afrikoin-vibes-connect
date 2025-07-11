import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, transactionType, metadata } = await req.json();

    // Validate input
    if (!amount || !transactionType) {
      return new Response(
        JSON.stringify({ error: 'Données invalides' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current balance
    const { data: currentBalance, error: balanceError } = await supabaseClient
      .from('user_balances')
      .select('available_balance, pending_balance')
      .eq('user_id', user.id)
      .single();

    if (balanceError) {
      return new Response(
        JSON.stringify({ error: 'Impossible de récupérer le solde' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new balance based on transaction type
    let availableChange = 0;
    let pendingChange = 0;

    switch (transactionType) {
      case 'deposit':
        availableChange = amount;
        break;
      case 'withdrawal_pending':
        if (currentBalance.available_balance < amount) {
          return new Response(
            JSON.stringify({ error: 'Solde insuffisant' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        availableChange = -amount;
        pendingChange = amount;
        break;
      case 'withdrawal_complete':
        if (currentBalance.pending_balance < amount) {
          return new Response(
            JSON.stringify({ error: 'Solde en attente insuffisant' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        pendingChange = -amount;
        break;
      case 'withdrawal_cancel':
        if (currentBalance.pending_balance < amount) {
          return new Response(
            JSON.stringify({ error: 'Solde en attente insuffisant' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        availableChange = amount;
        pendingChange = -amount;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Type de transaction invalide' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Update balance
    const { data: updatedBalance, error: updateError } = await supabaseClient.rpc('update_user_balance', {
      user_id: user.id,
      available_change: availableChange,
      pending_change: pendingChange
    });

    if (updateError) {
      console.error('Balance update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour du solde' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log transaction
    await supabaseClient.from('transactions').insert({
      user_id: user.id,
      transaction_type: transactionType,
      amount: transactionType.includes('withdrawal') && transactionType !== 'withdrawal_cancel' ? -amount : amount,
      status: 'completed',
      metadata
    });

    // Log security event
    await supabaseClient.from('security_logs').insert({
      user_id: user.id,
      event_type: 'balance_updated',
      metadata: {
        transaction_type: transactionType,
        amount,
        available_change: availableChange,
        pending_change: pendingChange,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        balance: updatedBalance
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Balance update error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});