import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Send, Sparkles, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSupportChat } from "@/hooks/useSupportChat"
import { FAQ_ITEMS, type FaqLang } from "@/data/faqData"

interface Props {
  lang: FaqLang
  onCitationClick?: (faqId: string) => void
}

const SUGGESTIONS: Record<FaqLang, string[]> = {
  fr: [
    "Comment éviter les arnaques ?",
    "Quels Mobile Money sont acceptés ?",
    "Combien coûte la livraison ?",
  ],
  wo: ["Naka laay moytu ay nax ?", "Ban Mobile Money lañu nangu ?"],
  ha: ["Yadda ake guji yaudara?", "Wadanne Mobile Money?"],
  en: ["How do I avoid scams?", "Which Mobile Money is accepted?"],
}

export function SupportChat({ lang, onCitationClick }: Props) {
  const { messages, isStreaming, error, send, reset } = useSupportChat(lang)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return
    send(input)
    setInput("")
  }

  const getFaqById = (id: string) => FAQ_ITEMS.find((f) => f.id === id)

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-xl">
      <header className="flex items-center justify-between gap-2 border-b border-border/40 bg-background/60 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-br from-primary to-accent p-1.5">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Assistant AfriKoin</p>
            <p className="text-[11px] text-muted-foreground">
              Répond en se basant sur la FAQ
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button size="sm" variant="ghost" onClick={reset} className="h-8">
            <RotateCcw className="h-3 w-3 mr-1" />
            Nouvelle conversation
          </Button>
        )}
      </header>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="space-y-4 p-4">
          {messages.length === 0 && (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Posez votre question. L'assistant cite les FAQ pertinentes.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS[lang].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    onClick={() => send(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/80 border border-border/40 backdrop-blur"
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {/* Hide citation markers in displayed text */}
                    {m.content.replace(/\[FAQ:[a-z0-9-]+\]/gi, "").trim()}
                  </ReactMarkdown>
                </div>

                {m.faqIds && m.faqIds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/30 pt-2">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Réponses liées :
                    </span>
                    {m.faqIds.map((id) => {
                      const faq = getFaqById(id)
                      if (!faq) return null
                      return (
                        <button
                          key={id}
                          onClick={() => onCitationClick?.(id)}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20"
                        >
                          {faq.question[lang] || faq.question.fr}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-background/80 px-4 py-2.5">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Réflexion…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={submit}
        className="border-t border-border/40 bg-background/60 p-3 backdrop-blur"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre question…"
            disabled={isStreaming}
            className="h-10 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isStreaming || !input.trim()}
            className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
