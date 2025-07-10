import React, { useState, useEffect } from 'react';
import { Heart, Download, Play, Star, Crown, Gift, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMonetizationStore } from '@/store/monetizationStore';
import { Creator, CreatorContent } from '@/types/monetization';
import { Language } from '@/types/language';

interface CreatorEconomyProps {
  language: Language;
}

const CreatorEconomy: React.FC<CreatorEconomyProps> = ({ language }) => {
  const { creators, creatorContent, setCreators, setCreatorContent } = useMonetizationStore();
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const text = {
    fr: {
      title: 'Économie des Créateurs',
      subtitle: 'Découvrez et soutenez les créateurs africains',
      topCreators: 'Top Créateurs',
      allContent: 'Tout le contenu',
      followers: 'abonnés',
      earnings: 'gains',
      content: 'contenus',
      verified: 'Vérifié',
      premium: 'Premium',
      free: 'Gratuit',
      download: 'Télécharger',
      preview: 'Aperçu',
      tip: 'Pourboire',
      follow: 'Suivre',
      support: 'Soutenir'
    },
    en: {
      title: 'Creator Economy',
      subtitle: 'Discover and support African creators',
      topCreators: 'Top Creators',
      allContent: 'All Content',
      followers: 'followers',
      earnings: 'earnings',
      content: 'content',
      verified: 'Verified',
      premium: 'Premium',
      free: 'Free',
      download: 'Download',
      preview: 'Preview',
      tip: 'Tip',
      follow: 'Follow',
      support: 'Support'
    }
  };

  const currentText = text[language] || text.fr;

  // Mock data
  const mockCreators: Creator[] = [
    {
      id: '1',
      name: 'Amina Kone',
      avatar: '/api/placeholder/100/100',
      bio: 'Artiste digitale spécialisée dans l\'art africain contemporain',
      verified: true,
      followers: 15420,
      totalEarnings: 245000,
      contentCount: 67,
      rating: 4.9,
      specialties: ['Art Digital', 'NFT', 'Illustration']
    },
    {
      id: '2',
      name: 'Kwame Asante',
      avatar: '/api/placeholder/100/100',
      bio: 'Photographe documentaire et créateur de contenu visuel',
      verified: true,
      followers: 8930,
      totalEarnings: 189000,
      contentCount: 124,
      rating: 4.8,
      specialties: ['Photographie', 'Documentaire', 'Portrait']
    },
    {
      id: '3',
      name: 'Fatou Diallo',
      avatar: '/api/placeholder/100/100',
      bio: 'Musicienne et productrice de beats afro',
      verified: false,
      followers: 12100,
      totalEarnings: 156000,
      contentCount: 89,
      rating: 4.7,
      specialties: ['Musique', 'Production', 'Afrobeat']
    }
  ];

  const mockContent: CreatorContent[] = [
    {
      id: '1',
      title: 'Collection Masques Africains NFT',
      description: 'Une collection unique de masques traditionnels africains en version NFT',
      type: 'nft',
      price: 25000,
      currency: 'FCFA',
      creatorId: '1',
      thumbnailUrl: '/api/placeholder/300/200',
      contentUrl: '',
      downloads: 47,
      rating: 4.9,
      tags: ['NFT', 'Art', 'Tradition', 'Masques'],
      isPremium: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Pack Photos Haute Résolution - Dakar',
      description: '50 photos professionnelles de Dakar pour vos projets',
      type: 'image',
      price: 15000,
      currency: 'FCFA',
      creatorId: '2',
      thumbnailUrl: '/api/placeholder/300/200',
      contentUrl: '',
      downloads: 123,
      rating: 4.8,
      tags: ['Photographie', 'Dakar', 'Urbain', 'Pack'],
      isPremium: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Beat Afro Trap - Libre de droits',
      description: 'Beat instrumental afro trap pour vos créations musicales',
      type: 'audio',
      price: 8000,
      currency: 'FCFA',
      creatorId: '3',
      thumbnailUrl: '/api/placeholder/300/200',
      contentUrl: '',
      downloads: 89,
      rating: 4.7,
      tags: ['Musique', 'Beat', 'Afro', 'Trap'],
      isPremium: true,
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setCreators(mockCreators);
    setCreatorContent(mockContent);
  }, [setCreators, setCreatorContent]);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Heart className="h-4 w-4" />;
      case 'image': return <Download className="h-4 w-4" />;
      case 'nft': return <Crown className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {currentText.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        <Tabs defaultValue="creators" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="creators">{currentText.topCreators}</TabsTrigger>
            <TabsTrigger value="content">{currentText.allContent}</TabsTrigger>
          </TabsList>

          <TabsContent value="creators" className="space-y-6">
            {/* Top Creators */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {creator.verified && (
                        <Verified className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full p-1" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                        {creator.name}
                        {creator.verified && (
                          <Badge variant="secondary" className="text-xs">
                            {currentText.verified}
                          </Badge>
                        )}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {creator.bio}
                      </p>

                      <div className="flex flex-wrap gap-1 justify-center">
                        {creator.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {creator.followers.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentText.followers}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {(creator.totalEarnings / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentText.earnings}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">
                          {creator.contentCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentText.content}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{creator.rating}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        {currentText.follow}
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Gift className="h-4 w-4" />
                        {currentText.tip}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Content Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorContent.map((content) => {
                const creator = creators.find(c => c.id === content.creatorId);
                
                return (
                  <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={content.thumbnailUrl}
                        alt={content.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-black/70 text-white">
                          {getContentTypeIcon(content.type)}
                          <span className="ml-1 capitalize">{content.type}</span>
                        </Badge>
                        {content.isPremium && (
                          <Badge className="bg-accent text-accent-foreground">
                            {currentText.premium}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground">
                          {content.price === 0 ? currentText.free : `${content.price.toLocaleString()} ${content.currency}`}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {content.description}
                      </p>

                      {/* Creator Info */}
                      {creator && (
                        <div className="flex items-center gap-2 pt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{creator.name}</span>
                          {creator.verified && (
                            <Verified className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {content.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {content.downloads}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {content.rating}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            {currentText.preview}
                          </Button>
                          <Button size="sm">
                            {currentText.download}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorEconomy;