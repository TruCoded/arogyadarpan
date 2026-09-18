// ============================
// ArogyaDarpan Frontend — ABDM / FHIR Bundle Generator
// HL7 FHIR R4 Compliant Document Bundle for ABDM Health Records
// ============================

function generateUUID() {
  return 'urn:uuid:' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export function prepareFHIRBundle(patientData = {}) {
  const patientId = generateUUID()
  const compositionId = generateUUID()
  const conditionId = generateUUID()
  const summary = patientData.summary || {}
  const medications = summary.medications || []
  const investigations = summary.investigations || []
  const allergies = summary.allergies || {}
  const timestamp = new Date().toISOString()

  // Build entries array
  const entries = []

  // 1. Patient Resource
  const patientResource = {
    fullUrl: patientId,
    resource: {
      resourceType: 'Patient',
      id: patientData.id || 'demo-001',
      identifier: [
        {
          system: 'https://healthid.abdm.gov.in',
          value: patientData.abhaId || 'ABHA-0000-0000',
        },
      ],
      name: [{ text: patientData.name || 'Unknown Patient', family: (patientData.name || '').split(' ').pop() || '', given: [(patientData.name || '').split(' ')[0] || ''] }],
      gender: (patientData.gender || 'unknown').toLowerCase(),
      birthDate: patientData.age ? `${new Date().getFullYear() - parseInt(patientData.age, 10)}-01-01` : '1980-01-01',
      telecom: [{ system: 'phone', value: patientData.phone || '' }],
    },
  }
  entries.push(patientResource)

  // 2. Condition Resource (Chief Complaint)
  const conditionResource = {
    fullUrl: conditionId,
    resource: {
      resourceType: 'Condition',
      id: 'condition-chief-complaint',
      code: {
        coding: [],
        text: patientData.consultation?.chiefComplaintText || summary.chiefComplaint || 'Clinical consultation',
      },
      subject: { reference: patientId },
      clinicalStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }],
      },
      verificationStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'provisional' }],
      },
      recordedDate: timestamp,
    },
  }
  entries.push(conditionResource)

  // 3. MedicationStatement Resources (dynamic from patient data)
  const medicationIds = []
  if (medications.length > 0) {
    medications.forEach((med, idx) => {
      const medId = generateUUID()
      medicationIds.push(medId)
      entries.push({
        fullUrl: medId,
        resource: {
          resourceType: 'MedicationStatement',
          id: `med-${idx + 1}`,
          status: 'active',
          medicationCodeableConcept: {
            text: `${med.name}${med.dosage ? ' ' + med.dosage : ''}`,
          },
          subject: { reference: patientId },
          dosage: [{ text: med.frequency || 'As prescribed' }],
        },
      })
    })
  } else {
    // Fallback single medication for demo
    const medId = generateUUID()
    medicationIds.push(medId)
    entries.push({
      fullUrl: medId,
      resource: {
        resourceType: 'MedicationStatement',
        id: 'med-1',
        status: 'active',
        medicationCodeableConcept: { text: 'No medications recorded' },
        subject: { reference: patientId },
      },
    })
  }

  // 4. Observation Resources (dynamic from investigations)
  const observationIds = []
  if (investigations.length > 0) {
    investigations.forEach((inv, idx) => {
      const obsId = generateUUID()
      observationIds.push(obsId)
      entries.push({
        fullUrl: obsId,
        resource: {
          resourceType: 'Observation',
          id: `obs-${idx + 1}`,
          status: 'final',
          code: { text: inv.name || 'Lab Test' },
          subject: { reference: patientId },
          valueQuantity: {
            value: parseFloat(inv.value) || 0,
            unit: inv.unit || '',
          },
          interpretation: [{
            text: inv.status === 'abnormal' ? 'Abnormal' : 'Normal',
          }],
          effectiveDateTime: inv.date || timestamp,
        },
      })
    })
  }

  // 5. AllergyIntolerance Resource (if allergy data exists)
  const allergyIds = []
  if (allergies.historicalRecord || (Array.isArray(allergies) && allergies.length > 0)) {
    const allergyId = generateUUID()
    allergyIds.push(allergyId)
    const allergyText = typeof allergies === 'string' ? allergies :
      allergies.historicalRecord || (Array.isArray(allergies) ? allergies.join(', ') : 'Unknown allergy')
    entries.push({
      fullUrl: allergyId,
      resource: {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-1',
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }],
        },
        verificationStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }],
        },
        type: 'allergy',
        category: ['medication'],
        code: { text: allergyText },
        patient: { reference: patientId },
        recordedDate: timestamp,
      },
    })
  }

  // 6. Composition Resource (REQUIRED as first entry in FHIR Document Bundle)
  const compositionResource = {
    fullUrl: compositionId,
    resource: {
      resourceType: 'Composition',
      id: 'composition-1',
      status: 'preliminary',
      type: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '371531000',
          display: 'Report of clinical encounter',
        }],
        text: 'Pre-Consultation Clinical Intake Summary',
      },
      subject: { reference: patientId },
      date: timestamp,
      title: `ArogyaDarpan Clinical Summary — ${patientData.name || 'Patient'}`,
      author: [{ display: 'ArogyaDarpan AI Intake System' }],
      section: [
        {
          title: 'Chief Complaint & History of Present Illness',
          entry: [{ reference: conditionId }],
        },
        {
          title: 'Medications',
          entry: medicationIds.map(id => ({ reference: id })),
        },
        ...(observationIds.length > 0 ? [{
          title: 'Investigations',
          entry: observationIds.map(id => ({ reference: id })),
        }] : []),
        ...(allergyIds.length > 0 ? [{
          title: 'Allergies',
          entry: allergyIds.map(id => ({ reference: id })),
        }] : []),
      ],
    },
  }

  // Insert Composition as FIRST entry (FHIR Document Bundle requirement)
  entries.unshift(compositionResource)

  return {
    resourceType: 'Bundle',
    identifier: {
      system: 'https://arogyadarpan.in/fhir/bundles',
      value: `arogya-bundle-${Date.now()}`,
    },
    type: 'document',
    timestamp,
    entry: entries,
  }
}
