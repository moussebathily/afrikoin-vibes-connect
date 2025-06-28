
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
      title: 'AfriKoin - Marketplace Panafricain | Commerce et Culture en Afrique',
      description: 'Marketplace panafricain n°1 pour acheter, vendre et se connecter. 50K+ utilisateurs, 25 pays, paiements locaux (Orange Money, Wave), live streaming.',
      keywords: 'AfriKoin, marketplace Afrique, petites annonces, commerce africain, Orange Money, Wave, streaming live'
    },
    en: {
      title: 'AfriKoin - Pan-African Marketplace | Commerce and Culture in Africa',
      description: 'Africa\'s #1 marketplace to buy, sell and connect. 50K+ users, 25 countries, local payments (Orange Money, Wave), live streaming.',
      keywords: 'AfriKoin, Africa marketplace, classified ads, African commerce, Orange Money, Wave, live streaming'
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
