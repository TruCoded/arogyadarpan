// ============================================================================
// ArogyaDarpan — Advanced Medical Document Intelligence & OCR Preprocessing Engine
// Handles:
// 21. Medical OCR (preprocessing, stamps, signatures, tables)
// 22. Handwritten Prescription Recognition & Medication Normalization (OD, BD, TDS, etc.)
// 23. Medical Document Intelligence (Structured laboratory and clinical JSON)
// 24. Medical Entity Extraction (Diagnoses, Medications, Investigations, Procedures, Symptoms)
// 25. Lab Value Extraction (Test, Value, Unit)
// 26. Abnormal Value Detection (Physiological range comparison, high/low flags)
// 28. Intelligent Document Classification (6 categories)
// 29. Document Date Extraction (Multi-format regex)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Canvas Image Preprocessing (for poor quality, faint ink & handwriting)
// ----------------------------------------------------------------------------

/**
 * Preprocesses an image via HTML5 Canvas (grayscale, contrast enhancement, binarization)
 * to significantly improve Tesseract OCR accuracy on handwritten and poor-quality scans.
 * @param {HTMLImageElement|HTMLCanvasElement|ImageBitmap} imageElement 
 * @returns {string} Data URL of preprocessed high-contrast binarized image
 */
export function preprocessImageForOcr(imageElement) {
  if (typeof document === 'undefined') return null // Node environment safety check

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageElement.width || imageElement.naturalWidth || 800
  canvas.height = imageElement.height || imageElement.naturalHeight || 1000

  // Draw original image
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imgData.data

  // Step 1: Grayscale & Contrast stretching
  let minBrightness = 255
  let maxBrightness = 0

  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    if (gray < minBrightness) minBrightness = gray
    if (gray > maxBrightness) maxBrightness = gray
  }

  const range = maxBrightness - minBrightness || 1

  // Step 2: Normalize and apply adaptive thresholding
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    // Contrast stretched value
    let stretched = ((gray - minBrightness) / range) * 255

    // Mild binarization to clean paper grain and amplify ink
    const binarized = stretched < 140 ? 0 : 255

    data[i] = binarized     // R
    data[i + 1] = binarized // G
    data[i + 2] = binarized // B
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}

// ----------------------------------------------------------------------------
// 2. Intelligent Document Classification (Feature 28)
// ----------------------------------------------------------------------------

export const DOCUMENT_CLASSES = [
  {
    id: 'Prescription',
    keywords: ['rx', 'prescription', 'tab', 'cap', 'mg', 'od', 'bd', 'tds', 'qid', 'doctor', 'clinic', 'hospital', 'dispense', 'dawai', 'syrup', 'dosage'],
    confidenceWeight: 1.2
  },
  {
    id: 'Laboratory Report',
    keywords: ['lab', 'laboratory', 'pathology', 'test', 'specimen', 'reference range', 'result', 'normal range', 'serum', 'hba1c', 'hemoglobin', 'cbc', 'urinalysis', 'fasting glucose', 'biochemistry'],
    confidenceWeight: 1.3
  },
  {
    id: 'Discharge Summary',
    keywords: ['discharge', 'admission date', 'discharge date', 'hospital stay', 'course in hospital', 'discharge condition', 'final diagnosis', 'discharge advice', 'ipd', 'ward'],
    confidenceWeight: 1.4
  },
  {
    id: 'Imaging Report',
    keywords: ['imaging', 'x-ray', 'xray', 'mri', 'ct scan', 'ultrasound', 'usg', 'radiology', 'radiologist', 'impression', 'findings', 'scanned area', 'contrast'],
    confidenceWeight: 1.3
  },
  {
    id: 'Medical Certificate',
    keywords: ['medical certificate', 'certify', 'leave of absence', 'unfit for duty', 'fit to resume', 'illness', 'rest advised', 'bed rest', 'certificate of fitness'],
    confidenceWeight: 1.4
  },
]

/**
 * Classifies a clinical document into one of 6 categories using weighted semantic scoring & header matching
 * @param {string} text - Raw OCR text
 * @returns {{ category: string, confidence: number }}
 */
