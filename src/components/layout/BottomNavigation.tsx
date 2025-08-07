import React from 'react'
import { Home, Heart, Wallet, User, Calendar } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigationItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Heart, label: 'Likes', path: '/likes' },
  { icon: Calendar, label: 'Fêtes', path: '/holidays' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: User, label: 'Profil', path: '/profile' },
]

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
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