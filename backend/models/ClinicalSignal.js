import mongoose from 'mongoose'

const clinicalSignalSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], required: true },
  message: { type: String, required: true },
  detail: { type: String },
  source: { type: String, default: 'clinical_rules_engine' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.ClinicalSignal || mongoose.model('ClinicalSignal', clinicalSignalSchema)
