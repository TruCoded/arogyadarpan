// ============================
// ArogyaDarpan — Multilingual Conversational AI Engine
// Natural conversational turns, multi-entity intake parsing, and dialogue continuation
// ============================

import { extractClinicalNLP } from './clinicalNlpEngine.js'

/**
 * Parses free natural language conversational speech and maps to interview answers
 * Example: "Pet mein pain hai aur kal se vomiting bhi ho rahi hai."
 * -> Complaint: Abdominal pain, Duration: 1 day, Associated: Vomiting
 * @param {string} userText - Spoken or typed natural language
 * @param {string} lang - 'hi' | 'en' | regional
 */
export function parseConversationalIntake(userText = '', lang = 'en') {
  const nlp = extractClinicalNLP(userText)

  // 1. Identify primary complaint
  let primaryComplaint = null
  if (nlp.symptoms.length > 0) {
    const firstSym = nlp.symptoms[0]
    // Map to system complaint key
    const mapping = {
      chest_pain: 'chest_pain',
      breathlessness: 'breathing',
      abdominal_pain: 'stomach_pain',
      fever: 'fever',
      cough: 'cough',
      headache: 'headache',
      dizziness: 'dizziness',
      vomiting: 'vomiting',
      joint_pain: 'back_pain',
      dysuria: 'burning_urine',
      fatigue: 'other',
    }
    primaryComplaint = {
      id: mapping[firstSym.id] || firstSym.id,
      label: firstSym.label,
      category: firstSym.category,
    }
  }

  // 2. Identify associated symptoms (symptoms besides primary complaint)
  const associatedSymptoms = nlp.symptoms
    .slice(primaryComplaint ? 1 : 0)
    .map(s => ({ id: s.id, label: s.label }))

  // If primary complaint was abdominal pain and vomiting was detected, vomiting is marked associated
  if (primaryComplaint?.id === 'stomach_pain' && nlp.symptoms.some(s => s.id === 'vomiting')) {
    if (!associatedSymptoms.some(s => s.id === 'vomiting')) {
      associatedSymptoms.push({ id: 'vomiting', label: 'Vomiting' })
    }
  }

  // 3. Generate conversational confirmation & next question
  const conversationalReply = generateConversationalReply({
    complaint: primaryComplaint?.label || 'your symptoms',
    duration: nlp.temporal || 'recently',
    associated: associatedSymptoms.map(s => s.label).join(', '),
    lang,
  })

  return {
    rawTranscript: userText,
    primaryComplaint,
    duration: nlp.temporal,
    associatedSymptoms,
    diseases: nlp.diseases,
    medications: nlp.medications,
    severity: nlp.severity,
    confidence: nlp.confidence,
    conversationalReply,
  }
}

/**
 * Generate natural clinical conversational response in patient's language
 */
export function generateConversationalReply({ complaint, duration, associated, lang = 'en' }) {
  const isHindi = lang === 'hi'

  if (isHindi) {
    const assocText = associated ? ` और साथ में ${associated} की परेशानी है` : ''
    const durText = duration ? `${duration} से ` : ''
    return `समझ गया: आपको ${durText}${complaint} हो रहा है${assocText}। मैं इसके बारे में कुछ ज़रूरी सवाल पूछूँगा ताकि डॉक्टर आपकी सही जाँच कर सकें।`
  }

  // English default
  const assocText = associated ? ` accompanied by ${associated}` : ''
  const durText = duration ? ` for ${duration}` : ''
  return `Understood: you have been experiencing ${complaint}${durText}${assocText}. I will ask you a few targeted questions to prepare your clinical summary for the doctor.`
}
