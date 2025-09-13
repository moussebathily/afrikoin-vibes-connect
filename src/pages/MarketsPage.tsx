import React, { useEffect, useState } from 'react'
import { PostCard } from '@/components/posts/PostCard'
import { DailyNewsCard } from '@/components/news/DailyNewsCard'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { EnhancedPost, DailyNews, Challenge } from '@/types/content'
import { Briefcase, TrendingUp, Globe, Building2 } from 'lucide-react'

export function MarketsPage() {
  const [posts, setPosts] = useState<EnhancedPost[]>([])
  const [news, setNews] = useState<DailyNews[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    fetchMarketsData()
  }, [])

  const fetchMarketsData = async () => {
    try {
      // Fetch market-related posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('category_slug', 'marches-panafricains')
        .eq('status', 'published')
        .order('trending_score', { ascending: false })
        .limit(10)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
        setPosts([])
      } else if (postsData && postsData.length > 0) {
        // Fetch profiles separately
        const userIds = postsData.map(p => p.user_id).filter(Boolean)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, country, is_verified')
          .in('id', userIds)
        
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.id === post.user_id) || null
        }))
        setPosts(postsWithProfiles)
      } else {
        setPosts([])
      }

      // Fetch market news
      const { data: newsData } = await supabase
        .from('daily_news')
        .select('*')
        .eq('category_slug', 'marches-panafricains')
        .order('published_at', { ascending: false })
        .limit(5)

      setNews(newsData || [])

      // Fetch market challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('category_slug', 'marches-panafricains')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3)

      setChallenges(challengesData || [])
    } catch (error) {
      console.error('Error fetching markets data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase.functions.invoke('like-post', {
        body: { postId }
      })

      if (error) {
        console.error('Error liking post:', error)
        return
      }

      if (data?.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, like_count: data.like_count }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Marchés Panafricains</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez les opportunités commerciales, les échanges économiques et les marchés émergents à travers l'Afrique
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Opportunités</h3>
          <p className="text-2xl font-bold text-primary">{posts.length}</p>
          <p className="text-sm text-muted-foreground">Contenus disponibles</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Actualités</h3>
          <p className="text-2xl font-bold text-green-500">{news.length}</p>
          <p className="text-sm text-muted-foreground">Infos du jour</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 text-center">
          <Globe className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Défis</h3>
          <p className="text-2xl font-bold text-blue-500">{challenges.length}</p>
          <p className="text-sm text-muted-foreground">Challenges actifs</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Opportunités Commerciales
          </h2>
          
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post as any}
                onLike={() => handleLikePost(post.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Aucune opportunité pour le moment
              </h3>
              <p className="text-muted-foreground">
                Soyez le premier à partager une opportunité commerciale !
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily News */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actualités Marchés
            </h3>
            <div className="space-y-4">
              {news.map((article) => (
                <DailyNewsCard key={article.id} news={article} />
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Défis Commerciaux
            </h3>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}