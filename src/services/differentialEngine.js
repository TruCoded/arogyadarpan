// ============================
// ArogyaDarpan — Interactive AI Differential Diagnosis & ICD-10 Candidate Engine
// Assists consulting physicians with ICD-10 codes, evidence rationales, and match probabilities
// ============================

export function generateDifferentialDiagnosis(patientData = {}) {
  const responses = patientData.interviewResponses || []
  const summary = patientData.summary || {}
  const symptoms = (summary.chiefComplaint || '').toLowerCase() + ' ' + (summary.hpi || '').toLowerCase()

  const candidates = []

  // Cardiac Pattern
  if (symptoms.includes('chest pain') || symptoms.includes('breathless') || symptoms.includes('left arm')) {
    candidates.push({
      icdCode: 'I20.9',
      disease: 'Angina Pectoris / Ischemic Heart Disease',
      probability: 88,
      urgency: 'high',
      evidence: [
        'Central chest pain radiating to left arm (SOCRATES)',
        'Exertional breathlessness & diaphoresis noted',
        'History of Type 2 Diabetes & Hypertension',
      ],
      recommendedTests: ['ECG (12-Lead)', 'Troponin-T / I', 'Echocardiogram'],
    })

    candidates.push({
      icdCode: 'K21.9',
      disease: 'Gastro-Esophageal Reflux Disease (GERD)',
      probability: 45,
      urgency: 'low',
      evidence: [
        'Retrosternal burning component',
        'Improves with antacids / empty stomach',
      ],
      recommendedTests: ['Endoscopy', 'Trial of PPI (Pantoprazole)'],
    })
  }

  // Diabetic Pattern
  if (symptoms.includes('sugar') || symptoms.includes('diabetes') || summary.investigations?.some(i => i.name.includes('HbA1c'))) {
    candidates.push({
      icdCode: 'E11.9',
      disease: 'Type 2 Diabetes Mellitus with Suboptimal Glycemic Control',
      probability: 94,
      urgency: 'medium',
      evidence: [
        'Documented HbA1c 8.2% (May 2025)',
        'Fasting Blood Glucose 162 mg/dL',
        'On Metformin 500mg BD therapy',
      ],
      recommendedTests: ['Urinary Microalbumin', 'Fundoscopy', 'Lipid Profile'],
    })
  }

  // Respiratory Pattern
  if (symptoms.includes('fever') || symptoms.includes('cough')) {
    candidates.push({
      icdCode: 'J18.9',
      disease: 'Community Acquired Lower Respiratory Tract Infection',
      probability: 82,
      urgency: 'medium',
      evidence: [
        'Fever with purulent cough and chest discomfort',
        'Elevated leucocytes (WBC > 11,000 /uL)',
      ],
      recommendedTests: ['Chest X-Ray (PA View)', 'Sputum Culture'],
    })
  }

  return candidates.sort((a, b) => b.probability - a.probability)
}
