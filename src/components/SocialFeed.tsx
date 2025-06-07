
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Music, Crown, Users } from 'lucide-react';

interface SocialFeedProps {
  language: 'fr' | 'en';
}

const SocialFeed: React.FC<SocialFeedProps> = ({ language }) => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const text = {
    fr: {
      title: 'Fil d\'actualité',
      subtitle: 'Découvrez le contenu de la communauté',
      likes: 'j\'aime',
      comments: 'commentaires',
      shares: 'partages',
      follow: 'S\'abonner',
      premium: 'Premium',
      unlock: 'Débloquer',
      fcfa: 'FCFA',
      sponsored: 'Sponsorisé'
    },
    en: {
      title: 'Social Feed',
      subtitle: 'Discover community content',
      likes: 'likes',
      comments: 'comments',
      shares: 'shares',
      follow: 'Follow',
      premium: 'Premium',
      unlock: 'Unlock',
      fcfa: 'FCFA',
      sponsored: 'Sponsored'
    }
  };

  const feedPosts = [
    {
      id: 1,
      user: {
        name: 'Khadija Sow',
        username: '@khadija_fashion',
        avatar: '/placeholder.svg',
        isVerified: true,
        followers: 5420
      },
      content: {
        type: 'photo',
        description: 'Nouvelle collection de pagnes traditionnels 🌟 Fait main avec amour au Sénégal',
        media: '/placeholder.svg',
        music: null,
        isPremium: false,
        price: null
      },
      stats: {
        likes: 245,
        comments: 34,
        shares: 12,
        views: 1250
      },
      timestamp: '2h',
      location: 'Dakar, Sénégal'
    },
    {
      id: 2,
      user: {
        name: 'Mamadou Traoré',
        username: '@mamadou_music',
        avatar: '/placeholder.svg',
        isVerified: false,
        followers: 2180
      },
      content: {
        type: 'video',
        description: 'Session de djembe au coucher du soleil 🥁 Musique traditionnelle malienne',
        media: '/placeholder.svg',
        music: 'Traditional Djembe - Mali Rhythms',
        isPremium: true,
        price: 2500
      },
      stats: {
        likes: 567,
        comments: 89,
        shares: 45,
        views: 3420
      },
      timestamp: '4h',
      location: 'Bamako, Mali'
    }
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {text[language].title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {feedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {/* En-tête du post */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {post.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{post.user.name}</h3>
                      {post.user.isVerified && (
                        <Crown className="w-4 h-4 text-afrikoin-gold" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.user.username} • {post.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-1" />
                    {text[language].follow}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="px-4 pb-3">
                <p>{post.content.description}</p>
                {post.location && (
                  <p className="text-sm text-muted-foreground mt-1">
                    📍 {post.location}
                  </p>
                )}
              </div>

              {/* Contenu média */}
              <div className="relative">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {post.content.type === 'video' ? (
                    <Play className="w-16 h-16 text-muted-foreground" />
                  ) : (
                    <div className="text-muted-foreground">Photo</div>
                  )}
                </div>

                {/* Overlay pour contenu premium */}
                {post.content.isPremium && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-afrikoin-gold" />
                      <h3 className="font-bold mb-2">{text[language].premium}</h3>
                      <p className="mb-4">{post.content.price} {text[language].fcfa}</p>
                      <Button className="bg-afrikoin-gold hover:bg-afrikoin-gold/90 text-white">
                        {text[language].unlock}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Badge Premium */}
                {post.content.isPremium && (
                  <div className="absolute top-3 right-3 bg-afrikoin-gold text-white px-2 py-1 rounded text-xs font-bold">
                    {text[language].premium}
                  </div>
                )}

                {/* Musique pour vidéo */}
                {post.content.music && (
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center">
                    <Music className="w-3 h-3 mr-1" />
                    {post.content.music}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          likedPosts.includes(post.id) 
                            ? 'fill-red-500 text-red-500' 
                            : ''
                        }`} 
                      />
                      <span className="text-sm">{post.stats.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.stats.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <Share className="w-5 h-5" />
                      <span className="text-sm">{post.stats.shares}</span>
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {post.stats.views.toLocaleString()} vues
                  </div>
                </div>

                {/* Statistiques */}
                <div className="text-sm text-muted-foreground">
                  {post.stats.likes} {text[language].likes}, {post.stats.comments} {text[language].comments}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
