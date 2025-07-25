
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesGrid from '@/components/CategoriesGrid';
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

// Lazy load heavy components
const ContentCreation = lazy(() => import('@/components/ContentCreation'));
const SocialFeed = lazy(() => import('@/components/SocialFeed'));
const UserProfile = lazy(() => import('@/components/UserProfile'));
const PostsFeed = lazy(() => import('@/components/PostsFeed'));
const LiveStreaming = lazy(() => import('@/components/LiveStreaming'));
const PaymentOptions = lazy(() => import('@/components/PaymentOptions'));
const DailyNews = lazy(() => import('@/components/DailyNews'));
const DailyEntertainment = lazy(() => import('@/components/DailyEntertainment'));
const MessagingCenter = lazy(() => import('@/components/MessagingCenter'));
const Footer = lazy(() => import('@/components/Footer'));
const NavigationMenu = lazy(() => import('@/components/NavigationMenu'));

const Index = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, isCapacitor } = useMobile();
  const { submitToGoogle } = useSEOAutomation(language);
  const { user } = useActionStore();
  const { metrics, measureAsync } = usePerformance('Index');
  const cache = useCache({ ttl: 10 * 60 * 1000 }); // 10 minutes cache

  // Memoized initialization to prevent re-runs
  const initializeApp = useCallback(async () => {
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
  }, [isCapacitor, submitToGoogle, user?.id, language, measureAsync, cache]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Memoized language change handler
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    measureAsync('language_change', async () => {
      analytics.track('language_changed', { language: newLanguage }, user?.id);
      advancedAnalytics.trackUserEngagement('language_selector', 'change');
    });
  }, [user?.id, measureAsync]);

  // Memoized performance tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const behavior = advancedAnalytics.getUserBehavior();
      const insights = advancedAnalytics.getPerformanceInsights();
      
      analytics.track('performance_snapshot', {
        ...behavior,
        ...insights,
        renderMetrics: metrics
      });
    }, 60000); // Reduced to every 60 seconds

    return () => clearInterval(interval);
  }, [metrics]);

  // Memoized mobile spacing class
  const mobileSpacing = useMemo(() => 
    isMobile ? 'mobile-spacing pb-20' : '', 
    [isMobile]
  );

  // Memoized safe area class
  const safeAreaClass = useMemo(() => 
    isCapacitor ? 'safe-area-top safe-area-bottom' : '', 
    [isCapacitor]
  );

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
    <div className={`min-h-screen bg-background ${safeAreaClass}`}>
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
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className={mobileSpacing}>
        <HeroSection language={language} />
        <CategoriesGrid language={language} />
        
        <Suspense fallback={<Loading size="md" variant="spinner" />}>
          <ContentCreation language={language} />
          
          {/* Feed des publications */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Publications de la communauté
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Découvrez le contenu partagé par nos utilisateurs
                </p>
              </div>
              <PostsFeed />
            </div>
          </section>
          
          <DailyNews language={language} />
          <DailyEntertainment language={language} />
          <SocialFeed language={language} />
          <MessagingCenter language={language} />
          <UserProfile language={language} />
          <LiveStreaming language={language} />
          <PaymentOptions language={language} />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer language={language} />
        {isMobile && <NavigationMenu />}
      </Suspense>
    </div>
  );
};

export default Index;
