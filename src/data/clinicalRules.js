// ============================
// ArogyaDarpan — Clinical Red-Flag Rules
// Deterministic rule engine — NO LLM decisions for emergencies
// ============================

/**
 * Each rule has:
 * - id: unique identifier
 * - name: human-readable name
 * - severity: 'critical' | 'high' | 'medium' | 'low'
 * - condition: function that receives all interview responses and returns boolean
 * - message: what to display
 * - doctorMessage: detailed message for doctor
 */
export const CLINICAL_RULES = [
  {
    id: 'chest_pain_breathlessness',
    name: 'Chest Pain + Breathlessness',
    severity: 'critical',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const breathless = responses.find(r => r.questionId === 'cp_breathlessness')
      return (
        complaint?.structuredValue === 'chest_pain' &&
        breathless?.structuredValue === 'yes'
      )
    },
    message: 'Priority Clinical Review Required',
    doctorMessage: 'Patient reports chest pain with difficulty breathing. Requires priority review.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'chest_pain_severe',
    name: 'Severe Chest Pain',
    severity: 'critical',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const severity = responses.find(r => r.questionId === 'cp_severity')
      return (
        complaint?.structuredValue === 'chest_pain' &&
        severity?.structuredValue >= 8
      )
    },
    message: 'Severe Pain — Priority Review',
    doctorMessage: 'Patient reports severe chest pain (8+/10). Consider urgent evaluation.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'chest_pain_radiation',
    name: 'Chest Pain with Radiation',
    severity: 'high',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const radiation = responses.find(r => r.questionId === 'cp_radiation')
      return (
        complaint?.structuredValue === 'chest_pain' &&
        radiation?.structuredValue &&
        radiation.structuredValue !== 'none'
      )
    },
    message: 'Pain Radiating — Clinical Attention Needed',
    doctorMessage: 'Patient reports chest pain with radiation. Needs clinical evaluation.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'high_fever_prolonged',
    name: 'Prolonged High Fever',
    severity: 'high',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const onset = responses.find(r => r.questionId === 'f_onset')
      return (
        complaint?.structuredValue === 'fever' &&
        (onset?.structuredValue === '1_week' || onset?.structuredValue === 'more')
      )
    },
    message: 'Prolonged Fever — Review Recommended',
    doctorMessage: 'Patient reports fever lasting more than a week. Needs evaluation.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'chest_pain_sweating',
    name: 'Chest Pain with Sweating',
    severity: 'high',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const sweating = responses.find(r => r.questionId === 'cp_sweating')
      return (
        complaint?.structuredValue === 'chest_pain' &&
        sweating?.structuredValue === 'yes'
      )
    },
    message: 'Chest Pain with Diaphoresis',
    doctorMessage: 'Patient reports chest pain with excessive sweating. Consider cardiac evaluation.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'chest_pain_left_arm_radiation',
    name: 'Chest Pain with Left Arm Radiation',
    severity: 'critical',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const radiation = responses.find(r => r.questionId === 'socrates_radiation')
      return (
        complaint?.structuredValue === 'chest_pain' &&
        radiation?.structuredValue === 'left_arm'
      )
    },
    message: 'Chest Pain Radiating to Left Arm — URGENT',
    doctorMessage: 'Patient reports substernal chest pain radiating to left arm/shoulder. Classic pattern for Acute Coronary Syndrome (ACS). Requires immediate ECG and Troponin.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'breathlessness_sweating',
    name: 'Breathlessness with Sweating',
    severity: 'high',
    condition: (responses) => {
      const associations = responses.find(r => r.questionId === 'socrates_associations')
      const values = Array.isArray(associations?.structuredValue) ? associations.structuredValue : []
      return values.includes('breathlessness') && values.includes('sweating')
    },
    message: 'Breathlessness + Diaphoresis — Cardiac Evaluation Needed',
    doctorMessage: 'Patient reports breathlessness combined with excessive sweating. May indicate cardiac or pulmonary emergency even without explicit chest pain.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
  {
    id: 'diabetic_chest_pain',
    name: 'Diabetic Patient with Chest Pain',
    severity: 'high',
    condition: (responses) => {
      const complaint = responses.find(r => r.questionId === 'chief_complaint')
      const pastMedical = responses.find(r => r.questionId === 'past_medical')
      const hasDiabetes = Array.isArray(pastMedical?.structuredValue)
        ? pastMedical.structuredValue.includes('diabetes')
        : String(pastMedical?.structuredValue || '').toLowerCase().includes('diabetes')
      return complaint?.structuredValue === 'chest_pain' && hasDiabetes
    },
    message: 'Diabetic Patient with Chest Pain — High Risk',
    doctorMessage: 'Patient with known Diabetes Mellitus presenting with chest pain. Diabetic patients may have atypical/silent MI presentation. Prioritize cardiac workup.',
    disclaimer: 'This is an alert for healthcare staff. It is not a diagnosis.',
  },
]

/**
 * Evaluate all clinical rules against interview responses
 * @param {Array} responses - All interview responses
 * @returns {Array} - Triggered clinical signals
 */
export function evaluateClinicalRules(responses) {
  const signals = []

  for (const rule of CLINICAL_RULES) {
    try {
      if (rule.condition(responses)) {
        signals.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          message: rule.message,
          doctorMessage: rule.doctorMessage,
          disclaimer: rule.disclaimer,
          source: 'clinical_rules_engine',
          status: 'active',
          triggeredAt: new Date().toISOString(),
        })
      }
    } catch (e) {
      // Silently skip rules that error — don't break the interview
      console.warn(`Rule ${rule.id} evaluation failed:`, e)
    }
  }

  return signals
}

/**
 * Get the highest severity from a list of signals
 */
export function getHighestSeverity(signals) {
  const order = ['critical', 'high', 'medium', 'low']
  for (const level of order) {
    if (signals.some(s => s.severity === level)) return level
  }
  return null
}
