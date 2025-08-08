import React, { useState } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Crown } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatRelativeTime, cn } from '@/lib/utils'

interface PostCardProps {
  post: any
  onLike: () => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onLike()
  }

  const renderMedia = () => {
    if (!post.media_files || post.media_files.length === 0) return null

    const media = post.media_files[0]
    
    if (media.mime_type?.startsWith('image/')) {
      return (
        <div className="relative w-full">
          <img
            src={`https://egwishjwlrhhumtnkrfo.supabase.co/storage/v1/object/public/posts/${media.file_path}`}
            alt={post.title || 'Post image'}
            className="w-full h-auto rounded-lg object-cover"
            loading="lazy"
          />
          {post.is_monetized && (
            <div className="absolute top-3 right-3 bg-gradient-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Premium
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
    <article className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback>
              {post.profiles?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">
                {post.profiles?.name || 'Utilisateur'}
              </h3>
              {post.profiles?.is_verified && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">✓</span>
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

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      {post.title && (
        <div className="px-4 pb-2">
          <h2 className="font-semibold text-lg">{post.title}</h2>
        </div>
      )}

      {/* Content */}
      {post.description && (
        <div className="px-4 pb-3">
          <p className="text-foreground leading-relaxed">
            {showFullContent || !contentPreview.endsWith('...') 
              ? post.description 
              : contentPreview}
          </p>
          {contentPreview.endsWith('...') && (
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

      {/* Actions */}
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-2 transition-colors",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart 
                className={cn(
                  "h-5 w-5",
                  liked && "fill-current"
                )} 
              />
              <span className="font-medium">{post.like_count || 0}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">0</span>
            </Button>

            <Button variant="ghost" size="sm">
              <Share className="h-5 w-5" />
            </Button>
          </div>

          {post.is_monetized && post.price && (
            <div className="text-sm font-semibold text-primary">
              {post.price}€
            </div>
          )}
        </div>
      </div>
    </article>
  )
}