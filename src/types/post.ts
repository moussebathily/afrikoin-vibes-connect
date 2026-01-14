// Post-related type definitions
export interface MediaFile {
  id: string
  url: string
  type: string
  post_id?: string
  thumbnail_url?: string
  duration?: number
  created_at?: string
  // Legacy support
  file_path?: string
  mime_type?: string
  thumbnail_path?: string
}

export interface Profile {
  id: string
  user_id?: string
  name?: string
  display_name?: string
  username?: string
  avatar_url?: string
  is_verified?: boolean
  country?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface Post {
  id: string
  user_id?: string
  title?: string
  description?: string
  content?: string
  content_type?: string
  status?: string
  like_count?: number
  likes_count?: number
  view_count?: number
  views_count?: number
  comment_count?: number
  comments_count?: number
  share_count?: number
  shares_count?: number
  save_count?: number
  is_monetized?: boolean
  is_featured?: boolean
  price?: number
  location?: string
  category?: string
  category_slug?: string
  country?: string
  country_code?: string
  media_url?: string
  media_type?: string
  weekly_score?: number
  trending_score?: number
  created_at: string
  updated_at?: string
  profiles?: Profile
  media_files?: MediaFile[]
}
