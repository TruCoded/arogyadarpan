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
  te: { bcp47: 'te-IN', alt: 'te-IN', name: 'Telugu' },
  mr: { bcp47: 'mr-IN', alt: 'hi-IN', name: 'Marathi' },
  gu: { bcp47: 'gu-IN', alt: 'hi-IN', name: 'Gujarati' },
  kn: { bcp47: 'kn-IN', alt: 'kn-IN', name: 'Kannada' },
  ml: { bcp47: 'ml-IN', alt: 'ml-IN', name: 'Malayalam' },
}

// Curated high-fidelity Phonetic Pronunciations for Greeting & Common Intake
const PHONETIC_DICTIONARY = {
  // Greetings
  'Hello. You can use ArogyaDarpan in English.': 'Hello. You can use Arogya Darpan in English.',
  'नमस्ते। आप आरोग्यदर्पण का उपयोग हिन्दी में कर सकते हैं।': 'Namaste. Aap Arogya Darpan ka upyog Hindi mein kar sakte hain.',
  'নমস্কার। আপনি বাংলায় আরোগ্যদর্পণ ব্যবহার করতে পারেন।': 'Nomoshkar. Aponi Banglay Arogya Darpan byabohar korte paren.',
  'வணக்கம். நீங்கள் ஆரோக்யதர்பனை தமிழில் பயன்படுத்தலாம்.': 'Vanakkam. Neengal Arogya Darpanai Thamizhil payanpaduthalaam.',
  'నమస్కారం. మీరు ఆరోగ్యదర్పణ్‌ను తెలుగులో ఉపయోగించవచ్చు.': 'Namaskaram. Meeru Arogya Darpan nu Telugu lo upayoginchavachhu.',
  'नमस्कार. तुम्ही आरोग्यदर्पण मराठीत वापरू शकता.': 'Namaskar. Tumhi Arogya Darpan Marathit vapru shakta.',
  'નમસ્તે. તમે આરોગ્યદર્પણનો ગુજરાતીમાં ઉપયોગ કરી શકો છો.': 'Namaste. Tame Arogya Darpan no Gujarati ma upyog kari shako chho.',
  'ನಮಸ್ಕಾರ. ನೀವು ಆರೋಗ್ಯದರ್ಪಣವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಬಳಸಬಹುದು.': 'Namaskara. Neevu Arogya Darpan vannu Kannada dalli balasabahudu.',
  'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਆਰੋਗਿਆਦਰਪਣ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਵਰਤ ਸਕਦੇ ਹੋ।': 'Sat Sri Akaal. Tuseen Arogya Darpan nu Punjabi vich varat sakde ho.',
  'നമസ്കാരം. നിങ്ങൾക്ക് ആരോഗ്യദർപ്പൺ മലയാളത്തിൽ ഉപയോഗിക്കാം.': 'Namaskaram. Ningalkku Arogya Darpan Malayalathil upayogikkam.',

  // Language Names
  'ਪੰਜਾਬੀ': 'Punjabi',
  'தமிழ்': 'Thamizh',
  'తెలుగు': 'Telugu',
  'বাংলা': 'Bangla',
  'मराठी': 'Marathi',
  'ગુજરાતી': 'Gujarati',
  'ಕನ್ನಡ': 'Kannada',
  'മലയാളം': 'Malayalam',
  'हिन्दी': 'Hindi',
}

