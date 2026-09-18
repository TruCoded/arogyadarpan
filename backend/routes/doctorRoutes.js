import express from 'express'
import { DEMO_PATIENTS } from '../config/demoData.js'

const router = express.Router()

// GET /api/doctor/patients — Doctor's patient queue
router.get('/patients', (req, res) => {
  const patients = DEMO_PATIENTS.map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    phone: p.phone,
    consultation: p.consultation,
    signalCount: p.clinicalSignals.length,
    hasCritical: p.clinicalSignals.some(s => s.severity === 'critical'),
  }))
  res.json(patients)
})

// GET /api/doctor/patients/:id — Full patient detail
router.get('/patients/:id', (req, res) => {
  const patient = DEMO_PATIENTS.find(p => p.id === req.params.id)
  if (!patient) return res.status(404).json({ error: 'Patient not found' })
  res.json(patient)
})

// POST /api/doctor/summary/:id/verify — Doctor verifies a section
router.post('/summary/:id/verify', (req, res) => {
  const { section, status, editedValue } = req.body
  res.json({
    consultationId: req.params.id,
    section,
    status,
    editedValue,
    verifiedBy: 'Dr. Sharma',
    verifiedAt: new Date().toISOString(),
  })
})

export default router
