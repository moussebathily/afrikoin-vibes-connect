import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, price, currency = 'XOF', category, style = 'modern' } = await req.json();

    if (!productName || !price) {
      throw new Error('Product name and price are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not set');

    console.log('Generating thumbnail via Lovable AI for:', productName);

    const styleMap: Record<string, string> = {
      modern: 'modern, clean, minimalist with African colors',
      traditional: 'traditional African patterns, warm earth tones',
      luxury: 'premium, elegant, gold accents, sophisticated',
      vibrant: 'bright colors, dynamic, energetic, colorful patterns'
    };
    const selectedStyle = styleMap[style] || styleMap.modern;

    const prompt = `Professional product thumbnail for African e-commerce: ${productName}, price ${price} ${currency}${category ? `, category: ${category}` : ''}. Style: ${selectedStyle}. Square 1:1 format, studio lighting, clean background, mobile-optimized, African aesthetic, e-commerce ready.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Trop de requêtes, réessayez plus tard.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: 'Crédits AI épuisés.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${await response.text()}`);
    }

    const result = await response.json();
    const imageUrl = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) throw new Error('No image returned by AI');

    return new Response(JSON.stringify({
      success: true,
      thumbnail_url: imageUrl,
      text_thumbnail: {
        productName,
        price: `${price} ${currency}`,
        style,
        backgroundColor: '#FF6B35',
        textColor: '#FFFFFF',
        category: category || 'Produit'
      },
      metadata: {
        product: productName,
        price: `${price} ${currency}`,
        style,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in thumbnail generator:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback_thumbnail: {
        backgroundColor: '#FF6B35',
        textColor: '#FFFFFF',
        category: 'Produit'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
