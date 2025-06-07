
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, MessageCircle, Share, Play, Camera, Settings, Crown } from 'lucide-react';

interface UserProfileProps {
  language: 'fr' | 'en';
}

const UserProfile: React.FC<UserProfileProps> = ({ language }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'about'>('posts');

  const text = {
    fr: {
      followers: 'Abonnés',
      following: 'Abonnements',
      posts: 'Publications',
      videos: 'Vidéos',
      about: 'À propos',
      follow: 'S\'abonner',
      unfollow: 'Se désabonner',
      message: 'Message',
      premium: 'Contenu Premium',
      earnings: 'Revenus ce mois',
      views: 'vues',
      likes: 'j\'aime',
      comments: 'commentaires',
      fcfa: 'FCFA',
      bio: 'Créateur de contenu passionné | Artisan traditionnel | Dakar, Sénégal'
    },
    en: {
      followers: 'Followers',
      following: 'Following',
      posts: 'Posts',
      videos: 'Videos',
      about: 'About',
      follow: 'Follow',
      unfollow: 'Unfollow',
      message: 'Message',
      premium: 'Premium Content',
      earnings: 'This month earnings',
      views: 'views',
      likes: 'likes',
      comments: 'comments',
      fcfa: 'FCFA',
      bio: 'Passionate content creator | Traditional craftsman | Dakar, Senegal'
    }
  };

  const userData = {
    name: 'Amina Diallo',
    username: '@amina_creates',
    avatar: '/placeholder.svg',
    followers: 2847,
    following: 456,
    posts: 89,
    isPremium: true,
    monthlyEarnings: 125000
  };

  const userContent = [
    {
      id: 1,
      type: 'photo',
      thumbnail: '/placeholder.svg',
      likes: 234,
      comments: 45,
      views: 1250,
      isPremium: false
    },
    {
      id: 2,
      type: 'video',
      thumbnail: '/placeholder.svg',
      likes: 567,
      comments: 89,
      views: 3420,
      isPremium: true
    },
    {
      id: 3,
      type: 'photo',
      thumbnail: '/placeholder.svg',
      likes: 123,
      comments: 23,
      views: 890,
      isPremium: false
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête du profil */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                {userData.isPremium && (
                  <div className="absolute -top-1 -right-1 bg-afrikoin-gold rounded-full p-1">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Informations utilisateur */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                <p className="text-muted-foreground mb-3">{userData.username}</p>
                <p className="text-sm mb-4">{text[language].bio}</p>

                {/* Statistiques */}
                <div className="flex justify-center md:justify-start space-x-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{userData.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{text[language].followers}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{userData.following}</div>
                    <div className="text-sm text-muted-foreground">{text[language].following}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{userData.posts}</div>
                    <div className="text-sm text-muted-foreground">{text[language].posts}</div>
                  </div>
                </div>

                {/* Revenus (si premium) */}
                {userData.isPremium && (
                  <div className="bg-afrikoin-gold/10 p-3 rounded-lg mb-4">
                    <div className="text-sm text-muted-foreground">{text[language].earnings}</div>
                    <div className="font-bold text-lg text-afrikoin-gold">
                      {userData.monthlyEarnings.toLocaleString()} {text[language].fcfa}
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex justify-center md:justify-start space-x-3">
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    variant={isFollowing ? "outline" : "default"}
                    className={!isFollowing ? "bg-afrikoin-gradient text-white" : ""}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isFollowing ? text[language].unfollow : text[language].follow}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {text[language].message}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Onglets de contenu */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted rounded-lg p-1">
              {['posts', 'videos', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === tab 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {text[language][tab as keyof typeof text[typeof language]]}
                </button>
              ))}
            </div>
          </div>

          {/* Grille de contenu */}
          {(activeTab === 'posts' || activeTab === 'videos') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContent.map((content) => (
                <Card key={content.id} className="overflow-hidden group cursor-pointer">
                  <div className="relative aspect-square bg-muted">
                    {/* Thumbnail placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {content.type === 'video' ? (
                        <Play className="w-12 h-12 text-muted-foreground" />
                      ) : (
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>

                    {/* Badge Premium */}
                    {content.isPremium && (
                      <div className="absolute top-2 right-2 bg-afrikoin-gold text-white px-2 py-1 rounded text-xs font-bold">
                        {text[language].premium}
                      </div>
                    )}

                    {/* Overlay avec statistiques */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {content.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {content.comments}
                          </div>
                        </div>
                        <div className="text-sm">
                          {content.views} {text[language].views}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