export function classifyDocument(text = '') {
  if (!text) return { category: 'Other', confidence: 0.50 }
  const lower = text.toLowerCase()

  // 1. High-priority explicit document titles & headers
  if (/discharge\s+summary|course\s+in\s+hospital|hospital\s+discharge/i.test(lower)) {
    return { category: 'Discharge Summary', confidence: 0.96 }
  }
  if (/medical\s+certificate|certificate\s+of\s+fitness|unfit\s+for\s+duty/i.test(lower)) {
    return { category: 'Medical Certificate', confidence: 0.95 }
  }
  if (/imaging\s+report|radiology|x-?ray|ct\s+scan|mri|ultrasound\s+report/i.test(lower) && !/discharge/i.test(lower)) {
    return { category: 'Imaging Report', confidence: 0.95 }
  }
  if (/laboratory\s+report|pathology\s+lab|biochemistry|blood\s+test\s+report/i.test(lower) && !/discharge/i.test(lower)) {
    return { category: 'Laboratory Report', confidence: 0.95 }
  }
  if (/prescription|clinical\s+record\s*\/\s*prescription|doctor['\s]+prescription/i.test(lower) && !/discharge/i.test(lower)) {
    return { category: 'Prescription', confidence: 0.94 }
  }

  // 2. Fallback to keyword frequency weighting
  let bestCategory = 'Other'
  let maxScore = 0

  for (const docClass of DOCUMENT_CLASSES) {
    let matchCount = 0
    for (const kw of docClass.keywords) {
      if (lower.includes(kw)) {
        matchCount++
      }
    }
    const score = matchCount * docClass.confidenceWeight
    if (score > maxScore) {
      maxScore = score
      bestCategory = docClass.id
    }
  }

  const confidence = Math.min(0.97, Math.max(0.65, 0.60 + (maxScore * 0.05)))
  return {
    category: maxScore >= 1.5 ? bestCategory : 'Other',
    confidence: Math.round(confidence * 100) / 100
  }
}

// ----------------------------------------------------------------------------
// 3. Document Date Extraction (Feature 29)
// ----------------------------------------------------------------------------

const MONTH_MAP = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  january: '01', february: '02', march: '03', april: '04', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
}

/**
 * Extracts clinical document dates across multiple Indian and international formats
 * @param {string} text - Raw OCR text
 * @returns {string} Standardized ISO date YYYY-MM-DD
 */
export function extractDocumentDate(text = '') {
  if (!text) return new Date().toISOString().split('T')[0]

  // Pattern 1: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmy = text.match(/\b([0-3]?[0-9])[-/.]([0-1]?[0-9])[-/.](20\d{2}|19\d{2})\b/)
  if (dmy) {
    const d = dmy[1].padStart(2, '0')
    const m = dmy[2].padStart(2, '0')
    const y = dmy[3]
    return `${y}-${m}-${d}`
  }

  // Pattern 2: DD Mon YYYY or DD Month YYYY (e.g., 15 March 2024, 12-Oct-2023)
  const textDate = text.match(/\b([0-3]?[0-9])[-/\s]+([a-zA-Z]{3,9})[-/\s]+(20\d{2}|19\d{2})\b/)
  if (textDate) {
    const d = textDate[1].padStart(2, '0')
    const monStr = textDate[2].toLowerCase()
    const y = textDate[3]
    const m = MONTH_MAP[monStr] || '01'
    return `${y}-${m}-${d}`
  }

  // Pattern 3: YYYY-MM-DD
  const ymd = text.match(/\b(20\d{2}|19\d{2})[-/.]([0-1]?[0-9])[-/.]([0-3]?[0-9])\b/)
  if (ymd) {
    return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
  }

  // Pattern 4: Year mentions in past history like "2019 diagnosed", "in 2022"
  const yearMatch = text.match(/\b(201\d|202\d)\b/)
  if (yearMatch) {
    return `${yearMatch[1]}-01-15`
  }

  return new Date().toISOString().split('T')[0]
}

// ----------------------------------------------------------------------------
// 4. Handwritten Prescription Abbreviation & Medication Normalization (Feature 22)
// ----------------------------------------------------------------------------

