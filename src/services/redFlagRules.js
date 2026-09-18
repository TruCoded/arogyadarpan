// ============================
// ArogyaDarpan — Deterministic Clinical Red-Flag Rule Engine
// Identifies acute emergency danger signs with STRICT non-diagnostic safety constraints
// Rule: System does NOT diagnose. Instead warns: "Potential emergency symptoms detected. Please alert clinical staff."
// ============================

export const RED_FLAG_RULES = [
  {
    id: 'rf_acute_coronary_syndrome',
    name: 'Acute Coronary Syndrome Alert',
    priority: 'critical',
    triageAction: 'IMMEDIATE_TRIAGE_DESK_DISPATCH',
    publicAlertMessage: 'Potential emergency symptoms detected. Please alert clinical staff immediately.',
    staffGuidance: 'High probability of Acute Coronary Syndrome (ACS). Perform STAT 12-Lead ECG within 10 minutes, evaluate vitals, and notify on-duty Emergency Medical Officer.',
    evaluate: (responses, nlp = {}) => {
      const hasChestPain = responses.some(r =>
        (r.questionId === 'chief_complaint' && r.structuredValue === 'chest_pain') ||
        (r.questionId === 'socrates_site' && String(r.structuredValue).includes('chest'))
      ) || nlp.symptoms?.some(s => s.id === 'chest_pain')

      if (!hasChestPain) return false

      const hasDyspnea = responses.some(r =>
        (r.questionId === 'cp_breathlessness' && r.structuredValue === 'yes') ||
        (r.questionId === 'socrates_associations' && (Array.isArray(r.structuredValue) ? r.structuredValue.includes('breathlessness') : String(r.structuredValue).toLowerCase().includes('breath')))
      ) || nlp.symptoms?.some(s => s.id === 'breathlessness')

      const hasSweating = responses.some(r =>
        (r.questionId === 'cp_sweating' && r.structuredValue === 'yes') ||
        (r.questionId === 'socrates_associations' && (Array.isArray(r.structuredValue) ? r.structuredValue.includes('sweating') : String(r.structuredValue).toLowerCase().includes('sweat')))
      ) || nlp.symptoms?.some(s => s.id === 'sweating')

      const hasRadiation = responses.some(r =>
        (r.questionId === 'socrates_radiation' || r.questionId === 'cp_radiation') &&
        (String(r.structuredValue).includes('arm') || String(r.structuredValue).includes('jaw'))
      )

      const hasHighSeverity = responses.some(r =>
        (r.questionId.includes('severity')) && parseInt(r.structuredValue, 10) >= 8
      ) || (nlp.severity && nlp.severity >= 8)

      // Chest pain + any 2 or radiation or high severity
      return (hasDyspnea && hasSweating) || hasRadiation || (hasHighSeverity && (hasDyspnea || hasSweating))
    },
    triggeredCriteria: ['Chest pain', 'Associated dyspnea / sweating / radiation to arm'],
  },
  {
    id: 'rf_acute_stroke_deficits',
    name: 'Acute Neurological Deficit Alert (Code Stroke)',
    priority: 'critical',
    triageAction: 'IMMEDIATE_TRIAGE_DESK_DISPATCH',
    publicAlertMessage: 'Potential emergency symptoms detected. Please alert clinical staff immediately.',
    staffGuidance: 'Signs consistent with acute neurological focal deficit. Check blood glucose (rule out hypoglycemia), assess BE-FAST criteria, and prepare for emergent Non-Contrast Brain CT.',
    evaluate: (responses, nlp = {}) => {
      const text = responses.map(r => String(r.originalResponse || r.structuredValue || '')).join(' ').toLowerCase() + ' ' + (nlp.rawText || '').toLowerCase()
      const hasWeakness = text.includes('paralysis') || text.includes('lakwa') || text.includes('kamzor') || text.includes('one side weak') || text.includes('haath pair kamzor')
      const hasSpeechIssue = text.includes('bolne me takleef') || text.includes('slurred') || text.includes('speech difficulty') || text.includes('awaz ladkhadana')
      const hasFacialDroop = text.includes('face drooping') || text.includes('chehra tedha')
      const hasWorstHeadache = (text.includes('thunderclap') || text.includes('worst headache') || text.includes('achanak tez sir dard')) && text.includes('sudden')

      return hasWeakness || hasSpeechIssue || hasFacialDroop || hasWorstHeadache
    },
    triggeredCriteria: ['Sudden focal motor weakness / speech difficulty / facial asymmetry'],
  },
  {
    id: 'rf_severe_respiratory_distress',
    name: 'Severe Respiratory Compromise Alert',
    priority: 'critical',
    triageAction: 'IMMEDIATE_TRIAGE_DESK_DISPATCH',
    publicAlertMessage: 'Potential emergency symptoms detected. Please alert clinical staff immediately.',
    staffGuidance: 'Acute respiratory distress reported. Immediately check pulse oximetry (SpO2), auscultate lung fields, and administer supplemental oxygen if SpO2 < 94%.',
    evaluate: (responses, nlp = {}) => {
      const text = responses.map(r => String(r.originalResponse || r.structuredValue || '')).join(' ').toLowerCase() + ' ' + (nlp.rawText || '').toLowerCase()
      const severeDyspnea = responses.some(r =>
        (r.questionId === 'chief_complaint' && r.structuredValue === 'breathing') ||
        (r.questionId.includes('breathlessness') && r.structuredValue === 'yes')
      )
      const cannotSpeak = text.includes('bol nahi pa rahe') || text.includes('gasping') || text.includes('saans ruk rahi hai') || text.includes('suffocating')
      return severeDyspnea && cannotSpeak
    },
    triggeredCriteria: ['Severe dyspnea with inability to complete sentences / gasping'],
  },
  {
    id: 'rf_acute_surgical_abdomen',
    name: 'Acute Surgical Abdomen Alert',
    priority: 'high',
    triageAction: 'URGENT_PHYSICIAN_EVALUATION',
    publicAlertMessage: 'Potential emergency symptoms detected. Please alert clinical staff immediately.',
    staffGuidance: 'Signs of acute peritonism or bowel obstruction. Keep patient NPO (nil per os), initiate IV line, order urgent erect abdominal X-ray and ultrasound.',
    evaluate: (responses, nlp = {}) => {
      const hasStomachPain = responses.some(r =>
        r.questionId === 'chief_complaint' && r.structuredValue === 'stomach_pain'
      ) || nlp.symptoms?.some(s => s.id === 'abdominal_pain')

      const text = responses.map(r => String(r.originalResponse || r.structuredValue || '')).join(' ').toLowerCase() + ' ' + (nlp.rawText || '').toLowerCase()
      const hasVomiting = text.includes('vomiting') || text.includes('ulti') || nlp.symptoms?.some(s => s.id === 'vomiting')
      const isSevereOrRigid = text.includes('rigid') || text.includes('pet akad gaya') || text.includes('unbearable') || responses.some(r => r.questionId.includes('severity') && parseInt(r.structuredValue, 10) >= 8)

      return hasStomachPain && hasVomiting && isSevereOrRigid
    },
    triggeredCriteria: ['Severe acute abdominal pain + persistent vomiting'],
  },
  {
    id: 'rf_anaphylaxis',
    name: 'Anaphylaxis / Acute Airway Allergy Alert',
    priority: 'critical',
    triageAction: 'IMMEDIATE_TRIAGE_DESK_DISPATCH',
    publicAlertMessage: 'Potential emergency symptoms detected. Please alert clinical staff immediately.',
    staffGuidance: 'Possible life-threatening systemic anaphylaxis. Assess airway patency, prepare intramuscular Epinephrine (1:1000, 0.5mg IM anterolateral thigh), and secure IV access.',
    evaluate: (responses, nlp = {}) => {
      const text = responses.map(r => String(r.originalResponse || r.structuredValue || '')).join(' ').toLowerCase() + ' ' + (nlp.rawText || '').toLowerCase()
      const hasSwelling = text.includes('lip swelling') || text.includes('hoth sooj gaye') || text.includes('tongue swelling') || text.includes('gala band ho raha hai')
      const hasRashOrDyspnea = text.includes('rash') || text.includes('khujli') || text.includes('saans phool')
      return hasSwelling && hasRashOrDyspnea
    },
    triggeredCriteria: ['Facial/lip/tongue angioedema with acute dyspnea or rash'],
  },
]

/**
 * Evaluate all deterministic clinical red flags against active patient responses and NLP facts
 * @param {Array} responses - Active session interview responses
 * @param {Object} nlp - Optional extracted NLP entities
 * @returns {Object} { hasEmergency: boolean, alerts: Array, topAlert: Object }
 */
export function evaluateRedFlags(responses = [], nlp = {}) {
  const activeAlerts = []

  for (const rule of RED_FLAG_RULES) {
    try {
      if (rule.evaluate(responses, nlp)) {
        activeAlerts.push({
          id: rule.id,
          name: rule.name,
          priority: rule.priority,
          triageAction: rule.triageAction,
          publicAlertMessage: rule.publicAlertMessage,
          staffGuidance: rule.staffGuidance,
          triggeredCriteria: rule.triggeredCriteria,
        })
      }
    } catch (e) {
      console.warn(`Error evaluating red-flag rule ${rule.id}:`, e)
    }
  }

  const hasEmergency = activeAlerts.some(a => a.priority === 'critical')
  const topAlert = activeAlerts.find(a => a.priority === 'critical') || activeAlerts[0] || null

  return {
    hasEmergency,
    hasAnyAlert: activeAlerts.length > 0,
    alerts: activeAlerts,
    topAlert,
  }
}
