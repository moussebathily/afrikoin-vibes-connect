// AI-related type definitions
export interface ModerationResult {
  approved: boolean
  quality_analysis?: {
    score: number
    issues?: string[]
    category?: string
    price_range?: string
  }
  recommendations?: {
    improvements?: string[]
    can_publish?: boolean
  }
}

export interface EnhancementResult {
  enhanced_description: string
  suggested_keywords: string[]
  improvement_summary: {
    added_value: number
    readability_score: number
  }
}

export interface ThumbnailResult {
  success: boolean
  thumbnail_url?: string
  fallback_thumbnail?: {
    backgroundColor: string
    textColor: string
  }
}

export interface IllustrationResult {
  success: boolean
  illustration_url?: string
  description: string
}

export interface TranslationResult {
  translated_text: string
  source_language: string
  target_language: string
  confidence: number
}