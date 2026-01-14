import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard } from '@/components/posts/PostCard'
import { WeeklyRankingsCard } from '@/components/rankings/WeeklyRankingsCard'
import { DailyNewsCard } from '@/components/news/DailyNewsCard'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Trophy, TrendingUp, Calendar, Goal } from 'lucide-react'
import { EnhancedPost, WeeklyRanking, DailyNews, Challenge } from '@/types/content'
import { toast } from 'sonner'

export function SportsPage() {
  const [posts, setPosts] = useState<EnhancedPost[]>([])
  const [rankings, setRankings] = useState<WeeklyRanking[]>([])
  const [news, setNews] = useState<DailyNews[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    fetchSportsContent()
  }, [])

  const fetchSportsContent = async () => {
    try {
      // Fetch sports posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('category', 'sport')
        .eq('status', 'published')
        .order('like_count', { ascending: false })
        .limit(20)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
        setPosts([])
      } else if (postsData && postsData.length > 0) {
        const userIds = (postsData as any[]).map(p => p.user_id).filter(Boolean)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, user_id, name, display_name, avatar_url, is_verified, country')
          .in('user_id', userIds)
        
        const postsWithProfiles = (postsData as any[]).map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.user_id === post.user_id) || null
        }))
        setPosts(postsWithProfiles as EnhancedPost[])
      } else {
        setPosts([])
      }

      // Fetch weekly rankings for sports
      const { data: rankingsData } = await supabase
        .from('weekly_rankings')
        .select('*')
        .eq('category', 'sport')
        .order('rank')
        .limit(10)

      setRankings((rankingsData || []) as WeeklyRanking[])

      // Fetch sports news
      const { data: newsData } = await supabase
        .from('daily_news')
        .select('*')
        .eq('category', 'sport')
        .order('published_at', { ascending: false })
        .limit(5)

      setNews((newsData || []) as DailyNews[])

      // Fetch sports challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setChallenges((challengesData || []) as Challenge[])

    } catch (error) {
      console.error('Error fetching sports content:', error)
      toast.error('Erreur lors du chargement du contenu sportif')
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
      if (!error && data?.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, like_count: data.like_count } : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('sports.title')}</h1>
            <p className="text-muted-foreground">{t('sports.subtitle')}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts"><TrendingUp className="h-4 w-4 mr-2" />Contenus</TabsTrigger>
          <TabsTrigger value="rankings"><Trophy className="h-4 w-4 mr-2" />Classements</TabsTrigger>
          <TabsTrigger value="news"><Calendar className="h-4 w-4 mr-2" />Actualités</TabsTrigger>
          <TabsTrigger value="challenges"><Goal className="h-4 w-4 mr-2" />Défis</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {posts.length > 0 ? posts.map((post) => (
                <PostCard key={post.id} post={post as any} onLike={() => handleLikePost(post.id)} />
              )) : (
                <Card><CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun contenu sportif</h3>
                </CardContent></Card>
              )}
            </div>
            <div className="space-y-6">
              <WeeklyRankingsCard rankings={rankings.slice(0, 5)} category="Sport" />
              {challenges.length > 0 && (
                <Card><CardHeader><CardTitle className="text-lg">Défis Sportifs</CardTitle></CardHeader>
                  <CardContent><ChallengeCard challenge={challenges[0]} /></CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings"><WeeklyRankingsCard rankings={rankings} category="Sport" /></TabsContent>

        <TabsContent value="news" className="space-y-4">
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((article) => <DailyNewsCard key={article.id} news={article} />)}
            </div>
          ) : <Card><CardContent className="text-center py-12"><Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3>Aucune actualité</h3></CardContent></Card>}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
            </div>
          ) : <Card><CardContent className="text-center py-12"><Goal className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3>Aucun défi</h3></CardContent></Card>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
