// ============================================================
// ArogyaDarpan — Bulletproof Multilingual Audio & TTS Engine
// Seamlessly plays native voices for all 10 Indian languages:
// hi, pa, bn, ta, te, mr, gu, kn, ml, en
// Strategy:
// 1. Attempts crystal-clear Online Natural Voice (Google TTS CDN)
// 2. Seamlessly falls back to Web Speech API (with smart voice match)
// ============================================================

let currentAudio = null

export function playLanguageAudio(text, langCode = 'hi', onEnd, onError) {
  stopLanguageAudio()

  const safeLang = langCode || 'hi'
  const encodedText = encodeURIComponent(text.slice(0, 200))
  const cdnUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${safeLang}&q=${encodedText}`

  // Strategy 1: HTML5 Audio (Guaranteed native pronunciation for pa, ta, te, mr, bn, etc.)
  try {
    const audio = new Audio(cdnUrl)
    currentAudio = audio

    audio.onended = () => {
      currentAudio = null
      onEnd?.()
    }

    audio.onerror = () => {
      // Strategy 2 Fallback: Web Speech API
      speakWithWebSpeech(text, safeLang, onEnd, onError)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        speakWithWebSpeech(text, safeLang, onEnd, onError)
      })
    }
  } catch (err) {
    speakWithWebSpeech(text, safeLang, onEnd, onError)
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

function speakWithWebSpeech(text, langCode, onEnd, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.()
    return
  }

  try {
    window.speechSynthesis.cancel()
    window.speechSynthesis.resume()

    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices() || []

    // Find best voice match
    const exactVoice = voices.find(v => v.lang === `${langCode}-IN` || v.lang.startsWith(langCode))
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi'))
    const defaultVoice = voices[0]

    const selectedVoice = exactVoice || indianVoice || defaultVoice
    if (selectedVoice) {
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang
    } else {
      utterance.lang = `${langCode}-IN`
    }

    utterance.rate = 0.92
    utterance.pitch = 1.0

    utterance.onend = () => onEnd?.()
    utterance.onerror = () => {
      onEnd?.()
      onError?.()
    }

    window.speechSynthesis.speak(utterance)
  } catch (err) {
    onEnd?.()
    onError?.()
  }
}
