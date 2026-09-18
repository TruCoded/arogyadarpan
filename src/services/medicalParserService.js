// ============================
// ArogyaDarpan — Advanced Medical Entity Extraction & Parser Engine
// Parses natural language patient text, voice transcripts, and OCR raw text
// ============================

export const SYMPTOM_DICTIONARY = [
  { id: 'chest_pain', keywords: ['chest pain', 'chhaati me dard', 'chest tightness', 'heart pain', 'chhati me dard', 'pain in chest', 'angina'], category: 'cardiac', severity: 'high', label: 'Chest Pain' },
  { id: 'breathlessness', keywords: ['breathless', 'saans phoolna', 'shortness of breath', 'difficulty breathing', 'dyspnea', 'saans me takleef'], category: 'respiratory', severity: 'high', label: 'Breathlessness' },
  { id: 'fever', keywords: ['fever', 'bukhar', 'buhar', 'high temp', 'temperature', 'chills', 'thund lagna'], category: 'infectious', severity: 'medium', label: 'Fever' },
  { id: 'cough', keywords: ['cough', 'khansi', 'dhasak', 'phlegm', 'dry cough'], category: 'respiratory', severity: 'low', label: 'Cough' },
  { id: 'dysuria', keywords: ['burning urination', 'peshab me jalan', 'painful urinating', 'dysuria', 'urine pain', 'peshab me dard'], category: 'urology', severity: 'medium', label: 'Painful Urination' },
  { id: 'back_pain', keywords: ['back pain', 'pith me dard', 'kamar dard', 'flank pain', 'lower back pain'], category: 'musculoskeletal', severity: 'medium', label: 'Back Pain' },
  { id: 'stomach_pain', keywords: ['stomach pain', 'pet me dard', 'abdominal pain', 'belly pain', 'gastric pain', 'stomach ache'], category: 'gastro', severity: 'medium', label: 'Abdominal Pain' },
  { id: 'headache', keywords: ['headache', 'sir dard', 'head pain', 'migraine', 'sir me dard'], category: 'neurology', severity: 'low', label: 'Headache' },
  { id: 'dizziness', keywords: ['dizziness', 'chakkan', 'chakkar', 'vertigo', 'feeling faint', 'lightheaded'], category: 'neurology', severity: 'medium', label: 'Dizziness' },
  { id: 'nausea', keywords: ['nausea', 'ulti', 'vomiting', 'nauseous', 'gabrahat'], category: 'gastro', severity: 'low', label: 'Nausea / Vomiting' },
  { id: 'sweating', keywords: ['sweating', 'paseena', 'diaphoresis', 'excessive sweat'], category: 'cardiac', severity: 'high', label: 'Excessive Sweating' },
  { id: 'palpitations', keywords: ['palpitation', 'dhadkan tez', 'heart racing', 'irregular heartbeat', 'dil dhadakna'], category: 'cardiac', severity: 'medium', label: 'Palpitations' },
  { id: 'joint_pain', keywords: ['joint pain', 'jodo me dard', 'arthritis', 'joint stiffness', 'ghutno me dard'], category: 'musculoskeletal', severity: 'medium', label: 'Joint Pain' },
  { id: 'skin_rash', keywords: ['skin rash', 'khujli', 'rash', 'itching', 'urticaria', 'hives', 'daane'], category: 'dermatology', severity: 'low', label: 'Skin Rash / Itching' },
  { id: 'swelling', keywords: ['swelling', 'sujan', 'edema', 'puffiness', 'pairo me sujan', 'ankles swollen'], category: 'cardiac', severity: 'medium', label: 'Swelling / Edema' },
  { id: 'weight_loss', keywords: ['weight loss', 'vajan kam', 'losing weight', 'unintentional weight loss'], category: 'systemic', severity: 'medium', label: 'Unintentional Weight Loss' },
  { id: 'fatigue', keywords: ['fatigue', 'thakan', 'tiredness', 'kamzori', 'weakness', 'low energy', 'exhaustion'], category: 'systemic', severity: 'low', label: 'Fatigue / Weakness' },
]