export const FREQUENCY_MAP = {
  'od': { label: 'Once Daily (OD)', timesPerDay: 1, hindi: 'दिन में एक बार' },
  'qd': { label: 'Once Daily (QD)', timesPerDay: 1, hindi: 'दिन में एक बार' },
  'bd': { label: 'Twice Daily (BD)', timesPerDay: 2, hindi: 'दिन में दो बार (सुबह-शाम)' },
  'bid': { label: 'Twice Daily (BID)', timesPerDay: 2, hindi: 'दिन में दो बार (सुबह-शाम)' },
  'tds': { label: 'Thrice Daily (TDS)', timesPerDay: 3, hindi: 'दिन में तीन बार (सुबह-दोपहर-रात)' },
  'tid': { label: 'Thrice Daily (TID)', timesPerDay: 3, hindi: 'दिन में तीन बार (सुबह-दोपहर-रात)' },
  'qid': { label: 'Four Times Daily (QID)', timesPerDay: 4, hindi: 'दिन में चार बार' },
  'hs': { label: 'At Bedtime (HS)', timesPerDay: 1, hindi: 'रात को सोने से पहले' },
  'sos': { label: 'As Needed (SOS)', timesPerDay: 0, hindi: 'ज़रूरत पड़ने पर' },
  'prn': { label: 'As Needed (PRN)', timesPerDay: 0, hindi: 'ज़रूरत पड़ने पर' },
  'stat': { label: 'Immediately (Stat)', timesPerDay: 1, hindi: 'तुरंत (एक खुराक)' },
  'bbf': { label: 'Before Breakfast', timesPerDay: 1, hindi: 'नाश्ते से पहले' },
  'pc': { label: 'After Meals', timesPerDay: 2, hindi: 'खाने के बाद' },
  'ac': { label: 'Before Meals', timesPerDay: 2, hindi: 'खाने से पहले' },
}

export const KNOWN_MEDICINES = [
  { name: 'Metformin', typicalStrength: '500 mg', defaultCategory: 'Oral Antidiabetic', aliases: ['metformin', 'glycomet', 'glucophage', 'obimet'] },
  { name: 'Amlodipine', typicalStrength: '5 mg', defaultCategory: 'Calcium Channel Blocker (BP)', aliases: ['amlodipine', 'amlong', 'stamlo', 'amlo'] },
  { name: 'Aspirin', typicalStrength: '75 mg', defaultCategory: 'Antiplatelet', aliases: ['aspirin', 'ecosprin', 'disprin', 'asa'] },
  { name: 'Atorvastatin', typicalStrength: '10 mg', defaultCategory: 'Lipid-lowering Statin', aliases: ['atorvastatin', 'atorva', 'lipitor', 'storvas'] },
  { name: 'Paracetamol', typicalStrength: '650 mg', defaultCategory: 'Antipyretic / Analgesic', aliases: ['paracetamol', 'pcm', 'crocin', 'dolo', 'calpol', 'panadol'] },
  { name: 'Telmisartan', typicalStrength: '40 mg', defaultCategory: 'ARB Antihypertensive', aliases: ['telmisartan', 'telma', 'telmikind', 'telsar'] },
  { name: 'Losartan', typicalStrength: '50 mg', defaultCategory: 'ARB Antihypertensive', aliases: ['losartan', 'losacar', 'repace'] },
  { name: 'Glimepiride', typicalStrength: '2 mg', defaultCategory: 'Sulfonylurea Antidiabetic', aliases: ['glimepiride', 'amaryl', 'glimisave'] },
  { name: 'Clopidogrel', typicalStrength: '75 mg', defaultCategory: 'Antiplatelet', aliases: ['clopidogrel', 'clopilet', 'plavix', 'clopivas'] },
  { name: 'Omeprazole', typicalStrength: '20 mg', defaultCategory: 'Proton Pump Inhibitor (Antacid)', aliases: ['omeprazole', 'omez', 'omiz'] },
  { name: 'Pantoprazole', typicalStrength: '40 mg', defaultCategory: 'Proton Pump Inhibitor (Antacid)', aliases: ['pantoprazole', 'pan', 'pantocid', 'pantodac'] },
  { name: 'Amoxicillin', typicalStrength: '500 mg', defaultCategory: 'Penicillin Antibiotic', aliases: ['amoxicillin', 'mox', 'novamox', 'amoxil'] },
  { name: 'Azithromycin', typicalStrength: '500 mg', defaultCategory: 'Macrolide Antibiotic', aliases: ['azithromycin', 'azee', 'azithral'] },
  { name: 'Levothyroxine', typicalStrength: '50 mcg', defaultCategory: 'Thyroid Hormone', aliases: ['levothyroxine', 'thyronorm', 'eltroxin'] },
  { name: 'Salbutamol', typicalStrength: '100 mcg', defaultCategory: 'Bronchodilator (Inhaler)', aliases: ['salbutamol', 'asthalin', 'albuterol'] },
  { name: 'Ibuprofen', typicalStrength: '400 mg', defaultCategory: 'NSAID (Pain/Inflammation)', aliases: ['ibuprofen', 'brufen', 'combiflam'] },
  { name: 'Warfarin', typicalStrength: '5 mg', defaultCategory: 'Anticoagulant', aliases: ['warfarin', 'coumadin', 'uniwarfin'] },
  { name: 'Insulin Glargine', typicalStrength: '10 units', defaultCategory: 'Long-acting Insulin', aliases: ['lantus', 'insulin glargine', 'glargine', 'basaglar'] },
]

