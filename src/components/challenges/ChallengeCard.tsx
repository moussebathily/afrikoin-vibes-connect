import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Users, Calendar, Gift } from 'lucide-react'
import { Challenge } from '@/types/content'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ChallengeCardProps {
  challenge: Challenge
  onJoin?: () => void
  isParticipating?: boolean
}

export function ChallengeCard({ challenge, onJoin, isParticipating }: ChallengeCardProps) {
  const endDate = new Date(challenge.end_date)
  const startDate = new Date(challenge.start_date)
  const now = new Date()
  
  const isActive = now >= startDate && now <= endDate
  const isUpcoming = now < startDate
  const isEnded = now > endDate
  
  const timeLeft = isActive ? formatDistanceToNow(endDate, { addSuffix: true, locale: fr }) : null
  const startsIn = isUpcoming ? formatDistanceToNow(startDate, { addSuffix: true, locale: fr }) : null
  
  const participationRate = challenge.max_participants 
    ? (challenge.current_participants / challenge.max_participants) * 100 
    : 0

  const getStatusBadge = () => {
    if (isEnded) return <Badge variant="secondary">Terminé</Badge>
    if (isUpcoming) return <Badge variant="outline">À venir</Badge>
    if (isActive) return <Badge variant="default">En cours</Badge>
    return null
  }

  const getChallengeTypeColor = () => {
    switch (challenge.challenge_type) {
      case 'weekly':
        return 'bg-blue-500'
      case 'monthly':
        return 'bg-purple-500'
      case 'special':
        return 'bg-gradient-to-r from-pink-500 to-violet-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${getChallengeTypeColor()}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-primary" />
              {getStatusBadge()}
              <Badge variant="outline" className="capitalize">
                {challenge.challenge_type}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {challenge.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {challenge.description}
        </p>
        
        {/* Participation Progress */}
        {challenge.max_participants && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Participants
              </span>
              <span className="text-muted-foreground">
                {challenge.current_participants}/{challenge.max_participants}
              </span>
            </div>
            <Progress value={participationRate} className="h-2" />
          </div>
        )}
        
        {/* Rewards */}
        {(challenge.reward_points > 0 || challenge.reward_title) && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Gift className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Récompenses</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {challenge.reward_points > 0 && (
                  <span>{challenge.reward_points} points</span>
                )}
                {challenge.reward_title && (
                  <>
                    {challenge.reward_points > 0 && <span>•</span>}
                    <span>"{challenge.reward_title}"</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Timing */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {isActive && <span>Se termine {timeLeft}</span>}
          {isUpcoming && <span>Commence {startsIn}</span>}
          {isEnded && <span>Terminé</span>}
        </div>
        
        {/* Action Button */}
        {isActive && challenge.is_active && onJoin && (
          <Button 
            onClick={onJoin}
            disabled={isParticipating || (challenge.max_participants && challenge.current_participants >= challenge.max_participants)}
            className="w-full"
            variant={isParticipating ? "outline" : "default"}
          >
            {isParticipating ? "Déjà inscrit" : "Participer"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}