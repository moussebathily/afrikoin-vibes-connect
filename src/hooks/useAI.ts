import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ModerationResult {
  approved: boolean
  text_moderation?: any
  image_moderation?: any
  quality_analysis?: {
    score: number
    issues: string[]
    price_range: string
    category: string
    suggestions: string[]
  }
  recommendations: {
    can_publish: boolean
    improvements: string[]
  }
}

interface EnhancementResult {
  original_description: string
  enhanced_description: string
  suggested_keywords: string[]
  improvement_summary: {
    length_improvement: boolean
    added_value: number
    readability_score: number
  }
}

interface ThumbnailResult {
  success: boolean
  thumbnail_url?: string
  text_thumbnail?: {
    productName: string
    price: string
    style: string
    backgroundColor: string
    textColor: string
    category: string
  }
  metadata?: any
  fallback_thumbnail?: any
}

interface IllustrationResult {
  success: boolean
  illustration_url?: string
  metadata?: any
  suggestions?: string[]
  alternative_styles?: string[]
}

interface TranslationResult {
  original_text: string
  translated_text: string
  source_language: string
  target_language: string
  context: string
  quality_score: number
  character_count: {
    original: number
    translated: number
  }
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const moderateContent = async (imageUrl?: string, text?: string): Promise<ModerationResult | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('ai-content-moderator', {
        body: { imageUrl, text }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Content moderation error:', error)
      toast({
        title: "Erreur de modération",
        description: "Impossible d'analyser le contenu",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const enhanceDescription = async (
    description: string, 
    category?: string, 
    price?: string,
    language = 'fr'
  ): Promise<EnhancementResult | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('ai-description-enhancer', {
        body: { description, category, price, language }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Description enhancement error:', error)
      toast({
        title: "Erreur d'amélioration",
        description: "Impossible d'améliorer la description",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const generateThumbnail = async (
    productName: string,
    price: number | string,
    currency = 'XOF',
    category?: string,
    style = 'modern'
  ): Promise<ThumbnailResult | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('ai-thumbnail-generator', {
        body: { productName, price, currency, category, style }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Thumbnail generation error:', error)
      toast({
        title: "Erreur de miniature",
        description: "Impossible de générer la miniature",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const generateIllustration = async (
    productDescription: string,
    category?: string,
    style = 'realistic',
    aspectRatio = '1:1',
    includeContext = true
  ): Promise<IllustrationResult | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('ai-illustration-generator', {
        body: { 
          productDescription, 
          category, 
          style, 
          aspectRatio, 
          includeContext 
        }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Illustration generation error:', error)
      toast({
        title: "Erreur d'illustration",
        description: "Impossible de générer l'illustration",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const translateText = async (
    text: string,
    targetLanguage: string,
    sourceLanguage = 'auto',
    context = 'marketplace'
  ): Promise<TranslationResult | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('ai-text-translator', {
        body: { text, targetLanguage, sourceLanguage, context }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Translation error:', error)
      toast({
        title: "Erreur de traduction",
        description: "Impossible de traduire le texte",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    moderateContent,
    enhanceDescription,
    generateThumbnail,
    generateIllustration,
    translateText
  }
}