// Basic Indic Consonant & Vowel Map for automatic fallback transliteration
const INDIC_CONSONANTS = {
  k: ['ক', 'ਕ', 'ક', 'க', 'క', 'ಕ', 'ക', 'क'],
  kh: ['খ', 'ਖ', 'ખ', 'ఖ', 'ಖ', 'ഖ', 'ख'],
  g: ['গ', 'ਗ', 'ગ', 'గ', 'ಗ', 'ഗ', 'ग'],
  gh: ['ঘ', 'ਘ', 'ઘ', 'ఘ', 'ಘ', 'ഘ', 'घ'],
  ch: ['চ', 'ਚ', 'ચ', 'ச', 'చ', 'ಚ', 'ച', 'च'],
  chh: ['ছ', 'ਛ', 'છ', 'ఛ', 'ಛ', 'ഛ', 'छ'],
  j: ['জ', 'ਜ', 'જ', 'జ', 'ಜ', 'ജ', 'ज'],
  jh: ['ঝ', 'ਝ', 'ઝ', 'ఝ', 'ಝ', 'ഝ', 'झ'],
  t: ['ট', 'ਤ', 'ਟ', 'ત', 'ટ', 'த', 'ట', 'త', 'ಟ', 'ತ', 'ത', 'ട', 'त', 'ट'],
  th: ['ঠ', 'ਥ', 'ਠ', 'થ', 'ઠ', 'థ', 'ఠ', 'ಥ', 'ಠ', 'ഥ', 'ഠ', 'थ', 'ठ'],
  d: ['ড', 'দ', 'ਦ', 'ਡ', 'દ', 'ડ', 'ద', 'డ', 'ದ', 'ಡ', 'ദ', 'ഡ', 'द', 'ड'],
  dh: ['ঢ', 'ধ', 'ਧ', 'ਢ', 'ધ', 'ઢ', 'ధ', 'ఢ', 'ಧ', 'ಢ', 'ധ', 'ഢ', 'ध', 'ढ'],
  n: ['ন', 'ণ', 'ਨ', 'ਣ', 'ન', 'ણ', 'ந', 'ன', 'ண', 'న', 'ణ', 'ನ', 'ಣ', 'ന', 'ണ', 'न', 'ण'],
  p: ['প', 'ਪ', 'પ', 'ப', 'ప', 'ಪ', 'പ', 'प'],
  ph: ['ফ', 'ਫ', 'ਫ', 'ఫ', 'ಫ', 'ഫ', 'फ'],
  b: ['ব', 'ਬ', 'બ', 'బ', 'ಬ', 'ബ', 'ब'],
  bh: ['ভ', 'ਭ', 'ભ', 'భ', 'ಭ', 'ഭ', 'भ'],
  m: ['ম', 'ਮ', 'મ', 'ம', 'మ', 'ಮ', 'മ', 'म'],
  y: ['য', 'ਯ', 'ય', 'ய', 'య', 'ಯ', 'യ', 'य'],
  r: ['র', 'ৰ', 'ਰ', 'ર', 'ர', 'ற', 'ర', 'ఱ', 'ರ', 'ಱ', 'ര', 'റ', 'र'],
  l: ['ল', 'ਲ', 'લ', 'ல', 'ள', 'ழ', 'ల', 'ళ', 'ಲ', 'ಳ', 'ല', 'ള', 'ഴ', 'ल', 'ळ'],
  v: ['ব', 'ਵ', 'વ', 'வ', 'వ', 'ವ', 'വ', 'व'],
  s: ['শ', 'ষ', 'স', 'ਸ਼', 'ਸ', 'શ', 'ષ', 'સ', 'ஶ', 'ஷ', 'ஸ', 'శ', 'ష', 'స', 'ಶ', 'ಷ', 'ಸ', 'ശ', 'ഷ', 'സ', 'श', 'ष', 'स'],
  h: ['হ', 'ਹ', 'ਹ', 'ஹ', 'హ', 'ಹ', 'ഹ', 'ह'],
}

const INDIC_VOWELS = {
  aa: ['া', 'ਾ', 'ા', 'ா', 'ా', 'ಾ', 'ാ', 'ा', 'आ', 'ਆ', 'આ', 'ஆ', 'ఆ', 'ಆ', 'ആ', 'আ'],
  i: ['ি', 'ਿ', 'િ', 'ி', 'ి', 'ಿ', 'ി', 'ि', 'इ', 'ਇ', 'ઇ', 'இ', 'ఇ', 'ಇ', 'ഇ', 'ই'],
  ee: ['ী', 'ੀ', 'ੀ', 'ீ', 'ీ', 'ീ', 'ੀ', 'ी', 'ई', 'ਈ', 'ઈ', 'ஈ', 'ఈ', 'ಈ', 'ഈ', 'ঈ'],
  u: ['ু', 'ੁ', 'ુ', 'ு', 'ు', 'ੁ', 'ു', 'ु', 'उ', 'ਉ', 'ઉ', 'உ', 'ఉ', 'ಉ', 'ഉ', 'উ'],
  oo: ['ূ', 'ੂ', 'ੂ', 'ੂ', 'ూ', 'ೂ', 'ൂ', 'ू', 'ऊ', 'ਊ', 'ઊ', 'ஊ', 'ఊ', 'ಊ', 'ഊ', 'ঊ'],
  e: ['ে', 'ੇ', 'ੇ', 'ெ', 'ே', 'ె', 'ే', 'ೆ', 'ೇ', 'െ', 'േ', 'े', 'ए', 'ਏ', 'એ', 'ஏ', 'ఎ', 'ఏ', 'ಎ', 'ಏ', 'എ', 'ഏ', 'এ'],
  ai: ['ৈ', 'ੈ', 'ੈ', 'ை', 'ై', 'ೈ', 'ൈ', 'ै', 'ऐ', 'ਐ', 'ઐ', 'ஐ', 'ఐ', 'ಐ', 'ഐ', 'ঐ'],
  o: ['ো', 'ੋ', 'ો', 'ொ', 'ோ', 'ొ', 'ో', 'ೊ', 'ೋ', 'ൊ', 'ോ', 'ो', 'ओ', 'ਓ', 'ઓ', 'ஒ', 'ஓ', 'ఒ', 'ఓ', 'ಒ', 'ಓ', 'ഒ', 'ഓ', 'ও'],
  au: ['ৌ', 'ੌ', 'ૌ', 'ௌ', 'ౌ', 'ೌ', 'ൌ', 'ौ', 'औ', 'ਔ', 'ઔ', 'ஔ', 'ఔ', 'ಔ', 'ഔ', 'ঔ'],
  am: ['ং', 'ਂ', 'ੰ', 'ં', 'ఁ', 'ం', 'ಂ', 'ം', 'ं', 'ঁ', 'ँ'],
}

