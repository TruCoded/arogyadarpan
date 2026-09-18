// ============================
// ArogyaDarpan — ABDM / FHIR Mock Service
// ============================

export function prepareFHIRBundle(patientData) {
  return {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resourceType: 'Patient',
        id: patientData.id || 'demo-001',
        name: [{ text: patientData.name || 'Rahul Sharma' }],
        gender: patientData.gender || 'male',
        birthDate: '1980-01-01',
        telecom: [{ system: 'phone', value: patientData.phone || '9876543210' }],
      },
      {
        resourceType: 'Condition',
        code: { text: patientData.chiefComplaint || 'Chest pain' },
        subject: { reference: `Patient/${patientData.id || 'demo-001'}` },
      },
    ],
  }
}
