
import React from 'react';
import { Language } from '@/types/language';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  language: Language;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  language
}) => {
  const defaultMeta = {
    fr: {
      title: 'AfriKoin - Marketplace Panafricain n°1 | Commerce, FinTech et Culture en Afrique 🌍',
      description: 'Marketplace panafricain n°1 avec 50K+ utilisateurs actifs dans 25 pays africains. Achetez, vendez en sécurité avec Orange Money, Wave. Live streaming, assistant vocal, géolocalisation avancée.',
      keywords: 'AfriKoin, marketplace Afrique, petites annonces Afrique, commerce africain, Orange Money, Wave, fintech Afrique, culture africaine, streaming live Afrique, assistant vocal, géolocalisation, paiements mobiles Afrique, transferts internationaux, certification professionnelle'
    },
    en: {
      title: 'AfriKoin - #1 Pan-African Marketplace | Commerce, FinTech and Culture in Africa 🌍',
      description: 'Africa\'s #1 marketplace with 50K+ active users in 25 African countries. Buy, sell securely with Orange Money, Wave. Live streaming, voice assistant, advanced geolocation.',
      keywords: 'AfriKoin, Africa marketplace, classified ads Africa, African commerce, Orange Money, Wave, fintech Africa, African culture, live streaming Africa, voice assistant, geolocation, mobile payments Africa, international transfers, professional certification'
    }
  };

  const meta = defaultMeta[language] || defaultMeta.fr;
  const pageTitle = title || meta.title;
  const pageDescription = description || meta.description;
  const pageKeywords = keywords || meta.keywords;

  React.useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = pageTitle;
    
    // Mettre à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', pageKeywords);
    }

    // Mettre à jour les Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', pageDescription);
    }

    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', url);
      }
    }

    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', image);
      }
    }
  }, [pageTitle, pageDescription, pageKeywords, url, image]);

  return null; // Ce composant ne rend rien visuellement
};

export default SEOHead;
