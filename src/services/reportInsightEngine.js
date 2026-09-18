// ============================
// ArogyaDarpan — AI Medical Report Explanation & Curative Insight Engine
// Explains what medical reports say in plain language and outlines medical/treatment insights
// ============================

/**
 * Generate intelligent clinical & plain-language insights for any medical report / extraction
 * @param {Object} documentData - OCR document extraction or lab result object
 * @returns {Object} Report Insights (Plain Summary, Medical Meaning, Medicines & Curative Insights, AYUSH Guidance)
 */
export function generateReportInsights(documentData = {}) {
  const extraction = documentData.extractedData || documentData || {}
  const labs = extraction.investigations || []
  const meds = extraction.medications || []
  const diags = extraction.diagnosis || []
  const symptoms = extraction.symptoms || []

  const insights = []
  const curativeMedicines = []
  const ayushRecommendations = []

  // Analyze Lab Results
  labs.forEach(lab => {
    const key = (lab.name || lab.key || '').toLowerCase()
    const val = parseFloat(lab.value) || 0

    if (key.includes('hba1c')) {
      if (val > 6.5) {
        insights.push({
          title: `HbA1c Level (${val}%) — High Blood Glucose Average`,
          plainText: `Your HbA1c result of ${val}% indicates that your average blood sugar levels over the past 2 to 3 months have been higher than the normal target range (below 5.7%).`,
          plainTextHi: `आपका HbA1c स्तर ${val}% है, जिसका अर्थ है कि पिछले 3 महीनों में आपका औसतन रक्त शर्करा (ब्लड शुगर) सामान्य से अधिक रहा है।`,
          clinicalMeaning: 'Suboptimal Glycemic Control (Type 2 Diabetes Mellitus)',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Metformin (500mg / 850mg)',
          role: 'First-line antidiabetic medication that reduces glucose production in the liver and improves insulin sensitivity.',
          lifestyle: 'Low glycemic index diet, portion control, 30-45 mins daily walking.',
        })
        ayushRecommendations.push({
          herb: 'Meha-hara Dravyas (Karela, Methi, Jamun seed powder, Amla)',
          principle: 'Kapha-Pitta Shamaka & Agni Deepana to balance Meda Dhatu.',
        })
      }
    } else if (key.includes('glucose') || key.includes('sugar')) {
      if (val > 125) {
        insights.push({
          title: `Fasting Blood Glucose (${val} mg/dL) — Elevated Sugar`,
          plainText: `Your fasting blood sugar of ${val} mg/dL is above the normal fasting limit of 100 mg/dL.`,
          plainTextHi: `आपका खाली पेट ब्लड शुगर ${val} mg/dL है, जो सामान्य 100 mg/dL से अधिक है।`,
          clinicalMeaning: 'Fasting Hyperglycemia',
          status: 'abnormal',
        })
      }
    } else if (key.includes('hemoglobin') || key.includes('hb')) {
      if (val < 12.0) {
        insights.push({
          title: `Hemoglobin (${val} g/dL) — Low Red Blood Cell Level (Anemia)`,
          plainText: `Your hemoglobin level of ${val} g/dL is below the normal range (12.0 - 16.5 g/dL). This indicates mild-to-moderate anemia, which can cause fatigue, weakness, or breathlessness.`,
          plainTextHi: `आपका हीमोग्लोबिन ${val} g/dL है जो सामान्य से कम है। यह एनीमिया (खून की कमी) का संकेत है जिससे थकान और कमजोरी हो सकती है।`,
          clinicalMeaning: 'Anemia / Reduced Oxygen Carrying Capacity',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Ferrous Ascorbate + Folic Acid (Iron Supplement)',
          role: 'Restores depleted iron stores and supports healthy red blood cell synthesis.',
          lifestyle: 'Iron-rich diet: Spinach (Palak), Beetroot, Pomegranate, Jaggery (Gud), Legumes.',
        })
        ayushRecommendations.push({
          herb: 'Pandu-hara Dravyas (Loha Bhasma, Punarnava Mandur, Drakshavaleha)',
          principle: 'Rakta Dhatu Vardhana and Agni balancing.',
        })
      }
    } else if (key.includes('tsh') || key.includes('thyroid')) {
      if (val > 4.5) {
        insights.push({
          title: `TSH (${val} uIU/mL) — Elevated Thyroid Stimulating Hormone`,
          plainText: `Your TSH of ${val} uIU/mL is higher than the upper limit (4.2 uIU/mL). This often points to an underactive thyroid gland (Hypothyroidism).`,
          plainTextHi: `आपका TSH स्तर ${val} है जो सामान्य से अधिक है। यह हाइपोथायरायडिज्म का संकेत हो सकता है।`,
          clinicalMeaning: 'Primary Hypothyroidism / Subclinical Hypothyroidism',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Levothyroxine (25mcg - 50mcg empty stomach)',
          role: 'Synthetic thyroid hormone replacement to normalize metabolic rate.',
          lifestyle: 'Regular morning exercise, iodine-rich balanced diet, stress management.',
        })
        ayushRecommendations.push({
          herb: 'Galaganda-hara Dravyas (Kanchanar Guggulu, Ashwagandha)',
          principle: 'Kapha-Vata Shamana and Medas clearance.',
        })
      }
    } else if (key.includes('wbc') || key.includes('leucocyte')) {
      if (val > 11000) {
        insights.push({
          title: `WBC Count (${val} /uL) — Elevated White Blood Cells`,
          plainText: `Your White Blood Cell count is ${val} /uL, which is higher than normal. This usually means your immune system is actively fighting an infection or inflammation.`,
          plainTextHi: `आपकी सफेद रक्त कोशिकाओं (WBC) की संख्या ${val} है, जो संक्रमण या सूजन का संकेत देती है।`,
          clinicalMeaning: 'Leukocytosis (Infection / Inflammatory response)',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Broad-Spectrum Antibiotics (if bacterial etiology confirmed by physician)',
          role: 'Eliminates bacterial pathogens responsible for elevated leucocytes.',
          lifestyle: 'Adequate hydration, bed rest, fever monitoring.',
        })
      }
    } else if (key.includes('creatinine')) {
      if (val > 1.2) {
        insights.push({
          title: `Serum Creatinine (${val} mg/dL) — Elevated Kidney Marker`,
          plainText: `Creatinine is a waste product filtered by the kidneys. A level of ${val} mg/dL requires kidney function monitoring and fluid assessment by your doctor.`,
          plainTextHi: `सीरम क्रिएटिनिन ${val} mg/dL है, जो गुर्दे (किडनी) की कार्यप्रणाली की निगरानी की आवश्यकता दर्शाता है।`,
          clinicalMeaning: 'Renal Function Impairment / High Filtration Load',
          status: 'abnormal',
        })
      }
    } else if (key.includes('cholesterol') || key.includes('lipid') || key.includes('triglyceride')) {
      if (val > 200) {
        insights.push({
          title: `Lipid / Cholesterol Marker (${val} mg/dL) — Elevated Level`,
          plainText: `Elevated lipid levels increase cardiovascular risk. Dietary fat reduction and lipid-lowering therapy may be advised.`,
          plainTextHi: `कोलेस्ट्रॉल का बढ़ा हुआ स्तर हृदय स्वास्थ्य के लिए आहार नियंत्रण और दवाओं की आवश्यकता दर्शाता है।`,
          clinicalMeaning: 'Dyslipidemia / Hypercholesterolemia',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Atorvastatin (10mg - 20mg at bedtime)',
          role: 'HMG-CoA reductase inhibitor that reduces LDL cholesterol synthesis in the liver.',
          lifestyle: 'Limit saturated fats and trans-fats, increase dietary fiber and exercise.',
        })
      }
    }
  })

  // Analyze Diagnoses & Reported Conditions
  diags.forEach(d => {
    const dLower = String(d).toLowerCase()
    if (dLower.includes('hypertension') || dLower.includes('bp')) {
      insights.push({
        title: 'Hypertension (High Blood Pressure)',
        plainText: 'High blood pressure means the force of blood against your artery walls is consistently high. Controlled with medicine and low-sodium diet.',
        plainTextHi: 'उच्च रक्तचाप (हाई बीपी) को कम नमक वाले आहार और नियमित दवाओं से नियंत्रित किया जा सकता है।',
        clinicalMeaning: 'Essential Arterial Hypertension',
        status: 'abnormal',
      })
      curativeMedicines.push({
        medicine: 'Amlodipine (5mg) or Telmisartan (40mg)',
        role: 'Relaxes blood vessels so blood flows more easily.',
        lifestyle: 'DASH diet, low salt (< 5g/day), stress reduction.',
      })
    }
    if (dLower.includes('diabetes') && !insights.some(i => i.title.includes('HbA1c'))) {
      insights.push({
        title: 'Type 2 Diabetes Mellitus Management',
        plainText: 'Type 2 diabetes affects how your body uses glucose for energy. Requires regular blood sugar monitoring and glycemic control.',
        plainTextHi: 'मधुमेह में रक्त शर्करा (ब्लड शुगर) की नियमित जांच और आहार नियंत्रण अत्यंत आवश्यक है।',
        clinicalMeaning: 'Metabolic Glucose Dysregulation',
        status: 'abnormal',
      })
      curativeMedicines.push({
        medicine: 'Metformin (500mg BD)',
        role: 'Improves insulin sensitivity and lowers liver glucose production.',
        lifestyle: 'Regular physical activity, avoidance of refined sugars.',
      })
    }
  })

  // Analyze Symptoms (Chest Pain, Fever, etc.)
  symptoms.forEach(s => {
    const sLower = String(s.label || s).toLowerCase()
    if (sLower.includes('chest_pain') || sLower.includes('chest pain')) {
      if (!insights.some(i => i.title.includes('Chest Pain'))) {
        insights.push({
          title: 'Acute Chest Discomfort — Priority Evaluation',
          plainText: 'Chest pain requires immediate clinical assessment including ECG and cardiac enzyme evaluation to rule out ischemic cardiac events.',
          plainTextHi: 'सीने में दर्द होने पर तत्काल ईसीजी (ECG) और हृदय जांच कराना आवश्यक है।',
          clinicalMeaning: 'Anginal / Ischemic Symptom Complex',
          status: 'abnormal',
        })
        curativeMedicines.push({
          medicine: 'Aspirin (75mg / 150mg) & Sorbitrate (as advised by physician)',
          role: 'Antiplatelet and coronary vasodilator support under medical supervision.',
          lifestyle: 'Complete rest, avoid exertion, immediate doctor consultation.',
        })
      }
    }
  })

  // Fallback default insight if report contains general prescriptions
  if (insights.length === 0) {
    insights.push({
      title: 'General Health & Prescription Overview',
      plainText: 'This summary organizes your clinical intake responses and health records for physician evaluation.',
      plainTextHi: 'यह विवरण आपके परामर्श के लिए आपके स्वास्थ्य रिकॉर्ड और लक्षणों को दर्शाता है।',
      clinicalMeaning: 'Standard Clinical Record',
      status: 'normal',
    })
  }

  return {
    insights,
    curativeMedicines,
    ayushRecommendations,
    generatedAt: new Date().toISOString(),
  }
}
