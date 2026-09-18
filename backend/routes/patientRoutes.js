import express from 'express'
import { DEMO_PATIENTS } from '../config/demoData.js'

const router = express.Router()

// POST /api/patients — Create patient
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, phone, abhaId, language } = req.body
    const patient = {
      id: `patient-${Date.now()}`,
      name, age, gender, phone, abhaId, language,
      createdAt: new Date().toISOString(),
    }
    res.status(201).json(patient)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  try {
    const patient = DEMO_PATIENTS.find(p => p.id === req.params.id)
    if (!patient) return res.status(404).json({ error: 'Patient not found' })
    res.json(patient)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
