import express from 'express'
import { generateSummary } from '../services/summaryService.js'

const router = express.Router()

// POST /api/summary/generate
router.post('/generate', async (req, res) => {
  try {
    const { consultationId, responses, documents } = req.body
    const summary = await generateSummary(consultationId, responses, documents)
    res.json(summary)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/summary/:consultationId
router.get('/:consultationId', (req, res) => {
  res.json({ consultationId: req.params.consultationId, status: 'generated' })
})

// PATCH /api/summary/:id
router.patch('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    ...req.body,
    updatedAt: new Date().toISOString(),
  })
})

export default router
