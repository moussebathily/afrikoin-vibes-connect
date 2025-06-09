import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Video, 
  Radio, 
  Gamepad2, 
  Calendar, 
  Users,
  Play,
  Heart,
  Share,
  Volume2,
  Mic,
  Trophy,
  Star,
  Clock
} from 'lucide-react';
import { Language } from '@/types/language';

interface EntertainmentProps {
  language: Language;
}

const Entertainment: React.FC<EntertainmentProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('music');

  const text = {
    fr: {
      title: 'Divertissement AfriKoin',
      subtitle: 'Vibrez au rythme de l\'Afrique',
      music: 'Musique',
      videos: 'Vidéos',
      radio: 'Radio',
      games: 'Jeux',
      events: 'Événements',
      trending: 'Tendances',
      newReleases: 'Nouveautés',
      topCharts: 'Top Charts',
      african: 'Africain',
      international: 'International',
      live: 'En direct',
      play: 'Lire',
      pause: 'Pause',
      addToPlaylist: 'Ajouter à la playlist',
      share: 'Partager',
      like: 'J\'aime',
      views: 'vues',
      listens: 'écoutes'
    },
    en: {
      title: 'AfriKoin Entertainment',
      subtitle: 'Feel the rhythm of Africa',
      music: 'Music',
      videos: 'Videos',
      radio: 'Radio',
      games: 'Games',
      events: 'Events',
      trending: 'Trending',
      newReleases: 'New Releases',
      topCharts: 'Top Charts',
      african: 'African',
      international: 'International',
      live: 'Live',
      play: 'Play',
      pause: 'Pause',
      addToPlaylist: 'Add to playlist',
      share: 'Share',
      like: 'Like',
      views: 'views',
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-accent to-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{currentText.title}</h1>
          <p className="text-xl opacity-90">{currentText.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="music">{currentText.music}</TabsTrigger>
            <TabsTrigger value="videos">{currentText.videos}</TabsTrigger>
            <TabsTrigger value="radio">{currentText.radio}</TabsTrigger>
            <TabsTrigger value="games">{currentText.games}</TabsTrigger>
            <TabsTrigger value="events">{currentText.events}</TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="mt-6">
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
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
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
          </TabsContent>

          <TabsContent value="radio" className="mt-6">
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
          </TabsContent>

          <TabsContent value="games" className="mt-6">
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
          </TabsContent>

          <TabsContent value="events" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Entertainment;
