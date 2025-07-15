import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseData {
  purchaseToken: string;
  productId: string;
  packageName: string;
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

    const { purchaseToken, productId, packageName }: PurchaseData = await req.json();

    console.log('Verifying purchase:', { purchaseToken, productId, packageName, userId: userData.user.id });

    // Définir les packs disponibles
    const LIKE_PACKS = {
      'com.afrikoin.likes_1000': { name: 'Pack Starter', likes: 1000, price: 999 },
      'com.afrikoin.likes_5000': { name: 'Pack Pro', likes: 5000, price: 3999 },
      'com.afrikoin.likes_10000': { name: 'Pack Premium', likes: 10000, price: 6999 }
    };

    const pack = LIKE_PACKS[productId as keyof typeof LIKE_PACKS];
    if (!pack) {
      throw new Error(`Invalid product ID: ${productId}`);
    }

    // Vérifier si l'achat existe déjà
    const { data: existingPurchase } = await supabaseClient
      .from('like_purchases')
      .select('*')
      .eq('purchase_token', purchaseToken)
      .eq('user_id', userData.user.id)
      .single();

    if (existingPurchase) {
      console.log('Purchase already processed:', existingPurchase.id);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Purchase already processed',
        purchase: existingPurchase 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Enregistrer l'achat
    const { data: purchase, error: purchaseError } = await supabaseClient
      .from('like_purchases')
      .insert({
        user_id: userData.user.id,
        purchase_token: purchaseToken,
        product_id: productId,
        pack_name: pack.name,
        likes_amount: pack.likes,
        price_amount: pack.price,
        status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // Mettre à jour le solde de likes
    const { data: currentCredits } = await supabaseClient
      .from('like_credits')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (currentCredits) {
      const { error: updateError } = await supabaseClient
        .from('like_credits')
        .update({
          balance: currentCredits.balance + pack.likes,
          total_purchased: currentCredits.total_purchased + pack.likes,
        })
        .eq('user_id', userData.user.id);

      if (updateError) throw updateError;
    } else {
      // Créer un nouveau solde si ça n'existe pas
      const { error: insertError } = await supabaseClient
        .from('like_credits')
        .insert({
          user_id: userData.user.id,
          balance: pack.likes + 10, // 10 likes gratuits + achat
          total_purchased: pack.likes,
        });

      if (insertError) throw insertError;
    }

    console.log('Purchase verified and credits added:', { 
      userId: userData.user.id, 
      likesAdded: pack.likes,
      purchaseId: purchase.id 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      purchase,
      likesAdded: pack.likes,
      message: `${pack.likes} likes ajoutés à votre compte !`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Purchase verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});