
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Video, Upload, MapPin } from 'lucide-react';

interface HeroSectionProps {
  language: 'fr' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const text = {
    fr: {
      mainTitle: 'Votre marché panafricain',
      subtitle: 'Achetez, vendez et connectez-vous partout en Afrique',
      description: 'La plateforme tout-en-un pour le commerce et la culture africaine. Petites annonces, live streaming, assistant vocal et paiements locaux.',
      startSelling: 'Commencer à vendre',
      exploreMarket: 'Explorer le marché',
      features: [
        'Petites annonces géolocalisées',
        'Live streaming interactif',
        'Assistant vocal intelligent',
        'Paiements sécurisés (Orange Money, Wave, Stripe)'
      ]
    },
    en: {
      mainTitle: 'Your Pan-African marketplace',
      subtitle: 'Buy, sell and connect across Africa',
      description: 'The all-in-one platform for African commerce and culture. Classified ads, live streaming, voice assistant and local payments.',
      startSelling: 'Start Selling',
      exploreMarket: 'Explore Market',
      features: [
        'Geolocated classified ads',
        'Interactive live streaming',
        'Smart voice assistant',
        'Secure payments (Orange Money, Wave, Stripe)'
      ]
    }
  };

  const highlights = [
    { icon: Upload, label: text[language].features[0] },
    { icon: Video, label: text[language].features[1] },
    { icon: Mic, label: text[language].features[2] },
    { icon: MapPin, label: text[language].features[3] }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [highlights.length]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                {text[language].mainTitle}
              </h1>
              <h2 className="text-xl lg:text-2xl text-muted-foreground">
                {text[language].subtitle}
              </h2>
              <p className="text-lg text-foreground/80 max-w-lg">
                {text[language].description}
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg animate-pulse-glow">
                <Upload className="w-5 h-5 mr-2" />
                {text[language].startSelling}
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg">
                {text[language].exploreMarket}
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">25+</div>
                <div className="text-sm text-muted-foreground">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">100K+</div>
                <div className="text-sm text-muted-foreground">Annonces</div>
              </div>
            </div>
          </div>

          {/* Fonctionnalités en rotation */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                const isActive = index === currentIndex;
                return (
                  <Card
                    key={index}
                    className={`p-6 transition-all duration-500 transform ${
                      isActive 
                        ? 'bg-afrikoin-gradient text-white scale-105 shadow-2xl' 
                        : 'bg-card hover:bg-card/80 hover:scale-102'
                    }`}
                  >
                    <div className="space-y-3">
                      <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-primary'}`} />
                      <p className={`font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                        {highlight.label}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Indicateurs */}
            <div className="flex justify-center mt-6 space-x-2">
              {highlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
