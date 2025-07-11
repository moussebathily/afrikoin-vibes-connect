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

    const { amount, paymentMethodId } = await req.json();

    // Validate input
    if (!amount || !paymentMethodId || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Données invalides' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user balance
    const { data: balance, error: balanceError } = await supabaseClient
      .from('user_balances')
      .select('available_balance')
      .eq('user_id', user.id)
      .single();

    if (balanceError || !balance) {
      return new Response(
        JSON.stringify({ error: 'Impossible de récupérer le solde' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check sufficient balance
    if (balance.available_balance < amount) {
      return new Response(
        JSON.stringify({ error: 'Solde insuffisant' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify payment method belongs to user
    const { data: paymentMethod, error: pmError } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .eq('user_id', user.id)
      .single();

    if (pmError || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: 'Méthode de paiement invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate fees (2% for bank, 1% for mobile money)
    const feeRate = paymentMethod.method_type === 'bank' ? 0.02 : 0.01;
    const fees = amount * feeRate;
    const netAmount = amount - fees;

    // Create withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabaseClient
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        payment_method_id: paymentMethodId,
        amount,
        fees,
        net_amount: netAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (withdrawalError) {
      console.error('Withdrawal creation error:', withdrawalError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de la demande' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user balance (move from available to pending)
    const { error: updateError } = await supabaseClient.rpc('update_user_balance', {
      user_id: user.id,
      available_change: -amount,
      pending_change: amount
    });

    if (updateError) {
      console.error('Balance update error:', updateError);
      // Rollback withdrawal request
      await supabaseClient
        .from('withdrawal_requests')
        .delete()
        .eq('id', withdrawal.id);

      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour du solde' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log transaction
    await supabaseClient.from('transactions').insert({
      user_id: user.id,
      transaction_type: 'withdrawal',
      amount: -amount,
      status: 'pending',
      reference_id: withdrawal.id,
      metadata: {
        payment_method: paymentMethod.method_type,
        provider: paymentMethod.provider,
        fees
      }
    });

    // Log security event
    await supabaseClient.from('security_logs').insert({
      user_id: user.id,
      event_type: 'withdrawal_requested',
      metadata: {
        amount,
        payment_method_id: paymentMethodId,
        withdrawal_id: withdrawal.id,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        withdrawalId: withdrawal.id,
        amount,
        fees,
        netAmount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Withdrawal processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});