/**
 * Normalizes handwritten or printed prescription lines into structured medication items
 * @param {string} text - Raw OCR text
 * @returns {Array<{ name: string, strength: string, frequency: string, duration: string, category: string, instructions: string, confidence: number }>}
 */
export function extractAndNormalizeMedications(text = '') {
  if (!text) return []
  const lines = text.split(/\r?\n/)
  const normalizedMeds = []

  for (const medDef of KNOWN_MEDICINES) {
    for (const alias of medDef.aliases) {
      const aliasRegex = new RegExp(`\\b${alias}\\b`, 'i')
      const lineMatch = lines.find(l => aliasRegex.test(l))

      if (lineMatch || aliasRegex.test(text)) {
        const targetStr = lineMatch || text
        // 1. Extract Strength (e.g. 500mg, 500 mg, 5 mg, 50mcg, 10 units)
        const strengthMatch = targetStr.match(/(\d+\.?\d*\s*(?:mg|mcg|g|ml|units?))/i)
        const strength = strengthMatch ? strengthMatch[1].trim() : medDef.typicalStrength

        // 2. Extract Frequency (BD, OD, TDS, QID, SOS, HS or numeric pattern 1-0-1)
        let frequency = 'Once Daily (OD)'
        let instructions = ''

        if (/\b(?:1-0-1|1\s*-\s*0\s*-\s*1|bd|bid)\b/i.test(targetStr)) {
          frequency = FREQUENCY_MAP.bd.label
          instructions = FREQUENCY_MAP.bd.hindi
        } else if (/\b(?:1-1-1|1\s*-\s*1\s*-\s*1|tds|tid)\b/i.test(targetStr)) {
          frequency = FREQUENCY_MAP.tds.label
          instructions = FREQUENCY_MAP.tds.hindi
        } else if (/\b(?:1-0-0|0-0-1|od|qd)\b/i.test(targetStr)) {
          frequency = FREQUENCY_MAP.od.label
          instructions = FREQUENCY_MAP.od.hindi
        } else if (/\b(?:hs|bedtime|night)\b/i.test(targetStr)) {
          frequency = FREQUENCY_MAP.hs.label
          instructions = FREQUENCY_MAP.hs.hindi
        } else if (/\b(?:sos|prn|as needed)\b/i.test(targetStr)) {
          frequency = FREQUENCY_MAP.sos.label
          instructions = FREQUENCY_MAP.sos.hindi
        }

        // 3. Extract Duration (e.g. 30 days, 5 days, 1 month, 2 weeks, for 15 days)
        const durationMatch = targetStr.match(/(\d+)\s*(days?|din|weeks?|hafte|months?|mahine)/i)
        const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : '30 days (Ongoing)'

        // Avoid duplicate additions
        if (!normalizedMeds.some(m => m.name.toLowerCase() === medDef.name.toLowerCase())) {
          normalizedMeds.push({
            name: medDef.name,
            strength,
            frequency,
            duration,
            category: medDef.defaultCategory,
            instructions,
            confidence: 0.94
          })
        }
        break // Stop alias iteration
      }
    }
  }

  return normalizedMeds
}

// ----------------------------------------------------------------------------
// 5. Medical Document Intelligence: Lab Values & Abnormal Detection (Features 23, 25, 26)
// ----------------------------------------------------------------------------

