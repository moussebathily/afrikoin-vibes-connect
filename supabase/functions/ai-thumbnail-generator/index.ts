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
    const { productName, price, currency = 'XOF', category, style = 'modern' } = await req.json();

    if (!productName || !price) {
      throw new Error('Product name and price are required');
    }

    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set');
    }

    console.log('Generating thumbnail for:', productName);

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    // Style adapté au marché africain
    const styleMap: Record<string, string> = {
      modern: 'modern, clean, minimalist design with African colors',
      traditional: 'traditional African patterns, warm earth tones',
      luxury: 'premium, elegant, gold accents, sophisticated',
      vibrant: 'bright colors, dynamic, energetic, colorful patterns'
    };

    const selectedStyle = styleMap[style] || styleMap.modern;

    // Prompt optimisé pour miniatures e-commerce africaines
    const prompt = `Product thumbnail for African marketplace: ${productName}, 
price ${price} ${currency}, ${category ? `category: ${category},` : ''} 
${selectedStyle}, professional product photography, 
AfriKoin logo placement, 1:1 aspect ratio, 
high contrast, clear pricing display, 
studio lighting, white or gradient background, 
optimized for mobile viewing, 
African aesthetic elements, 
clean typography, modern e-commerce style`;

    console.log('Using prompt:', prompt);

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90,
          num_inference_steps: 4
        }
      }
    );

    console.log('Thumbnail generated successfully');

    // Génération d'une miniature texte en fallback
    const textThumbnail = {
      productName,
      price: `${price} ${currency}`,
      style: style,
      backgroundColor: '#FF6B35', // Couleur AfriKoin
      textColor: '#FFFFFF',
      category: category || 'Produit'
    };

    return new Response(JSON.stringify({
      success: true,
      thumbnail_url: Array.isArray(output) ? output[0] : output,
      text_thumbnail: textThumbnail,
      metadata: {
        product: productName,
        price: `${price} ${currency}`,
        style: style,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in thumbnail generator:', error);
    
    // Fallback en cas d'erreur : miniature texte simple
    const fallbackThumbnail = {
      productName: req.url.includes('productName') ? 'Produit' : '',
      price: req.url.includes('price') ? 'Prix' : '',
      backgroundColor: '#FF6B35',
      textColor: '#FFFFFF',
      category: 'Produit'
    };

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallback_thumbnail: fallbackThumbnail
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});