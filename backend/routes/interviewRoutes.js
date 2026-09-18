import express from 'express'
import { getQuestionSequence, COMPLAINT_OPTIONS } from '../services/questionService.js'

const router = express.Router()

// GET /api/interview/questions?complaint=chest_pain
router.get('/questions', (req, res) => {
  const { complaint } = req.query
  const questions = getQuestionSequence(complaint)
  res.json({ questions, complaints: COMPLAINT_OPTIONS })
})

// POST /api/interview/response
router.post('/response', async (req, res) => {
  try {
    const response = {
      id: `resp-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
    }
    res.status(201).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/interview/:consultationId
router.get('/:consultationId', async (req, res) => {
  // In demo mode, return demo responses
  res.json({ consultationId: req.params.consultationId, responses: [] })
})

export default router
