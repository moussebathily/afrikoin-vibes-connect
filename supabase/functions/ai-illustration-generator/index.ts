import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

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

    if (!productDescription) {
      throw new Error('Product description is required');
    }

    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set');
    }

    console.log('Generating illustration for:', productDescription);

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    // Styles d'illustration adaptés
    const styleMap: Record<string, string> = {
      realistic: 'photorealistic, high quality photography, professional product shot',
      illustrated: 'clean illustration, vector style, modern design',
      artistic: 'artistic rendering, creative interpretation, stylized',
      minimal: 'minimalist design, clean lines, simple composition',
      african: 'African aesthetic, traditional patterns, warm colors, cultural elements'
    };

    const selectedStyle = styleMap[style] || styleMap.realistic;

    // Contexte africain si demandé
    const contextPrompt = includeContext 
      ? ', African marketplace context, suitable for African consumers, culturally appropriate'
      : '';

    // Prompt optimisé pour génération d'illustrations produit
    const prompt = `${productDescription}, ${selectedStyle}, 
professional product image, clean background, 
${category ? `${category} category,` : ''} 
well-lit, high contrast, commercial photography style,
suitable for e-commerce listing${contextPrompt}, 
no text overlays, focus on product details,
studio lighting, professional composition`;

    console.log('Using prompt:', prompt);

    // Génération avec Flux-Schnell pour rapidité
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 85,
          num_inference_steps: 4
        }
      }
    );

    console.log('Illustration generated successfully');

    // Suggestions d'amélioration basées sur le contenu
    const suggestions = [];
    if (productDescription.length < 20) {
      suggestions.push('Ajouter plus de détails dans la description pour de meilleures illustrations');
    }
    if (!category) {
      suggestions.push('Spécifier une catégorie pour des illustrations plus précises');
    }

    return new Response(JSON.stringify({
      success: true,
      illustration_url: Array.isArray(output) ? output[0] : output,
      metadata: {
        product_description: productDescription,
        category: category || 'Non spécifiée',
        style: style,
        aspect_ratio: aspectRatio,
        generated_at: new Date().toISOString()
      },
      suggestions: suggestions,
      alternative_styles: Object.keys(styleMap).filter(s => s !== style)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in illustration generator:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallback_suggestions: [
        'Essayer une description plus simple',
        'Vérifier la connexion internet',
        'Réessayer avec un style différent'
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});