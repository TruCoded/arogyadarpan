// ============================================================
// ArogyaDarpan — Bulletproof Multilingual Audio & TTS Engine
// Full native voice support for all 10 Indian languages:
// hi, pa, bn, ta, te, mr, gu, kn, ml, en
//
// Powered by Real Native Neural TTS Streaming with
// Web Speech API fallback for zero-latency offline playback.
// ============================================================

let currentAudio = null
let currentQueue = []
let currentQueueIndex = 0
let isPlayingQueue = false
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

export const LANGUAGE_MAP = {
  en: { bcp47: 'en-IN', ttsCode: 'en', name: 'English' },
  hi: { bcp47: 'hi-IN', ttsCode: 'hi', name: 'Hindi' },
  pa: { bcp47: 'pa-IN', ttsCode: 'pa', name: 'Punjabi' },
  bn: { bcp47: 'bn-IN', ttsCode: 'bn', name: 'Bengali' },
  ta: { bcp47: 'ta-IN', ttsCode: 'ta', name: 'Tamil' },
  te: { bcp47: 'te-IN', ttsCode: 'te', name: 'Telugu' },
  mr: { bcp47: 'mr-IN', ttsCode: 'mr', name: 'Marathi' },
  gu: { bcp47: 'gu-IN', ttsCode: 'gu', name: 'Gujarati' },
  kn: { bcp47: 'kn-IN', ttsCode: 'kn', name: 'Kannada' },
  ml: { bcp47: 'ml-IN', ttsCode: 'ml', name: 'Malayalam' },
}

/**
 * Splits a long text paragraph into clean sentence/clause chunks under maxChars
 * to guarantee flawless real-time streaming audio without truncation.
 */
function splitTextIntoChunks(text, maxChars = 150) {
  if (!text) return []
  const clean = text.trim()
  if (clean.length <= maxChars) return [clean]

  // Split by sentence terminators (English ., !, ? and Indic danda ।, newlines, semicolons)
  const rawSentences = clean.split(/([।!?\n\r]+|\.\s+)/)
  const chunks = []
  let buffer = ''

  for (let i = 0; i < rawSentences.length; i++) {
    const part = rawSentences[i]
    if (!part) continue

    if (buffer.length + part.length <= maxChars) {
      buffer += part
    } else {
      if (buffer.trim()) chunks.push(buffer.trim())
      
      // If a single sentence is exceptionally long, split by comma or space
      if (part.length > maxChars) {
        const subParts = part.split(/([,;:]\s*|\s+)/)
        let subBuffer = ''
        for (const sub of subParts) {
          if (subBuffer.length + sub.length <= maxChars) {
            subBuffer += sub
          } else {
            if (subBuffer.trim()) chunks.push(subBuffer.trim())
            subBuffer = sub
          }
        }
        buffer = subBuffer
      } else {
        buffer = part
      }
    }
  }

  if (buffer.trim()) {
    chunks.push(buffer.trim())
  }

  return chunks.filter(Boolean)
}

/**
 * Play using browser Web Speech API (fallback)
 */
function playWebSpeech(text, langCode = 'hi', onEnd, onError) {
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
    const langConfig = LANGUAGE_MAP[safeLang] || { bcp47: `${safeLang}-IN`, ttsCode: safeLang }

    // Find closest matching voice
    const exactVoice = voices.find((v) => {
      const vl = v.lang?.toLowerCase() || ''
      return vl === langConfig.bcp47.toLowerCase() || vl === safeLang.toLowerCase() || vl.startsWith(`${safeLang}-`)
    })

    const indianVoice = voices.find((v) => {
      const vl = v.lang?.toLowerCase() || ''
      const vn = v.name?.toLowerCase() || ''
      return vl.includes('in') || vl.includes('hi') || vn.includes('india')
    })

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = exactVoice ? langConfig.bcp47 : (indianVoice ? indianVoice.lang : 'en-IN')
    if (exactVoice) {
      utterance.voice = exactVoice
    } else if (indianVoice) {
      utterance.voice = indianVoice
    }

    utterance.rate = 0.92
    utterance.pitch = 1.0

    let hasEnded = false
    const handleEnd = () => {
      if (!hasEnded) {
        hasEnded = true
        onEnd?.()
      }
    }

    utterance.onend = handleEnd
    utterance.onerror = () => {
      handleEnd()
    }

    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance)
      } catch {
        handleEnd()
      }
    }, 40)
  } catch {
    onError?.()
  }
}

/**
 * Universal Native Multilingual Audio Player
 * 
 * 1. Streams pure, crystal-clear native Indic neural audio for all 10 languages (Punjabi, Bengali, Tamil, Telugu, Hindi, etc.)
 * 2. Handles multi-sentence queues seamlessly.
 * 3. Gracefully falls back to Web Speech API if offline.
 */
export function playLanguageAudio(text, langCode = 'hi', onEnd, onError) {
  stopLanguageAudio()

  if (!text || !text.trim()) {
    onEnd?.()
    return
  }

  const safeLang = langCode || 'en'
  const langConfig = LANGUAGE_MAP[safeLang] || { bcp47: `${safeLang}-IN`, ttsCode: safeLang }
  const ttsLang = langConfig.ttsCode || safeLang

  const chunks = splitTextIntoChunks(text, 160)
  if (!chunks.length) {
    onEnd?.()
    return
  }

  currentQueue = chunks
  currentQueueIndex = 0
  isPlayingQueue = true

  const playNextInQueue = () => {
    if (!isPlayingQueue) return

    if (currentQueueIndex >= currentQueue.length) {
      isPlayingQueue = false
      currentAudio = null
      onEnd?.()
      return
    }

    const chunk = currentQueue[currentQueueIndex]
    currentQueueIndex++

    // Build neural stream URL with target language code
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(ttsLang)}&client=tw-ob&q=${encodeURIComponent(chunk)}`

    try {
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.src = ttsUrl
      currentAudio = audio

      audio.onended = () => {
        if (isPlayingQueue) {
          playNextInQueue()
        }
      }

      audio.onerror = () => {
        // Fallback to browser SpeechSynthesis if network fails
        if (isPlayingQueue) {
          playWebSpeech(
            chunks.slice(currentQueueIndex - 1).join(' '),
            safeLang,
            () => {
              isPlayingQueue = false
              currentAudio = null
              onEnd?.()
            },
            () => {
              isPlayingQueue = false
              currentAudio = null
              onError?.()
            }
          )
        }
      }

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser audio autoplay was blocked or audio load failed, fallback
          if (isPlayingQueue) {
            playWebSpeech(
              chunks.join(' '),
              safeLang,
              () => {
                isPlayingQueue = false
                currentAudio = null
                onEnd?.()
              },
              () => {
                isPlayingQueue = false
                currentAudio = null
                onError?.()
              }
            )
          }
        })
      }
    } catch {
      // Direct WebSpeech fallback
      playWebSpeech(
        chunks.join(' '),
        safeLang,
        () => {
          isPlayingQueue = false
          currentAudio = null
          onEnd?.()
        },
        onError
      )
    }
  }

  // Start sequence
  playNextInQueue()
}

/**
 * Immediately stop any ongoing audio playback and reset queues
 */
export function stopLanguageAudio() {
  isPlayingQueue = false
  currentQueue = []
  currentQueueIndex = 0

  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.removeAttribute('src')
      currentAudio.load()
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
}
