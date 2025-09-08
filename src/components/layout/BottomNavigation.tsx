import React from 'react'
import { Home, Heart, Wallet, User, Calendar, Trophy } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const navigationItems = [
    { icon: Home, label: t('navigation.home'), path: '/' },
    { icon: Trophy, label: t('navigation.culture'), path: '/culture' },
    { icon: Heart, label: t('navigation.sports'), path: '/sports' },
    { icon: Calendar, label: t('navigation.rankings'), path: '/rankings' },
    { icon: User, label: t('navigation.profile'), path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive && "text-primary"
                )} 
              />
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}