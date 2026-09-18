import mongoose from 'mongoose'

const timelineEventSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  date: { type: String, required: true },
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  sourceDocumentId: { type: String },
  sourceResponseId: { type: String },
  verificationStatus: { type: String, default: 'unverified' },
})

export default mongoose.models.TimelineEvent || mongoose.model('TimelineEvent', timelineEventSchema)
