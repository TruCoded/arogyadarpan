// ============================
// ArogyaDarpan — OCR Service Wrapper
// Supports mock mode & easy API key replacement
// ============================

export async function processDocument(documentId, filePath) {
  // In demo/mock mode, return realistic extraction structure
  return {
    documentId,
    processedAt: new Date().toISOString(),
    documentType: 'prescription',
    documentDate: '2025-05-12',
    extractedData: {
      diagnosis: ['Type 2 Diabetes Mellitus'],
      medications: [
        { name: 'Metformin', dosage: '500 mg', frequency: 'twice daily', confidence: 0.96 },
      ],
      investigations: [
        { name: 'HbA1c', value: '8.2', unit: '%', status: 'abnormal', confidence: 0.94 },
      ],
      allergies: [],
    },
    confidence: 0.94,
    verificationStatus: 'needs_verification',
  }
}
