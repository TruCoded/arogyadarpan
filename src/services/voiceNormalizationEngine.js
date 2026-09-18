// ============================
// ArogyaDarpan — Multilingual Voice Normalization Engine
// Normalizes spoken audio (English, Hindi, Hinglish, regional) into structured question answers
// Dual Input System: Voice & Touch mapped to the exact same clinical ontology
// ============================

const YES_ALIASES = [
  'yes', 'yeah', 'yep', 'yup', 'sure', 'true', 'correct', 'affirmative',
  'haan', 'ha', 'ji haan', 'sahi', 'bilkul', 'avashya', 'ho', 'hnn',
  'haaji', 'thik', 'hain', 'aam', 'sarikku', 'avunu', 'hoy'
]

const NO_ALIASES = [
  'no', 'nah', 'nope', 'negative', 'false', 'none', 'never',
  'nahi', 'na', 'kabhi nahi', 'bilkul nahi', 'naahi', 'illai', 'kaadhu',
  'nathi', 'illa', 'illaa'
]

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  shunya: 0, ek: 1, do: 2, teen: 3, char: 4, paanch: 5, chhah: 6, saat: 7, aath: 8, nau: 9, das: 10,
  ekam: 1, onru: 1, rendu: 2, rendu: 2, moondru: 3, naalu: 4, ainthu: 5, aaru: 6, ezhu: 7, ettu: 8, ombathu: 9, pathu: 10
}

const COMPLAINT_ALIASES = {
  chest_pain: ['chest pain', 'chest', 'pain in chest', 'seene me dard', 'seena dard', 'chaati me dard', 'heart pain', 'heart', 'dil me dard'],
  fever: ['fever', 'temperature', 'bukhar', 'bukhaar', 'body hot', 'taap', 'jwar', 'kaachal'],
  cough: ['cough', 'cold', 'khansi', 'khaasi', 'khasi', 'coughing', 'irumal', 'daggulu'],
  stomach_pain: ['stomach pain', 'belly pain', 'pet dard', 'pet me dard', 'abdominal pain', 'abdomen', 'acidity', 'gas', 'vayiru vali'],
  headache: ['headache', 'head pain', 'sir dard', 'sar me dard', 'matha dard', 'thala vali', 'thalanoppi'],
  back_pain: ['back pain', 'lower back', 'kamar dard', 'peeth me dard', 'spine pain', 'nadumu noppi', 'mudhugu vali'],
  breathing: ['breathing difficulty', 'breathless', 'short of breath', 'saans lene me takleef', 'saans phoolna', 'asthma', 'moochu thinaran']
}

/**
 * Normalizes raw spoken transcript into the structured data format expected by currentQuestion
 *
 * @param {string} transcript - Spoken user speech
 * @param {Object} question - The active question object from questionBank
 * @returns {Object|null} { structuredValue, confidence, explanation, matchedOption }
 */
export function normalizeVoiceInput(transcript, question) {
  if (!transcript || !question) return null

  const clean = transcript.trim().toLowerCase()
  const qType = question.type

  // 1. Yes / No Question Normalization
  if (qType === 'yes_no') {
    const words = clean.split(/\s+/)
    for (const w of words) {
      if (YES_ALIASES.includes(w)) {
        return {
          structuredValue: 'yes',
          confidence: 0.96,
          explanation: `Spoken "${transcript}" matched Affirmative (Yes)`,
          matchedOption: 'yes'
        }
      }
      if (NO_ALIASES.includes(w)) {
        return {
          structuredValue: 'no',
          confidence: 0.96,
          explanation: `Spoken "${transcript}" matched Negative (No)`,
          matchedOption: 'no'
        }
      }
    }
  }

  // 2. Chief Complaint Select Normalization
  if (qType === 'complaint_select') {
    for (const [complaintId, aliases] of Object.entries(COMPLAINT_ALIASES)) {
      if (aliases.some(alias => clean.includes(alias))) {
        return {
          structuredValue: complaintId,
          confidence: 0.95,
          explanation: `Spoken "${transcript}" matched complaint "${complaintId.replace(/_/g, ' ')}"`,
          matchedOption: complaintId
        }
      }
    }
  }

  // 3. Numeric Keypad / Range Slider Normalization
  if (qType === 'number') {
    // Check for digits first (e.g. "7", "8/10", "5")
    const digitMatch = clean.match(/\b([1-9]|10)\b/)
    if (digitMatch) {
      const num = parseInt(digitMatch[1], 10)
      return {
        structuredValue: num,
        confidence: 0.98,
        explanation: `Spoken "${transcript}" parsed as numeric value ${num}`,
        matchedOption: num
      }
    }

    // Check for spoken words (e.g. "seven", "paanch", "das")
    const words = clean.split(/\s+/)
    for (const w of words) {
      if (NUMBER_WORDS[w] !== undefined) {
        return {
          structuredValue: NUMBER_WORDS[w],
          confidence: 0.94,
          explanation: `Spoken word "${w}" normalized to integer ${NUMBER_WORDS[w]}`,
          matchedOption: NUMBER_WORDS[w]
        }
      }
    }
  }

  // 4. Single Select / Dropdown Normalization
  if ((qType === 'single_select' || qType === 'dropdown' || qType === 'select') && question.options) {
    for (const opt of question.options) {
      const labelEn = (opt.label || '').toLowerCase()
      const labelHi = (opt.labelHi || '').toLowerCase()
      const val = (opt.value || '').toLowerCase()

      if (clean.includes(val) || clean.includes(labelEn) || (labelHi && clean.includes(labelHi))) {
        return {
          structuredValue: opt.value,
          confidence: 0.94,
          explanation: `Spoken "${transcript}" matched option "${opt.label}"`,
          matchedOption: opt.value
        }
      }

      // Individual keyword check
      const optKeywords = labelEn.split(/[\s/()]+/).filter(k => k.length > 3)
      if (optKeywords.some(k => clean.includes(k))) {
        return {
          structuredValue: opt.value,
          confidence: 0.88,
          explanation: `Spoken "${transcript}" matched keyword in "${opt.label}"`,
          matchedOption: opt.value
        }
      }
    }
  }

  // 5. Multi-Select Checkboxes Normalization
  if (qType === 'multi_select' && question.options) {
    const matchedValues = []
    for (const opt of question.options) {
      const labelEn = (opt.label || '').toLowerCase()
      const labelHi = (opt.labelHi || '').toLowerCase()
      const val = (opt.value || '').toLowerCase()

      if (clean.includes(val) || clean.includes(labelEn) || (labelHi && clean.includes(labelHi))) {
        matchedValues.push(opt.value)
      } else {
        const keywords = labelEn.split(/[\s/()]+/).filter(k => k.length > 3)
        if (keywords.some(k => clean.includes(k))) {
          matchedValues.push(opt.value)
        }
      }
    }

    if (matchedValues.length > 0) {
      return {
        structuredValue: matchedValues,
        confidence: 0.92,
        explanation: `Spoken "${transcript}" matched ${matchedValues.length} item(s)`,
        matchedOption: matchedValues
      }
    }
  }

  // Fallback for free text
  return {
    structuredValue: transcript,
    confidence: 0.85,
    explanation: `Captured as free text response`,
    matchedOption: null
  }
}