export const MEDICATION_DICTIONARY = [
  { name: 'Metformin', category: 'Antidiabetic', typicalDosage: '500 mg', keywords: ['metformin', 'glycomet', 'glucophage', 'sugar ki dawai'] },
  { name: 'Paracetamol', category: 'Analgesic/Antipyretic', typicalDosage: '650 mg', keywords: ['paracetamol', 'crocin', 'dolo', 'calpol', 'pcm', 'bukhar ki dawai'] },
  { name: 'Amoxicillin', category: 'Antibiotic', typicalDosage: '500 mg', keywords: ['amoxicillin', 'mox', 'novamox', 'amoxil'] },
  { name: 'Amlodipine', category: 'Antihypertensive', typicalDosage: '5 mg', keywords: ['amlodipine', 'amlong', 'stamlo', 'bp ki dawai'] },
  { name: 'Aspirin', category: 'Antiplatelet', typicalDosage: '75 mg', keywords: ['aspirin', 'ecosprin', 'disprin'] },
  { name: 'Atorvastatin', category: 'Statin', typicalDosage: '10 mg', keywords: ['atorvastatin', 'atorva', 'lipitor'] },
  { name: 'Omeprazole', category: 'PPI / Antacid', typicalDosage: '20 mg', keywords: ['omeprazole', 'pan', 'pantocid', 'pantoprazole', 'gas ki dawai'] },
  { name: 'Azithromycin', category: 'Antibiotic', typicalDosage: '500 mg', keywords: ['azithromycin', 'azee', 'azithral'] },
  { name: 'Levothyroxine', category: 'Thyroid', typicalDosage: '50 mcg', keywords: ['thyronorm', 'eltroxin', 'levothyroxine', 'thyroid medication'] },
  { name: 'Telmisartan', category: 'ARB Antihypertensive', typicalDosage: '40 mg', keywords: ['telmisartan', 'telma', 'telmikind', 'telsar'] },
  { name: 'Losartan', category: 'ARB Antihypertensive', typicalDosage: '50 mg', keywords: ['losartan', 'losacar', 'repace', 'losar'] },
  { name: 'Glimepiride', category: 'Sulfonylurea Antidiabetic', typicalDosage: '2 mg', keywords: ['glimepiride', 'amaryl', 'glimisave', 'glimy'] },
  { name: 'Clopidogrel', category: 'Antiplatelet', typicalDosage: '75 mg', keywords: ['clopidogrel', 'clopilet', 'plavix', 'clopivas'] },
  { name: 'Rabeprazole', category: 'PPI / Antacid', typicalDosage: '20 mg', keywords: ['rabeprazole', 'razo', 'rablet', 'happi'] },
]

export const LAB_TEST_DICTIONARY = [
  { key: 'hba1c', name: 'HbA1c', unit: '%', normalMin: 4.0, normalMax: 5.6, keywords: ['hba1c', 'glycated hemoglobin', 'hb a1c'] },
  { key: 'glucose_fasting', name: 'Fasting Blood Glucose', unit: 'mg/dL', normalMin: 70, normalMax: 100, keywords: ['fasting glucose', 'fasting blood sugar', 'fbs'] },
  { key: 'wbc', name: 'WBC Count', unit: '/uL', normalMin: 4000, normalMax: 11000, keywords: ['wbc', 'white blood cell', 'total leucocyte count', 'tlc'] },
  { key: 'hemoglobin', name: 'Hemoglobin', unit: 'g/dL', normalMin: 12.0, normalMax: 16.5, keywords: ['hemoglobin', 'hb', 'haemoglobin'] },
  { key: 'platelets', name: 'Platelets', unit: 'k/uL', normalMin: 150, normalMax: 450, keywords: ['platelets', 'platelet count', 'plt'] },
  { key: 'creatinine', name: 'Serum Creatinine', unit: 'mg/dL', normalMin: 0.6, normalMax: 1.2, keywords: ['creatinine', 's.creatinine', 'serum creatinine'] },
  { key: 'sbp', name: 'Systolic BP', unit: 'mmHg', normalMin: 90, normalMax: 120, keywords: ['sys bp', 'systolic', 'bp systolic'] },
  { key: 'dbp', name: 'Diastolic BP', unit: 'mmHg', normalMin: 60, normalMax: 80, keywords: ['dia bp', 'diastolic', 'bp diastolic'] },
  { key: 'tsh', name: 'TSH', unit: 'uIU/mL', normalMin: 0.4, normalMax: 4.2, keywords: ['tsh', 'thyroid stimulating hormone'] },
  { key: 'cholesterol', name: 'Total Cholesterol', unit: 'mg/dL', normalMin: 0, normalMax: 200, keywords: ['total cholesterol', 'cholesterol', 'serum cholesterol'] },
  { key: 'ldl', name: 'LDL Cholesterol', unit: 'mg/dL', normalMin: 0, normalMax: 100, keywords: ['ldl', 'low density lipoprotein', 'ldl cholesterol'] },
  { key: 'hdl', name: 'HDL Cholesterol', unit: 'mg/dL', normalMin: 40, normalMax: 200, keywords: ['hdl', 'high density lipoprotein', 'hdl cholesterol'] },
  { key: 'triglycerides', name: 'Triglycerides', unit: 'mg/dL', normalMin: 0, normalMax: 150, keywords: ['triglycerides', 'tg', 'triglyceride'] },
  { key: 'uric_acid', name: 'Uric Acid', unit: 'mg/dL', normalMin: 3.5, normalMax: 7.2, keywords: ['uric acid', 'serum uric acid', 'urate'] },
  { key: 'sgpt', name: 'SGPT / ALT', unit: 'U/L', normalMin: 7, normalMax: 56, keywords: ['sgpt', 'alt', 'alanine aminotransferase', 'alanine transaminase'] },
]

