// Test utility for i18n system
import { setupI18n, changeLanguage, getAvailableLanguages, detectUserLanguage } from '@/i18n/config'

export interface I18nTestResult {
  language: string
  success: boolean
  error?: string
  loadTime?: number
}

// Test language loading for critical languages
export const testLanguageLoading = async (): Promise<I18nTestResult[]> => {
  const criticalLanguages = ['en', 'fr', 'es', 'ar', 'sw', 'ha', 'yo', 'pt', 'de', 'it', 'zh', 'am', 'ig', 'om', 'so', 'zu', 'xh']
  const results: I18nTestResult[] = []
  
  for (const lang of criticalLanguages) {
    const startTime = Date.now()
    try {
      const success = await changeLanguage(lang)
      const loadTime = Date.now() - startTime
      
      results.push({
        language: lang,
        success,
        loadTime
      })
      
      console.log(`✅ Language ${lang} loaded successfully in ${loadTime}ms`)
    } catch (error) {
      const loadTime = Date.now() - startTime
      results.push({
        language: lang,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        loadTime
      })
      
      console.error(`❌ Language ${lang} failed to load:`, error)
    }
  }
  
  return results
}

// Test language detection
export const testLanguageDetection = () => {
  const detected = detectUserLanguage()
  const available = getAvailableLanguages()
  
  console.log('🔍 Language Detection Test:', {
    detected,
    browserLang: navigator.language,
    storedLang: localStorage.getItem('afrikoin-language'),
    availableCount: available.length,
    supportedDetection: available.some(lang => lang.code === detected || lang.code === detected.split('-')[0])
  })
  
  return {
    detected,
    isSupported: available.some(lang => lang.code === detected || lang.code === detected.split('-')[0])
  }
}

// Test RTL languages
export const testRTLLanguages = async () => {
  const rtlLanguages = ['ar', 'ar-MA', 'ar-DZ', 'ar-TN', 'mey']
  
  for (const lang of rtlLanguages) {
    try {
      await changeLanguage(lang)
      const isRTL = document.dir === 'rtl'
      console.log(`${isRTL ? '✅' : '❌'} RTL test for ${lang}: ${isRTL ? 'PASSED' : 'FAILED'}`)
    } catch (error) {
      console.error(`❌ RTL test failed for ${lang}:`, error)
    }
  }
}

// Complete i18n system test
export const runCompleteI18nTest = async () => {
  console.log('🚀 Starting complete i18n system test...')
  
  try {
    // Initialize system
    console.log('1. Testing i18n initialization...')
    await setupI18n()
    console.log('✅ i18n initialization successful')
    
    // Test language detection
    console.log('2. Testing language detection...')
    const detectionResult = testLanguageDetection()
    console.log(`✅ Language detection: ${detectionResult.detected} (supported: ${detectionResult.isSupported})`)
    
    // Test critical language loading
    console.log('3. Testing critical language loading...')
    const loadingResults = await testLanguageLoading()
    const successfulLoads = loadingResults.filter(r => r.success).length
    const totalLoads = loadingResults.length
    console.log(`✅ Language loading: ${successfulLoads}/${totalLoads} successful`)
    
    // Test RTL functionality
    console.log('4. Testing RTL functionality...')
    await testRTLLanguages()
    
    // Final summary
    const failedLanguages = loadingResults.filter(r => !r.success)
    if (failedLanguages.length > 0) {
      console.warn('⚠️ Some languages failed to load:', failedLanguages.map(f => f.language))
    }
    
    console.log('🎉 i18n system test completed!')
    return {
      success: successfulLoads === totalLoads,
      results: loadingResults,
      summary: `${successfulLoads}/${totalLoads} languages loaded successfully`
    }
    
  } catch (error) {
    console.error('❌ i18n system test failed:', error)
    throw error
  }
}