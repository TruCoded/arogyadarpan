// ============================================================================
// ArogyaDarpan — Advanced Client-Side Optical Character Recognition (OCR) Engine
// Integrated with Medical Document Intelligence & Drug-Drug Interaction Check
// Inspired by Medical-Prescription-OCR & Clinical NLP Pipelines
// ============================================================================

import { createWorker } from 'tesseract.js'
import { extractMedicalEntities, MEDICATION_DICTIONARY, LAB_TEST_DICTIONARY, SYMPTOM_DICTIONARY, ALLERGY_KEYWORDS } from './medicalParserService'
import {
  processMedicalDocumentIntelligence,
  extractDocumentDate,
  classifyDocument,
  FREQUENCY_MAP,
  KNOWN_MEDICINES,
  CLINICAL_LAB_DICTIONARY
} from './documentIntelligenceEngine'
import { detectDrugInteractions } from './drugInteractionEngine'

/**
 * Pre-processes an image via Canvas (grayscale + adaptive contrast binarization)
 * to maximize OCR recognition accuracy on printed and handwritten medical prescriptions.
 */
async function enhanceImageForOCR(imageSource) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return imageSource
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        // Scale up small images for better OCR resolution if needed
        const scale = img.width < 1200 ? Math.min(2.0, 1600 / img.width) : 1.0
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imgData.data

        // Step 1: Calculate brightness histogram for adaptive contrast
        let minLuma = 255
        let maxLuma = 0
        for (let i = 0; i < d.length; i += 4) {
          const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
          if (luma < minLuma) minLuma = luma
          if (luma > maxLuma) maxLuma = luma
        }

        const lumaRange = maxLuma - minLuma || 1

        // Step 2: High-contrast binarization & edge sharpening
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
          const normalized = ((gray - minLuma) / lumaRange) * 255
          // Adaptive threshold: amplify ink strokes while flattening background paper noise
          const val = normalized < 145 ? Math.max(0, normalized * 0.5) : Math.min(255, normalized * 1.25)
          d[i] = val
          d[i + 1] = val
          d[i + 2] = val
        }
        ctx.putImageData(imgData, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.95))
      } catch (e) {
        resolve(imageSource)
      }
    }
    img.onerror = () => resolve(imageSource)

    if (imageSource instanceof File || imageSource instanceof Blob) {
      img.src = URL.createObjectURL(imageSource)
    } else if (typeof imageSource === 'string') {
      img.src = imageSource
    } else {
      resolve(imageSource)
    }
  })
}

/**
 * Standardize Frequency Strings into Clean Clinical Formats
 */
function normalizeFrequencyString(freqStr = '') {
  if (!freqStr) return '1-0-1 (Twice Daily)'
  const clean = freqStr.trim().toLowerCase()
  if (clean.includes('1-0-1') || clean.includes('bd') || clean.includes('bid') || clean.includes('twice')) {
    return '1-0-1 (Twice Daily - Morning & Night)'
  }
  if (clean.includes('1-0-0') || clean.includes('od') || clean.includes('qd') || clean.includes('once') || clean.includes('morning')) {
    return '1-0-0 (Once Daily - Morning)'
  }
  if (clean.includes('0-0-1') || clean.includes('hs') || clean.includes('bedtime') || clean.includes('night')) {
    return '0-0-1 (Once Daily - At Bedtime)'
  }
  if (clean.includes('1-1-1') || clean.includes('tds') || clean.includes('tid') || clean.includes('thrice')) {
    return '1-1-1 (Thrice Daily - Morning, Noon & Night)'
  }
  if (clean.includes('1-1-1-1') || clean.includes('qid')) {
    return '1-1-1-1 (Four Times Daily)'
  }
  if (clean.includes('sos') || clean.includes('prn') || clean.includes('needed')) {
    return 'SOS (As Needed / If Required)'
  }
  if (clean.includes('stat') || clean.includes('immediately')) {
    return 'STAT (Immediate Single Dose)'
  }
  return freqStr.toUpperCase()
}

/**
 * Advanced Medical Prescription Line Parser
 * Extracts Rx lines, forms, dosages, frequencies, durations, instructions, and advice.
 */
