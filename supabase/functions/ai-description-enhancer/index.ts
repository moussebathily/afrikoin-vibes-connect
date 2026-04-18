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
    const { description, category, price, language = 'fr' } = await req.json();

    if (!description) throw new Error('Description is required');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not set');

    console.log('Enhancing description via Lovable AI');

    const systemPrompt = language === 'fr'
      ? `Tu es un expert en rédaction d'annonces pour une plateforme de vente africaine (AfriKoin). Améliore la description en la rendant attractive, professionnelle et adaptée au marché africain. Maximum 200 mots. Génère aussi 5-8 mots-clés SEO pertinents.`
      : `You are an expert copywriter for an African marketplace (AfriKoin). Enhance the description making it attractive, professional and adapted to the African market. Max 200 words. Also generate 5-8 relevant SEO keywords.`;

    const userPrompt = `Description: "${description}"
${category ? `Catégorie: ${category}` : ''}
${price ? `Prix: ${price}` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'submit_enhancement',
            description: 'Soumet la description améliorée et les mots-clés.',
            parameters: {
              type: 'object',
              properties: {
                enhanced_description: { type: 'string', description: 'Description améliorée' },
                keywords: { type: 'array', items: { type: 'string' }, description: '5-8 mots-clés SEO' }
              },
              required: ['enhanced_description', 'keywords'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'submit_enhancement' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Trop de requêtes, réessayez plus tard.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits AI épuisés.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${await response.text()}`);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    const parsed = toolCall ? JSON.parse(toolCall.function.arguments) : { enhanced_description: description, keywords: [] };

    return new Response(JSON.stringify({
      original_description: description,
      enhanced_description: parsed.enhanced_description,
      suggested_keywords: parsed.keywords,
      improvement_summary: {
        length_improvement: parsed.enhanced_description.length > description.length,
        added_value: parsed.enhanced_description.length - description.length,
        readability_score: Math.min(10, Math.max(1, 10 - Math.floor(parsed.enhanced_description.split(' ').length / 20)))
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in description enhancer:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
