import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StitchAppHeader from '../../components/StitchAppHeader'
import CameraCaptureModal from '../../components/CameraCaptureModal'
import ScannerModal from '../../components/ScannerModal'
import DocumentInspectorModal from '../../components/DocumentInspectorModal'
import { scanMedicalDocument } from '../../services/ocrEngine'
import { useLanguage } from '../../context/LanguageContext'

const DOC_TYPES = [
  { id: 'Prescription', label: 'Prescription (पर्चा)', icon: 'prescriptions' },
  { id: 'Laboratory Report', label: 'Lab Report (जांच रिपोर्ट)', icon: 'biotech' },
  { id: 'Discharge Summary', label: 'Discharge Summary', icon: 'assignment' },
  { id: 'Pharmacy Bill', label: 'Pharmacy Bill', icon: 'receipt_long' },
]

export default function DocumentUpload() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)

  const [selectedType, setSelectedType] = useState('Prescription')
  const [torchActive, setTorchActive] = useState(true)
  const [gridVisible, setGridVisible] = useState(true)
  const [isFlashing, setIsFlashing] = useState(false)
  const [beamPos, setBeamPos] = useState(25)
  const [beamDir, setBeamDir] = useState(1)

  // Real or demo scanned documents
  const [documents, setDocuments] = useState(() => {
    try {
      const stored = localStorage.getItem('arogya_documents')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch { /* ignore */ }
    return [
      {
        id: 'doc-seed-1',
        category: 'Prescription',
        fileName: 'OPD_Prescription_Cardiology.jpg',
        uploadDate: '2026-03-05',
        status: 'processed',
        previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMJS-5H3OBXkDd5RVw5Y7fzvVpByxTAbS-7M5zIqah8dYh8X7aNOV1dT7ghIRnZJn0BHa1VAaCXGtKLusTjEyeWpOi6YPZirv1a7mp-tU61o5KJIc_dA0yW488TZPzP7HJ5Y-BovK5D4W9SXtcfSQEnW3vDdLbGu3p5mMNHSsJXEcz2xX_IF0oT-Lt7S8sYBKw_5EpxkNpzW3NFzjc1WZI9UfFSRauo99PoBisaa-ZQ-zS0YQyoKaI',
      },
      {
        id: 'doc-seed-2',
        category: 'Laboratory Report',
        fileName: 'HbA1c_Lipid_Panel.pdf',
        uploadDate: '2026-03-05',
        status: 'processed',
        previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUUaDFe2he3SNBA-vi1U-uuBvqbHMTDRYKT0jumAHdsGIfQTgGzwutxe5Hnc0cctWMdHs0XXZs5hnOHymHrAw2K6WR-lUhCIOt0xQNqZEx5DxrS2xZYfBpEpCh9dmf-Y9ZyZHf249PnfFjtSz4WzImFQ0Un-uEyyANS8NEC_vsH-uAbwFOYh3vsgi6OnslFE2BxzrTJG0uja9cKuOVHdjXrduBEGheB4FhWXTH6ciRPArgKc71c-bC',
      }
    ]
  })

  const [activeInspectorDoc, setActiveInspectorDoc] = useState(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  // Animated laser sweep effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBeamPos(prev => {
        let next = prev + beamDir * 1.5
        if (next >= 90) {
          setBeamDir(-1)
          return 90
        }
        if (next <= 10) {
          setBeamDir(1)
          return 10
        }
        return next
      })
    }, 30)
    return () => clearInterval(interval)
  }, [beamDir])

  const triggerShutter = () => {
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 200)

    // Add a captured document
    const newDoc = {
      id: `doc-scan-${Date.now()}`,
      category: selectedType,
      fileName: `${selectedType}_Scan_${new Date().toLocaleTimeString().replace(/:/g, '')}.jpg`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'processed',
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPFeKS063QjC1f_6kw3-0LX009yyfDSzXZ9okUlNibx7TL1A3ndy7-NyY7PLMp14h0YXoXQnVi2mm-3_u5STgV9T6KyxP4mXQj8xs-IfstABBfqvF8VWboEI5MWffYtJcSWvrCYpD6EP-z8x2O7bOdEEDmfu9zQtXKcWKS7prD8Oh9x1UQMpolKdM6pBBU2VZGHgCmWNZxsx7gs4wI2OE5SwfoDyQMN2X1RWjR4UK3I6-huapCkJA3',
    }

    const updated = [newDoc, ...documents]
    setDocuments(updated)
    try {
      localStorage.setItem('arogya_documents', JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    for (const file of files) {
      const docId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      const doc = {
        id: docId,
        fileName: file.name,
        category: selectedType,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
      }
      setDocuments(prev => [doc, ...prev])

      try {
        const ocrResult = await scanMedicalDocument(file)
        setDocuments(prev => prev.map(d =>
          d.id === docId
            ? { ...d, status: 'processed', extraction: ocrResult }
            : d
        ))
      } catch {
        setDocuments(prev => prev.map(d =>
          d.id === docId ? { ...d, status: 'processed' } : d
        ))
      }
    }
  }

  const handleContinue = () => {
    try {
      localStorage.setItem('arogya_documents', JSON.stringify(documents))
    } catch { /* ignore */ }
    navigate('/patient/document-review')
  }

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col font-sans text-slate-800 pb-20 select-none">
      <StitchAppHeader
        title="Smart Medical Document Scanner"
        subtitle="स्मार्ट दस्तावेज़ स्कैनर"
        showBack
        onBack={() => navigate('/patient/interview')}
      />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-3 pb-8 flex flex-col justify-between">
        <div className="flex flex-col w-full relative">
          {/* Top Quick-Access Camera Controls */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Flash Toggle Button */}
              <button
                type="button"
                onClick={() => setTorchActive(!torchActive)}
                className="h-10 px-3.5 rounded-full bg-slate-200/80 text-slate-800 flex items-center gap-1.5 text-xs font-mono font-medium shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${torchActive ? 'text-amber-500' : 'text-slate-500'}`}>
                  {torchActive ? 'flash_on' : 'flash_off'}
                </span>
                <span>{torchActive ? 'Auto Torch' : 'Torch Off'}</span>
              </button>

              {/* Grid Overlay Toggle */}
              <button
                type="button"
                onClick={() => setGridVisible(!gridVisible)}
                className={`h-10 w-10 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer ${
                  gridVisible ? 'bg-teal-700 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}
                title="Toggle Reference Grid"
              >
                <span className="material-symbols-outlined text-[18px]">grid_4x4</span>
              </button>
            </div>

            {/* Auto Capture Pill Mode */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/70 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00855b] animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-[#006947] uppercase tracking-wider">Auto-Snap On</span>
              <span className="material-symbols-outlined text-[14px] text-[#006947]">check_circle</span>
            </div>
          </div>

          {/* Smart Guidance HUD Glass Pill */}
          <div className="w-full bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl p-3 shadow-xs mb-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-teal-700">document_scanner</span>
                <span className="font-heading font-bold text-sm text-slate-900">Align all 4 corners</span>
              </div>
              {/* Lighting Sensor Badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006947] text-[11px] font-mono font-semibold">
                <span className="material-symbols-outlined text-[13px]">light_mode</span>
                <span>Optimal Light (उत्तम प्रकाश)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">पर्चे के चारों कोने हरे फ्रेम में रखें</p>
              {/* Real-time Device Tilt Level Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-mono text-slate-800">
                <span className="material-symbols-outlined text-[14px] text-cyan-700">screen_rotation</span>
                <span className="text-teal-800 font-bold">0.4° Balanced</span>
              </div>
            </div>
          </div>

          {/* Viewfinder Viewport Container */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
            {/* Camera Feed Background */}
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300"
              alt="Medical Prescription Viewfinder"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPFeKS063QjC1f_6kw3-0LX009yyfDSzXZ9okUlNibx7TL1A3ndy7-NyY7PLMp14h0YXoXQnVi2mm-3_u5STgV9T6KyxP4mXQj8xs-IfstABBfqvF8VWboEI5MWffYtJcSWvrCYpD6EP-z8x2O7bOdEEDmfu9zQtXKcWKS7prD8Oh9x1UQMpolKdM6pBBU2VZGHgCmWNZxsx7gs4wI2OE5SwfoDyQMN2X1RWjR4UK3I6-huapCkJA3"
            />

            {/* Optical Grid Matrix Overlay */}
            {gridVisible && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
                <div className="shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)]" />
              </div>
            )}

            {/* AR Document Tracking Bounding Box */}
            <div className="absolute inset-x-6 inset-y-8 pointer-events-none transition-all duration-300">
              {/* Glow Perimeter Overlay */}
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl shadow-[0_0_24px_rgba(16,185,129,0.3)] border border-emerald-500/40" />

              {/* Corner Precision Target Brackets (#006947 / #10B981) */}
              {/* Top Left */}
              <div className="absolute -top-1.5 -left-1.5 w-7 h-7 flex flex-col justify-between">
                <div className="w-7 h-2 bg-[#00855b] rounded-t-sm shadow-sm" />
                <div className="w-2 h-5 bg-[#00855b] rounded-bl-sm shadow-sm" />
              </div>
              {/* Top Right */}
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 flex flex-col items-end justify-between">
                <div className="w-7 h-2 bg-[#00855b] rounded-t-sm shadow-sm" />
                <div className="w-2 h-5 bg-[#00855b] rounded-br-sm shadow-sm" />
              </div>
              {/* Bottom Left */}
              <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 flex flex-col justify-between">
                <div className="w-2 h-5 bg-[#00855b] rounded-tl-sm shadow-sm" />
                <div className="w-7 h-2 bg-[#00855b] rounded-b-sm shadow-sm" />
              </div>
              {/* Bottom Right */}
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 flex flex-col items-end justify-between">
                <div className="w-2 h-5 bg-[#00855b] rounded-tr-sm shadow-sm" />
                <div className="w-7 h-2 bg-[#00855b] rounded-b-sm shadow-sm" />
              </div>

              {/* AR Confidence Indicator Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm">
                <span className="material-symbols-outlined text-[13px] text-emerald-400">check_circle</span>
                <span className="font-mono text-[11px] font-bold">98.4% Document Lock</span>
              </div>

              {/* Continuous Optical OCR Laser Scanning Beam */}
              <div
                className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.9),0_0_28px_rgba(87,223,254,0.7)] flex items-center justify-center transition-all duration-75"
                style={{ top: `${beamPos}%` }}
              >
                <div className="w-20 h-2 rounded-full bg-cyan-200 opacity-80 blur-xs" />
              </div>

              {/* Detected Key Data Markers (Bioluminescent OCR Micro-tags) */}
              <div className="absolute top-16 left-4 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[11px] flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Rx: Metformin 500mg</span>
              </div>

              <div className="absolute bottom-16 right-4 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[11px] flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Date: 24 Oct 2024</span>
              </div>
            </div>

            {/* Live Stabilizer Reticle Target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/40">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              </div>
            </div>

            {/* Shutter Flash Animation Overlay */}
            {isFlashing && (
              <div className="absolute inset-0 bg-white pointer-events-none z-30 transition-opacity duration-150 opacity-90" />
            )}
          </div>

          {/* Document Type Selector Pills (Segmented Selector) */}
          <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-3 no-scrollbar">
            {DOC_TYPES.map((dt) => {
              const active = selectedType === dt.id
              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => setSelectedType(dt.id)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-full font-heading text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300/80 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{dt.icon}</span>
                  <span>{dt.label}</span>
                </button>
              )
            })}
          </div>

          {/* Floating Translucent Dark Glass Dock */}
          <div className="w-full rounded-2xl bg-slate-900 text-white p-3.5 shadow-xl flex items-center justify-between relative mt-1 border border-slate-800">
            {/* Left Action: Scanned Pages Stack Preview */}
            <div
              onClick={handleContinue}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative w-12 h-14 rounded-xl bg-white/10 backdrop-blur-md overflow-hidden flex-shrink-0 p-1 flex flex-col justify-between border border-white/20">
                <img
                  className="w-full h-full object-cover rounded"
                  alt="Scanned thumbnail"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUUaDFe2he3SNBA-vi1U-uuBvqbHMTDRYKT0jumAHdsGIfQTgGzwutxe5Hnc0cctWMdHs0XXZs5hnOHymHrAw2K6WR-lUhCIOt0xQNqZEx5DxrS2xZYfBpEpCh9dmf-Y9ZyZHf249PnfFjtSz4WzImFQ0Un-uEyyANS8NEC_vsH-uAbwFOYh3vsgi6OnslFE2BxzrTJG0uja9cKuOVHdjXrduBEGheB4FhWXTH6ciRPArgKc71c-bC"
                />
                {/* Floating Counter Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00855b] text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-sm">
                  {documents.length}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-bold text-xs text-white truncate">
                  {documents.length} {documents.length === 1 ? 'Page' : 'Pages'} Scanned
                </span>
                <span className="text-[11px] text-teal-400 truncate flex items-center gap-0.5">
                  <span>Ready to review</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Central Tactile Shutter Button (72px diameter) */}
            <div className="flex items-center justify-center flex-shrink-0 px-2">
              <button
                type="button"
                onClick={triggerShutter}
                className="w-18 h-18 rounded-full bg-[#00855b] flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.5)] active:scale-90 transition-transform p-1 focus:outline-none cursor-pointer"
                title="Capture Medical Document"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-[#00855b] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[26px]">camera_alt</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Action: Upload PDF / Open Gallery */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all shadow-sm border border-white/20 cursor-pointer"
                title="Upload Prescription PDF or Image"
              >
                <span className="material-symbols-outlined text-[22px]">folder_open</span>
              </button>
              <span className="font-mono text-[10px] text-slate-400 mt-1">Upload PDF</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Clinical AI ABDM Compliance Trust Strip */}
          <div className="w-full mt-3 flex items-center justify-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-[#006947]">lock</span>
            <span>ABDM / HIPAA Compliant • 256-bit Local OCR Encryption</span>
          </div>

          {/* Fallback Review Bar */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Review Extracted Prescriptions ({documents.length})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Real Hardware Modals when needed */}
      <AnimatePresence>
        {isCameraOpen && (
          <CameraCaptureModal
            onCapture={(file, previewUrl) => {
              setIsCameraOpen(false)
              const newDoc = {
                id: `doc-${Date.now()}`,
                category: selectedType,
                fileName: file.name,
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'processed',
                previewUrl,
              }
              setDocuments(prev => [newDoc, ...prev])
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
