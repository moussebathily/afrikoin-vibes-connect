import React, { useEffect, useState } from 'react'
import { PostCard } from '@/components/posts/PostCard'
import { StoryCarousel } from '@/components/stories/StoryCarousel'
import { WelcomeCard } from '@/components/home/WelcomeCard'
import { FestivalBanner } from '@/components/holidays/FestivalBanner'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(name, country, is_verified),
          media_files(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) return

    try {
      // Here we would implement the like system with credits
      // For now, just update the UI optimistically
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, like_count: post.like_count + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Card for new users */}
      <WelcomeCard />
      
      {/* Festival Banner */}
      <FestivalBanner />
      
      {/* Stories Carousel */}
      <StoryCarousel />
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLikePost(post.id)}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Aucun post pour le moment
          </h3>
          <p className="text-muted-foreground">
            Soyez le premier à partager du contenu !
          </p>
        </div>
      )}
    </div>
  )
}