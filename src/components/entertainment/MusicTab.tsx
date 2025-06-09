
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Share } from 'lucide-react';
import { Language } from '@/types/language';

interface MusicTabProps {
  language: Language;
}

const MusicTab: React.FC<MusicTabProps> = ({ language }) => {
  const text = {
    fr: {
      trending: 'Tendances',
      listens: 'écoutes'
    },
    en: {
      trending: 'Trending',
      listens: 'listens'
    }
  };

  const currentText = text[language] || text.fr;

  const musicTrending = [
    {
      id: 1,
      title: 'Amapiano Vibes',
      artist: 'DJ Maphorisa',
      album: 'Scorpion Kings',
      duration: '3:45',
      cover: '/placeholder.svg',
      genre: 'Amapiano',
      country: '🇿🇦',
      listens: '2.5M',
      featured: true
    },
    {
      id: 2,
      title: 'Afrobeats Anthem',
      artist: 'Burna Boy',
      album: 'Love, Damini',
      duration: '4:12',
      cover: '/placeholder.svg',
      genre: 'Afrobeats',
      country: '🇳🇬',
      listens: '8.9M',
      featured: true
    },
    {
      id: 3,
      title: 'Coupé-Décalé Power',
      artist: 'DJ Arafat',
      album: 'Reminiscence',
      duration: '3:28',
      cover: '/placeholder.svg',
      genre: 'Coupé-Décalé',
      country: '🇨🇮',
      listens: '1.8M',
      featured: false
    },
    {
      id: 4,
      title: 'Gqom Revolution',
      artist: 'Distruction Boyz',
      album: 'Gqom Is The Future',
      duration: '4:01',
      cover: '/placeholder.svg',
      genre: 'Gqom',
      country: '🇿🇦',
      listens: '3.2M',
      featured: false
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">{currentText.trending}</h2>
        <div className="grid gap-4">
          {musicTrending.map(track => (
            <Card key={track.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <Button
                    size="icon"
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white/90 text-primary hover:bg-white"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-muted-foreground">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{track.genre}</Badge>
                        <span className="text-sm">{track.country}</span>
                        {track.featured && (
                          <Badge className="bg-secondary">Featured</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{track.duration}</p>
                      <p className="text-sm font-medium">{track.listens} {currentText.listens}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicTab;
