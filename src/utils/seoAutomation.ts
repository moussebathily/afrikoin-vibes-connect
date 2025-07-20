
export interface SEOConfig {
  baseUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
}

export const seoConfig: SEOConfig = {
  baseUrl: 'https://afrikoin.online',
  siteName: 'AfriKoin',
  defaultTitle: 'AfriKoin - Marketplace Panafricain | Commerce, Culture et FinTech en Afrique',
  defaultDescription: 'Marketplace panafricain n°1 pour acheter, vendre et se connecter. 50K+ utilisateurs actifs, 25 pays africains, paiements mobiles sécurisés (Orange Money, Wave), live streaming et assistant vocal intelligent.',
  googleAnalyticsId: 'G-AFRIKOIN2024',
  googleSearchConsoleId: 'afrikoin-search-console'
};

export const generateSitemap = () => {
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily', keywords: 'marketplace afrique, commerce africain, plateforme afrique' },
    { url: '/marketplace', priority: '0.9', changefreq: 'daily', keywords: 'petites annonces afrique, achat vente afrique, marketplace' },
    { url: '/fintech', priority: '0.8', changefreq: 'weekly', keywords: 'fintech afrique, orange money, wave, paiements mobiles' },
    { url: '/education', priority: '0.8', changefreq: 'weekly', keywords: 'formation afrique, éducation en ligne, apprentissage' },
    { url: '/entertainment', priority: '0.8', changefreq: 'weekly', keywords: 'culture africaine, musique afrique, streaming live' },
    { url: '/services', priority: '0.7', changefreq: 'weekly', keywords: 'services afrique, prestataires afrique' },
    { url: '/profile', priority: '0.6', changefreq: 'monthly', keywords: 'profil utilisateur, compte afrikoin' },
    { url: '/auth', priority: '0.5', changefreq: 'monthly', keywords: 'inscription afrikoin, connexion' },
    { url: '/privacy-policy.html', priority: '0.4', changefreq: 'monthly', keywords: 'politique confidentialité afrikoin' },
    { url: '/terms-of-service.html', priority: '0.4', changefreq: 'monthly', keywords: 'conditions utilisation afrikoin' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => `  <url>
    <loc>${seoConfig.baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const initializeGoogleServices = () => {
  // Google Analytics
  if (seoConfig.googleAnalyticsId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoConfig.googleAnalyticsId}`;
    document.head.appendChild(gaScript);

    const gaConfig = document.createElement('script');
    gaConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${seoConfig.googleAnalyticsId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(gaConfig);
  }

  // Google Search Console verification
  if (seoConfig.googleSearchConsoleId) {
    const searchConsoleTag = document.createElement('meta');
    searchConsoleTag.name = 'google-site-verification';
    searchConsoleTag.content = seoConfig.googleSearchConsoleId;
    document.head.appendChild(searchConsoleTag);
  }
};

export const updateStructuredData = (pageData: {
  type: string;
  title: string;
  description: string;
  url: string;
}) => {
  const currentDate = new Date().toISOString();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": pageData.type,
    "name": pageData.title,
    "description": pageData.description,
    "url": pageData.url,
    "dateModified": currentDate,
    "datePublished": "2024-01-01T00:00:00Z",
    "inLanguage": ["fr", "en"],
    "keywords": "marketplace afrique, commerce africain, fintech afrique, culture africaine, paiements mobiles",
    "author": {
      "@type": "Organization",
      "name": "AfriKoin",
      "url": "https://afrikoin.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AfriKoin",
      "url": "https://afrikoin.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://afrikoin.com/logo-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "mainEntity": {
      "@type": "WebApplication",
      "name": "AfriKoin",
      "applicationCategory": "Marketplace",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${seoConfig.baseUrl}/marketplace?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "BuyAction",
        "target": `${seoConfig.baseUrl}/marketplace`
      },
      {
        "@type": "SellAction", 
        "target": `${seoConfig.baseUrl}/marketplace`
      }
    ],
    "sameAs": [
      "https://twitter.com/afrikoin",
      "https://facebook.com/afrikoin", 
      "https://instagram.com/afrikoin",
      "https://linkedin.com/company/afrikoin",
      "https://youtube.com/@afrikoin"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+221-XX-XXX-XXXX",
      "contactType": "customer service",
      "availableLanguage": ["French", "English"],
      "areaServed": {
        "@type": "Place",
        "name": "Africa"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "12500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Amadou K."
        },
        "reviewBody": "Excellente plateforme pour le commerce en Afrique. Interface intuitive et paiements sécurisés."
      }
    ]
  };

  // Supprimer l'ancien script structured data s'il existe
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Ajouter le nouveau script structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
