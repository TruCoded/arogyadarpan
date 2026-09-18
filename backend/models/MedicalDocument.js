import mongoose from 'mongoose'

const medicalDocumentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  documentType: { type: String, default: 'prescription' },
  documentDate: { type: String },
  extractedData: { type: mongoose.Schema.Types.Mixed },
  confidence: { type: Number, default: 0.90 },
  verificationStatus: { type: String, enum: ['unverified', 'patient_confirmed', 'doctor_confirmed', 'needs_verification'], default: 'unverified' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.MedicalDocument || mongoose.model('MedicalDocument', medicalDocumentSchema)
