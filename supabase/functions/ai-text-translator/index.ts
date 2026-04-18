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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not set');

    console.log(`Translating to ${targetLanguage} via Lovable AI`);

    const africanLanguages: Record<string, string> = {
      'fr': 'français', 'sw': 'swahili', 'ha': 'hausa', 'yo': 'yoruba',
      'ig': 'igbo', 'am': 'amharique', 'ar': 'arabe', 'pt': 'portugais',
      'en': 'anglais', 'wo': 'wolof', 'rw': 'kinyarwanda', 'zu': 'zulu',
      'xh': 'xhosa', 'af': 'afrikaans', 'so': 'somali', 'om': 'oromo',
      'es': 'espagnol', 'de': 'allemand', 'it': 'italien', 'zh': 'chinois'
    };

    const targetLangName = africanLanguages[targetLanguage] || targetLanguage;

    const systemPrompt = `Tu es un traducteur expert. Traduis vers ${targetLangName}. Garde le sens exact, utilise des expressions naturelles, respecte les conventions culturelles. Ne traduis pas les noms de marques. Garde les emojis. Contexte: ${context}.`;

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
          { role: 'user', content: text }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'submit_translation',
            description: 'Soumet la traduction.',
            parameters: {
              type: 'object',
              properties: {
                translated_text: { type: 'string' },
                detected_source_language: { type: 'string', description: 'Code langue (fr, en, etc.)' }
              },
              required: ['translated_text', 'detected_source_language'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'submit_translation' } }
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
    const parsed = toolCall ? JSON.parse(toolCall.function.arguments) : { translated_text: text, detected_source_language: sourceLanguage };

    return new Response(JSON.stringify({
      original_text: text,
      translated_text: parsed.translated_text,
      source_language: sourceLanguage === 'auto' ? parsed.detected_source_language : sourceLanguage,
      target_language: targetLanguage,
      context,
      confidence: 0.95,
      character_count: { original: text.length, translated: parsed.translated_text.length }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in text translator:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      translated_text: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
