
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Music, Crown, Users, Gem } from 'lucide-react';
import { Language } from '@/types/language';

interface SocialFeedProps {
  language: Language;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ language }) => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [gemmedPosts, setGemmedPosts] = useState<number[]>([]);

  const text = {
    fr: {
      title: 'Fil d\'actualité',
      subtitle: 'Découvrez le contenu de la communauté',
      likes: 'j\'aime',
      comments: 'commentaires',
      shares: 'partages',
      gems: 'gemmes',
      follow: 'S\'abonner',
      premium: 'Premium',
      unlock: 'Débloquer',
      fcfa: 'FCFA',
      sponsored: 'Sponsorisé',
      tapToLike: 'Tapez pour aimer',
      doubleTapGem: 'Double-tapez pour une gemme'
    },
    en: {
      title: 'Social Feed',
      subtitle: 'Discover community content',
      likes: 'likes',
      comments: 'comments',
      shares: 'shares',
      gems: 'gems',
      follow: 'Follow',
      premium: 'Premium',
      unlock: 'Unlock',
      fcfa: 'FCFA',
      sponsored: 'Sponsored',
      tapToLike: 'Tap to like',
      doubleTapGem: 'Double tap for gem'
    },
    bm: {
      title: 'Jamana kɔrɔlen',
      subtitle: 'Jamana kɔnɔko sɔrɔ',
      likes: 'ka di',
      comments: 'kuma',
      shares: 'tila',
      gems: 'bere',
      follow: 'Tɔbɔ',
      premium: 'Kɛrɛnkɛrɛnnen',
      unlock: 'Da',
      fcfa: 'FCFA',
      sponsored: 'Dɛmɛ',
      tapToLike: 'Digi walasa ka di',
      doubleTapGem: 'Digi fila walasa bere'
    },
    ar: {
      title: 'تدفق اجتماعي',
      subtitle: 'اكتشف محتوى المجتمع',
      likes: 'إعجابات',
      comments: 'تعليقات',
      shares: 'مشاركات',
      gems: 'جواهر',
      follow: 'متابعة',
      premium: 'مميز',
      unlock: 'إلغاء القفل',
      fcfa: 'فرنك',
      sponsored: 'مُموّل',
      tapToLike: 'اضغط للإعجاب',
      doubleTapGem: 'اضغط مرتين للجوهرة'
    },
    ti: {
      title: 'ማሕበራዊ ዝውውር',
      subtitle: 'ናይ ማሕበረሰብ ትሕዝቶ ርኸብ',
      likes: 'ፍቕሪ',
      comments: 'መልእኽቲ',
      shares: 'ምክፋል',
      gems: 'ድንጋይ',
      follow: 'ተኸተል',
      premium: 'ልዩ',
      unlock: 'ክፈት',
      fcfa: 'ፍራንክ',
      sponsored: 'ዝተደገፈ',
      tapToLike: 'ንምፍቃር ጠውቅ',
      doubleTapGem: 'ንድንጋይ ክልተ ግዜ ጠውቅ'
    },
    pt: {
      title: 'Feed Social',
      subtitle: 'Descubra conteúdo da comunidade',
      likes: 'curtidas',
      comments: 'comentários',
      shares: 'compartilhamentos',
      gems: 'gemas',
      follow: 'Seguir',
      premium: 'Premium',
      unlock: 'Desbloquear',
      fcfa: 'FCFA',
      sponsored: 'Patrocinado',
      tapToLike: 'Toque para curtir',
      doubleTapGem: 'Toque duplo para gema'
    },
    es: {
      title: 'Feed Social',
      subtitle: 'Descubre contenido de la comunidad',
      likes: 'me gusta',
      comments: 'comentarios',
      shares: 'compartidos',
      gems: 'gemas',
      follow: 'Seguir',
      premium: 'Premium',
      unlock: 'Desbloquear',
      fcfa: 'FCFA',
      sponsored: 'Patrocinado',
      tapToLike: 'Toca para dar me gusta',
      doubleTapGem: 'Doble toque para gema'
    },
    zh: {
      title: '社交动态',
      subtitle: '发现社区内容',
      likes: '赞',
      comments: '评论',
      shares: '分享',
      gems: '宝石',
      follow: '关注',
      premium: '高级',
      unlock: '解锁',
      fcfa: '非洲法郎',
      sponsored: '赞助',
      tapToLike: '点击点赞',
      doubleTapGem: '双击获得宝石'
    },
    ru: {
      title: 'Социальная лента',
      subtitle: 'Откройте контент сообщества',
      likes: 'лайки',
      comments: 'комментарии',
      shares: 'репосты',
      gems: 'самоцветы',
      follow: 'Подписаться',
      premium: 'Премиум',
      unlock: 'Разблокировать',
      fcfa: 'Франк КФА',
      sponsored: 'Спонсировано',
      tapToLike: 'Нажмите чтобы лайкнуть',
      doubleTapGem: 'Двойное нажатие для самоцвета'
    },
    hi: {
      title: 'सामाजिक फीड',
      subtitle: 'समुदाय की सामग्री खोजें',
      likes: 'लाइक',
      comments: 'टिप्पणियां',
      shares: 'शेयर',
      gems: 'रत्न',
      follow: 'फॉलो करें',
      premium: 'प्रीमियम',
      unlock: 'अनलॉक करें',
      fcfa: 'सीएफए फ्रैंक',
      sponsored: 'प्रायोजित',
      tapToLike: 'पसंद करने के लिए टैप करें',
      doubleTapGem: 'रत्न के लिए डबल टैप'
    }
  };

  const currentText = text[language] || text.fr;

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
        views: 1250,
        gems: 12
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
        views: 3420,
        gems: 34
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

  const toggleGem = (postId: number) => {
    setGemmedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDoubleTap = (postId: number) => {
    toggleGem(postId);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {currentText.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
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
                    {currentText.follow}
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

              {/* Contenu média avec zone de tap */}
              <div className="relative">
                <div 
                  className="aspect-square bg-muted flex items-center justify-center cursor-pointer relative overflow-hidden"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                  title={currentText.doubleTapGem}
                >
                  {post.content.type === 'video' ? (
                    <Play className="w-16 h-16 text-muted-foreground" />
                  ) : (
                    <div className="text-muted-foreground">Photo</div>
                  )}

                  {/* Zone de tap avec indicateur visuel */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-20 bg-black/20 transition-opacity">
                    <div className="flex flex-col items-center text-white">
                      <Heart className="w-8 h-8 mb-2" />
                      <span className="text-sm">{currentText.tapToLike}</span>
                    </div>
                  </div>

                  {/* Animation de gemme lors du double-tap */}
                  {gemmedPosts.includes(post.id) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Gem className="w-16 h-16 text-yellow-400 animate-ping" />
                    </div>
                  )}
                </div>

                {/* Overlay pour contenu premium */}
                {post.content.isPremium && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-afrikoin-gold" />
                      <h3 className="font-bold mb-2">{currentText.premium}</h3>
                      <p className="mb-4">{post.content.price} {currentText.fcfa}</p>
                      <Button className="bg-afrikoin-gold hover:bg-afrikoin-gold/90 text-white">
                        {currentText.unlock}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Badge Premium */}
                {post.content.isPremium && (
                  <div className="absolute top-3 right-3 bg-afrikoin-gold text-white px-2 py-1 rounded text-xs font-bold">
                    {currentText.premium}
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

              {/* Actions avec les nouvelles interactions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    {/* Bouton Like avec animation */}
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-all transform hover:scale-110"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all ${
                          likedPosts.includes(post.id) 
                            ? 'fill-red-500 text-red-500 scale-110' 
                            : ''
                        }`} 
                      />
                      <span className="text-sm">{post.stats.likes}</span>
                    </button>

                    {/* Bouton Gemme */}
                    <button
                      onClick={() => toggleGem(post.id)}
                      className="flex items-center space-x-1 hover:text-yellow-500 transition-all transform hover:scale-110"
                    >
                      <Gem 
                        className={`w-5 h-5 transition-all ${
                          gemmedPosts.includes(post.id) 
                            ? 'fill-yellow-500 text-yellow-500 scale-110' 
                            : ''
                        }`} 
                      />
                      <span className="text-sm">{post.stats.gems}</span>
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

                {/* Statistiques détaillées */}
                <div className="text-sm text-muted-foreground">
                  {post.stats.likes} {currentText.likes}, {post.stats.gems} {currentText.gems}, {post.stats.comments} {currentText.comments}
                </div>

                {/* Section commentaires rapides */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder={language === 'fr' ? "Ajouter un commentaire..." : "Add a comment..."}
                      className="flex-1 bg-muted rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
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
