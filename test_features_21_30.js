// ============================================================================
// ArogyaDarpan — Test Suite for Features 21 through 30
// Medical OCR, Handwritten Prescription Recognition, Document Intelligence,
// Entity Extraction, Lab Extraction, Abnormal Value Flags, Drug Interactions,
// Document Classification, Date Extraction, Chronological Timeline.
// ============================================================================

import {
  preprocessImageForOcr,
  classifyDocument,
  extractDocumentDate,
  extractAndNormalizeMedications,
  extractStructuredLabValues,
  extractCanonicalEntities,
  detectStampAndSignature,
  processMedicalDocumentIntelligence
} from './src/services/documentIntelligenceEngine.js'

import {
  detectDrugInteractions,
  checkDrugInteractions
} from './src/services/drugInteractionEngine.js'

console.log('====================================================')
console.log('🧪 RUNNING VERIFICATION FOR FEATURES 21 TO 30')
console.log('====================================================\n')

let passedTests = 0
let failedTests = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`)
    passedTests++
  } else {
    console.error(`  ❌ FAIL: ${message}`)
    failedTests++
  }
}

// ----------------------------------------------------------------------------
// Feature 21: Medical OCR & Preprocessing & Stamp/Signature
// ----------------------------------------------------------------------------
console.log('--- [Feature 21] Medical OCR & Layout / Stamp / Signature ---')
assert(typeof preprocessImageForOcr === 'function', 'Image preprocessing canvas function is defined')
const ocrTextWithSignature = `
  METRO MULTISPECIALTY HOSPITAL
  Date: 14/08/2024
  Consultant: Dr. R. K. Sharma MD (Cardiology)
  Reg No: DMC/49210
  Verified Seal & Signature of Medical Superintendent
`
const stampResult = detectStampAndSignature(ocrTextWithSignature)
assert(stampResult.hasSignature === true, 'Doctor signature / registration detected')
assert(stampResult.hasStamp === true, 'Institutional stamp / seal detected')
assert(stampResult.doctorName && stampResult.doctorName.includes('Dr.'), `Doctor name extracted: ${stampResult.doctorName}`)

// ----------------------------------------------------------------------------
// Feature 22: Handwritten Prescription Recognition & Medication Normalization
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 22] Handwritten Prescription Normalization (OD, BD, TDS, Duration) ---')
const prescriptionText = `
  Rx:
  1. Tab Metformin 500mg BD x 30 days
  2. Tab Amlodipine 5 mg OD for 1 month
  3. Tab Pantoprazole 40 mg 1-0-0 Before Meals
`
const normalizedMeds = extractAndNormalizeMedications(prescriptionText)
assert(normalizedMeds.length >= 3, `Normalized ${normalizedMeds.length} medications`)
const metformin = normalizedMeds.find(m => m.name === 'Metformin')
assert(metformin && metformin.strength === '500mg' || metformin.strength === '500 mg', `Metformin strength: ${metformin?.strength}`)
assert(metformin && metformin.frequency.includes('Twice Daily (BD)'), `Metformin frequency: ${metformin?.frequency}`)
assert(metformin && metformin.duration.includes('30 days'), `Metformin duration: ${metformin?.duration}`)

const amlodipine = normalizedMeds.find(m => m.name === 'Amlodipine')
assert(amlodipine && amlodipine.frequency.includes('Once Daily (OD)'), `Amlodipine frequency: ${amlodipine?.frequency}`)

// ----------------------------------------------------------------------------
// Feature 23: Medical Document Intelligence (Structured JSON)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 23] Medical Document Intelligence (Structured Output) ---')
const sampleLabOcr = `
  HbA1c: 8.4%
  FBS: 168 mg/dL
  Creatinine: 1.2 mg/dL
