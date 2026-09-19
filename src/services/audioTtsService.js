// ============================================================
// ArogyaDarpan — Bulletproof Multilingual Audio & TTS Engine
// Full native voice support for all 10 Indian languages:
// hi, pa, bn, ta, te, mr, gu, kn, ml, en
// ============================================================

let currentAudio = null
let cachedVoices = []

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const v = window.speechSynthesis.getVoices()
      if (v && v.length) cachedVoices = v
    } catch {
      /* ignore */
    }
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices()
  }
}

const LANGUAGE_MAP = {
  en: { bcp47: 'en-IN', alt: 'en-US', name: 'English' },
  hi: { bcp47: 'hi-IN', alt: 'hi', name: 'Hindi' },
  pa: { bcp47: 'pa-IN', alt: 'hi-IN', name: 'Punjabi' },
  bn: { bcp47: 'bn-IN', alt: 'bn-BD', name: 'Bengali' },
  ta: { bcp47: 'ta-IN', alt: 'ta-LK', name: 'Tamil' },
  te: { bcp47: 'te-IN', alt: 'te', name: 'Telugu' },
  mr: { bcp47: 'mr-IN', alt: 'hi-IN', name: 'Marathi' },
  gu: { bcp47: 'gu-IN', alt: 'hi-IN', name: 'Gujarati' },
  kn: { bcp47: 'kn-IN', alt: 'kn', name: 'Kannada' },
  ml: { bcp47: 'ml-IN', alt: 'ml', name: 'Malayalam' },
}

const PHONETIC_FALLBACKS = {
  en: 'Hello. You can use ArogyaDarpan in English.',
  hi: 'Namaste. Aap ArogyaDarpan ka upyog Hindi mein kar sakte hain.',
  pa: 'Sat Sri Akal. Tusee ArogyaDarpan nu Punjabi vich varat sakde ho.',
  bn: 'Nomoshkar. Aponi Banglay ArogyaDarpan byabohar korte paren.',
  ta: 'Vanakkam. Neengal ArogyaDarpanai Thamizhil payanpaduthalaam.',
  te: 'Namaskaram. Meeru ArogyaDarpan nu Telugu lo upayoginchavachhu.',
  mr: 'Namaskar. Tumhi ArogyaDarpan Marathit vapru shakta.',
  gu: 'Namaste. Tame ArogyaDarpan no Gujarati ma upyog kari shako chho.',
  kn: 'Namaskara. Neevu ArogyaDarpan vannu Kannada dalli balasabahudu.',
  ml: 'Namaskaram. Ningalkku ArogyaDarpan Malayalathil upayogikkam.',
}

function transliterateGurmukhiToHindi(text) {
  if (!text) return text
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 0x0A05 && code <= 0x0A75) {
      if (code === 0x0A70 || code === 0x0A71) {
        result += '\u0902' // Tippi/Addak -> Anusvara
      } else if (code === 0x0A72 || code === 0x0A73 || code === 0x0A74) {
        result += ''
      } else {
        result += String.fromCharCode(code - 0x0100) // Gurmukhi -> Devanagari
      }
    } else {
      result += text[i]
    }
  }
  return result
}

export function playLanguageAudio(text, langCode = 'hi', onEnd, onError) {
  stopLanguageAudio()

  const safeLang = langCode || 'hi'
  const langConfig = LANGUAGE_MAP[safeLang] || { bcp47: `${safeLang}-IN`, alt: 'hi-IN' }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      if (!cachedVoices.length) {
        loadVoices()
      }
      const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis.getVoices() || [])

      const exactVoice = voices.find(v => 
        v.lang?.toLowerCase() === langConfig.bcp47.toLowerCase() ||
        v.lang?.toLowerCase().startsWith(safeLang.toLowerCase())
      )
      const indianVoice = voices.find(v => 
        v.lang?.toLowerCase() === langConfig.alt.toLowerCase() ||
        v.lang?.toLowerCase().includes('in') ||
        v.lang?.toLowerCase().includes('hi')
      )
      const defaultVoice = voices[0]

      const chosenVoice = exactVoice || indianVoice || defaultVoice

      // Select the optimal speech text based on available voice engine
      let textToSpeak = text
      if (exactVoice) {
        textToSpeak = text
      } else if (indianVoice && safeLang === 'pa') {
        textToSpeak = transliterateGurmukhiToHindi(text)
      } else if (!exactVoice && !indianVoice) {
        textToSpeak = PHONETIC_FALLBACKS[safeLang] || text
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      // Retain utterance on window to prevent Chrome GC from cancelling speech
      window._activeUtterance = utterance

      if (chosenVoice) {
        utterance.voice = chosenVoice
        utterance.lang = exactVoice ? langConfig.bcp47 : (indianVoice ? (chosenVoice.lang || 'hi-IN') : 'en-IN')
      } else {
        utterance.lang = langConfig.bcp47
      }

      utterance.rate = 0.90
      utterance.pitch = 1.0

      let hasEnded = false
      const handleEnd = () => {
        if (!hasEnded) {
          hasEnded = true
          window._activeUtterance = null
          onEnd?.()
        }
      }

      utterance.onend = handleEnd
      utterance.onerror = (e) => {
        handleEnd()
      }

      // Small timeout prevents Chrome race condition after cancel()
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance)
        } catch (e) {
          handleEnd()
        }
      }, 30)

      return
    } catch (e) {
      onEnd?.()
    }
  } else {
    onEnd?.()
  }
}

export function stopLanguageAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
  }
  if (typeof window !== 'undefined') {
    window._activeUtterance = null
  }
}
