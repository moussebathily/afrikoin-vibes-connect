// Content-related type definitions
export interface ContentCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WeeklyRanking {
  id: string
  user_id: string
  country_code: string
  category_slug: string
  week_start: string
  week_end: string
  total_score: number
  total_views: number
  total_likes: number
  total_posts: number
  rank_position?: number
  title?: string
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    avatar_url?: string
    is_verified: boolean
  }
}

export interface DailyNews {
  id: string
  title: string
  content: string
  category_slug: string
  country_codes: string[]
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_breaking: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  category_slug: string
  challenge_type: 'weekly' | 'monthly' | 'special'
  start_date: string
  end_date: string
  reward_points: number
  reward_title?: string
  max_participants?: number
  current_participants: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_type: 'title' | 'badge' | 'milestone'
  achievement_name: string
  achievement_description?: string
  category_slug?: string
  points_earned: number
  earned_at: string
  week_start?: string
  metadata?: Record<string, any>
}

// Enhanced Post type with new fields
export interface EnhancedPost {
  id: string
  title?: string
  description?: string
  content_type: string
  status: string
  like_count: number
  view_count: number
  is_monetized: boolean
  price?: number
  location?: string
  category_slug: string
  country_code?: string
  weekly_score: number
  is_news_article: boolean
  challenge_id?: string
  trending_score: number
  created_at: string
  updated_at: string
  user_id: string
  profiles?: {
    id?: string
    user_id?: string
    name: string
    avatar_url?: string
    is_verified: boolean
    country?: string
  }
  media_files?: {
    id: string
    file_path: string
    mime_type: string
    thumbnail_path?: string
  }[]
}