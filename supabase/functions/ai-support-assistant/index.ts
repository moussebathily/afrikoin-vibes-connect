import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { FAQ_ITEMS } from "./faq-data.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

const LANG_NAME: Record<string, string> = {
  fr: "français",
  wo: "wolof",
  ha: "hausa",
  en: "English",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { messages, lang = "fr" } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Compact FAQ context — id + question + short answer in target lang
    const faqContext = FAQ_ITEMS.map((f: any) => {
      const q = f.question[lang] || f.question.fr
      const a = f.answer[lang] || f.answer.fr
      return `[${f.id}] (${f.audience}) Q: ${q}\nR: ${a}`
    }).join("\n\n")

    const langName = LANG_NAME[lang] || "français"

    const systemPrompt = `Tu es l'assistant support officiel d'AfriKoin, marketplace panafricaine.

RÈGLES STRICTES :
1. Réponds UNIQUEMENT en ${langName}.
2. Base-toi EXCLUSIVEMENT sur la FAQ ci-dessous. Si la question n'est pas couverte, dis-le et invite à contacter le support humain.
3. Cite TOUJOURS les sources en ajoutant à la fin de ta réponse les identifiants de FAQ pertinents au format : [FAQ:identifiant] (1 à 3 maximum).
4. Sois concis (3-6 phrases), chaleureux, et utilise des listes à puces quand pertinent.
5. Ne mentionne JAMAIS d'autres plateformes ou opérateurs non listés dans la FAQ.
6. Si le user mentionne une arnaque/fraude grave, recommande d'ouvrir un litige et de contacter le support.

FAQ AFRIKOIN (source de vérité) :
${faqContext}`

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    )

    if (response.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Trop de requêtes, réessayez dans un moment.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({
          error: "Crédits IA épuisés sur le workspace AfriKoin.",
        }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }
    if (!response.ok) {
      const t = await response.text()
      console.error("AI gateway error:", response.status, t)
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    })
  } catch (e) {
    console.error("support assistant error:", e)
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
