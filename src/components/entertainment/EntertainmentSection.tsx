import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PostCard } from '@/components/posts/PostCard'
import { Post } from '@/types/post'

export const EntertainmentSection = () => {
  const [videos, setVideos] = useState<Post[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('status', 'published')
        .eq('content_type', 'video')
        .order('like_count', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching videos:', error)
        return
      }

      if (postsData && postsData.length > 0) {
        // Fetch profiles separately
        const userIds = postsData.map(p => p.user_id).filter(Boolean)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, is_verified')
          .in('id', userIds)
        
        const videosWithProfiles = postsData.map(video => ({
          ...video,
          profiles: profilesData?.find(p => p.id === video.user_id) || null
        }))
        setVideos(videosWithProfiles)
      }
    }
    fetchVideos()
  }, [])

  if (!videos.length) return null

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">Divertissement — Vidéos tendances</h2>
      <div className="space-y-6">
        {videos.map((post) => (
          <PostCard key={post.id} post={post} onLike={() => {}} />
        ))}
      </div>
    </section>
  )
}
