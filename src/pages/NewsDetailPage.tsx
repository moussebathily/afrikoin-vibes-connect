import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Globe, AlertCircle, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { EntitySEO } from '@/components/seo/EntitySEO'

interface NewsItem {
  id: string
  title: string
  content?: string
  category?: string
  category_slug?: string
  image_url?: string
  is_breaking?: boolean
  is_featured?: boolean
  published_at?: string
  created_at: string
  source?: string
  source_url?: string
  country_codes?: string[]
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    ;(supabase as any)
      .from('daily_news')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }: any) => {
        setItem(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-8 w-2/3 bg-muted rounded animate-pulse mb-4" />
        <div className="h-64 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Article introuvable</h1>
        <p className="text-muted-foreground mb-6">Cet article n'existe pas ou a été retiré.</p>
        <Button asChild>
          <Link to="/news">Voir toutes les actualités</Link>
        </Button>
      </main>
    )
  }

  const url = `https://afrikoin.online/news/${item.id}`
  const datePublished = item.published_at || item.created_at
  const description = (item.content || item.title).slice(0, 200)

  const newsLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description,
    ...(item.image_url && { image: [item.image_url] }),
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: url,
    author: {
      '@type': 'Organization',
      name: item.source || 'AfriKoin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AfriKoin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://afrikoin.online/og-image.png',
      },
    },
    ...(item.category_slug && { articleSection: item.category_slug }),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://afrikoin.online/' },
      { '@type': 'ListItem', position: 2, name: 'Actualités', item: 'https://afrikoin.online/news' },
      { '@type': 'ListItem', position: 3, name: item.title, item: url },
    ],
  }

  return (
    <>
      <EntitySEO
        title={item.title}
        description={description}
        image={item.image_url}
        url={url}
        type="article"
        jsonLd={[newsLd, breadcrumbLd]}
      />

      <main className="mx-auto max-w-3xl px-4 py-6 pb-24">
        <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/news" className="hover:text-primary">Actualités</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{item.title}</span>
        </nav>

        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {item.is_breaking && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" /> Breaking
            </Badge>
          )}
          {item.category_slug && (
            <Badge variant="outline" className="capitalize text-xs">{item.category_slug}</Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{item.title}</h1>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(datePublished), { addSuffix: true, locale: fr })}
          </span>
          {item.source && <span>• {item.source}</span>}
          {item.country_codes?.length ? (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {item.country_codes.slice(0, 3).join(', ')}
            </span>
          ) : null}
        </div>

        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full rounded-xl mb-6 object-cover max-h-[420px]"
            loading="eager"
          />
        )}

        {item.content && (
          <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary whitespace-pre-line">
            {item.content}
          </article>
        )}

        {item.source_url && (
          <Card className="mt-8">
            <CardContent className="p-4 text-sm">
              Source originale :{' '}
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {item.source || item.source_url}
              </a>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
