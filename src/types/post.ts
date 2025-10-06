// Post-related type definitions
export interface MediaFile {
  id: string
  file_path: string
  mime_type: string
  thumbnail_path?: string
}

export interface Profile {
  id: string
  name: string
  avatar_url?: string
  is_verified: boolean
}

export interface Post {
  id: string
  title?: string
  description?: string
  content_type: string
  status: string
  like_count: number
  is_monetized: boolean
  price?: number
  location?: string
  created_at: string
  user_id: string
  profiles?: Profile
  media_files?: MediaFile[]
}