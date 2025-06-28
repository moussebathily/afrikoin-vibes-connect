
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesGrid from '@/components/CategoriesGrid';
import ContentCreation from '@/components/ContentCreation';
import SocialFeed from '@/components/SocialFeed';
import UserProfile from '@/components/UserProfile';
import LiveStreaming from '@/components/LiveStreaming';
import PaymentOptions from '@/components/PaymentOptions';
import DailyNews from '@/components/DailyNews';
import DailyEntertainment from '@/components/DailyEntertainment';
import MessagingCenter from '@/components/MessagingCenter';
import Footer from '@/components/Footer';
import NavigationMenu from '@/components/NavigationMenu';
import SEOHead from '@/components/SEOHead';
import { Language } from '@/types/language';
import { useMobile } from '@/hooks/useMobile';
import { useSEOAutomation } from '@/hooks/useSEOAutomation';

const Index = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const { isMobile, isCapacitor } = useMobile();
  
  // Automatisation SEO
  const { submitToGoogle } = useSEOAutomation(language);

  useEffect(() => {
    // Configuration pour les applications mobiles Capacitor
    if (isCapacitor) {
      console.log('AfriKoin running in Capacitor mobile app');
      
      // Gestion du status bar
      if ((window as any).StatusBar) {
        (window as any).StatusBar.setBackgroundColor('#22c55e');
        (window as any).StatusBar.setStyle('light');
      }
      
      // Gestion du splash screen
      if ((window as any).SplashScreen) {
        setTimeout(() => {
          (window as any).SplashScreen.hide();
        }, 3000);
      }
    }

    // Soumettre automatiquement à Google après 5 secondes
    const timer = setTimeout(() => {
      submitToGoogle();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isCapacitor, submitToGoogle]);

  return (
    <div className={`min-h-screen bg-background ${isCapacitor ? 'safe-area-top safe-area-bottom' : ''}`}>
      <SEOHead 
        language={language}
        title="AfriKoin - Marketplace Panafricain | Commerce et Culture en Afrique"
        description="Découvrez AfriKoin, le marketplace n°1 en Afrique. Achetez, vendez et connectez-vous avec plus de 50K utilisateurs dans 25 pays. Paiements locaux, live streaming, assistant vocal."
        keywords="AfriKoin, marketplace Afrique, petites annonces géolocalisées, commerce africain, Orange Money, Wave, streaming live Afrique, assistant vocal, vente en ligne Afrique"
        url="https://afrikoin.com"
      />
      
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      <main className={`${isMobile ? 'mobile-spacing pb-20' : ''}`}>
        <HeroSection language={language} />
        <CategoriesGrid language={language} />
        <ContentCreation language={language} />
        <DailyNews language={language} />
        <DailyEntertainment language={language} />
        <SocialFeed language={language} />
        <MessagingCenter language={language} />
        <UserProfile language={language} />
        <LiveStreaming language={language} />
        <PaymentOptions language={language} />
      </main>
      
      <Footer language={language} />
      
      {isMobile && <NavigationMenu />}
    </div>
  );
};

export default Index;
