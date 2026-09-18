// ============================
// ArogyaDarpan — Advanced Clinical NLP & Medical Entity Recognition Engine
// Converts unstructured natural language (Hindi, English, Hinglish) into structured clinical facts
// ============================

export const DISEASE_DICTIONARY = [
  {
    name: 'Diabetes Mellitus',
    icd10: 'E11',
    keywords: ['diabetes', 'sugar', 'madhumeh', 'sugar ki bimari', 'sugar ki problem', 'diabetic', 'type 2 diabetes'],
  },
  {
    name: 'Essential Hypertension',
    icd10: 'I10',
    keywords: ['hypertension', 'high bp', 'blood pressure', 'bp ki bimari', 'bp high', 'bp badhta hai'],
  },
  {
    name: 'Coronary Artery Disease',
    icd10: 'I25',
    keywords: ['heart disease', 'heart attack', 'dil ki bimari', 'angina', 'stent laga hai', 'bypass', 'cardiac disease'],
  },
  {
    name: 'Bronchial Asthma',
    icd10: 'J45',
    keywords: ['asthma', 'dama', 'saans ki bimari', 'inhaler leta hoon', 'asthmatic'],
  },
  {
    name: 'Hypothyroidism',
    icd10: 'E03.9',
    keywords: ['thyroid', 'hypothyroidism', 'thyroid ki bimari', 'thyroid problem'],
  },
  {
    name: 'Chronic Kidney Disease',
    icd10: 'N18',
    keywords: ['kidney disease', 'gurde ki bimari', 'kidney problem', 'creatinine high', 'dialysis'],
  },
  {
    name: 'Cerebrovascular Accident (Stroke)',
    icd10: 'I63',
    keywords: ['stroke', 'paralysis', 'lakwa', 'falij', 'brain stroke'],
  },
  {
    name: 'Gastroesophageal Reflux Disease (GERD)',
    icd10: 'K21',
    keywords: ['acidity', 'gerd', 'gas ki bimari', 'seene me jalan', 'acid reflux', 'heartburn'],
  },
  {
    name: 'Osteoarthritis',
    icd10: 'M19',
    keywords: ['arthritis', 'gathiya', 'jodo ka dard', 'joint problem', 'ghutno me dard'],
  },
]

export const COMMON_MEDICATIONS = [
  { name: 'Metformin', aliases: ['metformin', 'glycomet', 'glucophage', 'sugar ki goli', 'sugar ki dawai'], typicalDose: '500 mg' },
  { name: 'Paracetamol', aliases: ['paracetamol', 'crocin', 'dolo', 'calpol', 'pcm', 'bukhar ki goli'], typicalDose: '650 mg' },
  { name: 'Amoxicillin', aliases: ['amoxicillin', 'mox', 'novamox', 'amoxil', 'antibiotic'], typicalDose: '500 mg' },
  { name: 'Amlodipine', aliases: ['amlodipine', 'amlong', 'stamlo', 'bp ki goli', 'bp ki dawai'], typicalDose: '5 mg' },
  { name: 'Aspirin', aliases: ['aspirin', 'ecosprin', 'disprin'], typicalDose: '75 mg' },
  { name: 'Atorvastatin', aliases: ['atorvastatin', 'atorva', 'lipitor', 'cholesterol ki goli'], typicalDose: '10 mg' },
  { name: 'Omeprazole', aliases: ['omeprazole', 'pan', 'pantocid', 'pantoprazole', 'gas ki goli', 'gas ki dawai'], typicalDose: '20 mg' },
  { name: 'Azithromycin', aliases: ['azithromycin', 'azee', 'azithral'], typicalDose: '500 mg' },
  { name: 'Levothyroxine', aliases: ['thyronorm', 'eltroxin', 'levothyroxine', 'thyroid ki goli'], typicalDose: '50 mcg' },
  { name: 'Telmisartan', aliases: ['telmisartan', 'telma', 'telmikind'], typicalDose: '40 mg' },
  { name: 'Losartan', aliases: ['losartan', 'losacar', 'repace'], typicalDose: '50 mg' },
  { name: 'Glimepiride', aliases: ['glimepiride', 'amaryl', 'glimisave'], typicalDose: '2 mg' },
]

export const FREQUENCY_PATTERNS = [
  { normalized: 'Twice daily', code: 'BID', patterns: ['din mein do baar', 'do baar', 'subah shaam', 'twice daily', '2 times a day', 'twice a day', 'two times a day', 'subah aur shaam', 'b.i.d', 'bid'] },
  { normalized: 'Once daily', code: 'OD', patterns: ['din mein ek baar', 'ek baar', 'roz ek baar', 'once daily', '1 time a day', 'once a day', 'one time a day', 'o.d', 'od'] },
  { normalized: 'Three times daily', code: 'TDS', patterns: ['din mein teen baar', 'teen baar', 'thrice daily', '3 times a day', 'three times a day', 'subah dopahar shaam', 't.d.s', 'tds'] },
  { normalized: 'As needed (PRN)', code: 'PRN', patterns: ['jab zaroorat ho', 'dard hone par', 'as needed', 'when required', 'sos', 'p.r.n'] },
  { normalized: 'At bedtime', code: 'QHS', patterns: ['raat ko sote waqt', 'sote samay', 'at night', 'bedtime', 'before sleep'] },
]

