
import React from 'react';
import { MapPin, Shield, CreditCard } from 'lucide-react';

interface FooterProps {
  language: 'fr' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const text = {
    fr: {
      description: 'AfriKoin connecte l\'Afrique par le commerce et la culture. Achetez, vendez et échangez en toute sécurité.',
      about: 'À propos',
      services: 'Services',
      support: 'Support',
      legal: 'Légal',
      aboutLinks: ['Notre mission', 'Équipe', 'Carrières', 'Presse'],
      servicesLinks: ['Petites annonces', 'Live streaming', 'Assistant vocal', 'Paiements'],
      supportLinks: ['Centre d\'aide', 'Contact', 'Communauté', 'Blog'],
      legalLinks: ['Conditions', 'Confidentialité', 'Sécurité', 'Signalement'],
      rights: 'Tous droits réservés',
      madeWith: 'Fait avec ❤️ pour l\'Afrique'
    },
    en: {
      description: 'AfriKoin connects Africa through commerce and culture. Buy, sell and trade securely.',
      about: 'About',
      services: 'Services',
      support: 'Support',
      legal: 'Legal',
      aboutLinks: ['Our mission', 'Team', 'Careers', 'Press'],
      servicesLinks: ['Classifieds', 'Live streaming', 'Voice assistant', 'Payments'],
      supportLinks: ['Help center', 'Contact', 'Community', 'Blog'],
      legalLinks: ['Terms', 'Privacy', 'Security', 'Report'],
      rights: 'All rights reserved',
      madeWith: 'Made with ❤️ for Africa'
    }
  };

  const footerSections = [
    { title: text[language].about, links: text[language].aboutLinks },
    { title: text[language].services, links: text[language].servicesLinks },
    { title: text[language].support, links: text[language].supportLinks },
    { title: text[language].legal, links: text[language].legalLinks }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Section principale */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-afrikoin-gradient rounded-full"></div>
              <span className="text-2xl font-bold">AfriKoin</span>
            </div>
            <p className="text-muted-foreground mb-6">
              {text[language].description}
            </p>
            
            {/* Indicateurs de confiance */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>25+ pays</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Paiements locaux</span>
              </div>
            </div>
          </div>

          {/* Liens */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section du bas */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 AfriKoin. {text[language].rights}
            </div>
            <div className="text-sm text-muted-foreground">
              {text[language].madeWith}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
