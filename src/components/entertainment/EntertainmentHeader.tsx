
import React from 'react';
import { Language } from '@/types/language';

interface EntertainmentHeaderProps {
  language: Language;
}

const EntertainmentHeader: React.FC<EntertainmentHeaderProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Divertissement AfriKoin',
      subtitle: 'Vibrez au rythme de l\'Afrique'
    },
    en: {
      title: 'AfriKoin Entertainment',
      subtitle: 'Feel the rhythm of Africa'
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <div className="bg-gradient-to-r from-secondary via-accent to-primary text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{currentText.title}</h1>
        <p className="text-xl opacity-90">{currentText.subtitle}</p>
      </div>
    </div>
  );
};

export default EntertainmentHeader;
