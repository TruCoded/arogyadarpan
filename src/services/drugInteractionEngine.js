// ============================================================================
// ArogyaDarpan — Clinical Decision Support: Drug-Drug Interaction Detection Engine
// Feature 27: Detects potential medication interactions between current, past,
// and newly documented prescription drugs.
// IMPORTANT: Surfaces clinical alerts for physician attention; non-diagnostic.
// ============================================================================

export const KNOWN_DRUG_INTERACTIONS = [
  {
    id: 'DDI-ASP-WAR',
    drugA: ['aspirin', 'ecosprin', 'disprin'],
    drugB: ['warfarin', 'coumadin', 'uniwarfin', 'heparin'],
    severity: 'critical',
    title: 'Dual Antithrombotic / Anticoagulant Bleeding Risk',
    mechanism: 'Additive pharmacological inhibition of platelet aggregation and clotting factor synthesis markedly amplifies major gastrointestinal and systemic hemorrhage risk.',
    advisory: 'Review prothrombin time / INR. Consider gastroprotection (PPI) and assess risk-benefit of dual therapy.',
    evidenceLevel: 'High (Established clinical trial evidence)'
  },
  {
    id: 'DDI-ASP-CLO',
    drugA: ['aspirin', 'ecosprin'],
    drugB: ['clopidogrel', 'clopilet', 'plavix'],
    severity: 'moderate',
    title: 'Dual Antiplatelet Therapy (DAPT) Monitoring',
    mechanism: 'Simultaneous COX-1 and P2Y12 platelet inhibition significantly increases mucosal bleeding tendency.',
    advisory: 'Verify clinical indication (e.g. post-PCI stent or acute coronary syndrome protocol) and monitor for occult blood loss.',
    evidenceLevel: 'High'
  },
  {
    id: 'DDI-CLO-OME',
    drugA: ['clopidogrel', 'clopilet', 'plavix'],
    drugB: ['omeprazole', 'omez'],
    severity: 'moderate',
    title: 'CYP2C19 Competitive Inhibition (Reduced Antiplatelet Efficacy)',
    mechanism: 'Omeprazole competitively inhibits hepatic CYP2C19, decreasing the metabolic bioactivation of clopidogrel into its active thiol metabolite.',
    advisory: 'Consider switching gastroprotection to Pantoprazole or Rabeprazole, which exhibit significantly less CYP2C19 affinity.',
    evidenceLevel: 'High (FDA Safety Alert / EMA warning)'
  },
  {
    id: 'DDI-ARB-NSAID',
    drugA: ['telmisartan', 'losartan', 'ramipril', 'enalapril'],
    drugB: ['ibuprofen', 'brufen', 'diclofenac', 'combiflam', 'naproxen'],
    severity: 'critical',
    title: 'Renal Hemodynamic Compromise & Blunted Antihypertensive Response',
    mechanism: 'NSAID-mediated prostaglandin inhibition causes afferent renal arteriolar vasoconstriction while ARB/ACEi causes efferent arteriolar vasodilation, precipitating acute kidney injury (AKI) and blunting BP reduction.',
    advisory: 'Avoid chronic co-administration in patients with hypertension, CKD, or elderly profiles. Monitor serum creatinine and potassium.',
    evidenceLevel: 'High'
  },
  {
    id: 'DDI-ARB-POT',
    drugA: ['telmisartan', 'losartan', 'ramipril', 'enalapril'],
    drugB: ['spironolactone', 'aldactone', 'potassium', 'kcl'],
    severity: 'critical',
    title: 'Hyperkalemia Risk',
    mechanism: 'Inhibition of renin-angiotensin-aldosterone axis coupled with potassium-sparing diuretics promotes dangerous serum potassium retention, risking cardiac arrhythmias.',
    advisory: 'Regularly monitor serum electrolytes (K+). If K+ exceeds 5.2 mEq/L, re-evaluate dosage or regimen.',
    evidenceLevel: 'High'
  },
  {
    id: 'DDI-MET-CON',
    drugA: ['metformin', 'glycomet', 'glucophage'],
    drugB: ['contrast', 'iodinated contrast', 'ct contrast', 'angiography dye'],
    severity: 'critical',
    title: 'Contrast-Induced Nephropathy & Lactic Acidosis Caution',
    mechanism: 'Intravenous iodinated contrast media can induce acute renal hypoperfusion, leading to systemic metformin accumulation and potentially fatal lactic acidosis.',
    advisory: 'Temporarily withhold Metformin 48 hours prior to and 48 hours following intravascular contrast procedures. Resume only after confirming stable eGFR.',
    evidenceLevel: 'High (Standard Radiologic / Endocrinologic Guideline)'
  },
  {
    id: 'DDI-AML-SIM',
    drugA: ['amlodipine', 'amlong', 'stamlo'],
    drugB: ['simvastatin', 'zocor'],
    severity: 'moderate',
    title: 'Elevated Statin Exposure & Myopathy Risk',
    mechanism: 'Amlodipine inhibits CYP3A4-mediated hepatic clearance of simvastatin, increasing systemic statin AUC and risks of rhabdomyolysis or transaminitis.',
    advisory: 'Limit simvastatin dose to a maximum of 20 mg daily when combined with amlodipine, or switch to atorvastatin/rosuvastatin.',
    evidenceLevel: 'Moderate'
  },
  {
    id: 'DDI-MET-GLI',
    drugA: ['metformin', 'glycomet'],
    drugB: ['glimepiride', 'amaryl', 'glipizide'],
    severity: 'moderate',
    title: 'Additive Hypoglycemic Potential',
    mechanism: 'Sensitizer and insulin secretagogue combination synergistically accelerates glucose lowering.',
    advisory: 'Patient counsel on recognizing early hypoglycemia cues (tremors, sweating, dizziness). Monitor FBS/PPBS regularly.',
    evidenceLevel: 'High'
  },
]

