
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

const EventsTab: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Festival Panafricain de Musique Virtuel',
      date: '25-27 Décembre 2024',
      time: '20h00 GMT',
      type: 'Concert',
      attendees: '50K+',
      featured: true,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Concours de Talents AfriKoin',
      date: '15 Janvier 2025',
      time: '18h00 GMT',
      type: 'Competition',
      attendees: '15K+',
      featured: false,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Soirée Contes Africains Interactifs',
      date: '8 Janvier 2025',
      time: '19h30 GMT',
      type: 'Culturel',
      attendees: '5K+',
      featured: false,
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            {event.featured && (
              <Badge className="absolute top-2 left-2 bg-secondary">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{event.type}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} participants</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full">
              Participer
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventsTab;
