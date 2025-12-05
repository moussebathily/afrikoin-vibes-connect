import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Crown, Bookmark, Send } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Post } from '@/types/post'
import { toast } from 'sonner'

interface PostCardProps {
  post: Post
  onLike: () => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [likeAnimation, setLikeAnimation] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 300)
    onLike()
  }

  const handleShare = async () => {
    const shareData = {
      title: post.title || 'Post AfriKoin',
      text: post.description || '',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Partagé avec succès !')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Lien copié dans le presse-papier !')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    toast.success(saved ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    toast.success('Commentaire ajouté')
    setComment('')
  }

  const renderMedia = () => {
    if (!post.media_files || post.media_files.length === 0) return null

    const media = post.media_files[0]
    
    if (media.mime_type?.startsWith('image/')) {
      return (
        <div className="relative w-full overflow-hidden group">
          <img
            src={`https://egwishjwlrhhumtnkrfo.supabase.co/storage/v1/object/public/posts/${media.file_path}`}
            alt={post.title || 'Post image'}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {post.is_monetized && (
            <div className="absolute top-3 right-3 bg-gradient-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-elegant">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </div>
          )}
          
          {/* Double tap to like overlay */}
          {likeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-24 h-24 text-red-500 fill-current animate-ping" />
            </div>
          )}
        </div>
      )
    }

    if (media.mime_type?.startsWith('video/')) {
      return (
        <div className="relative w-full">
          <video
            src={`https://egwishjwlrhhumtnkrfo.supabase.co/storage/v1/object/public/posts/${media.file_path}`}
            controls
            className="w-full h-auto rounded-lg"
            poster={media.thumbnail_path ? `https://egwishjwlrhhumtnkrfo.supabase.co/storage/v1/object/public/thumbnails/${media.thumbnail_path}` : undefined}
          />
        </div>
      )
    }

    return null
  }

  const contentPreview = post.description?.length > 150 
    ? `${post.description.substring(0, 150)}...` 
    : post.description

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-11 w-11 ring-2 ring-primary/20">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
              {post.profiles?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors">
                {post.profiles?.name || 'Utilisateur'}
              </h3>
              {post.profiles?.is_verified && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-[10px]">✓</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{formatRelativeTime(post.created_at)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      {post.title && (
        <div className="px-4 pb-2">
          <h2 className="font-semibold text-lg leading-tight">{post.title}</h2>
        </div>
      )}

      {/* Content */}
      {post.description && (
        <div className="px-4 pb-3">
          <p className="text-foreground leading-relaxed">
            {showFullContent || !contentPreview?.endsWith('...') 
              ? post.description 
              : contentPreview}
          </p>
          {contentPreview?.endsWith('...') && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary text-sm font-medium mt-1 hover:underline"
            >
              {showFullContent ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      )}

      {/* Media */}
      {renderMedia()}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
        <span>{post.like_count || 0} j'aime</span>
        <span>{(post as any).view_count || 0} vues</span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-transform",
                  liked && "fill-current scale-110",
                  likeAnimation && "animate-bounce"
                )} 
              />
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
              <span className="font-medium text-sm">Partager</span>
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
        <div className="px-4 py-3 border-t border-border/50 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
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
            Aucun commentaire pour le moment
          </p>
        </div>
      )}

      {/* Price tag */}
      {post.is_monetized && post.price && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Prix</span>
            <span className="text-lg font-bold text-primary">{post.price}€</span>
          </div>
        </div>
      )}
    </article>
  )
}
