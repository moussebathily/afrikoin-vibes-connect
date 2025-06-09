
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radio, Users, Volume2 } from 'lucide-react';
import { Language } from '@/types/language';

interface RadioTabProps {
  language: Language;
}

const RadioTab: React.FC<RadioTabProps> = ({ language }) => {
  const text = {
    fr: {
      live: 'En direct'
    },
    en: {
      live: 'Live'
    }
  };

  const currentText = text[language] || text.fr;

  const radioStations = [
    {
      id: 1,
      name: 'AfriKoin FM',
      description: 'Le meilleur de la musique africaine 24h/24',
      genre: 'Varié',
      listeners: '45K',
      country: '🌍',
      live: true
    },
    {
      id: 2,
      name: 'Amapiano Central',
      description: 'Non-stop Amapiano from South Africa',
      genre: 'Amapiano',
      listeners: '28K',
      country: '🇿🇦',
      live: true
    },
    {
      id: 3,
      name: 'Afrobeats Nation',
      description: 'The biggest Afrobeats hits',
      genre: 'Afrobeats',
      listeners: '67K',
      country: '🇳🇬',
      live: true
    },
    {
      id: 4,
      name: 'Soukous Legends',
      description: 'Classic and modern Soukous',
      genre: 'Soukous',
      listeners: '19K',
      country: '🇨🇩',
      live: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {radioStations.map(station => (
        <Card key={station.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <p className="text-sm text-muted-foreground">{station.description}</p>
              </div>
            </div>
            {station.live && (
              <Badge className="bg-red-500 animate-pulse">
                {currentText.live}
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>{station.country}</span>
                <Badge variant="outline">{station.genre}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{station.listeners} auditeurs</span>
              </div>
            </div>
            
            <Button className="w-full">
              <Volume2 className="w-4 h-4 mr-2" />
              Écouter en direct
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RadioTab;
