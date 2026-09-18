import mongoose from 'mongoose'

const interviewResponseSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  originalResponse: { type: String },
  structuredValue: { type: mongoose.Schema.Types.Mixed },
  inputMethod: { type: String, enum: ['voice', 'touch', 'skipped'], default: 'touch' },
  confidence: { type: Number, default: 1.0 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.InterviewResponse || mongoose.model('InterviewResponse', interviewResponseSchema)