/**
 * Checks a list of medication names or objects for dangerous drug-drug interactions
 * @param {Array<string|Object>} medicationsList - List of medicine strings or normalized medication objects
 * @returns {Array<Object>} Detected drug interaction advisories
 */
export function detectDrugInteractions(medicationsList = []) {
  if (!Array.isArray(medicationsList) || medicationsList.length < 2) return []

  // Flatten into lowercase tokens
  const medNames = medicationsList.map(item => {
    if (typeof item === 'string') return item.toLowerCase()
    if (item && item.name) return item.name.toLowerCase()
    return ''
  }).filter(Boolean)

  const detectedInteractions = []

  for (const rule of KNOWN_DRUG_INTERACTIONS) {
    // Check if any med in list matches drugA
    const matchA = medNames.find(med => rule.drugA.some(alias => med.includes(alias)))
    // Check if any med in list matches drugB
    const matchB = medNames.find(med => rule.drugB.some(alias => med.includes(alias)))

    if (matchA && matchB && matchA !== matchB) {
      detectedInteractions.push({
        id: rule.id,
        drugA: matchA.toUpperCase(),
        drugB: matchB.toUpperCase(),
        severity: rule.severity,
        title: rule.title,
        mechanism: rule.mechanism,
        advisory: rule.advisory,
        evidenceLevel: rule.evidenceLevel,
        disclaimer: 'Clinical Decision Support warning for physician review. Does not replace clinical judgment.'
      })
    }
  }

  return detectedInteractions
}

/**
 * Unified Drug Safety and Allergy Contraindication checker
 * Compatible with DrugSafetyBanner component
 * @param {Array<string|Object>} medications - Current or prescribed meds
 * @param {Array<string>} allergies - Known patient allergies
 * @returns {Array<Object>} List of clinical safety warnings
 */
export function checkDrugInteractions(medications = [], allergies = []) {
  const warnings = []

  // 1. Drug-Drug Interactions
  const ddis = detectDrugInteractions(medications)
  for (const ddi of ddis) {
    warnings.push({
      id: ddi.id,
      severity: ddi.severity === 'critical' ? 'high' : 'medium',
      title: `Drug Interaction: ${ddi.drugA} + ${ddi.drugB}`,
      message: `${ddi.title} — ${ddi.mechanism}`,
      recommendation: ddi.advisory
    })
  }

  // 2. Allergy Contraindications
  const medStrs = medications.map(m => typeof m === 'string' ? m.toLowerCase() : (m?.name || '').toLowerCase())
  const allergyStrs = allergies.map(a => typeof a === 'string' ? a.toLowerCase() : (a?.name || '').toLowerCase())

  if (allergyStrs.some(a => a.includes('penicillin')) && medStrs.some(m => m.includes('amoxicillin') || m.includes('ampicillin') || m.includes('penicillin'))) {
    warnings.push({
      id: 'ALLERGY-PEN',
      severity: 'high',
      title: 'Severe Allergy Contraindication: Penicillin Group',
      message: 'Patient has a documented Penicillin allergy. Prescribed Amoxicillin/Penicillin presents severe anaphylaxis and urticaria risk.',
      recommendation: 'Withhold beta-lactam antibiotics. Switch to Macrolide (e.g. Azithromycin) or alternate non-cross-reactive class.'
    })
  }

  if (allergyStrs.some(a => a.includes('aspirin') || a.includes('nsaid')) && medStrs.some(m => m.includes('aspirin') || m.includes('ibuprofen') || m.includes('diclofenac'))) {
    warnings.push({
      id: 'ALLERGY-NSAID',
      severity: 'high',
      title: 'Allergy Contraindication: Aspirin / NSAID Class',
      message: 'Patient has known Aspirin/NSAID hypersensitivity. Co-administration can trigger bronchospasm or severe allergic reaction.',
      recommendation: 'Avoid NSAIDs. Consider Paracetamol for analgesia if tolerated, or consult allergy specialist.'
    })
  }

  return warnings
}

