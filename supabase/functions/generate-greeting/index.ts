import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { holiday, userPrefs, type = 'holiday' } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create personalized prompt based on user preferences and holiday
    let prompt = '';
    
    if (type === 'birthday') {
      prompt = `Generate a warm, personalized birthday message in ${userPrefs.language_code}. 
        User's country: ${userPrefs.country_code}
        User's religion: ${userPrefs.religion || 'not specified'}
        Make it culturally appropriate and heartfelt. Keep it under 100 words.`;
    } else {
      prompt = `Generate a warm, culturally appropriate greeting message for ${holiday.name} in ${userPrefs.language_code}.
        Holiday details: ${holiday.description}
        Holiday type: ${holiday.type}
        User's country: ${userPrefs.country_code}
        User's religion: ${userPrefs.religion || 'not specified'}
        
        Make the message personal, respectful of local customs, and appropriate for the celebration.
        Include relevant cultural elements and traditions. Keep it under 100 words.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a cultural assistant that creates personalized, respectful greeting messages for holidays and special occasions. Always be warm, inclusive, and culturally sensitive.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const generatedMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: generatedMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating greeting:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});