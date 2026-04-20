// Edge function: ai-product-from-photo
// Analyse a product photo and return a suggested title, description,
// price range, category and SEO keywords using Lovable AI Gateway.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const CATEGORIES = [
  'electronics',
  'fashion',
  'beauty',
  'home',
  'food',
  'sports',
  'books',
  'toys',
  'art',
  'other',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, currency = 'XOF', country } = await req.json()

    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'imageUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const systemPrompt = `Tu es un expert e-commerce africain pour la marketplace AfriKoin (Afrique de l'Ouest, francophone).
Tu analyses une photo de produit et tu génères:
- Un titre commercial clair (max 80 caractères, en français)
- Une description vendeuse (3-5 phrases, en français, ton naturel et concret)
- Une catégorie parmi: ${CATEGORIES.join(', ')}
- Une fourchette de prix réaliste pour le marché ouest-africain dans la devise ${currency}
- 5 mots-clés SEO pertinents
${country ? `Contexte pays: ${country}` : ''}
Si la photo ne contient pas un produit identifiable, mets confidence=low et explique brièvement.`

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyse cette photo et génère les informations produit.',
                },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'submit_product',
                description: 'Retourne les informations produit extraites de la photo',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Titre commercial du produit' },
                    description: { type: 'string', description: 'Description vendeuse' },
                    category: { type: 'string', enum: CATEGORIES },
                    price_min: { type: 'number', description: 'Prix minimum suggéré' },
                    price_max: { type: 'number', description: 'Prix maximum suggéré' },
                    suggested_price: { type: 'number', description: 'Prix suggéré médian' },
                    currency: { type: 'string' },
                    keywords: {
                      type: 'array',
                      items: { type: 'string' },
                      description: '5 mots-clés SEO',
                    },
                    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
                  },
                  required: [
                    'title',
                    'description',
                    'category',
                    'suggested_price',
                    'currency',
                    'keywords',
                    'confidence',
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: 'function',
            function: { name: 'submit_product' },
          },
        }),
      },
    )

    if (!response.ok) {
      const text = await response.text()
      console.error('AI gateway error:', response.status, text)

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Trop de requêtes, réessayez dans un instant.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              'Crédits AI épuisés. Ajoutez des fonds dans Settings → Workspace → Usage.',
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      return new Response(
        JSON.stringify({ error: 'Erreur du service IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const data = await response.json()
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0]
    if (!toolCall) {
      return new Response(
        JSON.stringify({ error: 'Réponse IA invalide' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const args = JSON.parse(toolCall.function.arguments)

    return new Response(JSON.stringify(args), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('ai-product-from-photo error:', err)
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Erreur inconnue',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
