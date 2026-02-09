import React, { useState, useCallback, lazy, Suspense } from 'react'
import { PostCard } from '@/components/posts/PostCard'
import { DemoPostsSection } from '@/components/posts/DemoPostsSection'
import { StoryCarousel } from '@/components/stories/StoryCarousel'
import { WelcomeCard } from '@/components/home/WelcomeCard'
import { FestivalBanner } from '@/components/holidays/FestivalBanner'
import { IndependenceBanner } from '@/components/holidays/IndependenceBanner'
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
import { useHomeData } from '@/hooks/useHomeData'

const EntertainmentSection = lazy(() =>
  import('@/components/entertainment/EntertainmentSection').then(m => ({ default: m.EntertainmentSection }))
)

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const { posts, categories, rankings, loading } = useHomeData(activeCategory)
  const [localPosts, setLocalPosts] = useState<typeof posts | null>(null)
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Sync posts from hook
  React.useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  const displayPosts = localPosts ?? posts

  const handleLikePost = useCallback(async (postId: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase.functions.invoke('like-post', {
        body: { postId }
      })

      if (error) {
        console.error('Error liking post:', error)
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
      
      if (!data?.success) return

      setLocalPosts(prev => (prev ?? []).map(post => 
        post.id === postId 
          ? { ...post, like_count: data.like_count }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }, [user])

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
      <WelcomeCard />

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
      
      <IndependenceBanner />
      <FestivalBanner />
      
      {categories.length > 0 && (
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
      
      <StoryCarousel />
      <EnhancedNewsSection limit={6} />
      <JobsSection limit={4} />
      
      <Suspense fallback={<div className="h-32 bg-muted rounded-lg animate-pulse" />}>
        <EntertainmentSection />
      </Suspense>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {displayPosts.length === 0 ? (
            <DemoPostsSection />
          ) : (
            displayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLikePost(post.id)}
              />
            ))
          )}
        </div>
        
        <div className="space-y-6">
          {rankings.length > 0 && (
            <WeeklyRankingsCard 
              rankings={rankings} 
              category="Cette semaine"
            />
          )}
        </div>
      </div>

      {displayPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {t('posts.noPostsYet')}
          </h3>
          <p className="text-muted-foreground">
            {t('posts.beFirst')}
          </p>
        </div>
      )}

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
