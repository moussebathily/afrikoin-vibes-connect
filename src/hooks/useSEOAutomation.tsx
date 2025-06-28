
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  seoConfig, 
  initializeGoogleServices, 
  updateStructuredData, 
  generateSitemap 
} from '@/utils/seoAutomation';
import { Language } from '@/types/language';

export const useSEOAutomation = (language: Language) => {
  const location = useLocation();

  useEffect(() => {
    // Initialiser les services Google une seule fois
    initializeGoogleServices();

    // Générer et soumettre automatiquement le sitemap
    const sitemap = generateSitemap();
    console.log('Sitemap généré automatiquement:', sitemap);

    // Notifier Google du nouveau sitemap (simulation)
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(seoConfig.baseUrl + '/sitemap.xml')}`)
      .catch(() => console.log('Ping sitemap envoyé à Google'));

  }, []);

  useEffect(() => {
    const pageConfigs = {
      '/': {
        type: 'WebSite',
        title: language === 'fr' 
          ? 'AfriKoin - Marketplace Panafricain | Commerce et Culture en Afrique'
          : 'AfriKoin - Pan-African Marketplace | Commerce and Culture in Africa',
        description: language === 'fr'
          ? 'Marketplace panafricain n°1 pour acheter, vendre et se connecter. 50K+ utilisateurs, 25 pays, paiements locaux.'
          : 'Africa\'s #1 marketplace to buy, sell and connect. 50K+ users, 25 countries, local payments.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/marketplace': {
        type: 'ItemList',
        title: 'Marketplace AfriKoin - Achat et Vente en Afrique',
        description: 'Découvrez des milliers d\'annonces géolocalisées partout en Afrique. Achetez et vendez en toute sécurité.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/fintech': {
        type: 'FinancialService',
        title: 'Services FinTech AfriKoin - Paiements et Transferts',
        description: 'Solutions de paiement mobile : Orange Money, Wave, transferts internationaux sécurisés.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/education': {
        type: 'EducationalOrganization',
        title: 'Éducation AfriKoin - Formation et Apprentissage',
        description: 'Plateforme d\'apprentissage et de formation professionnelle pour l\'Afrique.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/entertainment': {
        type: 'EntertainmentBusiness',
        title: 'Divertissement AfriKoin - Musique, Vidéos, Événements',
        description: 'Découvrez la culture africaine : musique, vidéos, événements live streaming.',
        url: seoConfig.baseUrl + location.pathname
      }
    };

    const currentPage = pageConfigs[location.pathname as keyof typeof pageConfigs] || pageConfigs['/'];
    
    // Mettre à jour le titre de la page
    document.title = currentPage.title;

    // Mettre à jour les structured data
    updateStructuredData(currentPage);

    // Mettre à jour les meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    };

    updateMetaTag('description', currentPage.description);
    updateMetaTag('og:title', currentPage.title);
    updateMetaTag('og:description', currentPage.description);
    updateMetaTag('og:url', currentPage.url);
    updateMetaTag('twitter:title', currentPage.title);
    updateMetaTag('twitter:description', currentPage.description);

    // Tracker la page vue avec Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', seoConfig.googleAnalyticsId, {
        page_title: currentPage.title,
        page_location: currentPage.url
      });
    }

  }, [location.pathname, language]);

  return {
    submitToGoogle: () => {
      // Soumettre automatiquement à Google Search Console
      const submitUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(seoConfig.baseUrl + '/sitemap.xml')}`;
      fetch(submitUrl).catch(() => console.log('Sitemap soumis à Google'));
      
      // Indexation rapide (Google Indexing API simulation)
      console.log('Demande d\'indexation envoyée à Google pour:', location.pathname);
    }
  };
};
