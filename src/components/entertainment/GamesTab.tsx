
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Users, Star } from 'lucide-react';

const GamesTab: React.FC = () => {
  const games = [
    {
      id: 1,
      title: 'Ayo (Oware) - Jeu de Stratégie Traditionnel',
      description: 'Le jeu de société africain ancestral en version numérique',
      players: '2.5K en ligne',
      rating: 4.8,
      category: 'Stratégie',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Afro Quiz Challenge',
      description: 'Testez vos connaissances sur la culture africaine',
      players: '8.9K en ligne',
      rating: 4.6,
      category: 'Quiz',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Mbube Safari Adventure',
      description: 'Explorez la faune africaine dans cette aventure immersive',
      players: '1.2K en ligne',
      rating: 4.9,
      category: 'Aventure',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Kente Pattern Puzzle',
      description: 'Créez de magnifiques motifs Kente traditionnels',
      players: '3.7K en ligne',
      rating: 4.4,
      category: 'Puzzle',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map(game => (
        <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-48 object-cover"
          />
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{game.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline">{game.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{game.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{game.players}</span>
              </div>
              
              <Button className="w-full">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Jouer maintenant
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GamesTab;
