// ============================================================
// ArogyaDarpan — Bulletproof Multilingual Audio & TTS Engine
// Full native voice support for all 10 Indian languages:
// hi, pa, bn, ta, te, mr, gu, kn, ml, en
// ============================================================

let currentAudio = null
let cachedVoices = []

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices() || []
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices() || []
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

  // Strategy 1: Web Speech API (Fastest & direct on user click gesture)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis.getVoices() || [])

      const exactVoice = voices.find(v => 
        v.lang.toLowerCase() === langConfig.bcp47.toLowerCase() ||
        v.lang.toLowerCase().startsWith(safeLang.toLowerCase())
      )
      const altVoice = voices.find(v => 
        v.lang.toLowerCase() === langConfig.alt.toLowerCase() ||
        v.lang.toLowerCase().includes('in') ||
        v.lang.toLowerCase().includes('hi')
      )
      const defaultVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi')) || voices[0]

      const chosenVoice = exactVoice || altVoice || defaultVoice

      // If Punjabi (or other Indic script) lacks an offline voice pack in Windows, transliterate for the Indian voice
      let textToSpeak = text
      if (safeLang === 'pa' && !exactVoice) {
        textToSpeak = transliterateGurmukhiToHindi(text)
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      if (chosenVoice) {
        utterance.voice = chosenVoice
        utterance.lang = exactVoice ? langConfig.bcp47 : (chosenVoice.lang || 'hi-IN')
      } else {
        utterance.lang = langConfig.bcp47
      }

      utterance.rate = 0.92
      utterance.pitch = 1.0

      let hasFinished = false
      utterance.onend = () => {
        if (!hasFinished) {
          hasFinished = true
          onEnd?.()
        }
      }

      utterance.onerror = (e) => {
        if (!hasFinished) {
          hasFinished = true
          playOnlineAudio(text, safeLang, onEnd, onError)
        }
      }

      window.speechSynthesis.speak(utterance)
      return
    } catch (e) {
      // Fallback
    }
  }

  // Strategy 2: HTML5 Audio Online CDN
  playOnlineAudio(text, safeLang, onEnd, onError)
}

function playOnlineAudio(text, safeLang, onEnd, onError) {
  try {
    const encodedText = encodeURIComponent(text.slice(0, 200))
    const cdnUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${safeLang}&q=${encodedText}`
    const audio = new Audio(cdnUrl)
    currentAudio = audio

    audio.onended = () => {
      currentAudio = null
      onEnd?.()
    }
    audio.onerror = () => {
      currentAudio = null
      onEnd?.()
      onError?.()
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        currentAudio = null
        onEnd?.()
        onError?.()
      })
    }
  } catch (err) {
    onEnd?.()
    onError?.()
  }
}

export function stopLanguageAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch (e) {
      /* ignore */
    }
    currentAudio = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch (e) {
      /* ignore */
    }
  }
}