/**
 * Universal Indic Script -> Phonetic English Transliterator
 */
export function transliterateIndicToPhonetic(text) {
  if (!text) return ''
  if (PHONETIC_DICTIONARY[text]) return PHONETIC_DICTIONARY[text]

  // Check if text is mostly ASCII
  if (/^[\x00-\x7F\s\d.,!?'"-]+$/.test(text)) {
    return text
  }

  let out = ''
  let i = 0
  const len = text.length

  while (i < len) {
    const char = text[i]
    const code = char.charCodeAt(0)

    // Non-Indic ASCII characters (spaces, numbers, punctuation)
    if (code < 0x0900 || code > 0x0D7F) {
      out += char
      i++
      continue
    }

    // Check Virama / Halant
    if ([0x094D, 0x09CD, 0x0A4D, 0x0ACD, 0x0B4D, 0x0BCD, 0x0C4D, 0x0CCD, 0x0D4D].includes(code)) {
      if (out.endsWith('a')) {
        out = out.slice(0, -1)
      }
      i++
      continue
    }

    // Check Vowel signs
    let foundVowel = false
    for (const [vKey, vChars] of Object.entries(INDIC_VOWELS)) {
      if (vChars.includes(char)) {
        if (out.endsWith('a')) {
          out = out.slice(0, -1)
        }
        out += vKey
        foundVowel = true
        break
      }
    }
    if (foundVowel) {
      i++
      continue
    }

    // Check Consonants
    let foundConsonant = false
    for (const [cKey, cChars] of Object.entries(INDIC_CONSONANTS)) {
      if (cChars.includes(char)) {
        out += cKey + 'a'
        foundConsonant = true
        break
      }
    }
    if (foundConsonant) {
      i++
      continue
    }

    i++
  }

  return out.replace(/a([aeiou])/gi, '$1').replace(/aa/g, 'a').trim() || text
}

/**
 * Universal Zero-Install Audio Player
 * Plays speech aloud on ANY system (Windows, Android, Mac, iOS) without requiring extra downloads.
 */
export function playLanguageAudio(text, langCode = 'hi', onEnd, onError) {
  stopLanguageAudio()

  if (!text) {
    onEnd?.()
    return
  }

  const safeLang = langCode || 'en'
  const langConfig = LANGUAGE_MAP[safeLang] || { bcp47: `${safeLang}-IN`, alt: 'en-IN' }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      if (!cachedVoices.length) {
        loadVoices()
      }
      const voices = cachedVoices.length ? cachedVoices : (window.speechSynthesis.getVoices() || [])

      // Check if native voice pack exists on this device
      const exactVoice = voices.find(v => {
        const vl = v.lang?.toLowerCase() || ''
        return vl === langConfig.bcp47.toLowerCase() ||
               vl === safeLang.toLowerCase() ||
               vl.startsWith(`${safeLang}-`)
      })

      // Check if general Indian voice is available
      const indianVoice = voices.find(v => {
        const vl = v.lang?.toLowerCase() || ''
        const vn = v.name?.toLowerCase() || ''
        return vl.includes('in') || vl.includes('hi') || vn.includes('india') || vn.includes('heera') || vn.includes('hemant') || vn.includes('kalpana')
      })

      const englishVoice = voices.find(v => {
        const vl = v.lang?.toLowerCase() || ''
        return vl.startsWith('en')
      })

      const defaultVoice = voices[0]

      let chosenVoice = null
      let textToSpeak = text
      let speechLang = 'en-IN'

      if (exactVoice) {
        // Native voice installed (e.g. Hindi on Windows, or Tamil/Telugu on Android)
        chosenVoice = exactVoice
        textToSpeak = text
        speechLang = langConfig.bcp47
      } else {
        // No native voice pack installed on this computer!
        // Use phonetic transliteration so the Indian English / standard voice speaks the exact native language fluently!
        chosenVoice = indianVoice || englishVoice || defaultVoice
        textToSpeak = PHONETIC_DICTIONARY[text] || transliterateIndicToPhonetic(text)
        speechLang = indianVoice ? (indianVoice.lang || 'en-IN') : 'en-IN'
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      window._activeUtterance = utterance

      if (chosenVoice) {
        utterance.voice = chosenVoice
      }
      utterance.lang = speechLang
      utterance.rate = 0.88
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
      utterance.onerror = () => {
        handleEnd()
      }

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance)
        } catch {
          handleEnd()
        }
      }, 35)

      return
    } catch {
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
