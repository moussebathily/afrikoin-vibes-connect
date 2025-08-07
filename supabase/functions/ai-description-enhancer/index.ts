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
    const { description, category, price, language = 'fr' } = await req.json();

    if (!description) {
      throw new Error('Description is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Enhancing description for category:', category);

    const systemPrompt = language === 'fr' 
      ? `Tu es un expert en rédaction d'annonces pour une plateforme de vente africaine (AfriKoin). 
         Améliore la description donnée en la rendant plus attrayante, professionnelle et vendeuse.
         
         Règles importantes:
         - Garde le même produit et les caractéristiques principales
         - Ajoute des détails pertinents pour le marché africain
         - Utilise un français simple et accessible
         - Mentionne les avantages pratiques
         - Optimise pour les recherches locales
         - Reste authentique et honnête
         - Maximum 200 mots
         
         Réponds UNIQUEMENT avec la description améliorée, sans introduction.`
      : `You are an expert copywriter for an African marketplace (AfriKoin).
         Enhance the given description to make it more attractive, professional and sales-oriented.
         
         Important rules:
         - Keep the same product and main characteristics
         - Add relevant details for the African market
         - Use simple, accessible English
         - Mention practical benefits
         - Optimize for local searches
         - Stay authentic and honest
         - Maximum 200 words
         
         Reply ONLY with the enhanced description, no introduction.`;

    const userPrompt = `Description originale: "${description}"
${category ? `Catégorie: ${category}` : ''}
${price ? `Prix: ${price}` : ''}

Améliore cette description:`;

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
            content: userPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const result = await response.json();
    const enhancedDescription = result.choices[0].message.content.trim();

    // Génération de mots-clés SEO
    const keywordsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Génère 5-8 mots-clés de recherche pour cette annonce, séparés par des virgules. Utilise des termes que les acheteurs africains tapent réellement.'
          },
          {
            role: 'user',
            content: enhancedDescription
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    let keywords = [];
    if (keywordsResponse.ok) {
      const keywordsResult = await keywordsResponse.json();
      keywords = keywordsResult.choices[0].message.content
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k.length > 0);
    }

    console.log('Description enhanced successfully');

    return new Response(JSON.stringify({
      original_description: description,
      enhanced_description: enhancedDescription,
      suggested_keywords: keywords,
      improvement_summary: {
        length_improvement: enhancedDescription.length > description.length,
        added_value: enhancedDescription.length - description.length,
        readability_score: Math.min(10, Math.max(1, 10 - Math.floor(enhancedDescription.split(' ').length / 20)))
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in description enhancer:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});