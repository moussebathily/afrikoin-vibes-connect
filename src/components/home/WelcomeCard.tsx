import React from 'react'
import { Gift, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function WelcomeCard() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  // Don't show if user has been active for a while
  if (profile?.created_at) {
    const daysSinceJoined = Math.floor(
      (new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceJoined > 7) return null
  }

  return (
    <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">
            Bienvenue sur AfriKoin ! 🎉
          </h2>
          <p className="text-primary-foreground/90 mb-4">
            Découvrez une nouvelle façon de partager et de monétiser votre contenu en Afrique.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="bg-primary-foreground/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Gift className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">10 likes gratuits</span>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-foreground/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Contenu premium</span>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-foreground/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Communauté</span>
            </div>
          </div>
          
          <Button
            variant="secondary"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => navigate('/create')}
          >
            Créer mon premier post
          </Button>
        </div>
      </div>
    </div>
  )
}