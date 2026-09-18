import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, X, Check, RefreshCw, Zap, Sliders, FileText } from 'lucide-react'
import Button from './Button'

/**
 * ScannerModal — Flatbed / Document Feeder Optical Scanner Interface
 * Simulates high-speed optical scanning with laser beam sweep and contrast filtering
 */
export default function ScannerModal({
  isOpen,
  onClose,
  onScanComplete,
}) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scannedResult, setScannedResult] = useState(null)
  const [highContrast, setHighContrast] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState('prescription')

  const PRESETS = [
    {
      id: 'prescription',
      title: 'Prescription (Dr. O.P. Sharma)',
      type: 'Prescription',
      date: '2025-05-12',
      text: 'Rx\nTab Telmisartan 40mg OD\nTab Metformin 500mg BD\nTab Rosuvastatin 10mg HS\nBP: 142/90 mmHg, RBS: 154 mg/dL',
      sampleUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'lab_report',
      title: 'Lab Report (Thyroid & Lipid Profile)',
      type: 'Laboratory Report',
      date: '2025-05-14',
      text: 'INVESTIGATIONS:\nTSH: 6.42 uIU/mL (High)\nTotal Cholesterol: 228 mg/dL (Borderline High)\nTriglycerides: 198 mg/dL\nHbA1c: 7.2%',
      sampleUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'discharge_summary',
      title: 'Discharge Summary (AIIMS OPD)',
      type: 'Discharge Summary',
      date: '2024-11-20',
      text: 'DISCHARGE SUMMARY:\nDiagnosis: Acute Bronchitis with Bronchospasm\nCourse in Hospital: Nebulized with Levolin & Budecort.\nCondition on Discharge: Hemodynamically stable.',
      sampleUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'medical_certificate',
      title: 'Medical Fitness Certificate',
      type: 'Medical Certificate',
      date: '2025-01-10',
      text: 'MEDICAL CERTIFICATE:\nThis is to certify that Mr. Rahul Sharma is fit to resume normal duties after recovering from acute viral illness.',
      sampleUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80'
    }
  ]

  const handleStartScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScannedResult(null)

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          const chosen = PRESETS.find(p => p.id === selectedPreset) || PRESETS[0]
          setScannedResult(chosen)
          return 100
        }
        return prev + 15
      })
    }, 200)
  }

  const handleConfirmScan = () => {
    if (!scannedResult) return

    // Generate simulated File object
    const blob = new Blob([scannedResult.text], { type: 'text/plain' })
    const file = new File(
      [blob],
      `scanner-${scannedResult.id}-${Date.now()}.png`,
      { type: 'image/png' }
    )

    onScanComplete(file, {
      category: scannedResult.type,
      title: scannedResult.title,
      rawText: scannedResult.text,
      isScannedFeed: true,
      highContrast
    })

    handleClose()
  }

  const handleClose = () => {
    setIsScanning(false)
    setScanProgress(0)
    setScannedResult(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-x-hidden overflow-y-auto w-full max-w-[100vw]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-raised rounded-2xl sm:rounded-3xl overflow-hidden max-w-xl w-full max-w-[calc(100vw-1.5rem)] border border-border-light shadow-2xl flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-surface">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <span className="font-bold text-text-primary text-base font-heading">
                Flatbed Document Scanner Interface
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scanner Flatbed View Area */}
          <div className="p-6 space-y-4">
            {/* Scanner Bed Canvas Container */}
            <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Glass Flatbed Background Texture */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Optical Laser Scanning Sweep Bar */}
              {isScanning && (
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 shadow-[0_0_15px_#2dd4bf] z-20"
                  animate={{
                    top: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}

              {/* Scanned Document Preview / Bed Placeholder */}
              {scannedResult ? (
                <div className={`p-4 max-w-md w-full rounded-xl border font-mono text-xs shadow-md transition-all ${
                  highContrast
                    ? 'bg-white text-slate-900 border-slate-300'
                    : 'bg-amber-50/90 text-amber-950 border-amber-200'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2 font-sans">
                    <span className="font-bold text-xs uppercase text-teal-700">
                      {scannedResult.type} • 300 DPI OPTICAL SCAN
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      CLEAN TEXT
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {scannedResult.text}
                  </pre>
                </div>
              ) : isScanning ? (
                <div className="text-center z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full border-3 border-teal-400 border-t-transparent animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white font-heading">
                    Scanning Flatbed Document... {scanProgress}%
                  </p>
                  <p className="text-xs text-slate-400">
                    Auto-aligning document margins & OCR contrast filter
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 z-10">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-200 mb-1">
                    Document Ready on Flatbed
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Select the document type preset below and tap "Start Optical Scan"
                  </p>
                </div>
              )}
            </div>

            {/* Document Presets for Quick Clinic Scan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                Select Document Source Preset:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={isScanning}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'border-primary-500 bg-primary-50/50 text-primary-900 font-bold shadow-xs'
                        : 'border-border-light bg-surface text-text-secondary hover:border-gray-300'
                    }`}
                  >
                    <p className="text-xs truncate">{preset.title}</p>
                    <span className="text-[10px] text-text-muted font-normal">{preset.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Filter Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-border-light text-xs">
              <div className="flex items-center gap-2 font-medium text-text-primary">
                <Sliders className="w-4 h-4 text-primary-600" />
                <span>Auto-Binarization (High-Contrast Clean OCR)</span>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  highContrast ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-surface border-t border-border-light flex items-center justify-between gap-3">
            {scannedResult ? (
              <>
                <Button
                  variant="outline"
                  size="md"
                  icon={RefreshCw}
                  onClick={handleStartScan}
                >
                  Rescan
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={handleConfirmScan}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Import Scanned Record
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="md" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Zap}
                  disabled={isScanning}
                  onClick={handleStartScan}
                  className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                >
                  Start Optical Scan
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
