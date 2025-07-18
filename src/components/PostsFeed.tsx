import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MapPin, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Post {
  id: string;
  title?: string;
  description?: string;
  content_type: string;
  location?: string;
  price?: number;
  is_monetized: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  user_id: string;
  media_files: Array<{
    id: string;
    file_path: string;
    file_name: string;
    mime_type: string;
    width?: number;
    height?: number;
  }>;
}

const PostsFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          media_files (
            id,
            file_path,
            file_name,
            mime_type,
            width,
            height
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (filePath: string) => {
    const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleLike = async (postId: string) => {
    // Get current post to increment like count
    const { data: currentPost } = await supabase
      .from('posts')
      .select('like_count')
      .eq('id', postId)
      .single();
    
    if (!currentPost) return;
    
    // Increment like count
    const { error } = await supabase
      .from('posts')
      .update({ like_count: currentPost.like_count + 1 })
      .eq('id', postId);

    if (error) {
      toast.error('Erreur lors du like');
      return;
    }

    // Update local state
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, like_count: post.like_count + 1 }
          : post
      )
    );

    toast.success('Publication likée !');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted h-12 w-12"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
                <div className="h-64 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Aucune publication pour le moment.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Soyez le premier à publier du contenu !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="w-full max-w-2xl mx-auto">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-4 flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {post.user_id.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">Utilisateur</span>
                  {post.location && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.location}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </div>
              </div>
            </div>

            {/* Media */}
            {post.media_files.length > 0 && (
              <div className="relative">
                {post.media_files[0].mime_type.startsWith('image/') ? (
                  <img
                    src={getMediaUrl(post.media_files[0].file_path)}
                    alt={post.title || 'Publication'}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : (
                  <video
                    src={getMediaUrl(post.media_files[0].file_path)}
                    controls
                    className="w-full h-auto max-h-96"
                  />
                )}
                {post.media_files.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{post.media_files.length - 1}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {post.title && (
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              )}
              {post.description && (
                <p className="text-muted-foreground mb-3">{post.description}</p>
              )}

              {/* Price */}
              {post.is_monetized && post.price && (
                <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-semibold">
                    {post.price.toLocaleString()} FCFA
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.like_count}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Commenter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Partager
                  </Button>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  {post.view_count}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostsFeed;