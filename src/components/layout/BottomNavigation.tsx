import React, { useState } from 'react'
import { Home, Wallet, Package, ShoppingBag, MoreHorizontal, Briefcase, Newspaper, Trophy, Palette, TrendingUp, X, Car, Shield, CalendarCheck, Beef } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAdminRole } from '@/hooks/useAdminRole'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const { isAdmin } = useAdminRole()

  const mainItems = [
    { icon: Home, label: t('navigation.home'), path: '/' },
    { icon: ShoppingBag, label: 'Boutique', path: '/marketplace' },
    { icon: Newspaper, label: 'Actus', path: '/news' },
    { icon: Briefcase, label: 'Emploi', path: '/jobs' },
  ]

  const moreItems = [
    { icon: Beef, label: 'Tabaski', path: '/tabaski' },
    { icon: Car, label: 'Transport', path: '/transport' },
    { icon: CalendarCheck, label: 'Mes Locations', path: '/my-rentals' },
    { icon: Package, label: 'Colis', path: '/tracking' },
    { icon: TrendingUp, label: 'Marchés', path: '/markets' },
    { icon: Trophy, label: 'Sport', path: '/sports' },
    { icon: Palette, label: 'Culture', path: '/culture' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin/transport' }] : []),
  ]

  const isMoreActive = moreItems.some(item => location.pathname === item.path)

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Panel */}
      {showMore && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-card border border-border rounded-2xl shadow-elegant p-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Plus de sections</h3>
            <button 
              onClick={() => setShowMore(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {moreItems.map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path)
                    setShowMore(false)
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl transition-all",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path
            
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200",
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

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200",
              (showMore || isMoreActive)
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {(showMore || isMoreActive) && (
              <div className="absolute inset-0 bg-primary/10 rounded-xl animate-scale-in" />
            )}
            <MoreHorizontal 
              className={cn(
                "relative h-5 w-5 mb-1 transition-transform duration-200",
                (showMore || isMoreActive) && "text-primary scale-110"
              )} 
            />
            <span className={cn(
              "relative text-xs font-medium transition-all",
              (showMore || isMoreActive) && "text-primary"
            )}>
              Plus
            </span>
            {isMoreActive && !showMore && (
              <div className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </>
  )
}