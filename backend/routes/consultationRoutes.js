import express from 'express'
const router = express.Router()

// POST /api/consultations
router.post('/', async (req, res) => {
  try {
    const consultation = {
      id: `consult-${Date.now()}`,
      ...req.body,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    }
    res.status(201).json(consultation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/consultations/:id
router.get('/:id', async (req, res) => {
  res.json({ id: req.params.id, status: 'ready_for_review' })
})

// PATCH /api/consultations/:id
router.patch('/:id', async (req, res) => {
  res.json({ id: req.params.id, ...req.body, updatedAt: new Date().toISOString() })
})

export default router
