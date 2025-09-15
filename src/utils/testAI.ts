// Test utility for AI Edge Functions
import { supabase } from '@/integrations/supabase/client'

export interface AITestResult {
  function: string
  success: boolean
  responseTime?: number
  error?: string
  result?: any
}

// Test AI Content Moderator
export const testAIContentModerator = async (): Promise<AITestResult> => {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.functions.invoke('ai-content-moderator', {
      body: {
        text: "This is a test message for content moderation",
        imageUrl: null
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (error) throw error
    
    return {
      function: 'ai-content-moderator',
      success: true,
      responseTime,
      result: data
    }
  } catch (error) {
    return {
      function: 'ai-content-moderator',
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Test AI Description Enhancer
export const testAIDescriptionEnhancer = async (): Promise<AITestResult> => {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.functions.invoke('ai-description-enhancer', {
      body: {
        description: "Beautiful handmade jewelry",
        category: "accessories",
        price: "50",
        language: "en"
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (error) throw error
    
    return {
      function: 'ai-description-enhancer',
      success: true,
      responseTime,
      result: data
    }
  } catch (error) {
    return {
      function: 'ai-description-enhancer',
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Test AI Text Translator
export const testAITextTranslator = async (): Promise<AITestResult> => {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.functions.invoke('ai-text-translator', {
      body: {
        text: "Hello, welcome to AfriKoin",
        targetLanguage: "fr",
        sourceLanguage: "en",
        context: "marketplace"
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (error) throw error
    
    return {
      function: 'ai-text-translator',
      success: true,
      responseTime,
      result: data
    }
  } catch (error) {
    return {
      function: 'ai-text-translator',
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Test AI Thumbnail Generator
export const testAIThumbnailGenerator = async (): Promise<AITestResult> => {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.functions.invoke('ai-thumbnail-generator', {
      body: {
        productName: "African Art",
        price: 100,
        currency: "USD",
        category: "art",
        style: "modern"
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (error) throw error
    
    return {
      function: 'ai-thumbnail-generator',
      success: true,
      responseTime,
      result: data
    }
  } catch (error) {
    return {
      function: 'ai-thumbnail-generator',
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Test AI Illustration Generator
export const testAIIllustrationGenerator = async (): Promise<AITestResult> => {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.functions.invoke('ai-illustration-generator', {
      body: {
        productDescription: "Beautiful African mask with traditional patterns",
        category: "art",
        style: "traditional",
        aspectRatio: "square"
      }
    })
    
    const responseTime = Date.now() - startTime
    
    if (error) throw error
    
    return {
      function: 'ai-illustration-generator',
      success: true,
      responseTime,
      result: data
    }
  } catch (error) {
    return {
      function: 'ai-illustration-generator',
      success: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Run complete AI system test
export const runCompleteAITest = async () => {
  console.log('🤖 Starting complete AI system test...')
  
  const tests = [
    testAIContentModerator,
    testAIDescriptionEnhancer,
    testAITextTranslator,
    testAIThumbnailGenerator,
    testAIIllustrationGenerator
  ]
  
  const results: AITestResult[] = []
  
  for (const test of tests) {
    console.log(`Testing ${test.name}...`)
    try {
      const result = await test()
      results.push(result)
      
      if (result.success) {
        console.log(`✅ ${result.function} passed in ${result.responseTime}ms`)
      } else {
        console.error(`❌ ${result.function} failed: ${result.error}`)
      }
    } catch (error) {
      console.error(`❌ ${test.name} test crashed:`, error)
      results.push({
        function: test.name,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }
  
  const successfulTests = results.filter(r => r.success).length
  const totalTests = results.length
  
  console.log(`🎯 AI System Test Results: ${successfulTests}/${totalTests} functions working`)
  
  if (successfulTests < totalTests) {
    const failedFunctions = results.filter(r => !r.success).map(r => r.function)
    console.warn('⚠️ Failed functions:', failedFunctions)
  }
  
  return {
    success: successfulTests === totalTests,
    results,
    summary: `${successfulTests}/${totalTests} AI functions working`
  }
}