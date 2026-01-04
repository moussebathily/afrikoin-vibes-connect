import React from 'react'
import { Home, Heart, Wallet, User, Calendar, Trophy, Building2, Package } from 'lucide-react'
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
    { icon: Package, label: 'Colis', path: '/tracking' },
    { icon: Building2, label: 'Marchés', path: '/markets' },
    { icon: Calendar, label: t('navigation.rankings'), path: '/rankings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl animate-scale-in" />
              )}
              <Icon 
                className={cn(
                  "relative h-5 w-5 mb-1 transition-transform duration-200",
                  isActive && "text-primary scale-110"
                )} 
              />
              <span className={cn(
                "relative text-xs font-medium transition-all",
                isActive && "text-primary"
              )}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}