export const TIMING_PATTERNS = [
  { normalized: 'After meals', patterns: ['khana khane ke baad', 'khane ke baad', 'after food', 'after meal', 'after meals', 'post-prandial'] },
  { normalized: 'Before meals', patterns: ['khana khane se pehle', 'khane se pehle', 'khali pet', 'before food', 'before meal', 'empty stomach', 'ante-prandial'] },
]

export const TEMPORAL_PATTERNS = [
  { regex: /(\d+|ek|do|teen|chaar|paanch|chhe|saat|aath|nau|das|one|two|three|four|five|six|seven|eight|nine|ten)\s*(din|days?|hafte|weeks?|mahine|months?|ghante|hours?)\s*(se|ago|prior)?/i, type: 'duration' },
  { patterns: ['kal se', 'since yesterday', 'yesterday'], normalized: '1 day (since yesterday)', days: 1 },
  { patterns: ['aaj se', 'aaj subah se', 'since morning', 'today'], normalized: 'Today', days: 0 },
  { patterns: ['parso se', 'day before yesterday'], normalized: '2 days ago', days: 2 },
  { patterns: ['pichle hafte se', 'last week', 'since last week'], normalized: '1 week', days: 7 },
  { patterns: ['kuch dino se', 'few days', 'for a few days'], normalized: '2-3 days', days: 3 },
  { patterns: ['kaafi dino se', 'chronic', 'many weeks'], normalized: 'Several weeks (chronic)', days: 21 },
]

export const ONSET_PATTERNS = [
  { normalized: 'Sudden', patterns: ['achanak', 'sudden', 'ekdum se', 'all of a sudden', 'acute'] },
  { normalized: 'Gradual', patterns: ['dheere dheere', 'gradual', 'slowly', 'dhire dhire', 'steep'] },
]

export const SYMPTOM_PATTERNS = [
  { id: 'chest_pain', label: 'Chest Pain', category: 'cardiac', patterns: ['chest pain', 'seene mein dard', 'seene me dard', 'chhaati me dard', 'chhati dard', 'pain in chest', 'chest heaviness', 'seene par bojh'] },
  { id: 'breathlessness', label: 'Shortness of Breath', category: 'respiratory', patterns: ['breathlessness', 'saans lene me takleef', 'saans phoolti hai', 'saans phoolna', 'shortness of breath', 'difficulty breathing', 'dyspnea'] },
  { id: 'sweating', label: 'Diaphoresis / Excessive Sweating', category: 'cardiac', patterns: ['sweating', 'paseena', 'bahut paseena', 'profuse sweating', 'cold sweats'] },
  { id: 'abdominal_pain', label: 'Abdominal Pain', category: 'gastrointestinal', patterns: ['pet mein dard', 'pet me pain', 'stomach pain', 'belly pain', 'abdominal pain', 'pet dard'] },
  { id: 'vomiting', label: 'Vomiting / Nausea', category: 'gastrointestinal', patterns: ['vomiting', 'ulti', 'ulti ho rahi hai', 'nausea', 'ji machlana', 'gabrahat'] },
  { id: 'fever', label: 'Fever', category: 'infectious', patterns: ['fever', 'bukhar', 'buhar', 'high temperature', 'badan garm'] },
  { id: 'cough', label: 'Cough', category: 'respiratory', patterns: ['cough', 'khansi', 'dhasak', 'balgam', 'sukhi khansi'] },
  { id: 'headache', label: 'Headache', category: 'neurological', patterns: ['headache', 'sir dard', 'sar dard', 'sir me dard', 'head pain'] },
  { id: 'dizziness', label: 'Dizziness / Lightheadedness', category: 'neurological', patterns: ['dizziness', 'chakkar', 'chakkan', 'head spinning', 'behoshi jaisa'] },
  { id: 'joint_pain', label: 'Joint Pain', category: 'musculoskeletal', patterns: ['joint pain', 'jodo me dard', 'ghutno me dard', 'arthritis pain'] },
  { id: 'fatigue', label: 'Fatigue / Weakness', category: 'general', patterns: ['fatigue', 'kamzori', 'thakan', 'weakness', 'tiredness', 'sust'] },
  { id: 'dysuria', label: 'Burning Urination', category: 'urological', patterns: ['burning urine', 'peshab me jalan', 'painful urination', 'peshab me dard'] },
]

/**
 * Perform deep Clinical NLP extraction from natural language text
 * Handles Hindi, English, and Hinglish mixed speech
 * @param {string} text - Natural conversational sentence
 * @returns {Object} Structured clinical entities
 */
