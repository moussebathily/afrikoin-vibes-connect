
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Language } from '@/types/language';

interface FavoritesTabProps {
  language: Language;
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ language }) => {
  const favoriteItems = [
    {
      id: 1,
      title: 'Villa moderne 4 chambres',
      price: '45,000,000 FCFA',
      image: '/placeholder.svg',
      location: 'Cocody, Abidjan'
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      price: '1,200,000 FCFA',
      image: '/placeholder.svg',
      location: 'Dakar, Sénégal'
    },
    {
      id: 3,
      title: 'Robe traditionnelle Kente',
      price: '75,000 FCFA',
      image: '/placeholder.svg',
      location: 'Accra, Ghana'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteItems.map(item => (
        <Card key={item.id} className="overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-lg font-bold text-primary mb-2">{item.price}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {item.location}
            </div>
            <Button className="w-full mt-4">Voir détails</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FavoritesTab;
