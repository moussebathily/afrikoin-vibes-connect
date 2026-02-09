import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Post } from '@/types/post'
import { ContentCategory, WeeklyRanking } from '@/types/content'

interface HomeData {
  posts: Post[]
  categories: ContentCategory[]
  rankings: WeeklyRanking[]
  loading: boolean
}

export function useHomeData(activeCategory: string) {
  const [data, setData] = useState<HomeData>({
    posts: [],
    categories: [],
    rankings: [],
    loading: true,
  })
  const initialFetchDone = useRef(false)

  const fetchPosts = useCallback(async (category: string) => {
    try {
      let query = supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('status', 'published')

      if (category !== 'general') {
        query = query.eq('category', category)
      }

      const { data: postsData, error } = await query
        .order('like_count', { ascending: false })
        .limit(20)

      if (error || !postsData?.length) return []

      const userIds = (postsData as any[]).map(p => p.user_id).filter(Boolean)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, user_id, name, display_name, country, is_verified')
        .in('user_id', userIds)

      return (postsData as any[]).map(post => ({
        ...post,
        profiles: profilesData?.find(p => p.user_id === post.user_id) || null,
      })) as Post[]
    } catch {
      return []
    }
  }, [])

  // Initial parallel fetch for categories, rankings, and posts
  useEffect(() => {
    if (initialFetchDone.current) return
    initialFetchDone.current = true

    const fetchAll = async () => {
      const [categoriesResult, rankingsResult, postsResult] = await Promise.allSettled([
        supabase
          .from('content_categories')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('weekly_rankings')
          .select('*')
          .order('rank')
          .limit(5),
        fetchPosts(activeCategory),
      ])

      const categories =
        categoriesResult.status === 'fulfilled' && !categoriesResult.value.error
          ? (categoriesResult.value.data || []) as ContentCategory[]
          : []

      let rankings: WeeklyRanking[] = []
      if (rankingsResult.status === 'fulfilled' && !rankingsResult.value.error) {
        const rankingsData = rankingsResult.value.data || []
        if (rankingsData.length > 0) {
          const userIds = (rankingsData as any[]).map(r => r.user_id).filter(Boolean)
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, user_id, name, display_name, avatar_url, is_verified')
            .in('user_id', userIds)

          rankings = (rankingsData as any[]).map(ranking => ({
            ...ranking,
            profiles: profilesData?.find(p => p.user_id === ranking.user_id) || null,
          })) as WeeklyRanking[]
        }
      }

      const posts = postsResult.status === 'fulfilled' ? postsResult.value : []

      setData({ categories, rankings, posts, loading: false })
    }

    fetchAll()
  }, [activeCategory, fetchPosts])

  // Refetch posts only when category changes (after initial load)
  useEffect(() => {
    if (data.loading) return

    let cancelled = false
    fetchPosts(activeCategory).then(posts => {
      if (!cancelled) {
        setData(prev => ({ ...prev, posts }))
      }
    })
    return () => { cancelled = true }
  }, [activeCategory, fetchPosts, data.loading])

  return data
}