`
const structuredLabs = extractStructuredLabValues(sampleLabOcr)
assert(structuredLabs.length === 3, `Extracted ${structuredLabs.length} structured lab values`)
const hba1c = structuredLabs.find(l => l.test.includes('HbA1c'))
assert(hba1c && hba1c.value === 8.4 && hba1c.unit === '%' && hba1c.type === 'laboratory',
  `HbA1c structured: ${JSON.stringify({ test: hba1c?.test, value: hba1c?.value, unit: hba1c?.unit, type: hba1c?.type })}`)

// ----------------------------------------------------------------------------
// Feature 24: Medical Entity Extraction (5 Canonical Buckets)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 24] Medical Entity Extraction (5 Buckets) ---')
const multiEntityText = `
  Patient has history of Type 2 Diabetes and Bronchial Asthma.
  Complaining of severe Chest Pain and Breathlessness.
  Underwent Coronary Angiography and Tissue Biopsy in 2024.
  Prescribed Metformin 500 mg and Salbutamol.
  Investigations show HbA1c: 8.4% and TLC: 12500 /uL.
`
const canonical = extractCanonicalEntities(multiEntityText)
assert(canonical.diagnoses.includes('Type 2 Diabetes Mellitus'), 'Extracted Diagnoses: Diabetes')
assert(canonical.diagnoses.includes('Bronchial Asthma'), 'Extracted Diagnoses: Asthma')
assert(canonical.medications.some(m => m.name === 'Metformin'), 'Extracted Medications: Metformin')
assert(canonical.investigations.some(i => i.test.includes('HbA1c')), 'Extracted Investigations: HbA1c')
assert(canonical.procedures.includes('Coronary Angiography'), 'Extracted Procedures: Coronary Angiography')
assert(canonical.procedures.includes('Tissue Biopsy'), 'Extracted Procedures: Tissue Biopsy')
assert(canonical.symptoms.includes('Chest Pain'), 'Extracted Symptoms: Chest Pain')
assert(canonical.symptoms.includes('Breathlessness / Dyspnea'), 'Extracted Symptoms: Breathlessness')

// ----------------------------------------------------------------------------
// Feature 25: Lab Value Extraction (Test, Value, Unit)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 25] Lab Value Extraction ---')
const hbText = 'Complete Blood Count: Hemoglobin = 9.2 g/dL, Platelets = 240 k/uL'
const hbExtracted = extractStructuredLabValues(hbText)
const hbItem = hbExtracted.find(i => i.test.includes('Hemoglobin'))
assert(hbItem && hbItem.value === 9.2 && hbItem.unit === 'g/dL', `Hemoglobin extracted: ${hbItem?.value} ${hbItem?.unit}`)

// ----------------------------------------------------------------------------
// Feature 26: Abnormal Value Detection (Physiological Reference Ranges)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 26] Abnormal Value Detection & Non-Diagnostic Flagging ---')
const abnormalLabText = 'HbA1c: 8.4% | Hemoglobin: 6.5 g/dL | Fasting Blood Sugar: 168 mg/dL'
const evaluatedLabs = extractStructuredLabValues(abnormalLabText)
const highA1c = evaluatedLabs.find(l => l.test.includes('HbA1c'))
assert(highA1c.status === 'abnormal' && highA1c.direction === 'high', `HbA1c status: ${highA1c.status} (${highA1c.abnormalFlag})`)
assert(highA1c.physicianAttention === true, 'HbA1c flagged for physician attention')

const criticalHb = evaluatedLabs.find(l => l.test.startsWith('Hemoglobin'))
assert(criticalHb && criticalHb.status === 'critical' && criticalHb.direction === 'low', `Severe Anemia Hb: ${criticalHb?.status} (${criticalHb?.abnormalFlag})`)
assert(criticalHb && criticalHb.disclaimer.includes('not a standalone diagnosis'), 'Non-diagnostic clinical disclaimer present')

// ----------------------------------------------------------------------------
// Feature 27: Drug Interaction Detection (Clinical Decision Support)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 27] Drug-Drug Interaction Detection Engine ---')
const medsWithDDI = ['Metformin 500 mg', 'CT contrast media']
const ddiResults1 = detectDrugInteractions(medsWithDDI)
assert(ddiResults1.length > 0 && ddiResults1[0].id === 'DDI-MET-CON', `Metformin + Contrast DDI: ${ddiResults1[0]?.title}`)

const medsWithBleedingRisk = ['Aspirin 75 mg', 'Warfarin 5 mg']
const ddiResults2 = detectDrugInteractions(medsWithBleedingRisk)
assert(ddiResults2.length > 0 && ddiResults2[0].severity === 'critical', `Aspirin + Warfarin bleeding risk: ${ddiResults2[0]?.title}`)

const unifiedWarnings = checkDrugInteractions(['Amoxicillin 500mg'], ['Penicillin'])
assert(unifiedWarnings.some(w => w.id === 'ALLERGY-PEN'), 'Penicillin allergy contraindication caught')

// ----------------------------------------------------------------------------
// Feature 28: Intelligent Document Classification (6 Categories)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 28] Intelligent Document Classification ---')
const docRx = classifyDocument('Rx: Tab Metformin 500mg BD x 30 days. Dr. Gupta Clinic.')
assert(docRx.category === 'Prescription', `Classified as: ${docRx.category}`)

const docLab = classifyDocument('DEPARTMENT OF BIOCHEMISTRY PATHOLOGY LAB: Specimen Blood, Serum Creatinine 1.2 mg/dL Reference range.')
assert(docLab.category === 'Laboratory Report', `Classified as: ${docLab.category}`)

const docDischarge = classifyDocument('DISCHARGE SUMMARY: Admission Date: 12/03/2024. Discharge Date: 16/03/2024. Course in hospital: Patient stabilized.')
assert(docDischarge.category === 'Discharge Summary', `Classified as: ${docDischarge.category}`)

const docImaging = classifyDocument('RADIOLOGY IMAGING REPORT: CT Scan Abdomen and Chest X-ray. Impression: Clear lung fields.')
assert(docImaging.category === 'Imaging Report', `Classified as: ${docImaging.category}`)

const docCert = classifyDocument('MEDICAL CERTIFICATE: This is to certify that Mr. Kumar is unfit for duty due to acute gastroenteritis. Bed rest advised for 5 days.')
assert(docCert.category === 'Medical Certificate', `Classified as: ${docCert.category}`)

// ----------------------------------------------------------------------------
// Feature 29: Document Date Extraction (Multi-format)
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 29] Document Date Extraction ---')
const d1 = extractDocumentDate('Prescription Date: 12/03/2024 by Dr. Roy')
assert(d1 === '2024-03-12', `DD/MM/YYYY extracted: ${d1}`)

const d2 = extractDocumentDate('Specimen collected: 15-Mar-2024 at 08:30 AM')
assert(d2 === '2024-03-15', `DD-Mon-YYYY extracted: ${d2}`)

const d3 = extractDocumentDate('Hospital Discharge: 2024-05-20')
assert(d3 === '2024-05-20', `YYYY-MM-DD extracted: ${d3}`)

// ----------------------------------------------------------------------------
// Feature 30: Automatic Chronological Timeline Aggregator
// ----------------------------------------------------------------------------
console.log('\n--- [Feature 30] Unified Multi-Year Chronological Timeline ---')
const fullDocIntel = processMedicalDocumentIntelligence(`
  DISCHARGE SUMMARY
  Date: 20/03/2024
  Diagnosis: Essential Hypertension
  Procedure: Coronary Angiography
  Rx: Tab Amlodipine 5 mg OD
  HbA1c: 7.8%
`)

assert(fullDocIntel.documentType === 'Discharge Summary', `Document recognized as: ${fullDocIntel.documentType}`)
assert(fullDocIntel.documentDate === '2024-03-20', `Date recognized: ${fullDocIntel.documentDate}`)
assert(fullDocIntel.extractedData.procedures.includes('Coronary Angiography'), 'Procedure captured for timeline')
assert(fullDocIntel.abnormalValuesCount > 0, 'Abnormal lab count computed for timeline')

console.log('\n====================================================')
console.log(`📊 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`)
console.log('====================================================\n')

if (failedTests > 0) {
  process.exit(1)
}
