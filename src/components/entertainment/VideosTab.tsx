
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { Language } from '@/types/language';

interface VideosTabProps {
  language: Language;
}

const VideosTab: React.FC<VideosTabProps> = ({ language }) => {
  const text = {
    fr: {
      live: 'En direct',
      views: 'vues'
    },
    en: {
      live: 'Live',
      views: 'views'
    }
  };

  const currentText = text[language] || text.fr;

  const videos = [
    {
      id: 1,
      title: 'Documentaire : Histoire du Jazz Africain',
      creator: 'Africa Culture TV',
      thumbnail: '/placeholder.svg',
      duration: '42:15',
      views: '850K',
      category: 'Documentaire',
      live: false
    },
    {
      id: 2,
      title: 'Concert Live - Angelique Kidjo à Cotonou',
      creator: 'Live Africa Music',
      thumbnail: '/placeholder.svg',
      duration: 'Live',
      views: '125K',
      category: 'Concert',
      live: true
    },
    {
      id: 3,
      title: 'Danse Traditionnelle Malienne',
      creator: 'Mali Heritage',
      thumbnail: '/placeholder.svg',
      duration: '8:30',
      views: '420K',
      category: 'Culture',
      live: false
    },
    {
      id: 4,
      title: 'Making of : Album Afrobeats Sensation',
      creator: 'Studio Sessions Africa',
      thumbnail: '/placeholder.svg',
      duration: '15:22',
      views: '1.2M',
      category: 'Making Of',
      live: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
              {video.duration}
            </div>
            {video.live && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                {currentText.live}
              </Badge>
            )}
            <Button
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 text-primary hover:bg-white w-12 h-12"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{video.creator}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{video.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {video.views} {currentText.views}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VideosTab;
