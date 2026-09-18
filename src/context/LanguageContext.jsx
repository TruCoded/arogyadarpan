import { createContext, useContext, useState, useEffect } from 'react'
import translations, { t as translateHelper } from '../data/translations'

export const SUPPORTED_LANGUAGES = [
  { id: 'en', label: 'English', native: 'English', flag: '🇬🇧', speechLocale: 'en-IN', region: 'Pan-India' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', speechLocale: 'hi-IN', region: 'North / Central India' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳', speechLocale: 'bn-IN', region: 'West Bengal / Tripura' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', speechLocale: 'ta-IN', region: 'Tamil Nadu' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', speechLocale: 'te-IN', region: 'Andhra / Telangana' },
  { id: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳', speechLocale: 'mr-IN', region: 'Maharashtra' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', speechLocale: 'gu-IN', region: 'Gujarat' },
  { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', speechLocale: 'kn-IN', region: 'Karnataka' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechLocale: 'pa-IN', region: 'Punjab' },
  { id: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', speechLocale: 'ml-IN', region: 'Kerala' },
]

const LanguageContext = createContext({
  lang: 'en',
  setLanguage: () => {},
  t: (key) => key,
  languages: SUPPORTED_LANGUAGES,
  currentLanguageMeta: SUPPORTED_LANGUAGES[0],
  speechLocale: 'en-IN',
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('arogya_language') || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('arogya_language', lang)
      document.documentElement.lang = lang
    } catch (e) {
      console.warn('Could not save language to storage', e)
    }
  }, [lang])

  const setLanguage = (newLang) => {
    if (SUPPORTED_LANGUAGES.some(l => l.id === newLang)) {
      setLang(newLang)
    }
  }

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.id === lang) || SUPPORTED_LANGUAGES[0]
  const speechLocale = currentLanguageMeta.speechLocale || 'en-IN'

  const t = (key, fallback) => {
    return translateHelper(key, lang) || fallback || key
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
        speechLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      lang: 'en',
      setLanguage: () => {},
      t: (key) => translateHelper(key, 'en'),
      languages: SUPPORTED_LANGUAGES,
      currentLanguageMeta: SUPPORTED_LANGUAGES[0],
      speechLocale: 'en-IN',
    }
  }
  return context
}

export default LanguageContext
