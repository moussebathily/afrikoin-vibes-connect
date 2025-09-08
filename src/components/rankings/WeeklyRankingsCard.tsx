import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, Trophy, Medal } from 'lucide-react'
import { WeeklyRanking } from '@/types/content'
import { useTranslation } from 'react-i18next'

interface WeeklyRankingsCardProps {
  rankings: WeeklyRanking[]
  category: string
  countryCode?: string
}

export function WeeklyRankingsCard({ rankings, category, countryCode }: WeeklyRankingsCardProps) {
  const { t } = useTranslation()

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{position}</span>
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-muted'
    }
  }

  if (rankings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('rankings.weeklyLeaders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            {t('rankings.noRankingsYet')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          {t('rankings.weeklyLeaders')} - {category}
        </CardTitle>
        {countryCode && (
          <Badge variant="outline" className="w-fit">
            {countryCode.toUpperCase()}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {rankings.map((ranking, index) => (
          <div
            key={ranking.id}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              ranking.rank_position === 1 ? getRankColor(1) : 'hover:bg-muted/50'
            } transition-colors`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(ranking.rank_position || index + 1)}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={ranking.profiles?.avatar_url} />
              <AvatarFallback>
                {ranking.profiles?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">
                  {ranking.profiles?.name || 'Utilisateur'}
                </p>
                {ranking.profiles?.is_verified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    ✓
                  </Badge>
                )}
              </div>
              {ranking.title && (
                <Badge 
                  variant="outline" 
                  className="text-xs mt-1 bg-primary/10 border-primary/20"
                >
                  {ranking.title}
                </Badge>
              )}
            </div>
            
            <div className="text-right">
              <p className="font-bold text-primary">
                {ranking.total_score.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {ranking.total_posts} posts
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}