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
    const {
      productDescription,
      category,
      style = 'realistic',
      aspectRatio = '1:1',
      includeContext = true
    } = await req.json();

    if (!productDescription) throw new Error('Product description is required');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not set');

    console.log('Generating illustration via Lovable AI for:', productDescription);

    const styleMap: Record<string, string> = {
      realistic: 'photorealistic, professional product photography, high quality',
      illustrated: 'clean illustration, vector style, modern',
      artistic: 'artistic rendering, creative, stylized',
      minimal: 'minimalist, clean lines, simple composition',
      african: 'African aesthetic, traditional patterns, warm colors'
    };
    const selectedStyle = styleMap[style] || styleMap.realistic;
    const contextPrompt = includeContext ? ', African marketplace context, culturally appropriate' : '';

    const prompt = `${productDescription}, ${selectedStyle}, professional product image, clean background${category ? `, ${category} category` : ''}, well-lit, commercial photography${contextPrompt}, no text overlays, ${aspectRatio} aspect ratio.`;

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
        return new Response(JSON.stringify({ success: false, error: 'Trop de requêtes.' }), {
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

    const suggestions: string[] = [];
    if (productDescription.length < 20) suggestions.push('Ajouter plus de détails dans la description');
    if (!category) suggestions.push('Spécifier une catégorie pour de meilleurs résultats');

    return new Response(JSON.stringify({
      success: true,
      illustration_url: imageUrl,
      description: productDescription,
      metadata: {
        product_description: productDescription,
        category: category || 'Non spécifiée',
        style,
        aspect_ratio: aspectRatio,
        generated_at: new Date().toISOString()
      },
      suggestions,
      alternative_styles: Object.keys(styleMap).filter(s => s !== style)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in illustration generator:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback_suggestions: ['Essayer une description plus simple', 'Réessayer avec un style différent']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