export const CLINICAL_LAB_DICTIONARY = [
  {
    test: 'HbA1c (Glycated Hemoglobin)',
    aliases: ['hba1c', 'hb a1c', 'glycated hemoglobin'],
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    criticalMax: 9.0,
    type: 'laboratory',
    clinicalSignificance: 'Diabetic glycemic control index'
  },
  {
    test: 'Fasting Blood Sugar (FBS)',
    aliases: ['fbs', 'fasting blood sugar', 'fasting blood glucose', 'fasting sugar'],
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 99,
    criticalMax: 250,
    type: 'laboratory',
    clinicalSignificance: 'Fasting carbohydrate metabolism marker'
  },
  {
    test: 'Postprandial Blood Sugar (PPBS)',
    aliases: ['ppbs', 'post prandial blood sugar', 'pp blood sugar', 'postprandial glucose'],
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 140,
    criticalMax: 300,
    type: 'laboratory',
    clinicalSignificance: 'Post-meal glycemic excursion'
  },
  {
    test: 'Hemoglobin (Hb)',
    aliases: ['hemoglobin', 'haemoglobin', 'hb'],
    unit: 'g/dL',
    normalMin: 12.0,
    normalMax: 16.5,
    criticalMin: 7.0,
    type: 'laboratory',
    clinicalSignificance: 'Oxygen carrying capacity / Anemia marker'
  },
  {
    test: 'Serum Creatinine',
    aliases: ['creatinine', 's.creatinine', 'serum creatinine', 'sr.creatinine'],
    unit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    criticalMax: 3.0,
    type: 'laboratory',
    clinicalSignificance: 'Glomerular filtration & renal function'
  },
  {
    test: 'Total Leukocyte Count (TLC / WBC)',
    aliases: ['tlc', 'wbc', 'total leukocyte count', 'white blood cells'],
    unit: '/uL',
    normalMin: 4000,
    normalMax: 11000,
    criticalMax: 20000,
    type: 'laboratory',
    clinicalSignificance: 'Infection / inflammatory immune response'
  },
  {
    test: 'Platelet Count',
    aliases: ['platelets', 'platelet count', 'plt'],
    unit: 'k/uL',
    normalMin: 150,
    normalMax: 450,
    criticalMin: 50,
    type: 'laboratory',
    clinicalSignificance: 'Hemostasis and coagulation competence'
  },
  {
    test: 'SGPT (ALT)',
    aliases: ['sgpt', 'alt', 'alanine aminotransferase'],
    unit: 'U/L',
    normalMin: 7,
    normalMax: 56,
    criticalMax: 200,
    type: 'laboratory',
    clinicalSignificance: 'Hepatocellular integrity marker'
  },
  {
    test: 'Total Cholesterol',
    aliases: ['total cholesterol', 'cholesterol', 'serum cholesterol'],
    unit: 'mg/dL',
    normalMin: 100,
    normalMax: 200,
    criticalMax: 300,
    type: 'laboratory',
    clinicalSignificance: 'Atherosclerotic cardiovascular risk index'
  },
  {
    test: 'Serum Potassium (K+)',
    aliases: ['potassium', 'serum potassium', 'k+'],
    unit: 'mEq/L',
    normalMin: 3.5,
    normalMax: 5.0,
    criticalMin: 3.0,
    criticalMax: 6.0,
    type: 'laboratory',
    clinicalSignificance: 'Cardiac conduction and electrolyte balance'
  },
]

/**
 * Extracts and structures lab values with abnormal detection & non-diagnostic flags
 * @param {string} text - Raw OCR text
 * @returns {Array<Object>} Structured lab objects
 */
