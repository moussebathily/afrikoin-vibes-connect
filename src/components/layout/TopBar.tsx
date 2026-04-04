import React from 'react'
import { Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LanguageSelector } from '@/components/ui/language-selector'
import { CartButton } from '@/components/cart/CartButton'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function TopBar() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass supports-[backdrop-filter]:bg-background/80 pt-safe-top">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gradient leading-tight">
              AfriKoin
            </span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">L'Afrique connectée</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/search')}
            aria-label={t('navigation.search')}
            className="hover:bg-primary/10 hover:text-primary rounded-xl"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/notifications')}
            aria-label={t('navigation.notifications')}
            className="relative hover:bg-primary/10 hover:text-primary rounded-xl"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/create')}
            aria-label={t('navigation.create')}
            className="hover:bg-primary/10 hover:text-primary rounded-xl"
          >
          <Plus className="h-5 w-5" />
          </Button>

          <CartButton />

          <LanguageSelector />

          <div className="relative">
            <Avatar 
              className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-200" 
              onClick={() => navigate('/profile')}
            >
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}