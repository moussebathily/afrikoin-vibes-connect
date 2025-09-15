import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PostCard } from '@/components/posts/PostCard'
import { WeeklyRankingsCard } from '@/components/rankings/WeeklyRankingsCard'
import { DailyNewsCard } from '@/components/news/DailyNewsCard'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Palette, TrendingUp, Calendar, Trophy } from 'lucide-react'
import { EnhancedPost, WeeklyRanking, DailyNews, Challenge } from '@/types/content'
import { toast } from 'sonner'

export function CulturePage() {
  const [posts, setPosts] = useState<EnhancedPost[]>([])
  const [rankings, setRankings] = useState<WeeklyRanking[]>([])
  const [news, setNews] = useState<DailyNews[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    fetchCulturalContent()
  }, [])

  const fetchCulturalContent = async () => {
    try {
      // Fetch cultural posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('category_slug', 'culture')
        .eq('status', 'published')
        .order('trending_score', { ascending: false })
        .limit(20)

      if (postsError) {
        console.error('Error fetching posts:', postsError)
        setPosts([])
      } else if (postsData && postsData.length > 0) {
        // Fetch profiles separately
        const userIds = postsData.map(p => p.user_id).filter(Boolean)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, is_verified, country')
          .in('id', userIds)
        
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.id === post.user_id) || null
        }))
        setPosts(postsWithProfiles)
      } else {
        setPosts([])
      }

      // Fetch weekly rankings for culture
      const { data: rankingsData, error: rankingsError } = await supabase
        .from('weekly_rankings')
        .select('*')
        .eq('category_slug', 'culture')
        .order('rank_position')
        .limit(10)

      if (rankingsError) throw rankingsError
      setRankings(rankingsData || [])

      // Fetch cultural news
      const { data: newsData, error: newsError } = await supabase
        .from('daily_news')
        .select('*')
        .eq('category_slug', 'culture')
        .order('published_at', { ascending: false })
        .limit(5)

      if (newsError) throw newsError
      setNews(newsData || [])

      // Fetch cultural challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('category_slug', 'culture')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (challengesError) throw challengesError
      setChallenges(challengesData || [])

    } catch (error) {
      console.error('Error fetching cultural content:', error)
      toast.error('Erreur lors du chargement du contenu culturel')
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
      
      if (!data?.success) {
        console.error('Error liking post:', data)
        return
      }

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, like_count: data.like_count }
          : post
      ))
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('culture.title')}</h1>
            <p className="text-muted-foreground">{t('culture.subtitle')}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Contenus
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Classements
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Actualités
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Défis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post as any}
                      onLike={() => handleLikePost(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun contenu culturel</h3>
                    <p className="text-muted-foreground">
                      Soyez le premier à partager quelque chose de culturel !
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <WeeklyRankingsCard 
                rankings={rankings.slice(0, 5)} 
                category="Culture"
              />
              
              {challenges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Défis Culturels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChallengeCard 
                      challenge={challenges[0]}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings">
          <WeeklyRankingsCard 
            rankings={rankings} 
            category="Culture"
          />
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((article) => (
                <DailyNewsCard key={article.id} news={article} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune actualité</h3>
                <p className="text-muted-foreground">
                  Les actualités culturelles apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun défi</h3>
                <p className="text-muted-foreground">
                  Les défis culturels apparaîtront ici prochainement.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}