// ----------------------------------------------------------------------------
// Comprehensive Indian Clinical Medication & Brand Names Dictionary
// ----------------------------------------------------------------------------
const COMMON_INDIAN_MEDICINES = [
  'metformin', 'glycomet', 'glucophage', 'obimet', 'cetapin',
  'glimepiride', 'amaryl', 'glimisave', 'glimy', 'zoryl',
  'vildagliptin', 'galvus', 'jalra', 'sitagliptin', 'januvia',
  'dapagliflozin', 'forxiga', 'oxra', 'empagliflozin', 'jardiance',
  'paracetamol', 'pcm', 'crocin', 'dolo', 'calpol', 'panadol', 'pacimol',
  'aceclofenac', 'zerodol', 'hifenac', 'aceclo',
  'diclofenac', 'voveran', 'dynapar', 'reactin',
  'ibuprofen', 'brufen', 'combiflam', 'ibugesic',
  'tramadol', 'ultram', 'tramazac', 'tramacip',
  'pantoprazole', 'pan', 'pantocid', 'pantodac', 'pantosec',
  'rabeprazole', 'razo', 'rablet', 'happi', 'rabicip',
  'omeprazole', 'omez', 'omiz', 'ocid',
  'esomeprazole', 'nexpro', 'esomac',
  'ranitidine', 'aciloc', 'rantac', 'famotidine',
  'amlodipine', 'amlong', 'stamlo', 'amlovas', 'amlo',
  'telmisartan', 'telma', 'telmikind', 'telsar', 'telpres',
  'losartan', 'losacar', 'repace', 'losar',
  'olmesartan', 'olmat', 'olmin',
  'atenolol', 'aten', 'betacard', 'metoprolol', 'betaloc', 'metolar',
  'atorvastatin', 'atorva', 'lipitor', 'storvas', 'atocor',
  'rosuvastatin', 'rosuvas', 'rozavel', 'crestor',
  'aspirin', 'ecosprin', 'disprin', 'asa', 'loprin',
  'clopidogrel', 'clopilet', 'plavix', 'clopivas', 'deplatt',
  'amoxicillin', 'mox', 'novamox', 'amoxil', 'augmentin', 'clamamox', 'moxikind',
  'azithromycin', 'azee', 'azithral', 'zady', 'azit',
  'cefixime', 'zifi', 'ceftas', 'taxim-o', 'mahacef',
  'ciprofloxacin', 'cifran', 'ciro', 'ciplox',
  'levofloxacin', 'levomac', 'levoflox', 'l-cin',
  'doxycycline', 'doxy-1', 'microdox',
  'montelukast', 'montair', 'montek', 'telekast',
  'levocetirizine', 'levocet', 'levorid', 'vozcet',
  'cetirizine', 'cetzine', 'okacet', 'alerid',
  'salbutamol', 'asthalin', 'ventorlin',
  'budesonide', 'budecort', 'pulmicort',
  'formoterol', 'foracort', 'maxiflo',
  'cough syrup', 'ascoril', 'benadryl', 'grilinctus', 'alex', 'chericof', 't-koff',
  'levothyroxine', 'thyronorm', 'eltroxin', 'thyrox',
  'gabapentin', 'gabapin', 'gabaneuron',
  'pregabalin', 'pregalin', 'maxgalin', 'lyrica',
  'alprazolam', 'alprax', 'restyl', 'clonazepam', 'clona', 'zapiz',
  'multivitamin', 'becosules', 'supradyn', 'zincovit', 'a-to-z',
  'calcium', 'shelcal', 'cipcal', 'calcimax', 'ostocalcium',
  'vitamin d3', 'uprise-d3', 'd3-must', 'calcirol',
  'iron', 'autrin', 'dexorange', 'feronia', 'orofer',
]

/**
 * Advanced Medical Prescription Line Parser
 * Extracts Rx lines, forms, dosages, frequencies, durations, instructions, and advice.
 * Supports all standard Indian handwriting conventions and shortforms.
 */
