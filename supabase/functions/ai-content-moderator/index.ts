import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Starting content moderation...');

    // Modération du texte
    let textModerationResult = null;
    if (text) {
      console.log('Moderating text content...');
      const textResponse = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
        }),
      });

      if (!textResponse.ok) {
        throw new Error(`Text moderation failed: ${await textResponse.text()}`);
      }

      textModerationResult = await textResponse.json();
    }

    // Modération de l'image + analyse de qualité
    let imageModerationResult = null;
    let qualityAnalysis = null;

    if (imageUrl) {
      console.log('Moderating image content and analyzing quality...');
      
      // Analyse de modération + qualité avec GPT Vision
      const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en modération de contenu pour une plateforme de vente africaine. 
                       Analyse cette image et réponds UNIQUEMENT en JSON avec cette structure exacte:
                       {
                         "appropriate": boolean,
                         "quality_score": number (0-10),
                         "quality_issues": string[],
                         "content_flags": string[],
                         "recommended_price_range": string,
                         "category_suggestion": string,
                         "description_suggestions": string[]
                       }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyse cette image de produit à vendre en Afrique. Vérifie le contenu approprié, la qualité de l\'image, et donne des suggestions.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (!visionResponse.ok) {
        throw new Error(`Vision analysis failed: ${await visionResponse.text()}`);
      }

      const visionResult = await visionResponse.json();
      
      try {
        const analysisText = visionResult.choices[0].message.content;
        // Extraire le JSON de la réponse
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          imageModerationResult = {
            appropriate: analysis.appropriate,
            content_flags: analysis.content_flags || []
          };
          qualityAnalysis = {
            score: analysis.quality_score || 0,
            issues: analysis.quality_issues || [],
            price_range: analysis.recommended_price_range || '',
            category: analysis.category_suggestion || '',
            suggestions: analysis.description_suggestions || []
          };
        }
      } catch (parseError) {
        console.error('Error parsing vision analysis:', parseError);
        // Fallback
        imageModerationResult = { appropriate: true, content_flags: [] };
        qualityAnalysis = { score: 5, issues: [], price_range: '', category: '', suggestions: [] };
      }
    }

    // Résultat final
    const result = {
      approved: (!textModerationResult || !textModerationResult.results[0]?.flagged) && 
                (!imageModerationResult || imageModerationResult.appropriate),
      text_moderation: textModerationResult,
      image_moderation: imageModerationResult,
      quality_analysis: qualityAnalysis,
      recommendations: {
        can_publish: true,
        improvements: []
      }
    };

    // Ajouter des recommandations
    if (qualityAnalysis?.score < 6) {
      result.recommendations.improvements.push("Améliorer la qualité de l'image");
    }
    if (qualityAnalysis?.issues?.length > 0) {
      result.recommendations.improvements.push(...qualityAnalysis.issues);
    }

    result.recommendations.can_publish = result.approved && (qualityAnalysis?.score || 10) >= 4;

    console.log('Moderation completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI content moderator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      approved: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});