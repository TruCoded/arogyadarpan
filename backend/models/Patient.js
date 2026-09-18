import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  language: { type: String, default: 'en' },
  abhaId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema)
