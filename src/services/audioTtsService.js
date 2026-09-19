// ============================================================
// ArogyaDarpan — Universal Multilingual Audio & Speech Engine
// Full native voice support for all 10 Indian languages:
// hi, pa, bn, ta, te, mr, gu, kn, ml, en
// ============================================================

let cachedVoices = []
let activeUtterances = []
let isSpeaking = false

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

export const LANGUAGE_MAP = {
  en: { bcp47: 'en-IN', name: 'English' },
  hi: { bcp47: 'hi-IN', name: 'Hindi' },
  pa: { bcp47: 'pa-IN', name: 'Punjabi' },
  bn: { bcp47: 'bn-IN', name: 'Bengali' },
  ta: { bcp47: 'ta-IN', name: 'Tamil' },
  te: { bcp47: 'te-IN', name: 'Telugu' },
  mr: { bcp47: 'mr-IN', name: 'Marathi' },
  gu: { bcp47: 'gu-IN', name: 'Gujarati' },
  kn: { bcp47: 'kn-IN', name: 'Kannada' },
  ml: { bcp47: 'ml-IN', name: 'Malayalam' },
}

/**
 * Splits long text paragraphs into clean sentences to avoid
 * Chrome Web Speech API 15-second cutoff bug.
 */
function splitIntoSentences(text) {
  if (!text) return []
  const clean = text.trim()
  const sentences = clean.split(/([।!?\n\r]+|\.\s+)/)
  const result = []
  let buffer = ''

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i]
    if (!part) continue

    buffer += part
    if (/[।!?\n\r.]/.test(part) || buffer.length > 120) {
      if (buffer.trim()) result.push(buffer.trim())
      buffer = ''
    }
  }

  if (buffer.trim()) {
    result.push(buffer.trim())
  }

  return result.filter(Boolean)
}

/**
 * Universal Multilingual Audio & Speech Player
 */
export function playLanguageAudio(text, langCode = 'hi', onEnd, onError) {
  stopLanguageAudio()

  if (!text || !text.trim()) {
    onEnd?.()
    return
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.()
    return
  }

  try {
    window.speechSynthesis.cancel()
    window.speechSynthesis.resume()

    if (!cachedVoices.length) loadVoices()
    const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis.getVoices() || [])

    const safeLang = langCode || 'en'
    const langConfig = LANGUAGE_MAP[safeLang] || { bcp47: `${safeLang}-IN` }
    const bcp47Lower = langConfig.bcp47.toLowerCase()

    // Find voice matching target language (e.g. pa, pa-IN, hi, hi-IN, etc.)
    const exactVoice = voices.find((v) => {
      const vl = (v.lang || '').toLowerCase().replace(/_/g, '-')
      return vl === bcp47Lower || vl.startsWith(`${safeLang}-`) || vl === safeLang
    })

    const chunks = splitIntoSentences(text)
    if (!chunks.length) {
      onEnd?.()
      return
    }

    isSpeaking = true
    let chunkIndex = 0

    const speakNextChunk = () => {
      if (!isSpeaking || chunkIndex >= chunks.length) {
        isSpeaking = false
        onEnd?.()
        return
      }

      const chunkText = chunks[chunkIndex]
      chunkIndex++

      const utterance = new SpeechSynthesisUtterance(chunkText)
      utterance.lang = langConfig.bcp47
      if (exactVoice) {
        utterance.voice = exactVoice
      }
      utterance.rate = 0.92
      utterance.pitch = 1.0

      utterance.onend = () => {
        if (isSpeaking) {
          speakNextChunk()
        }
      }

      utterance.onerror = () => {
        if (isSpeaking) {
          speakNextChunk()
        }
      }

      activeUtterances.push(utterance)

      try {
        window.speechSynthesis.speak(utterance)
      } catch {
        isSpeaking = false
        onError?.()
      }
    }

    setTimeout(() => {
      speakNextChunk()
    }, 40)
  } catch {
    isSpeaking = false
    onError?.()
  }
}

/**
 * Immediately stops all speech playback
 */
export function stopLanguageAudio() {
  isSpeaking = false
  activeUtterances = []

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
  }
}
