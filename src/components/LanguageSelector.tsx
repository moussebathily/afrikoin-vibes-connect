
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
        className="bg-white/20 border-white/30 text-white hover:bg-white/30 min-w-[100px]"
      >
        <Globe className="w-4 h-4 mr-2" />
        {currentLanguage?.nativeName}
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 bg-background border shadow-lg z-50 min-w-[200px]">
          <div className="p-2 max-h-60 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors ${
                  language === lang.code ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-muted-foreground">{lang.name}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LanguageSelector;
