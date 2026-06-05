import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Newspaper, 
  Trophy, 
  Palette, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Globe,
  Flame
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
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
  country_codes?: string[]
}

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const { t } = useTranslation()

  useEffect(() => {
    fetchNews()
  }, [activeCategory])

  const fetchNews = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('daily_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50)

      if (activeCategory !== 'all') {
        query = query.eq('category_slug', activeCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching news:', error)
        setNews([])
      } else {
        setNews((data || []) as NewsItem[])
      }
    } catch (error) {
      console.error('Error:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  }

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const breakingNews = filteredNews.filter(item => item.is_breaking)
  const featuredNews = filteredNews.filter(item => item.is_featured && !item.is_breaking)
  const regularNews = filteredNews.filter(item => !item.is_breaking && !item.is_featured)

  const stats = {
    total: news.length,
    breaking: breakingNews.length,
    featured: featuredNews.length,
    sports: news.filter(n => n.category_slug === 'sports').length,
    culture: news.filter(n => n.category_slug === 'culture').length
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          Actualités Africaines
        </h1>
        <p className="text-muted-foreground">
          Restez informé sur l'Afrique - Actualités, Sport, Culture
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-destructive" />
            <p className="text-2xl font-bold">{stats.breaking}</p>
            <p className="text-xs text-muted-foreground">Breaking</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold">{stats.sports}</p>
            <p className="text-xs text-muted-foreground">Sport</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Palette className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{stats.culture}</p>
            <p className="text-xs text-muted-foreground">Culture</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une actualité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            <Globe className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Tout
          </TabsTrigger>
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            <Newspaper className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Général
          </TabsTrigger>
          <TabsTrigger value="sports" className="text-xs sm:text-sm">
            <Trophy className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Sport
          </TabsTrigger>
          <TabsTrigger value="culture" className="text-xs sm:text-sm">
            <Palette className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Culture
          </TabsTrigger>
          <TabsTrigger value="business" className="text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Business
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Breaking News */}
          {breakingNews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Breaking News
              </h2>
              <div className="space-y-3">
                {breakingNews.map(item => (
                  <NewsCard key={item.id} item={item} formatTime={formatTime} />
                ))}
              </div>
            </section>
          )}

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                À la une
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredNews.slice(0, 4).map(item => (
                  <FeaturedNewsCard key={item.id} item={item} formatTime={formatTime} />
                ))}
              </div>
            </section>
          )}

          {/* Regular News */}
          <section>
            <h2 className="text-lg font-semibold mb-3">
              {activeCategory === 'all' ? 'Dernières actualités' : 
               activeCategory === 'sports' ? 'Actualités sportives' :
               activeCategory === 'culture' ? 'Actualités culturelles' :
               activeCategory === 'business' ? 'Actualités business' : 'Actualités générales'}
            </h2>
            <div className="space-y-3">
              {regularNews.length > 0 ? (
                regularNews.map(item => (
                  <NewsCard key={item.id} item={item} formatTime={formatTime} />
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold mb-2">Aucune actualité</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? 'Aucun résultat pour votre recherche' : 'Les actualités arrivent bientôt'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

// News Card Component
function NewsCard({ item, formatTime }: { item: NewsItem, formatTime: (date: string) => string }) {
  return (
    <Card className={`transition-all hover:shadow-md cursor-pointer group ${
      item.is_breaking ? 'border-destructive bg-destructive/5' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.image_url && (
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
            <h3 className={`font-semibold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors ${
              item.is_breaking ? 'text-destructive-foreground' : ''
            }`}>
              {item.title}
            </h3>
            {item.content && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.content}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(item.published_at || item.created_at)}
              </span>
              {item.source && (
                <span>• {item.source}</span>
              )}
              {item.country_codes && item.country_codes.length > 0 && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {item.country_codes.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Featured News Card
function FeaturedNewsCard({ item, formatTime }: { item: NewsItem, formatTime: (date: string) => string }) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
      {item.image_url && (
        <div className="h-40 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {item.category_slug && (
            <Badge variant="secondary" className="text-xs capitalize">
              {item.category_slug}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">À la une</Badge>
        </div>
        <h3 className="font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTime(item.published_at || item.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsPage
