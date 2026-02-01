import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Crown, MoreHorizontal, Send, Eye, Verified } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { DEMO_POSTS, type DemoPost } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface DemoPostCardProps {
  post: DemoPost;
}

function DemoPostCard({ post }: DemoPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 300);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        });
        toast.success('Partagé avec succès !');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié !');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-elegant animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <AvatarImage src={post.profiles.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
              {post.profiles.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors">
                {post.profiles.name}
              </span>
              {post.profiles.is_verified && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Verified className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{timeAgo}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{post.location}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <h2 className="font-semibold text-lg leading-tight">{post.title}</h2>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground leading-relaxed text-sm">{post.description}</p>
      </div>

      {/* Media */}
      <div className="relative w-full overflow-hidden group">
        <img
          src={post.media_url}
          alt={post.title}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {post.is_featured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
              ⭐ Tendance
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {post.category}
          </Badge>
        </div>

        {post.is_monetized && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}

        {/* Double tap like animation */}
        {likeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-24 h-24 text-red-500 fill-red-500 animate-ping" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-b border-border/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            {formatNumber(likeCount)}
          </span>
          <span>{formatNumber(post.comment_count)} commentaires</span>
        </div>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {formatNumber(post.view_count)} vues
        </span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-all",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn(
                "h-5 w-5 transition-transform",
                liked && "fill-current scale-110",
                likeAnimation && "animate-bounce"
              )} />
              <span className="font-medium text-sm">J'aime</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium text-sm">Commenter</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium text-sm hidden sm:inline">Partager</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={cn(saved && "text-primary")}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-border/50 space-y-3 animate-in slide-in-from-top-2">
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (comment.trim()) {
                toast.success('Commentaire ajouté');
                setComment('');
              }
            }} 
            className="flex gap-2"
          >
            <Input
              placeholder="Écrire un commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 h-9"
            />
            <Button type="submit" size="sm" variant="ghost" disabled={!comment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            {post.comment_count} commentaires • Voir tous
          </p>
        </div>
      )}

      {/* Price for monetized */}
      {post.is_monetized && post.price && (
        <div className="px-4 py-3 border-t border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Contenu Premium</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {post.price.toLocaleString()} FCFA
              </span>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                Débloquer
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function DemoPostsSection() {
  return (
    <div className="space-y-6">
      {DEMO_POSTS.map((post) => (
        <DemoPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
