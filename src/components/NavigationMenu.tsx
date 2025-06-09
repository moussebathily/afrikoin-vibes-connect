
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShoppingBag, 
  User, 
  Wallet, 
  BookOpen, 
  Music,
  MessageSquare,
  Video,
  Settings
} from 'lucide-react';

const NavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { path: '/fintech', icon: Wallet, label: 'Finance' },
    { path: '/education', icon: BookOpen, label: 'Éducation' },
    { path: '/entertainment', icon: Music, label: 'Divertissement' },
    { path: '/profile', icon: User, label: 'Profil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full flex flex-col items-center gap-1 h-auto py-2 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationMenu;
