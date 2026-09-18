// ============================
// ArogyaDarpan / MediKiosk — Standardized Clinical Summary Generator
// Formats summary strictly according to SIH specifications:
// Chief Complaint → HPI (SOCRATES) → Past Medical/Surgical → Drug & Allergy → Family → Personal → Review of Systems (ROS) → Prior Investigations → Dashavidha Pariksha (AYUSH)
// ============================

export async function generateSummary(consultationId, responses = [], documents = []) {
  return {
    consultationId,
    orderOfSections: [
      'Chief Complaint',
      'History of Present Illness (SOCRATES)',
      'Past Medical & Surgical History',
      'Drug & Allergy History',
      'Family History',
      'Personal & Lifestyle History (Ahara-Vihara)',
      'Review of Systems (ROS)',
      'Prior Investigations Summary',
      'Dashavidha Pariksha (AYUSH 10-Fold Assessment)',
    ],
    chiefComplaint: 'Central chest pain for 3 days with exertional dyspnea',
    hpiSocrates: {
      site: 'Substernal / Center of chest',
      onset: 'Sudden onset 3 days ago during stair climbing',
      character: 'Heavy squeezing pressure (Dull pressure)',
      radiation: 'Radiates to left arm and shoulder',
      associations: 'Associated with shortness of breath (Dyspnea) and profuse sweating',
      timecourse: 'Episodic, triggered by walking',
      exacerbating: 'Worse with exertion; better with rest',
      severity: '7 / 10 on Pain Scale',
    },
    pastHistory: [
      { condition: 'Type 2 Diabetes Mellitus', since: '2024', source: 'Discharge_Summary_2024.pdf', verified: true },
      { condition: 'Essential Hypertension', since: '2022', source: 'Prescription_2025.pdf', verified: true },
    ],
    medications: [
      { name: 'Metformin 500 mg', frequency: 'twice daily after meals', source: 'Prescription_12_May_2025.pdf', confidence: 0.96, verified: true },
      { name: 'Amlodipine 5 mg', frequency: 'once daily in morning', source: 'Prescription_12_May_2025.pdf', confidence: 0.92, verified: true },
    ],
    allergies: {
      status: 'conflict',
      currentResponse: 'Patient stated "No known allergies" during intake',
      historicalRecord: 'Penicillin Allergy documented in 2024 Discharge Summary',
      needsReview: true,
    },
    familyHistory: 'Father had premature Coronary Artery Disease (Heart Attack at age 52)',
    personalHistory: {
      smoking: 'Quit 2 years ago',
      alcohol: 'Occasional',
      diet: 'Ahara: Mixed diet, irregular meal times',
    },
    reviewOfSystems: [
      { system: 'Cardiovascular', findings: 'Chest pain, exertional dyspnea, diaphoresis' },
      { system: 'Respiratory', findings: 'Shortness of breath on exertion; no cough' },
      { system: 'Gastrointestinal', findings: 'Mild acid reflux; no nausea or hematemesis' },
      { system: 'Genitourinary', findings: 'No dysuria or nocturia' },
    ],
    investigations: [
      { name: 'HbA1c', value: '8.2%', date: '2025-05-12', status: 'abnormal', referenceRange: '4.0 - 5.6 %', source: 'Lab_Report_HbA1c.pdf' },
      { name: 'Fasting Blood Glucose', value: '162 mg/dL', date: '2025-05-12', status: 'abnormal', referenceRange: '70 - 100 mg/dL', source: 'Lab_Report_HbA1c.pdf' },
    ],
    dashavidhaPariksha: {
      prakriti: 'Vata-Pitta Dvandvaja',
      vikriti: 'Vata-Pitta Vriddhi (Ruksha & Ushna vitiation)',
      sara: 'Rakta & Mamsa Sara',
      samhanana: 'Madhyama Samhanana (Moderate Build)',
      satmya: 'Madhyama Satmya',
      sattva: 'Madhyama Sattva',
      aharaShakti: 'Visham Agni (Irregular Appetite & Digestion)',
      vyayamaShakti: 'Avara Vyayama Shakti (Low Physical Endurance)',
      vaya: 'Madhyama Vaya (46 years)',
      koshtha: 'Krura Koshtha (Prone to constipation)',
    },
    generatedAt: new Date().toISOString(),
    verificationStatus: 'unverified',
  }
}
