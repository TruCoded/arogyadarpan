// ============================
// ArogyaDarpan — Multi-Parametric Clinical Triage & Risk Radar Engine
// ESI Level Classification, Risk Scoring, Conflict Detection, and Dynamic Question Branching
// ============================

import { evaluateClinicalRules } from '../data/clinicalRules'
import { extractMedicalEntities } from './medicalParserService'

/**
 * Perform comprehensive clinical triage analysis on patient interview responses & document records
 */
export function calculateClinicalTriage({ responses = [], documentExtractions = [], freeText = '', patientAge = null, patientGender = null }) {
  // Combine all text sources for holistic NLP extraction
  const combinedText = responses
    .map(r => `${r.question} ${r.originalResponse || r.structuredValue}`)
    .join(' ') + ' ' + freeText

  const parsed = extractMedicalEntities(combinedText)
  const rulesSignals = evaluateClinicalRules(responses)

  let riskScore = 15 // Base score
  let esiLevel = 5 // ESI 5 = Non-urgent, 1 = Resuscitation
  let priorityStatus = 'routine' // 'critical' | 'priority' | 'urgent' | 'routine'
  const detectedConflicts = []

  // Age-based cardiac risk adjustment
  const age = patientAge || (() => {
    try {
      const stored = localStorage.getItem('arogya_patient')
      if (stored) return parseInt(JSON.parse(stored).age, 10) || null
    } catch (e) { /* ignore */ }
    return null
  })()
  const gender = patientGender || (() => {
    try {
      const stored = localStorage.getItem('arogya_patient')
      if (stored) return JSON.parse(stored).gender?.toLowerCase() || null
    } catch (e) { /* ignore */ }
    return null
  })()

  if (age) {
    const isHighRiskAge = (gender === 'male' && age >= 55) || (gender === 'female' && age >= 65) || age >= 70
    if (isHighRiskAge) {
      riskScore += 10
      if (parsed.symptoms.some(s => s.category === 'cardiac')) {
        riskScore += 15 // Extra risk for cardiac symptoms in elderly
      }
    }
  }

  // Check cardiac red flag pattern
  const hasChestPain = parsed.symptoms.some(s => s.id === 'chest_pain')
  const hasBreathlessness = parsed.symptoms.some(s => s.id === 'breathlessness')
  const hasSweating = parsed.symptoms.some(s => s.id === 'sweating')
  const highSeverity = parsed.severityScore && parsed.severityScore >= 7

  if (hasChestPain && (hasBreathlessness || hasSweating || highSeverity)) {
    riskScore += 65
    esiLevel = 2 // ESI 2 Emergency
    priorityStatus = 'critical'
  } else if (hasChestPain || hasBreathlessness) {
    riskScore += 40
    esiLevel = 3
    priorityStatus = 'priority'
  } else if (parsed.symptoms.some(s => s.severity === 'high')) {
    riskScore += 30
    esiLevel = 3
    priorityStatus = 'urgent'
  }

  // Check Allergy Conflicts
  const allergyResponse = responses.find(r => r.questionId === 'allergies')
  const currentAllergyText = (allergyResponse?.originalResponse || String(allergyResponse?.structuredValue || '')).toLowerCase()
  const currentSaysNoAllergy = currentAllergyText.includes('none') || currentAllergyText.includes('no') || currentAllergyText.includes('nahi')

  // Search historical documents for recorded allergies
  let documentedAllergy = null
  for (const doc of documentExtractions) {
    if (doc.extractedData?.allergies && doc.extractedData.allergies.length > 0) {
      documentedAllergy = doc.extractedData.allergies[0]
      break
    }
    // Only use actual extracted allergy data — no hardcoded fallbacks
  }

  if (currentSaysNoAllergy && documentedAllergy) {
    detectedConflicts.push({
      id: 'conflict-allergy',
      type: 'allergy_conflict',
      severity: 'high',
      message: 'Allergy Information Conflict',
      detail: `Patient currently responded "No known allergy", but previous record (${documentedAllergy}) has a documented allergy.`,
      currentValue: 'No known allergy',
      previousValue: `${documentedAllergy} allergy documented`,
      source: 'conflict_detection',
      status: 'needs_review',
    })
    riskScore += 15
  }

  // Check Lab Result Alerts
  for (const lab of parsed.labResults) {
    if (lab.status === 'abnormal') {
      riskScore += 10
      rulesSignals.push({
        id: `lab-alert-${lab.key}`,
        type: 'abnormal_investigation',
        severity: lab.key === 'hba1c' && lab.value > 8.0 ? 'high' : 'medium',
        message: `Abnormal ${lab.name}`,
        detail: `${lab.name} is ${lab.value} ${lab.unit} (Normal: ${lab.normalRange}).`,
        source: 'document_extraction',
        status: 'active',
      })
    }
  }

  riskScore = Math.min(98, Math.max(10, riskScore))

  // Determine Dynamic Targeted Follow-Up Questions
  const dynamicQuestions = []
  if (parsed.symptoms.some(s => s.id === 'dysuria' || s.id === 'back_pain')) {
    dynamicQuestions.push({
      id: 'dyn_urinary_fever',
      question: 'Have you noticed any fever, chills, or blood in your urine?',
      type: 'yes_no',
      category: 'associated_symptoms',
      reason: 'Targeted follow-up for urinary/back pain symptoms',
    })
  }
  if (parsed.symptoms.some(s => s.id === 'stomach_pain')) {
    dynamicQuestions.push({
      id: 'dyn_gastro_vomit',
      question: 'Is the stomach pain accompanied by vomiting or inability to keep food down?',
      type: 'yes_no',
      category: 'associated_symptoms',
      reason: 'Targeted follow-up for abdominal pain',
    })
  }

  return {
    riskScore,
    esiLevel,
    esiDescription: esiLevel === 1 ? 'ESI Level 1 — Immediate Resuscitation' :
                   esiLevel === 2 ? 'ESI Level 2 — Emergency / Priority Review' :
                   esiLevel === 3 ? 'ESI Level 3 — Urgent Evaluation' :
                   esiLevel === 4 ? 'ESI Level 4 — Less Urgent' : 'ESI Level 5 — Non-Urgent',
    priorityStatus,
    signals: [...rulesSignals, ...detectedConflicts],
    detectedSymptoms: parsed.symptoms,
    detectedMedications: parsed.medications,
    detectedLabResults: parsed.labResults,
    detectedConflicts,
    dynamicQuestions,
  }
}
