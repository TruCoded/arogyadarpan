import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  department: { type: String, default: 'General Medicine' },
  chiefComplaint: { type: String, required: true },
  status: { type: String, enum: ['in_progress', 'ready_for_review', 'needs_verification', 'completed'], default: 'in_progress' },
  language: { type: String, default: 'en' },
  consentGiven: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
})

export default mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema)
