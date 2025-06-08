
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, MapPin } from 'lucide-react';
import { Language } from '@/types/language';

interface LiveStreamingProps {
  language: Language;
}

const LiveStreaming: React.FC<LiveStreamingProps> = ({ language }) => {
  const [activeStream, setActiveStream] = useState(0);

  const text = {
    fr: {
      title: 'Lives en direct',
      subtitle: 'Découvrez les vendeurs en temps réel',
      joinLive: 'Rejoindre le live',
      viewers: 'spectateurs',
      live: 'EN DIRECT',
      streams: [
        {
          title: 'Vente de bijoux traditionnels',
          seller: 'Amina Boutique',
          location: 'Dakar, Sénégal',
          viewers: 234,
          category: 'Mode & Beauté'
        },
        {
          title: 'Marché aux légumes frais',
          seller: 'Ferme Bio Kano',
          location: 'Kano, Nigeria',
          viewers: 156,
          category: 'Alimentation'
        },
        {
          title: 'Artisanat en bois sculpté',
          seller: 'Atelier Mbawa',
          location: 'Bamako, Mali',
          viewers: 89,
          category: 'Art & Culture'
        }
      ]
    },
    en: {
      title: 'Live streams',
      subtitle: 'Discover sellers in real-time',
      joinLive: 'Join live',
      viewers: 'viewers',
      live: 'LIVE',
      streams: [
        {
          title: 'Traditional jewelry sale',
          seller: 'Amina Boutique',
          location: 'Dakar, Senegal',
          viewers: 234,
          category: 'Fashion & Beauty'
        },
        {
          title: 'Fresh vegetable market',
          seller: 'Kano Organic Farm',
          location: 'Kano, Nigeria',
          viewers: 156,
          category: 'Food'
        },
        {
          title: 'Carved wood crafts',
          seller: 'Mbawa Workshop',
          location: 'Bamako, Mali',
          viewers: 89,
          category: 'Art & Culture'
        }
      ]
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {currentText.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Streams en direct */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentText.streams.map((stream, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer">
              {/* Vidéo placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-16 h-16 text-primary/60" />
                </div>
                
                {/* Badge LIVE */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                  {currentText.live}
                </div>
                
                {/* Nombre de spectateurs */}
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {stream.viewers} {currentText.viewers}
                </div>

                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="bg-white text-black hover:bg-white/90">
                    {currentText.joinLive}
                  </Button>
                </div>
              </div>

              {/* Informations du stream */}
              <div className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {stream.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{stream.seller}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {stream.location}
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {stream.category}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bouton pour démarrer un live */}
        <div className="text-center">
          <Card className="inline-flex items-center p-6 bg-afrikoin-gradient text-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Video className="w-6 h-6" />
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {language === 'fr' ? 'Démarrez votre live' : 'Start your live stream'}
                </h3>
                <p className="text-sm text-white/80">
                  {language === 'fr' 
                    ? 'Présentez vos produits en temps réel' 
                    : 'Showcase your products in real-time'
                  }
                </p>
              </div>
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                {language === 'fr' ? 'Commencer' : 'Start'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveStreaming;
