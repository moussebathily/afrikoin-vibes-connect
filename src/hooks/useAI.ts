import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { 
  ModerationResult, 
  EnhancementResult, 
  ThumbnailResult, 
  IllustrationResult, 
  TranslationResult 
} from '@/types/ai'

// Helper to safely invoke Supabase functions with error handling
async function invokeFunction(functionName: string, payload: Record<string, unknown>): Promise<unknown> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    })

    if (error) {
      console.error(`Error invoking ${functionName}:`, error)
      return null
    }

    return data
  } catch (err) {
    console.error(`Network error invoking ${functionName}:`, err)
    return null
  }
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const moderateContent = async (imageUrl?: string, text?: string): Promise<ModerationResult | null> => {
    try {
      setLoading(true)
      const data = await invokeFunction('ai-content-moderator', { imageUrl, text })
      return data as ModerationResult | null
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
      const data = await invokeFunction('ai-description-enhancer', { description, category, price, language })
      return data as EnhancementResult | null
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
      const data = await invokeFunction('ai-thumbnail-generator', { productName, price, currency, category, style })
      return data as ThumbnailResult | null
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
      const data = await invokeFunction('ai-illustration-generator', { 
        productDescription, category, style, aspectRatio, includeContext 
      })
      return data as IllustrationResult | null
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
      const data = await invokeFunction('ai-text-translator', { text, targetLanguage, sourceLanguage, context })
      return data as TranslationResult | null
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