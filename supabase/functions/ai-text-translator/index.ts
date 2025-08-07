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
    const { text, targetLanguage, sourceLanguage = 'auto', context = 'marketplace' } = await req.json();

    if (!text || !targetLanguage) {
      throw new Error('Text and target language are required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log(`Translating to ${targetLanguage}:`, text.substring(0, 100));

    // Langues africaines supportées avec contexte culturel
    const africanLanguages: Record<string, string> = {
      'fr': 'français (français africain, utilise des expressions locales)',
      'sw': 'swahili (kiswahili standard)',
      'ha': 'hausa (hausa standard)',
      'yo': 'yoruba (yorùbá)',
      'ig': 'igbo (asụsụ igbo)',
      'am': 'amharique (አማርኛ)',
      'ar': 'arabe (العربية, dialecte maghrébin)',
      'pt': 'portugais (portugais africain)',
      'en': 'anglais (anglais africain)',
      'wo': 'wolof',
      'rw': 'kinyarwanda',
      'zu': 'zulu',
      'xh': 'xhosa',
      'af': 'afrikaans'
    };

    const targetLangName = africanLanguages[targetLanguage] || targetLanguage;

    // Contexte spécialisé pour marketplace
    const contextPrompts: Record<string, string> = {
      marketplace: 'Ceci est une annonce de vente sur une plateforme africaine. Traduis en gardant le ton commercial et les spécificités culturelles.',
      product: 'Ceci est une description de produit. Garde les termes techniques et les caractéristiques précises.',
      message: 'Ceci est un message entre utilisateurs. Garde le ton naturel et familier.',
      notification: 'Ceci est une notification système. Utilise un langage clair et direct.'
    };

    const systemPrompt = `Tu es un traducteur expert spécialisé dans les langues africaines et les contextes commerciaux africains.
    
${contextPrompts[context] || contextPrompts.marketplace}

Règles importantes:
- Traduis vers ${targetLangName}
- Garde le sens exact et l'intention
- Utilise des expressions naturelles de cette langue/région
- Respecte les conventions culturelles locales
- Pour les prix et devises, garde les formats locaux
- Ne traduis PAS les noms de marques
- Garde les émojis s'il y en a

Réponds UNIQUEMENT avec la traduction, sans explication.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: Math.min(2000, text.length * 2),
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const result = await response.json();
    const translatedText = result.choices[0].message.content.trim();

    // Détection automatique de la langue source si demandé
    let detectedSourceLanguage = sourceLanguage;
    if (sourceLanguage === 'auto') {
      const detectionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'Détecte la langue de ce texte. Réponds avec le code langue uniquement (ex: fr, en, sw, etc.)'
            },
            {
              role: 'user',
              content: text.substring(0, 200)
            }
          ],
          max_tokens: 10,
          temperature: 0,
        }),
      });

      if (detectionResponse.ok) {
        const detectionResult = await detectionResponse.json();
        detectedSourceLanguage = detectionResult.choices[0].message.content.trim().toLowerCase();
      }
    }

    console.log('Translation completed successfully');

    return new Response(JSON.stringify({
      original_text: text,
      translated_text: translatedText,
      source_language: detectedSourceLanguage,
      target_language: targetLanguage,
      context: context,
      quality_score: Math.min(10, Math.max(1, 10 - Math.abs(text.length - translatedText.length) / text.length * 5)),
      character_count: {
        original: text.length,
        translated: translatedText.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in text translator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      original_text: req.body?.text || '',
      translated_text: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});