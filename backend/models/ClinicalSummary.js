import mongoose from 'mongoose'

const clinicalSummarySchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  chiefComplaint: { type: String, required: true },
  hpi: { type: String, required: true },
  pastHistory: { type: mongoose.Schema.Types.Mixed },
  medications: { type: mongoose.Schema.Types.Mixed },
  allergies: { type: mongoose.Schema.Types.Mixed },
  familyHistory: { type: String },
  personalHistory: { type: mongoose.Schema.Types.Mixed },
  investigations: { type: mongoose.Schema.Types.Mixed },
  generatedAt: { type: Date, default: Date.now },
  verificationStatus: { type: String, default: 'unverified' },
})

export default mongoose.models.ClinicalSummary || mongoose.model('ClinicalSummary', clinicalSummarySchema)
