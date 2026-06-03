import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { ChevronRight, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingMinutes: number
  children: React.ReactNode
}

export function ArticleLayout({
  slug,
  title,
  description,
  publishedAt,
  readingMinutes,
  children,
}: Props) {
  const url = `https://www.afrikoin.online/aide/articles/${slug}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: { "@type": "Organization", name: "AfriKoin" },
    publisher: {
      "@type": "Organization",
      name: "AfriKoin",
      logo: {
        "@type": "ImageObject",
        url: "https://www.afrikoin.online/og-image.png",
      },
    },
    mainEntityOfPage: url,
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.afrikoin.online/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Aide",
        item: "https://www.afrikoin.online/aide",
      },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  }

  return (
    <>
      <Helmet>
        <title>{title} | AfriKoin</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbLd)}
        </script>
      </Helmet>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/aide" className="hover:text-primary">
            Aide
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {readingMinutes} min de lecture · Mis à jour le{" "}
            {new Date(publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          {children}
        </article>

        <aside className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
          <div className="mb-3 flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">Besoin d'aide précise ?</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Posez votre question à l'assistant IA AfriKoin — il vous répond en
            citant la FAQ.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-accent">
            <Link to="/aide#assistant">Demander à l'assistant</Link>
          </Button>
        </aside>
      </main>
    </>
  )
}
