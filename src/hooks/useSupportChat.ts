import { useCallback, useRef, useState } from "react"
import type { FaqLang } from "@/data/faqData"

export type ChatRole = "user" | "assistant"
export interface ChatMessage {
  role: ChatRole
  content: string
  faqIds?: string[]
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-support-assistant`

function extractFaqIds(text: string): string[] {
  const ids = new Set<string>()
  const re = /\[FAQ:([a-z0-9-]+)\]/gi
  let m
  while ((m = re.exec(text)) !== null) ids.add(m[1])
  return Array.from(ids)
}

export function useSupportChat(lang: FaqLang) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (input: string) => {
      if (!input.trim() || isStreaming) return
      setError(null)
      const userMsg: ChatMessage = { role: "user", content: input.trim() }
      const next = [...messages, userMsg]
      setMessages(next)
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      let assistantSoFar = ""
      const upsert = (chunk: string) => {
        assistantSoFar += chunk
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          const faqIds = extractFaqIds(assistantSoFar)
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1
                ? { ...m, content: assistantSoFar, faqIds }
                : m
            )
          }
          return [...prev, { role: "assistant", content: assistantSoFar, faqIds }]
        })
      }

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            lang,
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        })

        if (resp.status === 429) {
          throw new Error("Trop de requêtes. Réessayez dans un moment.")
        }
        if (resp.status === 402) {
          throw new Error(
            "Crédits IA épuisés. Contactez l'administrateur AfriKoin."
          )
        }
        if (!resp.ok || !resp.body) {
          throw new Error("L'assistant est temporairement indisponible.")
        }

        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let textBuffer = ""
        let streamDone = false

        while (!streamDone) {
          const { done, value } = await reader.read()
          if (done) break
          textBuffer += decoder.decode(value, { stream: true })

          let newlineIndex: number
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex)
            textBuffer = textBuffer.slice(newlineIndex + 1)
            if (line.endsWith("\r")) line = line.slice(0, -1)
            if (line.startsWith(":") || line.trim() === "") continue
            if (!line.startsWith("data: ")) continue

            const jsonStr = line.slice(6).trim()
            if (jsonStr === "[DONE]") {
              streamDone = true
              break
            }
            try {
              const parsed = JSON.parse(jsonStr)
              const content = parsed.choices?.[0]?.delta?.content as
                | string
                | undefined
              if (content) upsert(content)
            } catch {
              textBuffer = line + "\n" + textBuffer
              break
            }
          }
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Erreur inconnue")
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [messages, isStreaming, lang]
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
  }, [])

  return { messages, isStreaming, error, send, stop, reset }
}
