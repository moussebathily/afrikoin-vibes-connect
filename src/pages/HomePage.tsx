import React, { useEffect, useState } from 'react'
import { PostCard } from '@/components/posts/PostCard'
import { StoryCarousel } from '@/components/stories/StoryCarousel'
import { WelcomeCard } from '@/components/home/WelcomeCard'
import { FestivalBanner } from '@/components/holidays/FestivalBanner'
import { IndependenceBanner } from '@/components/holidays/IndependenceBanner'
import { EntertainmentSection } from '@/components/entertainment/EntertainmentSection'
import { CategoryTabs } from '@/components/categories/CategoryTabs'
import { WeeklyRankingsCard } from '@/components/rankings/WeeklyRankingsCard'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function HomePage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [rankings, setRankings] = useState([])
  const [activeCategory, setActiveCategory] = useState('general')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [activeCategory])

  const fetchInitialData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch rankings
      const { data: rankingsData, error: rankingsError } = await supabase
        .from('weekly_rankings')
        .select(`
          *,
          profiles!weekly_rankings_user_id_fkey(name, avatar_url, is_verified)
        `)
        .order('rank_position')
        .limit(5)

      if (rankingsError) throw rankingsError
      setRankings(rankingsData || [])

      // Fetch initial posts
      await fetchPosts()
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(name, country, is_verified),
          media_files(*)
        `)
        .eq('status', 'published')

      if (activeCategory !== 'general') {
        query = query.eq('category_slug', activeCategory)
      }

      const { data, error } = await query
        .order('trending_score', { ascending: false })
        .limit(20)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
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
      
      {/* Cultural & Entertainment */}
      <EntertainmentSection />
      
      {/* Posts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post as any}
              onLike={() => handleLikePost(post.id)}
            />
          ))}
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
    </div>
  )
}