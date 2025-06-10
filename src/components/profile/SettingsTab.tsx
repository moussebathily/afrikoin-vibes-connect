
import React from 'react';
import { Card } from '@/components/ui/card';
import { Language } from '@/types/language';

interface SettingsTabProps {
  language: Language;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ language }) => {
  const text = {
    fr: {
      settings: 'Paramètres'
    },
    en: {
      settings: 'Settings'
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{currentText.settings}</h3>
      <p className="text-muted-foreground">Paramètres de profil et de compte à venir...</p>
    </Card>
  );
};

export default SettingsTab;
