import React, { useEffect, useState } from 'react'
import { PostCard } from '@/components/posts/PostCard'
import { DemoPostsSection } from '@/components/posts/DemoPostsSection'
import { StoryCarousel } from '@/components/stories/StoryCarousel'
import { WelcomeCard } from '@/components/home/WelcomeCard'
import { FestivalBanner } from '@/components/holidays/FestivalBanner'
import { IndependenceBanner } from '@/components/holidays/IndependenceBanner'
import { EntertainmentSection } from '@/components/entertainment/EntertainmentSection'
import { CategoryTabs } from '@/components/categories/CategoryTabs'
import { WeeklyRankingsCard } from '@/components/rankings/WeeklyRankingsCard'
import { EnhancedNewsSection } from '@/components/news/EnhancedNewsSection'
import { JobsSection } from '@/components/jobs/JobsSection'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Phone } from 'lucide-react'
import { Post } from '@/types/post'
import { ContentCategory, WeeklyRanking } from '@/types/content'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [rankings, setRankings] = useState<WeeklyRanking[]>([])
  const [activeCategory, setActiveCategory] = useState('general')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [activeCategory])

  const fetchInitialData = async () => {
    try {
      // Fetch categories safely
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
      } else {
        setCategories((categoriesData || []) as ContentCategory[])
      }

      // Fetch rankings safely without foreign key dependency
      const { data: rankingsData, error: rankingsError } = await supabase
        .from('weekly_rankings')
        .select('*')
        .order('rank')
        .limit(5)

      if (rankingsError) {
        console.error('Error fetching rankings:', rankingsError)
      } else {
        // Fetch profiles separately for rankings
        if (rankingsData && rankingsData.length > 0) {
          const userIds = (rankingsData as any[]).map(r => r.user_id).filter(Boolean)
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, user_id, name, display_name, avatar_url, is_verified')
            .in('user_id', userIds)
          
          const rankingsWithProfiles = (rankingsData as any[]).map(ranking => ({
            ...ranking,
            profiles: profilesData?.find(p => p.user_id === ranking.user_id) || null
          }))
          setRankings(rankingsWithProfiles as WeeklyRanking[])
        } else {
          setRankings([])
        }
      }

      // Fetch initial posts
      await fetchPosts()
    } catch (error) {
      console.error('Error fetching initial data:', error)
      // Don't fail completely - continue loading with empty data
      setCategories([])
      setRankings([])
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('*, media_files(*)')
        .eq('status', 'published')

      if (activeCategory !== 'general') {
        query = query.eq('category', activeCategory)
      }

      const { data: postsData, error } = await query
        .order('like_count', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
        return
      }

      // Fetch profiles separately to avoid foreign key issues
      if (postsData && postsData.length > 0) {
        const userIds = (postsData as any[]).map(p => p.user_id).filter(Boolean)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, user_id, name, display_name, country, is_verified')
          .in('user_id', userIds)
        
        const postsWithProfiles = (postsData as any[]).map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.user_id === post.user_id) || null
        }))
        setPosts(postsWithProfiles as Post[])
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
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
        
        // Check for insufficient credits
        if (error.message?.includes('INSUFFICIENT_CREDITS')) {
          toast.error("Crédits insuffisants", {
            description: "Vous n'avez plus de crédits likes",
            action: {
              label: "Acheter des likes",
              onClick: () => window.location.href = "/wallet"
            }
          })
        }
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

      {/* Discover AfriKoin CTA */}
      <section aria-label={t('marketing.cta.getStarted')} className="rounded-lg border bg-card text-card-foreground p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">{t('marketing.hero.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('marketing.hero.tagline') || t('app.tagline')}</p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/about">{t('marketing.cta.getStarted')}</Link>
          </Button>
        </div>
      </section>
      
      {/* Independence Day Banner (shows only on your country's Independence Day) */}
      <IndependenceBanner />
      
      {/* Festival Banner */}
      <FestivalBanner />
      
      {/* Category Tabs */}
      {categories.length > 0 && (
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
      
      {/* Stories Carousel */}
      <StoryCarousel />
      
      {/* Info du jour - Actualités, Sport, Culture */}
      <EnhancedNewsSection limit={6} />
      
      {/* Offres d'emploi */}
      <JobsSection limit={4} />
      
      {/* Cultural & Entertainment */}
      <EntertainmentSection />
      
      {/* Posts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Show demo posts if no real posts */}
          {posts.length === 0 ? (
            <DemoPostsSection />
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLikePost(post.id)}
              />
            ))
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {rankings.length > 0 && (
            <WeeklyRankingsCard 
              rankings={rankings} 
              category="Cette semaine"
            />
          )}
        </div>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {t('posts.noPostsYet')}
          </h3>
          <p className="text-muted-foreground">
            {t('posts.beFirst')}
          </p>
        </div>
      )}

      {/* Floating Call Button */}
      <button
        onClick={() => navigate('/call')}
        className="fixed bottom-20 right-4 z-40 w-16 h-16 bg-gradient-primary hover:shadow-glow text-primary-foreground rounded-full shadow-elegant flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float"
        aria-label={t('call.title')}
      >
        <Phone className="w-7 h-7" />
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
      </button>
    </div>
  )
}
