import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { FaqItem, FaqLang } from "@/data/faqData"

interface Props {
  items: FaqItem[]
  lang: FaqLang
  highlightId?: string
}

export function FaqAccordion({ items, lang, highlightId }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/30 bg-background/40 p-8 text-center text-sm text-muted-foreground">
        Aucune question ne correspond à votre recherche.
      </div>
    )
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={highlightId}
      className="rounded-xl border border-border/40 bg-background/60 px-4 backdrop-blur"
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          id={`faq-${item.id}`}
          className={
            highlightId === item.id
              ? "animate-in fade-in ring-2 ring-primary/40 rounded-lg"
              : ""
          }
        >
          <AccordionTrigger className="text-left">
            <span className="flex items-start gap-2 pr-3">
              <Badge
                variant="outline"
                className="mt-0.5 shrink-0 text-[10px] uppercase tracking-wide"
              >
                {item.audience === "buyer" ? "Acheteur" : "Vendeur"}
              </Badge>
              <span className="font-medium text-foreground">
                {item.question[lang] || item.question.fr}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="whitespace-pre-line">
              {item.answer[lang] || item.answer.fr}
            </p>
            {item.articleSlug && (
              <Link
                to={`/aide/articles/${item.articleSlug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Lire l'article complet
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