export function parsePrescriptionLines(text) {
  if (!text) return { medications: [], diagnoses: [], labResults: [], advice: [], doctorInfo: {}, patientInfo: {} }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const medications = []
  const diagnoses = []
  const labResults = []
  const advice = []

  let doctorInfo = {
    name: null,
    qualification: null,
    regNo: null,
    clinicName: null,
  }

  let patientInfo = {
    name: null,
    age: null,
    gender: null,
  }

  // Regex patterns for medicine line extraction
  const medPrefixRegex = /^(?:(?:\d+[\.\)]\s*)?(?:Tab(?:let)?|Cap(?:sule)?|Syp(?:rup)?|Inj(?:ection)?|Oint(?:ment)?|Drops?|Cream|Gel|Susp(?:ension)?|Inhaler|Resp|Neb)\.?\s+)?([A-Za-z0-9\s\/\+\-]+?)(?:\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|g|gm|ml|iu|%|puffs?|units?|drops?)))?(?:\s*[-—–:])?(?:\s+((?:[01]-[01]-[01]|[01]\s*x\s*[0-3]|OD|BD|BID|TDS|TID|QID|SOS|PRN|HS|AC|PC|BBF|M&N|Once\s+daily|Twice\s+daily|Thrice\s+daily|At\s+bedtime|Empty\s+stomach)))?(?:\s*(?:x|for|\*)\s*(\d+\s*(?:days?|weeks?|months?|d|w|m)))?/i

  for (const line of lines) {
    // 1. Doctor & Clinic headers
    const docMatch = line.match(/(?:Dr\.|Doctor|Dr\s+)([A-Za-z\s\.]+)/i)
    if (docMatch && !doctorInfo.name) {
      const docClean = docMatch[1].trim()
      if (docClean.length > 2 && !/^(prescription|date|clinic|hospital|patient|opd)$/i.test(docClean)) {
        doctorInfo.name = `Dr. ${docClean}`
      }
    }
    const qualMatch = line.match(/\b(MBBS|MD|MS|DM|MCh|DNB|BAMS|BHMS|BDS|MRCP|FRCP|DCH|DGO|DA)\b/i)
    if (qualMatch && !doctorInfo.qualification) {
      doctorInfo.qualification = qualMatch[0].toUpperCase()
    }
    const regMatch = line.match(/(?:Reg(?:istration)?\.?\s*(?:No\.?)?|DMC|MCI|KMC|MMC|TMC|GMC|PMC)\s*[:=-]?\s*([A-Za-z0-9\-\/]+)/i)
    if (regMatch && !doctorInfo.regNo) {
      doctorInfo.regNo = regMatch[1].trim()
    }
    const clinicMatch = line.match(/(?:Hospital|Clinic|Health\s*Center|Nursing\s*Home|Dispensary|Medical\s*Centre|Pathology|Diagnostic|Polyclinic|Care)/i)
    if (clinicMatch && !doctorInfo.clinicName && line.length < 70) {
      doctorInfo.clinicName = line.trim()
    }

    // 2. Patient Demographics
    const ptMatch = line.match(/(?:Pt|Patient|Name)\s*[:=-]?\s*([A-Za-z\s]+?)(?:\s*[\/|,]|\s+(?:Age|Gender|Sex|Yr|Y\/O|Date))/i)
    if (ptMatch && !patientInfo.name && ptMatch[1].trim().length > 2) {
      patientInfo.name = ptMatch[1].trim()
    }
    const ageMatch = line.match(/\b(\d{1,3})\s*(?:yrs?|years?|y\/o|yr)\b/i)
    if (ageMatch && !patientInfo.age) {
      patientInfo.age = parseInt(ageMatch[1], 10)
    }
    const genderMatch = line.match(/\b(Male|Female|M|F)\b/i)
    if (genderMatch && !patientInfo.gender) {
      patientInfo.gender = genderMatch[1].toLowerCase().startsWith('m') ? 'Male' : 'Female'
    }

    // 3. Clinical Diagnoses
    const diagMatch = line.match(/(?:Diagnosis|Impression|Assessment|K\/C\/O|Known Case of|C\/O|Dx|Provisional)\s*[:=-]?\s*([^\n\r,;]+)/i)
    if (diagMatch && diagMatch[1]) {
      const diagClean = diagMatch[1].trim()
      if (diagClean.length > 2 && !diagnoses.includes(diagClean)) {
        diagnoses.push(diagClean)
      }
    }

    // 4. Prescribed Medication Line
    const medMatch = line.match(medPrefixRegex)
    if (medMatch && medMatch[1] && medMatch[1].length > 2) {
      const candidateName = medMatch[1].trim()
      const isHeaderWord = /^(patient|doctor|date|clinic|hospital|investigation|diagnosis|report|test|rx|advice|history|treatment|findings|summary|notes|signature|seal|reg|age|gender|sex|phone|address|opd|room|name)$/i.test(candidateName)
      
      if (!isHeaderWord) {
        let form = 'Tablet'
        if (/\b(?:cap|capsule)\b/i.test(line)) form = 'Capsule'
        else if (/\b(?:syp|syrup|susp|suspension)\b/i.test(line)) form = 'Syrup'
        else if (/\b(?:inj|injection)\b/i.test(line)) form = 'Injection'
        else if (/\b(?:oint|ointment|cream|gel)\b/i.test(line)) form = 'Ointment'
        else if (/\b(?:drops?)\b/i.test(line)) form = 'Drops'
        else if (/\b(?:inhaler|resp|neb)\b/i.test(line)) form = 'Inhaler'

        let timing = 'After Food (PC)'
        if (/\b(?:ac|before (?:food|meals|breakfast)|empty stomach|bbf)\b/i.test(line)) {
          timing = 'Before Food (AC - Empty Stomach)'
        } else if (/\b(?:hs|bedtime|night|nocte)\b/i.test(line)) {
          timing = 'At Bedtime (HS)'
        } else if (/\b(?:sos|prn|as needed)\b/i.test(line)) {
          timing = 'As Needed (SOS)'
        }

        const frequency = normalizeFrequencyString(medMatch[3] || '1-0-1')
        const duration = medMatch[4] || 'As directed'

        // Check if candidate matches any known medicine keyword or has dosage
        const isKnownMed = COMMON_INDIAN_MEDICINES.some(m => candidateName.toLowerCase().includes(m))
        const hasStrength = Boolean(medMatch[2])

        if (isKnownMed || hasStrength || /tab|cap|syp|inj/i.test(line)) {
          medications.push({
            id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: candidateName,
            form,
            strength: medMatch[2] ? medMatch[2].trim() : 'Standard dose',
            frequency,
            duration,
            timing,
            rawLine: line,
            confidence: isKnownMed ? 0.95 : 0.88
          })
        }
      }
    }

    // 5. Laboratory & Vital Signs
    const labMatch = line.match(/(HbA1c|FBS|PPBS|Fasting Glucose|Creatinine|BUN|WBC|TLC|Hemoglobin|Hb|Platelets|SGPT|ALT|SGOT|AST|TSH|Cholesterol|LDL|HDL|Triglycerides|Uric Acid|BP|Blood Pressure|Troponin|SpO2|Glucose|Urea|Bilirubin|ESR)\s*[:=-]?\s*([\d\.]+(?:\/\d+)?)\s*([a-zA-Z%\/]+)?/i)
    if (labMatch) {
      const testName = labMatch[1].trim()
      const rawVal = labMatch[2].trim()
      const unit = labMatch[3] ? labMatch[3].trim() : ''
      
      let status = 'normal'
      let direction = 'normal'
      const numVal = parseFloat(rawVal)
      if (!isNaN(numVal)) {
        if (/hba1c/i.test(testName) && numVal > 5.6) { status = 'abnormal'; direction = 'high' }
        else if (/fbs|fasting/i.test(testName) && numVal > 99) { status = 'abnormal'; direction = 'high' }
        else if (/ppbs/i.test(testName) && numVal > 140) { status = 'abnormal'; direction = 'high' }
        else if (/creatinine/i.test(testName) && numVal > 1.2) { status = 'abnormal'; direction = 'high' }
        else if (/cholesterol/i.test(testName) && numVal > 200) { status = 'abnormal'; direction = 'high' }
        else if (/hemoglobin|hb/i.test(testName) && numVal < 12) { status = 'abnormal'; direction = 'low' }
        else if (/wbc|tlc/i.test(testName) && numVal > 11000) { status = 'abnormal'; direction = 'high' }
      }

      labResults.push({
        id: `lab-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        test: testName,
        value: rawVal,
        unit,
        status,
        direction,
        confidence: 0.94
      })
    }

    // 6. Clinical Advice & Follow-up
    const advMatch = line.match(/(?:Advice|Plan|Follow[- ]up|Precautions|Diet|Review|Adv)\s*[:=-]?\s*([^\n\r]+)/i)
    if (advMatch && advMatch[1] && advMatch[1].length > 3) {
      advice.push(advMatch[1].trim())
    }
  }

  return { medications, diagnoses, labResults, advice, doctorInfo, patientInfo }
}

/**
 * Perform real OCR text extraction and Medical Document Intelligence on an image
 * @param {File|Blob|string} imageSource - The uploaded medical document image
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Object>} Extracted clinical entities, classification, normalized meds, and CDS alerts
 */
export async function scanMedicalDocument(imageSource, onProgress) {
  let rawText = ''
  let confidence = 0.85

  try {
    onProgress?.({ status: 'Preprocessing image: contrast stretch & adaptive binarization...', progress: 20 })
    const preprocessedImage = await enhanceImageForOCR(imageSource)

    onProgress?.({ status: 'Running OCR neural text extraction...', progress: 50 })
    const worker = await createWorker('eng')
    const { data } = await worker.recognize(preprocessedImage)
    rawText = (data.text || '').trim()
    confidence = Math.round((data.confidence || 80)) / 100
    await worker.terminate()
  } catch (err) {
    console.warn('OCR extraction warning:', err)
    rawText = ''
    confidence = 0.50
  }

  onProgress?.({ status: 'Analyzing extracted text & clinical entities...', progress: 85 })

  // 1. Line-by-line regex parsing from authentic OCR text
  const rxParsed = parsePrescriptionLines(rawText)

  // 2. Document Intelligence entity parser
  const docIntel = processMedicalDocumentIntelligence(rawText)
  const parsedBasic = extractMedicalEntities(rawText)

  // 3. Merge only actually detected medications
  const medicationMap = new Map()

  for (const med of rxParsed.medications) {
    const key = med.name.toLowerCase().trim()
    if (key.length > 1) {
      medicationMap.set(key, {
        id: med.id || `med-${Math.random().toString(36).substr(2, 7)}`,
        name: med.name,
        form: med.form || 'Tablet',
        strength: med.strength || 'Standard dose',
        frequency: med.frequency || '1-0-1 (Twice Daily)',
        duration: med.duration || 'As directed',
        timing: med.timing || 'After Food (PC)',
        category: 'Prescription Drug',
        confidence: med.confidence || 0.90,
      })
    }
  }

  for (const med of docIntel.extractedData.medications) {
    const key = med.name.toLowerCase().trim()
    if (key.length > 1 && !medicationMap.has(key)) {
      medicationMap.set(key, {
        id: `med-${Math.random().toString(36).substr(2, 7)}`,
        name: med.name,
        form: 'Tablet',
        strength: med.strength || 'Standard dose',
        frequency: med.frequency || '1-0-1 (Twice Daily)',
        duration: med.duration || 'As directed',
        timing: 'After Food (PC)',
        category: med.category || 'Prescription Drug',
        confidence: med.confidence || 0.88,
      })
    }
  }

  const allMedications = Array.from(medicationMap.values())

  // 4. Merge only actually detected lab investigations
  const investigationMap = new Map()

  for (const lab of rxParsed.labResults) {
    const key = lab.test.toLowerCase().trim()
    investigationMap.set(key, {
      id: lab.id || `lab-${Math.random().toString(36).substr(2, 7)}`,
      test: lab.test,
      name: lab.test,
      value: lab.value,
      unit: lab.unit,
      referenceRange: 'Standard',
      status: lab.status,
      direction: lab.direction,
      abnormalFlag: lab.status === 'abnormal' ? (lab.direction === 'high' ? '↑ High' : '↓ Low') : 'Normal',
      confidence: lab.confidence || 0.90
    })
  }

  for (const inv of docIntel.extractedData.investigations) {
    const key = (inv.test || inv.name || '').toLowerCase().trim()
    if (key.length > 1 && !investigationMap.has(key)) {
      investigationMap.set(key, {
        id: `lab-${Math.random().toString(36).substr(2, 7)}`,
        test: inv.test || inv.name,
        name: inv.test || inv.name,
        value: inv.value,
        unit: inv.unit || '',
        referenceRange: inv.referenceRange || 'Standard',
        status: inv.status || 'normal',
        direction: inv.direction || 'normal',
        abnormalFlag: inv.status === 'abnormal' ? (inv.direction === 'high' ? '↑ High' : '↓ Low') : 'Normal',
        confidence: inv.confidence || 0.90
      })
    }
  }

  const mergedInvestigations = Array.from(investigationMap.values())

  // 5. Diagnoses only extracted from text
  const allDiagnoses = Array.from(new Set([
    ...rxParsed.diagnoses,
    ...docIntel.extractedData.diagnoses,
  ])).filter(Boolean)

  // 6. Advice only extracted from text
  const allAdvice = Array.from(new Set([
    ...rxParsed.advice,
    ...(docIntel.extractedData.procedures || []),
  ])).filter(Boolean)

  // 7. Clinical Drug-Drug Interactions on actual extracted meds
  const detectedInteractions = allMedications.length > 1 ? detectDrugInteractions(allMedications) : []

  // 8. Strict Medical Document Verification (Reject non-medical / artzy / blank images)
  const hasMedications = allMedications.length > 0
  const hasLabResults = mergedInvestigations.length > 0
  const hasDoctorInfo = Boolean(rxParsed.doctorInfo?.name || rxParsed.doctorInfo?.clinicName || rxParsed.doctorInfo?.regNo || rxParsed.doctorInfo?.qualification)
  const hasDiagnoses = allDiagnoses.length > 0
  
  // Stricter medical validation: MUST contain doctor handwriting/name, hospital/clinic, medications, or lab values
  const isValidMedicalDocument = Boolean(
    hasDoctorInfo ||
    hasMedications ||
    hasLabResults ||
    hasDiagnoses
  )

  const validationError = isValidMedicalDocument
    ? null
    : 'Non-Medical Document Detected: No doctor credentials, clinic or hospital header, prescribed medications, or laboratory findings were detected in this image. To protect patient safety, only authentic medical documents can be confirmed.'

  onProgress?.({ status: 'OCR Extraction Complete!', progress: 100 })

  return {
    rawText,
    isValidMedicalDocument,
    validationError,
    documentType: isValidMedicalDocument ? (docIntel.documentType || (allMedications.length ? 'Prescription' : 'Medical Record')) : 'Unrecognized Non-Medical Document',
    documentCategory: isValidMedicalDocument ? (docIntel.documentType || 'Medical Record') : 'Invalid Image / Art Print',
    classificationConfidence: isValidMedicalDocument ? (docIntel.classificationConfidence || 0.90) : 0,
    documentDate: extractDocumentDate(rawText) || new Date().toISOString().split('T')[0],
    doctorInfo: rxParsed.doctorInfo.name || rxParsed.doctorInfo.clinicName ? rxParsed.doctorInfo : null,
    patientInfo: rxParsed.patientInfo.name ? rxParsed.patientInfo : null,
    stampAndSignature: docIntel.stampAndSignature || {
      detected: false,
      hasSignature: false,
      hasStamp: false,
      confidence: 0,
      signatory: null
    },
    abnormalValuesCount: mergedInvestigations.filter(i => i.status !== 'normal').length,
    extractedData: {
      diagnosis: allDiagnoses,
      medications: allMedications,
      investigations: mergedInvestigations,
      procedures: docIntel.extractedData.procedures,
      symptoms: docIntel.extractedData.symptoms,
      allergies: parsedBasic.allergies,
      advice: allAdvice,
    },
    drugInteractions: detectedInteractions,
    confidence: isValidMedicalDocument ? Math.max(confidence, docIntel.classificationConfidence || 0.85) : 0.0,
    parsedAt: new Date().toISOString(),
  }
}

export { extractDocumentDate, classifyDocument }

