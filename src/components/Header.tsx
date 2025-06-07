
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Video, Upload, MapPin, Shield, CreditCard } from 'lucide-react';

interface HeaderProps {
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const text = {
    fr: {
      title: 'AfriKoin',
      subtitle: 'Votre marché panafricain',
      publish: 'Publier',
      live: 'Live',
      voice: 'Vocal',
      locate: 'Localiser',
      secure: 'Sécurisé',
      payment: 'Paiement'
    },
    en: {
      title: 'AfriKoin',
      subtitle: 'Your Pan-African marketplace',
      publish: 'Publish',
      live: 'Live',
      voice: 'Voice',
      locate: 'Locate',
      secure: 'Secure',
      payment: 'Payment'
    }
  };

  return (
    <header className="bg-afrikoin-gradient shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-afrikoin-gradient rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{text[language].title}</h1>
              <p className="text-white/80 text-sm">{text[language].subtitle}</p>
            </div>
          </div>

          {/* Actions principales */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              {text[language].publish}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Video className="w-4 h-4 mr-2" />
              {text[language].live}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Mic className="w-4 h-4 mr-2" />
              {text[language].voice}
            </Button>
          </div>

          {/* Sélecteur de langue */}
          <div className="flex items-center space-x-2">
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLanguageChange('fr')}
              className={language === 'fr' ? 'bg-white text-primary' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'}
            >
              FR
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLanguageChange('en')}
              className={language === 'en' ? 'bg-white text-primary' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'}
            >
              EN
            </Button>
          </div>
        </div>

        {/* Barre de fonctionnalités */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <MapPin className="w-4 h-4" />
              <span>{text[language].locate}</span>
            </div>
          </Card>
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <Shield className="w-4 h-4" />
              <span>{text[language].secure}</span>
            </div>
          </Card>
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{text[language].payment}</span>
            </div>
          </Card>
        </div>
      </div>
    </header>
  );
};

export default Header;
