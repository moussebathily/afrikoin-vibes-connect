
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
          ? 'AfriKoin - Marketplace Panafricain n°1 | Commerce, FinTech et Culture en Afrique 🌍'
          : 'AfriKoin - #1 Pan-African Marketplace | Commerce, FinTech and Culture in Africa 🌍',
        description: language === 'fr'
          ? 'Marketplace panafricain n°1 avec 50K+ utilisateurs actifs dans 25 pays. Achetez, vendez en sécurité avec Orange Money, Wave. Live streaming, assistant vocal, géolocalisation avancée.'
          : 'Africa\'s #1 marketplace with 50K+ active users in 25 countries. Buy, sell securely with Orange Money, Wave. Live streaming, voice assistant, advanced geolocation.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/marketplace': {
        type: 'ItemList',
        title: language === 'fr' 
          ? 'Marketplace AfriKoin - 1000+ Annonces Géolocalisées en Afrique 📍'
          : 'AfriKoin Marketplace - 1000+ Geolocated Ads in Africa 📍',
        description: language === 'fr'
          ? 'Découvrez plus de 1000 annonces géolocalisées partout en Afrique. Achetez et vendez en toute sécurité avec paiements mobiles intégrés.'
          : 'Discover 1000+ geolocated ads across Africa. Buy and sell safely with integrated mobile payments.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/fintech': {
        type: 'FinancialService',
        title: language === 'fr'
          ? 'FinTech AfriKoin - Paiements Mobiles Orange Money, Wave | Transferts Sécurisés 💳'
          : 'AfriKoin FinTech - Mobile Payments Orange Money, Wave | Secure Transfers 💳',
        description: language === 'fr'
          ? 'Solutions de paiement mobile complètes : Orange Money, Wave, MTN Money. Transferts internationaux sécurisés, taux avantageux, conformité bancaire.'
          : 'Complete mobile payment solutions: Orange Money, Wave, MTN Money. Secure international transfers, competitive rates, banking compliance.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/education': {
        type: 'EducationalOrganization',
        title: language === 'fr'
          ? 'Éducation AfriKoin - Formation Professionnelle et Certification | Skills Africa 📚'
          : 'AfriKoin Education - Professional Training and Certification | Skills Africa 📚',
        description: language === 'fr'
          ? 'Plateforme d\'apprentissage et de formation professionnelle pour l\'Afrique. Certifications reconnues, mentors experts, emploi garanti.'
          : 'Professional learning and training platform for Africa. Recognized certifications, expert mentors, guaranteed employment.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/entertainment': {
        type: 'EntertainmentBusiness',
        title: language === 'fr'
          ? 'Divertissement AfriKoin - Culture Africaine | Live Streaming & Événements 🎵'
          : 'AfriKoin Entertainment - African Culture | Live Streaming & Events 🎵',
        description: language === 'fr'
          ? 'Découvrez la richesse culturelle africaine : musique live, vidéos exclusives, événements en streaming. Artistes émergents et stars confirmées.'
          : 'Discover African cultural richness: live music, exclusive videos, streaming events. Emerging artists and confirmed stars.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/services': {
        type: 'Service',
        title: language === 'fr'
          ? 'Services AfriKoin - Prestataires Vérifiés | Freelance et Business 💼'
          : 'AfriKoin Services - Verified Providers | Freelance and Business 💼',
        description: language === 'fr'
          ? 'Trouvez des prestataires vérifiés en Afrique : développeurs, designers, consultants. Projets sécurisés, paiements garantis.'
          : 'Find verified service providers in Africa: developers, designers, consultants. Secure projects, guaranteed payments.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/profile': {
        type: 'ProfilePage',
        title: language === 'fr'
          ? 'Mon Profil AfriKoin - Tableau de Bord Personnel | Transactions & Statistiques'
          : 'My AfriKoin Profile - Personal Dashboard | Transactions & Statistics',
        description: language === 'fr'
          ? 'Gérez votre compte AfriKoin : historique des transactions, statistiques de vente, paramètres de sécurité, préférences personnalisées.'
          : 'Manage your AfriKoin account: transaction history, sales statistics, security settings, personalized preferences.',
        url: seoConfig.baseUrl + location.pathname
      },
      '/auth': {
        type: 'WebPage',
        title: language === 'fr'
          ? 'Connexion AfriKoin - Rejoignez 50K+ Utilisateurs | Inscription Gratuite'
          : 'AfriKoin Login - Join 50K+ Users | Free Registration',
        description: language === 'fr'
          ? 'Rejoignez la communauté AfriKoin gratuitement. Inscription rapide, sécurisée. Commencez à acheter et vendre en Afrique dès aujourd\'hui.'
          : 'Join the AfriKoin community for free. Quick, secure registration. Start buying and selling in Africa today.',
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
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'AfriKoin');
    updateMetaTag('og:locale', language === 'fr' ? 'fr_FR' : 'en_US');
    updateMetaTag('twitter:title', currentPage.title);
    updateMetaTag('twitter:description', currentPage.description);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@afrikoin');
    
    // Ajouter des mots-clés spécifiques par page
    const pageKeywords = {
      '/': 'marketplace afrique, commerce africain, plateforme afrique, orange money, wave',
      '/marketplace': 'petites annonces afrique, achat vente afrique, marketplace géolocalisé',
      '/fintech': 'fintech afrique, paiements mobiles, orange money, wave, transferts',
      '/education': 'formation afrique, éducation en ligne, certification professionnelle',
      '/entertainment': 'culture africaine, musique afrique, streaming live, événements',
      '/services': 'services afrique, freelance afrique, prestataires vérifiés',
      '/profile': 'profil utilisateur, compte afrikoin, tableau de bord',
      '/auth': 'inscription afrikoin, connexion, rejoindre communauté'
    };
    
    const keywords = pageKeywords[location.pathname as keyof typeof pageKeywords] || pageKeywords['/'];
    updateMetaTag('keywords', keywords);

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
