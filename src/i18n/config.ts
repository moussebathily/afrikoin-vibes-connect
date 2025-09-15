import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import languages from './languages.json'

// Supported language codes
export const supportedLngs = languages.map(lang => lang.code)

// Load translation files dynamically with robust fallback
const loadLocale = async (lng: string) => {
  try {
    const module = await import(`./locales/${lng}/common.json`)
    return module.default || module
  } catch (error) {
    console.warn(`Failed to load locale ${lng}, trying fallback strategies`)
    
    // Try base language (e.g., 'en' from 'en-US')
    const baseLng = lng.split('-')[0]
    if (baseLng !== lng && supportedLngs.includes(baseLng)) {
      try {
        const baseModule = await import(`./locales/${baseLng}/common.json`)
        console.log(`Using base language ${baseLng} for ${lng}`)
        return baseModule.default || baseModule
      } catch (baseError) {
        console.warn(`Base language ${baseLng} also failed`)
      }
    }
    
    // Final fallback to English
    try {
      const fallbackModule = await import(`./locales/en/common.json`)
      console.log(`Using English fallback for ${lng}`)
      return fallbackModule.default || fallbackModule
    } catch (fallbackError) {
      console.error('Critical error: Could not load any translation files')
      // Return minimal fallback object
      return {
        app: { name: "AfriKoin", tagline: "Buy & sell across Africa with trust" },
        common: { loading: "Loading...", error: "Error", language: "Language" },
        _meta: { rtl: false }
      }
    }
  }
}

// Initialize i18n with enhanced language detection
export const setupI18n = async (userLng?: string) => {
  // Detect user language with multiple fallback strategies
  const browserLng = navigator.language
  const storedLng = localStorage.getItem('afrikoin-language')
  
  let lng = userLng || storedLng || browserLng || 'en'
  
  // Enhanced language matching
  if (!supportedLngs.includes(lng)) {
    // Try language without region (e.g., 'en' from 'en-US')
    const baseLng = lng.split('-')[0]
    if (supportedLngs.includes(baseLng)) {
      lng = baseLng
    } else {
      // Try regional variants if available
      const regionalMatch = supportedLngs.find(lang => lang.startsWith(baseLng + '-'))
      lng = regionalMatch || 'en'
    }
  }
  
  console.log(`Initializing i18n with language: ${lng} (detected: ${browserLng}, stored: ${storedLng})`)

  // Load translation resources
  const resources: Record<string, Record<string, any>> = {}
  const bundle = await loadLocale(lng)
  resources[lng] = { common: bundle }

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: ['en', 'fr', 'ar'], // Multiple fallback languages
      resources,
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      supportedLngs,
      returnEmptyString: false,
      debug: process.env.NODE_ENV === 'development',
      // Enhanced error handling
      missingKeyHandler: (lng, ns, key) => {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
        return key // Return the key itself as fallback
      }
    })

  // Set document direction and language
  document.dir = bundle?._meta?.rtl ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
  
  // Store user preference
  localStorage.setItem('afrikoin-language', lng)

  return i18n
}

// Change language dynamically with enhanced error handling
export const changeLanguage = async (lng: string) => {
  if (!supportedLngs.includes(lng)) {
    console.warn(`Language ${lng} not supported`)
    return false
  }

  try {
    // Load new language resources
    const bundle = await loadLocale(lng)
    i18n.addResourceBundle(lng, 'common', bundle, true, true)
    
    // Change language
    await i18n.changeLanguage(lng)
    
    // Update document attributes
    document.dir = bundle?._meta?.rtl ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
    
    // Store preference
    localStorage.setItem('afrikoin-language', lng)
    
    console.log(`Successfully changed language to: ${lng}`)
    return true
  } catch (error) {
    console.error(`Failed to change language to ${lng}:`, error)
    return false
  }
}

// Get available languages for UI
export const getAvailableLanguages = () => {
  return languages.filter(lang => supportedLngs.includes(lang.code))
}

// Detect user's preferred language from various sources
export const detectUserLanguage = () => {
  // Priority: URL params > localStorage > navigator.language > default
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  const storedLang = localStorage.getItem('afrikoin-language')
  const browserLang = navigator.language
  
  return urlLang || storedLang || browserLang || 'en'
}

export { languages }
export default i18n