
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
import Loading from '@/components/ui/loading';
import { AuthInitializer } from '@/components/AuthInitializer';
import { Language } from '@/types/language';
import { useMobile } from '@/hooks/useMobile';
import { useSEOAutomation } from '@/hooks/useSEOAutomation';
import { useActionStore } from '@/store/actionStore';
import { usePerformance } from '@/hooks/usePerformance';
import { useCache } from '@/hooks/useCache';
import { analytics } from '@/services/analyticsService';
import { advancedAnalytics } from '@/services/advancedAnalytics';

const Index = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, isCapacitor } = useMobile();
  const { submitToGoogle } = useSEOAutomation(language);
  const { user } = useActionStore();
  const { metrics, measureAsync } = usePerformance('Index');
  const cache = useCache({ ttl: 10 * 60 * 1000 }); // 10 minutes cache

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize analytics with performance tracking
        await measureAsync('analytics_init', async () => {
          analytics.initialize();
          analytics.trackPageView('/', user?.id);
        });

        // Setup advanced tracking
        const cleanup = advancedAnalytics.setupRealTimeTracking();
        advancedAnalytics.trackUserJourney('app_loaded');

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

        // Optimized SEO submission with caching
        const cacheKey = `seo_submitted_${language}`;
        if (!cache.has(cacheKey)) {
          const timer = setTimeout(async () => {
            await measureAsync('seo_submit', async () => {
              await submitToGoogle();
              cache.set(cacheKey, true);
            });
          }, 5000);

          return () => {
            clearTimeout(timer);
            cleanup?.();
          };
        }

        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        analytics.trackError('app_init_error', error instanceof Error ? error.message : 'Unknown error', user?.id);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isCapacitor, submitToGoogle, user?.id, language, measureAsync, cache]);

  // Track language changes with performance
  useEffect(() => {
    measureAsync('language_change', async () => {
      analytics.track('language_changed', { language }, user?.id);
      advancedAnalytics.trackUserEngagement('language_selector', 'change');
    });
  }, [language, user?.id, measureAsync]);

  // Track performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const behavior = advancedAnalytics.getUserBehavior();
      const insights = advancedAnalytics.getPerformanceInsights();
      
      analytics.track('performance_snapshot', {
        ...behavior,
        ...insights,
        renderMetrics: metrics
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading 
          size="lg" 
          variant="spinner" 
          text={language === 'fr' ? 'Chargement d\'AfriKoin...' : 'Loading AfriKoin...'} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isCapacitor ? 'safe-area-top safe-area-bottom' : ''}`}>
      <AuthInitializer />
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
