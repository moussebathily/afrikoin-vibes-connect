
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TikTokLikeButton } from '@/components/ui/tiktok-like-button';
import { Play, Music, Film, Mic, Star, Heart } from 'lucide-react';
import { Language } from '@/types/language';

interface DailyEntertainmentProps {
  language: Language;
}

const DailyEntertainment: React.FC<DailyEntertainmentProps> = ({ language }) => {
  const [likedContent, setLikedContent] = useState<number[]>([]);
  const text = {
    fr: {
      title: 'Divertissement quotidien',
      subtitle: 'Découvrez le meilleur de la culture et du divertissement africain',
      music: 'Musique',
      movies: 'Cinéma',
      shows: 'Émissions',
      artists: 'Artistes',
      watchNow: 'Regarder',
      listenNow: 'Écouter',
      trending: 'Tendance',
      newRelease: 'Nouvelle sortie'
    },
    en: {
      title: 'Daily Entertainment',
      subtitle: 'Discover the best of African culture and entertainment',
      music: 'Music',
      movies: 'Movies',
      shows: 'Shows',
      artists: 'Artists',
      watchNow: 'Watch Now',
      listenNow: 'Listen Now',
      trending: 'Trending',
      newRelease: 'New Release'
    },
    bm: {
      title: 'Don ka nyɛnajɛ',
      subtitle: 'Afrika laada ni nyɛnajɛ ɲuman sɔrɔ',
      music: 'Donkili',
      movies: 'Filimuw',
      shows: 'Jiraliw',
      artists: 'Dɔnkililaw',
      watchNow: 'Filɛ sisan',
      listenNow: 'Lamɛn sisan',
      trending: 'Ka ɲɛ',
      newRelease: 'Kura bɔli'
    },
    ar: {
      title: 'الترفيه اليومي',
      subtitle: 'اكتشف أفضل ما في الثقافة والترفيه الأفريقي',
      music: 'موسيقى',
      movies: 'أفلام',
      shows: 'برامج',
      artists: 'فنانون',
      watchNow: 'شاهد الآن',
      listenNow: 'استمع الآن',
      trending: 'رائج',
      newRelease: 'إصدار جديد'
    },
    ti: {
      title: 'ናይ መዓልቲ ዘዝናን',
      subtitle: 'ናይ ኣፍሪቃ ባህሊን ዘዝናንን ምረጽ ኣርኽብ',
      music: 'ሙዚቃ',
      movies: 'ፊልሚታት',
      shows: 'መደባት',
      artists: 'ኣርቲስታት',
      watchNow: 'ሕጂ ተዓዘብ',
      listenNow: 'ሕጂ ስማዕ',
      trending: 'ግሉጽ',
      newRelease: 'ሓድሽ ፍርቂ'
    },
    pt: {
      title: 'Entretenimento diário',
      subtitle: 'Descubra o melhor da cultura e entretenimento africano',
      music: 'Música',
      movies: 'Filmes',
      shows: 'Programas',
      artists: 'Artistas',
      watchNow: 'Assistir Agora',
      listenNow: 'Ouvir Agora',
      trending: 'Em Alta',
      newRelease: 'Novo Lançamento'
    },
    es: {
      title: 'Entretenimiento diario',
      subtitle: 'Descubre lo mejor de la cultura y entretenimiento africano',
      music: 'Música',
      movies: 'Películas',
      shows: 'Programas',
      artists: 'Artistas',
      watchNow: 'Ver Ahora',
      listenNow: 'Escuchar Ahora',
      trending: 'Tendencia',
      newRelease: 'Nuevo Lanzamiento'
    },
    zh: {
      title: '每日娱乐',
      subtitle: '探索非洲文化和娱乐的精华',
      music: '音乐',
      movies: '电影',
      shows: '节目',
      artists: '艺术家',
      watchNow: '立即观看',
      listenNow: '立即收听',
      trending: '热门',
      newRelease: '新发布'
    },
    ru: {
      title: 'Ежедневные развлечения',
      subtitle: 'Откройте для себя лучшее в африканской культуре и развлечениях',
      music: 'Музыка',
      movies: 'Фильмы',
      shows: 'Шоу',
      artists: 'Артисты',
      watchNow: 'Смотреть сейчас',
      listenNow: 'Слушать сейчас',
      trending: 'В тренде',
      newRelease: 'Новый релиз'
    },
    hi: {
      title: 'दैनिक मनोरंजन',
      subtitle: 'अफ्रीकी संस्कृति और मनोरंजन के सर्वोत्तम की खोज करें',
      music: 'संगीत',
      movies: 'फिल्में',
      shows: 'शो',
      artists: 'कलाकार',
      watchNow: 'अभी देखें',
      listenNow: 'अभी सुनें',
      trending: 'ट्रेंडिंग',
      newRelease: 'नई रिलीज़'
    }
  };

  const currentText = text[language] || text.fr;

  const entertainmentContent = [
    {
      id: 1,
      type: 'music',
      title: 'Amapiano Fusion',
      artist: 'DJ Kenzo',
      description: 'Nouveau mix afrobeat qui fait sensation',
      duration: '45min',
      likes: 12000,
      trending: true,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      type: 'movie',
      title: 'Lagos Dreams',
      artist: 'Nollywood Productions',
      description: 'Drame familial touchant sur l\'immigration',
      duration: '2h 15min',
      likes: 8500,
      trending: false,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      type: 'show',
      title: 'African Voices',
      artist: 'Continental TV',
      description: 'Talk-show avec des personnalités influentes',
      duration: '1h',
      likes: 15000,
      trending: true,
      image: '/placeholder.svg'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="w-5 h-5" />;
      case 'movie': return <Film className="w-5 h-5" />;
      case 'show': return <Mic className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getActionText = (type: string) => {
    return type === 'music' ? currentText.listenNow : currentText.watchNow;
  };

  const toggleLike = (contentId: number) => {
    setLikedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Play className="w-8 h-8 text-secondary" />
            <h2 className="text-3xl font-bold">{currentText.title}</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center space-x-6 mb-12">
          <Button variant="outline" className="flex items-center space-x-2">
            <Music className="w-4 h-4" />
            <span>{currentText.music}</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Film className="w-4 h-4" />
            <span>{currentText.movies}</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>{currentText.shows}</span>
          </Button>
        </div>

        {/* Featured Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entertainmentContent.map((content, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    {getIcon(content.type)}
                  </div>
                </div>
                {content.trending && (
                  <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{currentText.trending}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {content.duration}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{content.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{content.artist}</p>
                <p className="text-sm mb-4 line-clamp-2">{content.description}</p>
                
                <div className="flex items-center justify-between">
                  <TikTokLikeButton
                    isLiked={likedContent.includes(content.id)}
                    likesCount={content.likes + (likedContent.includes(content.id) ? 1 : 0)}
                    onLike={() => toggleLike(content.id)}
                  />
                  <Button size="sm" className="bg-afrikoin-gradient hover:opacity-90">
                    <Play className="w-4 h-4 mr-2" />
                    {getActionText(content.type)}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Highlights */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Highlights de la semaine</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Playlist Afrobeats</h4>
                  <p className="text-muted-foreground text-sm">Les hits du moment</p>
                  <Button variant="link" className="p-0 h-auto font-medium">
                    Écouter maintenant →
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Festival du Film</h4>
                  <p className="text-muted-foreground text-sm">Concours international</p>
                  <Button variant="link" className="p-0 h-auto font-medium">
                    Participer →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyEntertainment;
