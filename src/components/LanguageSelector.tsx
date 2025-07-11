
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Globe } from 'lucide-react';
import { Language, languages } from '@/types/language';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 border-white/30 text-white hover:bg-white/30 min-w-[120px]"
      >
        <span className="mr-2">{currentLanguage?.flag}</span>
        {currentLanguage?.nativeName}
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 bg-background border shadow-lg z-50 min-w-[280px] max-w-[400px]">
          <div className="p-2 max-h-80 overflow-y-auto">
            {/* Langues internationales */}
            <div className="mb-3">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">
                Langues Internationales
              </div>
              {languages.filter(lang => !lang.region).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                    language === lang.code ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Langues par région */}
            {['Afrique de l\'Ouest', 'Afrique Centrale', 'Afrique de l\'Est', 'Afrique Australe', 'Cameroun & Bassin du Congo'].map(region => {
              const regionLanguages = languages.filter(lang => lang.region === region);
              if (regionLanguages.length === 0) return null;
              
              return (
                <div key={region} className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">
                    {region}
                  </div>
                  {regionLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        language === lang.code ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-muted-foreground">{lang.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LanguageSelector;