export function extractStructuredLabValues(text = '') {
  if (!text) return []
  const lower = text.toLowerCase()
  const extractedLabs = []

  for (const item of CLINICAL_LAB_DICTIONARY) {
    for (const alias of item.aliases) {
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Ensure alias is a standalone word/token and not a substring (e.g. 'hb' inside 'hba1c')
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9])${escapedAlias}(?:[^a-zA-Z0-9]|$)[\\s:=:-]*([0-9]+\\.?[0-9]*)`, 'i')
      const match = lower.match(pattern)

      if (match && match[1]) {
        const numValue = parseFloat(match[1])

          // Abnormal & critical evaluation
          let status = 'normal'
          let direction = 'normal'
          let abnormalFlag = ''

          if (item.criticalMax && numValue >= item.criticalMax) {
            status = 'critical'
            direction = 'high'
            abnormalFlag = '↑↑ CRITICAL HIGH'
          } else if (item.criticalMin && numValue <= item.criticalMin) {
            status = 'critical'
            direction = 'low'
            abnormalFlag = '↓↓ CRITICAL LOW'
          } else if (numValue > item.normalMax) {
            status = 'abnormal'
            direction = 'high'
            abnormalFlag = '↑ Abnormal'
          } else if (numValue < item.normalMin) {
            status = 'abnormal'
            direction = 'low'
            abnormalFlag = '↓ Low'
          }

          extractedLabs.push({
            test: item.test,
            value: numValue,
            unit: item.unit,
            type: item.type,
            referenceRange: `${item.normalMin} - ${item.normalMax} ${item.unit}`,
            status,
            direction,
            abnormalFlag,
            clinicalSignificance: item.clinicalSignificance,
            physicianAttention: status !== 'normal',
            disclaimer: 'Clinical decision support signal for physician verification (not a standalone diagnosis)',
            confidence: 0.95
          })
          break
        }
      }
    }

  return extractedLabs
}

// ----------------------------------------------------------------------------
// 6. Medical Entity Extraction Across 5 Canonical Buckets (Feature 24)
// Diagnoses | Medications | Investigations | Procedures | Symptoms
// ----------------------------------------------------------------------------

export const KNOWN_DIAGNOSES = [
  { name: 'Type 2 Diabetes Mellitus', keywords: ['diabetes', 'type 2 diabetes', 't2dm', 'sugar problem'] },
  { name: 'Essential Hypertension', keywords: ['hypertension', 'high blood pressure', 'htn', 'high bp'] },
  { name: 'Bronchial Asthma', keywords: ['asthma', 'bronchial asthma', 'wheezing condition'] },
  { name: 'Coronary Artery Disease', keywords: ['coronary artery disease', 'cad', 'heart disease', 'angina pectoris'] },
  { name: 'Chronic Kidney Disease', keywords: ['ckd', 'chronic kidney disease', 'renal insufficiency'] },
  { name: 'Hypothyroidism', keywords: ['hypothyroid', 'hypothyroidism', 'thyroid problem'] },
  { name: 'Dyslipidemia', keywords: ['dyslipidemia', 'high cholesterol', 'hypercholesterolemia'] },
  { name: 'Gastroesophageal Reflux Disease (GERD)', keywords: ['gerd', 'acid reflux', 'gastritis', 'hyperacidity'] },
]

export const KNOWN_PROCEDURES = [
  { name: 'Coronary Angiography', keywords: ['angiography', 'coronary angiogram', 'angio'] },
  { name: 'Percutaneous Coronary Intervention (Stent)', keywords: ['angioplasty', 'stenting', 'pci', 'cardiac stent'] },
  { name: 'Coronary Artery Bypass Graft (CABG)', keywords: ['cabg', 'bypass surgery', 'heart bypass'] },
  { name: 'Appendectomy', keywords: ['appendectomy', 'appendix removal', 'appendix surgery'] },
  { name: 'Cholecystectomy', keywords: ['cholecystectomy', 'gallbladder removal', 'gall stone surgery'] },
  { name: 'Upper GI Endoscopy', keywords: ['endoscopy', 'upper gi endoscopy', 'gastroscopy'] },
  { name: 'Tissue Biopsy', keywords: ['biopsy', 'histopathology', 'tissue biopsy'] },
  { name: 'Hemodialysis', keywords: ['dialysis', 'hemodialysis', 'renal dialysis'] },
  { name: 'Caesarean Section (C-Section)', keywords: ['c-section', 'caesarean', 'cesarean delivery'] },
]

export const KNOWN_SYMPTOMS = [
  { name: 'Chest Pain', keywords: ['chest pain', 'chest tightness', 'angina', 'chhaati me dard'] },
  { name: 'Breathlessness / Dyspnea', keywords: ['breathless', 'shortness of breath', 'dyspnea', 'saans phoolna'] },
  { name: 'Fever', keywords: ['fever', 'pyrexia', 'high temp', 'bukhar'] },
  { name: 'Cough', keywords: ['cough', 'khansi', 'dhasak'] },
  { name: 'Abdominal Pain', keywords: ['abdominal pain', 'stomach pain', 'pet dard'] },
  { name: 'Headache', keywords: ['headache', 'cephalea', 'sir dard'] },
  { name: 'Dizziness / Vertigo', keywords: ['dizziness', 'vertigo', 'chakkar'] },
  { name: 'Palpitations', keywords: ['palpitations', 'heart racing', 'dhadkan tez'] },
]

/**
 * Extracts 5 canonical clinical entity categories from medical documents or conversation
 * @param {string} text - Raw input text
 * @returns {{ diagnoses: Array<string>, medications: Array<Object>, investigations: Array<Object>, procedures: Array<string>, symptoms: Array<string> }}
 */
export function extractCanonicalEntities(text = '') {
  if (!text) return { diagnoses: [], medications: [], investigations: [], procedures: [], symptoms: [] }
  const lower = text.toLowerCase()

  // 1. Diagnoses
  const diagnoses = []
  for (const diag of KNOWN_DIAGNOSES) {
    if (diag.keywords.some(kw => lower.includes(kw))) {
      diagnoses.push(diag.name)
    }
  }

  // 2. Medications (Normalized)
  const medications = extractAndNormalizeMedications(text)

  // 3. Investigations (Structured with abnormal flags)
  const investigations = extractStructuredLabValues(text)

  // 4. Procedures
  const procedures = []
  for (const proc of KNOWN_PROCEDURES) {
    if (proc.keywords.some(kw => lower.includes(kw))) {
      procedures.push(proc.name)
    }
  }

  // 5. Symptoms
  const symptoms = []
  for (const symp of KNOWN_SYMPTOMS) {
    if (symp.keywords.some(kw => lower.includes(kw))) {
      symptoms.push(symp.name)
    }
  }

  return {
    diagnoses,
    medications,
    investigations,
    procedures,
    symptoms
  }
}

// ----------------------------------------------------------------------------
// 7. Stamp & Signature Heuristic Detection (Feature 21)
// ----------------------------------------------------------------------------

/**
 * Detects presence of doctor signature and institutional seal/stamp based on keywords & layout marks
 * @param {string} text - Raw OCR text
 * @returns {{ hasSignature: boolean, hasStamp: boolean, doctorName: string|null }}
 */
export function detectStampAndSignature(text = '') {
  if (!text) return { hasSignature: false, hasStamp: false, doctorName: null }
  const lower = text.toLowerCase()

  const signatureKeywords = ['dr.', 'dr ', 'signature', 'sign', 'mbbs', 'md', 'reg no', 'registration no', 'consultant']
  const stampKeywords = ['seal', 'stamp', 'hospital', 'clinic', 'phc', 'chc', 'medical superintendent', 'authorized signatory']

  const hasSignature = signatureKeywords.some(kw => lower.includes(kw))
  const hasStamp = stampKeywords.some(kw => lower.includes(kw))

  // Try extracting doctor name
  let doctorName = null
  const docMatch = text.match(/\b(Dr\.?\s+[A-Za-z]+(?:\s+[A-Za-z]+)?)\b/i)
  if (docMatch) {
    doctorName = docMatch[1]
  }

  return {
    hasSignature,
    hasStamp,
    doctorName: doctorName || (hasSignature ? 'Registered Physician' : null)
  }
}

// ----------------------------------------------------------------------------
// 8. Unified Master Document Intelligence Pipeline
// ----------------------------------------------------------------------------

/**
 * Executes full Document Intelligence parsing on OCR text
 * @param {string} rawText - Raw OCR text from image
 * @returns {Object} Complete structured document intelligence payload
 */
export function processMedicalDocumentIntelligence(rawText = '') {
  const classification = classifyDocument(rawText)
  const documentDate = extractDocumentDate(rawText)
  const entities = extractCanonicalEntities(rawText)
  const stamps = detectStampAndSignature(rawText)

  const abnormalLabsCount = entities.investigations.filter(i => i.status !== 'normal').length

  return {
    rawText,
    documentType: classification.category,
    classificationConfidence: classification.confidence,
    documentDate,
    stampAndSignature: stamps,
    abnormalValuesCount: abnormalLabsCount,
    extractedData: {
      diagnoses: entities.diagnoses,
      medications: entities.medications,
      investigations: entities.investigations,
      procedures: entities.procedures,
      symptoms: entities.symptoms,
    },
    cdsSummary: {
      hasAbnormalFindings: abnormalLabsCount > 0,
      totalMedicationsFound: entities.medications.length,
      requiresPhysicianAttention: abnormalLabsCount > 0 || entities.medications.length > 3
    },
    analyzedAt: new Date().toISOString()
  }
}
