import { useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { LifeBuoy, Sparkles } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FaqSearch, normalize } from "@/components/help/FaqSearch"
import { FaqAccordion } from "@/components/help/FaqAccordion"
import { SupportChat } from "@/components/help/SupportChat"
import { HelpLanguageToggle } from "@/components/help/HelpLanguageToggle"
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqAudience,
  type FaqLang,
} from "@/data/faqData"

export default function HelpFaqPage() {
  const [lang, setLang] = useState<FaqLang>("fr")
  const [audience, setAudience] = useState<FaqAudience | "all">("all")
  const [query, setQuery] = useState("")
  const [highlightId, setHighlightId] = useState<string | undefined>()

  const filtered = useMemo(() => {
    const q = normalize(query)
    return FAQ_ITEMS.filter((f) => {
      if (audience !== "all" && f.audience !== audience) return false
      if (!q) return true
      const blob = normalize(
        [
          f.question.fr,
          f.question.wo,
          f.question.ha,
          f.question.en,
          f.answer.fr,
          f.answer.wo,
          f.answer.ha,
          f.answer.en,
          f.tags.join(" "),
        ].join(" ")
      )
      return blob.includes(q)
    })
  }, [query, audience])

  const grouped = useMemo(() => {
    return FAQ_CATEGORIES.map((c) => ({
      ...c,
      items: filtered.filter((f) => f.category === c.key),
    })).filter((g) => g.items.length > 0)
  }, [filtered])

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.question.fr,
      acceptedAnswer: { "@type": "Answer", text: f.answer.fr },
    })),
  }

  const scrollToFaq = (id: string) => {
    setHighlightId(id)
    setTimeout(() => {
      document
        .getElementById(`faq-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 50)
  }

  return (
    <>
      <Helmet>
        <title>
          Centre d'aide AfriKoin — FAQ acheteurs, vendeurs, Mobile Money &
          livraison
        </title>
        <meta
          name="description"
          content="Toutes les réponses : éviter les arnaques, payer avec Orange Money / Wave / MTN MoMo, livraison en Afrique, retours et remboursements, vendre en confiance sur AfriKoin."
        />
        <link rel="canonical" href="https://www.afrikoin.online/aide" />
        <meta
          property="og:title"
          content="Centre d'aide AfriKoin — Acheter et vendre en confiance"
        />
        <meta
          property="og:description"
          content="FAQ multilingue (FR/WO/HA/EN), articles SEO et assistant IA pour acheter et vendre sans risque en Afrique."
        />
        <meta property="og:url" content="https://www.afrikoin.online/aide" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <main className="mx-auto max-w-5xl px-4 py-8 pb-24">
        {/* Hero */}
        <section className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <LifeBuoy className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Centre d'aide AfriKoin
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Acheter et vendre en confiance partout en Afrique
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Réponses claires aux questions des acheteurs et vendeurs : Mobile
            Money, livraison, arnaques, retours. Disponible en français, wolof,
            hausa et anglais.
          </p>
        </section>

        {/* Language */}
        <div className="mb-4 flex justify-center">
          <HelpLanguageToggle value={lang} onChange={setLang} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <FaqSearch
            value={query}
            onChange={setQuery}
            placeholder="Rechercher : arnaque, Wave, retour…"
          />
        </div>

        {/* Audience tabs */}
        <Tabs
          value={audience}
          onValueChange={(v) => setAudience(v as FaqAudience | "all")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="buyer">Acheteurs</TabsTrigger>
            <TabsTrigger value="seller">Vendeurs</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Grouped FAQ */}
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {group.label[lang] || group.label.fr}
                </h2>
                <Badge variant="secondary" className="text-[10px]">
                  {group.items.length}
                </Badge>
              </div>
              <FaqAccordion
                items={group.items}
                lang={lang}
                highlightId={highlightId}
              />
            </section>
          ))}
          {grouped.length === 0 && (
            <div className="rounded-xl border border-border/30 bg-background/40 p-8 text-center text-sm text-muted-foreground">
              Aucun résultat. Essayez d'autres mots-clés ou demandez à
              l'assistant IA ci-dessous.
            </div>
          )}
        </div>

        {/* Assistant IA */}
        <section className="mt-10" id="assistant">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Assistant IA</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Vous ne trouvez pas ? Posez votre question. Notre assistant s'appuie
            sur la FAQ AfriKoin et cite les réponses sources.
          </p>
          <SupportChat lang={lang} onCitationClick={scrollToFaq} />
        </section>
      </main>
    </>
  )
}