export const ALLERGY_KEYWORDS = [
  { name: 'Penicillin', keywords: ['penicillin', 'amoxicillin allergy', 'penicillin allergy'] },
  { name: 'Sulfa Drugs', keywords: ['sulfa', 'bactrim', 'sulfonamide'] },
  { name: 'Aspirin / NSAIDs', keywords: ['aspirin allergy', 'nsaid allergy', 'brufen allergy'] },
  { name: 'Peanut / Food', keywords: ['peanut', 'seafood', 'egg allergy'] },
]

/**
 * Extract structured medical facts from raw text (speech transcript, user message, or OCR text)
 * @param {string} text - Raw natural text
 * @returns {Object} Extracted clinical entities
 */
export function extractMedicalEntities(text = '') {
  if (!text) return { symptoms: [], medications: [], labResults: [], allergies: [], duration: null, severityScore: null, confidence: 0 }

  const lowerText = text.toLowerCase()

  // 1. Detect Symptoms
  const detectedSymptoms = []
  for (const symptom of SYMPTOM_DICTIONARY) {
    if (symptom.keywords.some(kw => lowerText.includes(kw))) {
      detectedSymptoms.push({
        id: symptom.id,
        label: symptom.label,
        category: symptom.category,
        severity: symptom.severity,
        matchedKeyword: symptom.keywords.find(kw => lowerText.includes(kw)),
      })
    }
  }

  // 2. Detect Medications
  const detectedMedications = []
  for (const med of MEDICATION_DICTIONARY) {
    if (med.keywords.some(kw => lowerText.includes(kw))) {
      // Try extracting dosage within 30 chars of the matched keyword
      const kwPos = lowerText.indexOf(med.keywords.find(kw => lowerText.includes(kw)))
      const nearbyText = kwPos >= 0 ? lowerText.substring(Math.max(0, kwPos - 10), kwPos + 40) : ''
      const dosageMatch = nearbyText.match(/(\d+\s*(?:mg|mcg|g))/i)
      detectedMedications.push({
        name: med.name,
        category: med.category,
        dosage: dosageMatch ? dosageMatch[1].toUpperCase() : med.typicalDosage,
        confidence: 0.92,
      })
    }
  }

  // 3. Detect Lab Values with numbers
  const detectedLabResults = []
  for (const test of LAB_TEST_DICTIONARY) {
    for (const kw of test.keywords) {
      if (lowerText.includes(kw)) {
        // Regex pattern to extract numerical value following test keyword
        const regex = new RegExp(`${kw}[\\s:=:-]*([0-9]+\\.?[0-9]*)`, 'i')
        const match = lowerText.match(regex)
        if (match && match[1]) {
          const numValue = parseFloat(match[1])
          const isAbnormal = numValue < test.normalMin || numValue > test.normalMax
          let status = 'normal'
          if (numValue > test.normalMax) status = 'high'
          if (numValue < test.normalMin) status = 'low'

          detectedLabResults.push({
            key: test.key,
            name: test.name,
            value: numValue,
            unit: test.unit,
            normalRange: `${test.normalMin}-${test.normalMax} ${test.unit}`,
            status: isAbnormal ? 'abnormal' : 'normal',
            direction: status,
            confidence: 0.94,
          })
          break
        }
      }
    }
  }

  // 4. Detect Allergies
  const detectedAllergies = []
  for (const allergy of ALLERGY_KEYWORDS) {
    if (allergy.keywords.some(kw => lowerText.includes(kw))) {
      detectedAllergies.push(allergy.name)
    }
  }

  // 5. Detect Duration
  let duration = null
  const durationMatch = lowerText.match(/(\d+|\b(one|two|three|four|five|six|seven)\b)\s*(days?|din|weeks?|hafte|months?|mahine|hours?|ghante)/i)
  if (durationMatch) {
    duration = durationMatch[0]
  } else if (lowerText.includes('yesterday') || lowerText.includes('kal se')) {
    duration = '1 day (since yesterday)'
  } else if (lowerText.includes('today') || lowerText.includes('aaj se')) {
    duration = 'Today'
  }

  // 6. Detect Severity Score (1-10)
  let severityScore = null
  const severityMatch = lowerText.match(/(\d{1,2})\s*(\/|\s*out of\s*)\s*10/i) || lowerText.match(/severity\s*(\d{1,2})/i)
  if (severityMatch) {
    severityScore = parseInt(severityMatch[1], 10)
  } else if (lowerText.includes('severe') || lowerText.includes('bahut zyada')) {
    severityScore = 8
  } else if (lowerText.includes('moderate') || lowerText.includes('thoda zyada')) {
    severityScore = 5
  } else if (lowerText.includes('mild') || lowerText.includes('halka')) {
    severityScore = 3
  }

  // Overall Confidence based on matched entities count
  const entityCount = detectedSymptoms.length + detectedMedications.length + detectedLabResults.length
  const confidence = Math.min(0.98, 0.70 + entityCount * 0.08)

  return {
    symptoms: detectedSymptoms,
    medications: detectedMedications,
    labResults: detectedLabResults,
    allergies: detectedAllergies,
    duration,
    severityScore,
    confidence: Math.round(confidence * 100) / 100,
  }
}
