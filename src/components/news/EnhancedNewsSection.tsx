import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Newspaper, 
  Trophy, 
  Palette, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Landmark,
  Coins,
  Laptop,
  Heart,
  Leaf,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { DEMO_NEWS, NEWS_CATEGORIES, type DemoNews } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface EnhancedNewsSectionProps {
  limit?: number;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'politique': return Landmark;
    case 'economie': return Coins;
    case 'sports': return Trophy;
    case 'culture': return Palette;
    case 'technologie': return Laptop;
    case 'sante': return Heart;
    case 'environnement': return Leaf;
    default: return Newspaper;
  }
};

const getCategoryColor = (slug: string) => {
  switch (slug) {
    case 'politique': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'economie': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'sports': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'culture': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'technologie': return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
    case 'sante': return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'environnement': return 'bg-green-500/10 text-green-600 border-green-500/20';
    default: return 'bg-primary/10 text-primary border-primary/20';
  }
};

export function EnhancedNewsSection({ limit = 6 }: EnhancedNewsSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNews = activeCategory === 'all' 
    ? DEMO_NEWS.slice(0, limit) 
    : DEMO_NEWS.filter(n => n.category_slug === activeCategory).slice(0, limit);

  const featuredNews = DEMO_NEWS.find(n => n.is_breaking) || DEMO_NEWS[0];

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  return (
    <section aria-label="Actualités et informations" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Actualités Afrique</h2>
            <p className="text-xs text-muted-foreground">Les dernières nouvelles du continent</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-primary">
          <Link to="/news">
            Voir tout <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Category Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {NEWS_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const isActive = activeCategory === cat.slug;
            return (
              <Button
                key={cat.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "flex-shrink-0 gap-1.5 transition-all",
                  isActive && "shadow-md"
                )}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Featured News Card */}
      {activeCategory === 'all' && featuredNews && (
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10 shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
              <img 
                src={featuredNews.image_url} 
                alt={featuredNews.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
              {featuredNews.is_breaking && (
                <Badge variant="destructive" className="absolute top-3 left-3 animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Breaking
                </Badge>
              )}
            </div>
            <div className="md:w-3/5 p-5 flex flex-col justify-center">
              <Badge className={cn("w-fit mb-2", getCategoryColor(featuredNews.category_slug))}>
                {featuredNews.category_label}
              </Badge>
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{featuredNews.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{featuredNews.content}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(featuredNews.published_at)}
                </span>
                <span>•</span>
                <span>{featuredNews.source}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredNews.filter(n => n.id !== featuredNews?.id || activeCategory !== 'all').map((news) => {
          const CategoryIcon = getCategoryIcon(news.category_slug);
          return (
            <Card 
              key={news.id} 
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden",
                news.is_breaking && "border-destructive/50 bg-destructive/5"
              )}
            >
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                    <img 
                      src={news.image_url} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {news.is_featured && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        ⭐
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge 
                          variant="outline" 
                          className={cn("text-[10px] px-1.5 py-0 gap-1", getCategoryColor(news.category_slug))}
                        >
                          <CategoryIcon className="h-2.5 w-2.5" />
                          {news.category_label}
                        </Badge>
                        {news.is_breaking && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(news.published_at)}</span>
                      <span>•</span>
                      <span className="truncate">{news.source}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune actualité dans cette catégorie</p>
            <p className="text-sm">Revenez plus tard pour les dernières nouvelles</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
