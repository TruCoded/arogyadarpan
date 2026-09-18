import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Import routes
import patientRoutes from './routes/patientRoutes.js'
import consultationRoutes from './routes/consultationRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import summaryRoutes from './routes/summaryRoutes.js'

// API Routes
app.use('/api/patients', patientRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/summary', summaryRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'production',
    timestamp: new Date().toISOString(),
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message,
  })
})

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║       ArogyaDarpan Backend            ║
  ║       Running on port ${PORT}             ║
  ║       Mode: ${process.env.DEMO_MODE === 'true' ? 'DEMO' : 'PRODUCTION'}                   ║
  ╚═══════════════════════════════════════╝
  `)
})
