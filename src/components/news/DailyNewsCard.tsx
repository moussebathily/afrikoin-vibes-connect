import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { DailyNews } from '@/types/content'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DailyNewsCardProps {
  news: DailyNews
  onClick?: () => void
}

export function DailyNewsCard({ news, onClick }: DailyNewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(news.published_at), {
    addSuffix: true,
    locale: fr
  })

  return (
    <Card className={`transition-all hover:shadow-md cursor-pointer ${
      news.is_breaking ? 'border-destructive bg-destructive/5' : ''
    }`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {news.is_breaking && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Breaking
                </Badge>
              )}
              {news.is_featured && (
                <Badge variant="secondary" className="text-xs">
                  À la une
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {news.category_slug}
              </Badge>
            </div>
            <h3 className={`font-semibold leading-tight ${
              news.is_breaking ? 'text-destructive-foreground' : ''
            }`}>
              {news.title}
            </h3>
          </div>
          {news.image_url && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={news.image_url} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {news.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
            {news.country_codes && news.country_codes.length > 0 && (
              <>
                <span>•</span>
                <span>{news.country_codes.slice(0, 2).join(', ')}</span>
                {news.country_codes.length > 2 && <span>+{news.country_codes.length - 2}</span>}
              </>
            )}
          </div>
          
          {news.source_url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                window.open(news.source_url, '_blank')
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}