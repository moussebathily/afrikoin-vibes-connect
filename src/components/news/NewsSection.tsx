import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Newspaper, 
  Trophy, 
  Palette, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
}

interface NewsSectionProps {
  limit?: number
  showTabs?: boolean
}

export function NewsSection({ limit = 6, showTabs = true }: NewsSectionProps) {
  const [generalNews, setGeneralNews] = useState<NewsItem[]>([])
  const [sportsNews, setSportsNews] = useState<NewsItem[]>([])
  const [cultureNews, setCultureNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    fetchAllNews()
  }, [])

  const fetchAllNews = async () => {
    try {
      const [general, sports, culture] = await Promise.all([
        supabase
          .from('daily_news')
          .select('*')
          .not('category_slug', 'in', '("sports","culture")')
          .order('published_at', { ascending: false })
          .limit(limit),
        supabase
          .from('daily_news')
          .select('*')
          .eq('category_slug', 'sports')
          .order('published_at', { ascending: false })
          .limit(limit),
        supabase
          .from('daily_news')
          .select('*')
          .eq('category_slug', 'culture')
          .order('published_at', { ascending: false })
          .limit(limit)
      ])

      setGeneralNews((general.data || []) as NewsItem[])
      setSportsNews((sports.data || []) as NewsItem[])
      setCultureNews((culture.data || []) as NewsItem[])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  }

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <Card className={`transition-all hover:shadow-md cursor-pointer group ${
      item.is_breaking ? 'border-destructive bg-destructive/5' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {item.image_url && (
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {item.is_breaking && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Breaking
                </Badge>
              )}
              {item.category_slug && (
                <Badge variant="outline" className="text-xs capitalize">
                  {item.category_slug}
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
              {item.title}
            </h4>
            {item.content && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {item.content}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(item.published_at || item.created_at)}</span>
              {item.source && (
                <>
                  <span>•</span>
                  <span>{item.source}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const NewsList = ({ items, emptyMessage }: { items: NewsItem[], emptyMessage: string }) => (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map(item => <NewsCard key={item.id} item={item} />)
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{emptyMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!showTabs) {
    return (
      <section aria-label="Actualités du jour">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="h-5 w-5 text-primary" />
                Actualités du jour
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/culture" className="text-xs">
                  Voir tout <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <NewsList items={generalNews} emptyMessage="Aucune actualité disponible" />
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section aria-label="Actualités et informations">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Info du jour
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="general" className="text-xs sm:text-sm">
                <Newspaper className="h-4 w-4 mr-1.5" />
                Actualités
              </TabsTrigger>
              <TabsTrigger value="sports" className="text-xs sm:text-sm">
                <Trophy className="h-4 w-4 mr-1.5" />
                Sport
              </TabsTrigger>
              <TabsTrigger value="culture" className="text-xs sm:text-sm">
                <Palette className="h-4 w-4 mr-1.5" />
                Culture
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-0">
              <NewsList items={generalNews} emptyMessage="Aucune actualité disponible" />
              <div className="mt-3 text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/culture">Voir toutes les actualités</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sports" className="mt-0">
              <NewsList items={sportsNews} emptyMessage="Aucune info sportive disponible" />
              <div className="mt-3 text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/sports">Voir le sport</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="culture" className="mt-0">
              <NewsList items={cultureNews} emptyMessage="Aucune info culturelle disponible" />
              <div className="mt-3 text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/culture">Voir la culture</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
