import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PostCard } from '@/components/posts/PostCard'
import { Post } from '@/types/post'

export const EntertainmentSection: React.FC = () => {
  const [videos, setVideos] = useState<Post[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles!posts_user_id_fkey(name, is_verified), media_files(*)`)
        .eq('status', 'published')
        .eq('content_type', 'video')
        .order('like_count', { ascending: false })
        .limit(6)

      if (!error) setVideos(data || [])
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
