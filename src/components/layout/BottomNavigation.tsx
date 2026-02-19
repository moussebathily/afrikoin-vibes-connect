import React, { useState } from 'react'
import { Home, Wallet, Package, ShoppingBag, MoreHorizontal, Briefcase, Newspaper, Trophy, Palette, TrendingUp, X, Car, Shield, CalendarCheck, Beef, Fuel, ImageIcon, MessageCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAdminRole } from '@/hooks/useAdminRole'
import { ROUTES } from '@/config/routes'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const { isAdmin } = useAdminRole()

  const mainItems = [
    { icon: Home, label: t('navigation.home'), path: ROUTES.HOME },
    { icon: ShoppingBag, label: 'Boutique', path: ROUTES.MARKETPLACE },
    { icon: MessageCircle, label: 'Messages', path: ROUTES.MESSAGING },
    { icon: Briefcase, label: 'Emploi', path: ROUTES.JOBS },
  ]

  const moreItems = [
    { icon: Newspaper, label: 'Actus', path: ROUTES.NEWS },
    { icon: Fuel, label: 'Stations', path: ROUTES.STATIONS },
    { icon: Beef, label: 'Tabaski', path: ROUTES.TABASKI },
    { icon: Car, label: 'Transport', path: ROUTES.TRANSPORT },
    { icon: CalendarCheck, label: 'Mes Locations', path: ROUTES.MY_RENTALS },
    { icon: Package, label: 'Colis', path: ROUTES.TRACKING },
    { icon: TrendingUp, label: 'Marchés', path: ROUTES.MARKETS },
    { icon: Trophy, label: 'Sport', path: ROUTES.SPORTS },
    { icon: Palette, label: 'Culture', path: ROUTES.CULTURE },
    { icon: Wallet, label: 'Wallet', path: ROUTES.WALLET },
    { icon: ImageIcon, label: 'Fonds d\'Écran', path: ROUTES.WALLPAPERS },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: ROUTES.ADMIN_TRANSPORT }] : []),
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