export function extractClinicalNLP(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      diseases: [],
      medications: [],
      symptoms: [],
      temporal: null,
      onset: null,
      severity: null,
      confidence: 0,
      rawText: '',
    }
  }

  const rawLower = text.toLowerCase().trim()

  // 1. Disease Extraction
  const detectedDiseases = []
  for (const dis of DISEASE_DICTIONARY) {
    if (dis.keywords.some(kw => rawLower.includes(kw))) {
      detectedDiseases.push({
        name: dis.name,
        disease: dis.name,
        icd10: dis.icd10,
        matchedPhrase: dis.keywords.find(kw => rawLower.includes(kw)),
      })
    }
  }

  // 2. Medication Extraction with Dose & Frequency
  const detectedMedications = []
  for (const med of COMMON_MEDICATIONS) {
    const matchedAlias = med.aliases.find(a => rawLower.includes(a))
    if (matchedAlias) {
      // Find dosage around medication name
      const kwIdx = rawLower.indexOf(matchedAlias)
      const nearbyWindow = rawLower.substring(Math.max(0, kwIdx - 15), Math.min(rawLower.length, kwIdx + 45))
      const doseMatch = nearbyWindow.match(/(\d+\s*(?:mg|mcg|g|ml))/i)
      const dose = doseMatch ? doseMatch[1].toUpperCase() : med.typicalDose

      // Detect Frequency
      let frequency = 'Once daily (OD)'
      for (const freq of FREQUENCY_PATTERNS) {
        if (freq.patterns.some(p => rawLower.includes(p))) {
          frequency = freq.normalized
          break
        }
      }

      // Detect Timing relation
      let timing = 'After meals'
      for (const t of TIMING_PATTERNS) {
        if (t.patterns.some(p => rawLower.includes(p))) {
          timing = t.normalized
          break
        }
      }

      detectedMedications.push({
        medication: med.name,
        dose,
        frequency,
        timing,
        confidence: 0.94,
      })
    }
  }

  // 3. Symptoms Extraction
  const detectedSymptoms = []
  for (const sym of SYMPTOM_PATTERNS) {
    if (sym.patterns.some(p => rawLower.includes(p))) {
      detectedSymptoms.push({
        id: sym.id,
        label: sym.label,
        category: sym.category,
        matchedPhrase: sym.patterns.find(p => rawLower.includes(p)),
      })
    }
  }

  // 4. Temporal / Duration Extraction
  let detectedDuration = null
  for (const t of TEMPORAL_PATTERNS) {
    if (t.patterns) {
      if (t.patterns.some(p => rawLower.includes(p))) {
        detectedDuration = t.normalized
        break
      }
    } else if (t.regex) {
      const match = rawLower.match(t.regex)
      if (match) {
        detectedDuration = normalizeHindiNumber(match[0].trim())
        break
      }
    }
  }

  // 5. Onset Extraction
  let detectedOnset = null
  for (const on of ONSET_PATTERNS) {
    if (on.patterns.some(p => rawLower.includes(p))) {
      detectedOnset = on.normalized
      break
    }
  }

  // 6. Severity Extraction
  let detectedSeverity = null
  const severityMatch = rawLower.match(/(\d{1,2})\s*(?:out of|\/)?\s*10/i)
  if (severityMatch) {
    detectedSeverity = parseInt(severityMatch[1], 10)
  } else if (rawLower.includes('bahut zyada') || rawLower.includes('severe') || rawLower.includes('unbearable')) {
    detectedSeverity = 8
  } else if (rawLower.includes('thoda') || rawLower.includes('mild') || rawLower.includes('halka')) {
    detectedSeverity = 3
  } else if (rawLower.includes('moderate') || rawLower.includes('theek theek')) {
    detectedSeverity = 5
  }

  const entityCount = detectedDiseases.length + detectedMedications.length + detectedSymptoms.length + (detectedDuration ? 1 : 0)
  const confidence = Math.min(0.99, 0.65 + entityCount * 0.1)

  return {
    diseases: detectedDiseases,
    medications: detectedMedications,
    symptoms: detectedSymptoms,
    temporal: detectedDuration,
    onset: detectedOnset,
    severity: detectedSeverity,
    confidence: Math.round(confidence * 100) / 100,
    rawText: text,
  }
}

function normalizeHindiNumber(text) {
  const map = {
    ek: '1', do: '2', teen: '3', chaar: '4', paanch: '5',
    chhe: '6', saat: '7', aath: '8', nau: '9', das: '10',
    din: 'days', dinon: 'days', hafte: 'weeks', mahine: 'months',
    ghante: 'hours', se: ''
  }
  let out = text
  for (const [k, v] of Object.entries(map)) {
    const reg = new RegExp(`\\b${k}\\b`, 'gi')
    out = out.replace(reg, v)
  }
  return out.trim()
}
