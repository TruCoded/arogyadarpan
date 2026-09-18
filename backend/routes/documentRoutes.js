import express from 'express'
import multer from 'multer'
import { dirname, join, extname } from 'path'
import { fileURLToPath } from 'url'
import { processDocument } from '../services/ocrService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Multer config
const storage = multer.diskStorage({
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

const router = express.Router()

// POST /api/documents/upload
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const doc = {
      id: `doc-${Date.now()}`,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    }
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/documents/:id/process — OCR processing
router.post('/:id/process', async (req, res) => {
  try {
    const result = await processDocument(req.params.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/documents/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'processed' })
})

// PATCH /api/documents/:id/verify
router.patch('/:id/verify', (req, res) => {
  res.json({
    id: req.params.id,
    verificationStatus: req.body.status,
    updatedAt: new Date().toISOString(),
  })
})

export default router
