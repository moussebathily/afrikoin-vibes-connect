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
    const { imageUrl, text } = await req.json();

    if (!imageUrl && !text) {
      throw new Error('Either imageUrl or text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    console.log('Starting content moderation via Lovable AI...');

    const userContent: any[] = [];
    const inputDescription: string[] = [];

    if (text) {
      inputDescription.push(`Texte de l'annonce: "${text}"`);
    }
    userContent.push({
      type: 'text',
      text: `Analyse ce contenu d'annonce pour une plateforme de vente africaine (AfriKoin). ${inputDescription.join(' ')} Vérifie si le contenu est approprié, évalue la qualité, et donne des suggestions.`
    });

    if (imageUrl) {
      userContent.push({
        type: 'image_url',
        image_url: { url: imageUrl }
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en modération de contenu pour une plateforme de vente africaine. Analyse l'image et/ou le texte fournis et détecte tout contenu inapproprié (violence, nudité, arnaques, produits illégaux, haine, etc.).`
          },
          { role: 'user', content: userContent }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'submit_moderation',
            description: 'Soumet le résultat de la modération.',
            parameters: {
              type: 'object',
              properties: {
                appropriate: { type: 'boolean', description: 'Le contenu est-il approprié ?' },
                quality_score: { type: 'number', description: 'Score qualité 0-10' },
                quality_issues: { type: 'array', items: { type: 'string' } },
                content_flags: { type: 'array', items: { type: 'string' } },
                recommended_price_range: { type: 'string' },
                category_suggestion: { type: 'string' },
                description_suggestions: { type: 'array', items: { type: 'string' } }
              },
              required: ['appropriate', 'quality_score', 'quality_issues', 'content_flags', 'description_suggestions'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'submit_moderation' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Trop de requêtes, réessayez dans un instant.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits AI épuisés. Ajoutez des crédits dans Settings → Workspace → Usage.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${await response.text()}`);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    const analysis = toolCall ? JSON.parse(toolCall.function.arguments) : {
      appropriate: true, quality_score: 5, quality_issues: [], content_flags: [], description_suggestions: []
    };

    const finalResult = {
      approved: analysis.appropriate,
      quality_analysis: {
        score: analysis.quality_score,
        issues: analysis.quality_issues,
        category: analysis.category_suggestion,
        price_range: analysis.recommended_price_range
      },
      recommendations: {
        improvements: [
          ...(analysis.quality_score < 6 ? ["Améliorer la qualité de l'image"] : []),
          ...(analysis.quality_issues || []),
          ...(analysis.description_suggestions || [])
        ],
        can_publish: analysis.appropriate && analysis.quality_score >= 4
      }
    };

    console.log('Moderation completed successfully');

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI content moderator:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      approved: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
