import React from 'react';
import { Language } from '@/types/language';

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  language: Language;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://afrikoin.com/og-image.png',
  canonicalUrl,
  language,
  articleData
}) => {
  React.useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    updateOrCreateMeta('name', 'description', description);
    
    // Keywords
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords);
    }

    // Canonical URL
    if (canonicalUrl) {
      updateOrCreateLink('canonical', canonicalUrl);
    }

    // Language
    document.documentElement.lang = language;
    updateOrCreateMeta('name', 'language', language === 'fr' ? 'French' : 'English');

    // Open Graph
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:image', ogImage);
    updateOrCreateMeta('property', 'og:locale', language === 'fr' ? 'fr_FR' : 'en_US');
    
    if (canonicalUrl) {
      updateOrCreateMeta('property', 'og:url', canonicalUrl);
    }

    // Article data (if provided)
    if (articleData) {
      updateOrCreateMeta('property', 'og:type', 'article');
      
      if (articleData.publishedTime) {
        updateOrCreateMeta('property', 'article:published_time', articleData.publishedTime);
      }
      
      if (articleData.modifiedTime) {
        updateOrCreateMeta('property', 'article:modified_time', articleData.modifiedTime);
      }
      
      if (articleData.author) {
        updateOrCreateMeta('property', 'article:author', articleData.author);
      }
      
      if (articleData.section) {
        updateOrCreateMeta('property', 'article:section', articleData.section);
      }
      
      if (articleData.tags) {
        articleData.tags.forEach(tag => {
          const metaTag = document.createElement('meta');
          metaTag.setAttribute('property', 'article:tag');
          metaTag.setAttribute('content', tag);
          document.head.appendChild(metaTag);
        });
      }
    }

    // Twitter Card
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', ogImage);
    updateOrCreateMeta('name', 'twitter:site', '@afrikoin');

    // Additional SEO meta tags
    updateOrCreateMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateOrCreateMeta('name', 'googlebot', 'index, follow');
    updateOrCreateMeta('name', 'bingbot', 'index, follow');
    
    // Mobile optimization
    updateOrCreateMeta('name', 'mobile-web-app-capable', 'yes');
    updateOrCreateMeta('name', 'apple-mobile-web-app-capable', 'yes');
    updateOrCreateMeta('name', 'apple-mobile-web-app-status-bar-style', 'default');

  }, [title, description, keywords, ogImage, canonicalUrl, language, articleData]);

  return null;
};

const updateOrCreateMeta = (attribute: string, name: string, content: string) => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateOrCreateLink = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

export default SEOHelmet;