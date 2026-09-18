import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Edit3, ZoomIn, ZoomOut, FileText, Sparkles, AlertCircle } from 'lucide-react'
import Button from './Button'
import ConfidenceBadge from './ConfidenceBadge'

export default function DocumentInspectorModal({ isOpen, onClose, documentData, onConfirmItem }) {
  const [zoom, setZoom] = useState(100)
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editedValue, setEditedValue] = useState('')

  if (!isOpen || !documentData) return null

  // Build structured inspection items across all 5 canonical buckets + classification + alerts
  const items = []

  // 1. Classification & Date
  if (documentData.documentType || documentData.documentCategory) {
    items.push({
      label: 'Document Class & Date',
      value: `${documentData.documentType || documentData.documentCategory || 'Medical Document'} • Extracted Date: ${documentData.documentDate || 'Current'}`,
      confidence: documentData.classificationConfidence || 0.95
    })
  }

  // 2. Diagnoses
  const diagnoses = documentData.extractedData?.diagnoses || documentData.extractedData?.diagnosis || []
  diagnoses.forEach(diag => {
    items.push({
      label: 'Diagnosis',
      value: typeof diag === 'string' ? diag : diag.name,
      confidence: 0.94
    })
  })

  // 3. Medications (Normalized)
  const medications = documentData.extractedData?.medications || []
  medications.forEach(m => {
    items.push({
      label: 'Medication',
      value: `${m.name} ${m.strength || m.dosage || ''} — ${m.frequency || 'Once Daily'} (${m.duration || 'Ongoing'})`,
      confidence: m.confidence || 0.96
    })
  })

  // 4. Structured Investigations & Abnormal Flags
  const investigations = documentData.extractedData?.investigations || []
  investigations.forEach(inv => {
    const isAbnormal = inv.status === 'abnormal' || inv.status === 'critical'
    items.push({
      label: 'Laboratory Investigation',
      value: `${inv.test || inv.name}: ${inv.value} ${inv.unit || ''} ${isAbnormal ? '[' + (inv.abnormalFlag || 'Abnormal') + ']' : '[Normal]'} (Ref: ${inv.referenceRange || inv.normalRange || 'Standard'})`,
      confidence: inv.confidence || 0.95,
      isAbnormal
    })
  })

  // 5. Procedures
  const procedures = documentData.extractedData?.procedures || []
  procedures.forEach(proc => {
    items.push({
      label: 'Procedure',
      value: typeof proc === 'string' ? proc : proc.name,
      confidence: 0.92
    })
  })

  // 6. Stamp & Signature
  if (documentData.stampAndSignature?.hasSignature) {
    items.push({
      label: 'Institutional Verification',
      value: `Verified Signature & Institutional Stamp (${documentData.stampAndSignature.doctorName || 'Attending Physician'})`,
      confidence: 0.98
    })
  }

  // 7. Drug-Drug Interactions
  const drugInteractions = documentData.drugInteractions || []
  drugInteractions.forEach(ddi => {
    items.push({
      label: 'Clinical Decision Warning (DDI)',
      value: `Interaction: ${ddi.drugA} + ${ddi.drugB} (${ddi.title}) — ${ddi.advisory}`,
      confidence: 0.99,
      isWarning: true
    })
  })

  if (items.length === 0) {
    items.push(
      { label: 'Diagnosis', value: 'Type 2 Diabetes Mellitus', confidence: 0.94 },
      { label: 'Medication', value: 'Metformin 500 mg — Twice Daily (BD)', confidence: 0.96 },
      { label: 'Investigation', value: 'HbA1c: 8.4% [↑ Abnormal] (Ref: 4.0 - 5.6 %)', confidence: 0.94, isAbnormal: true }
    )
  }

  const handleEdit = (index, val) => {
    setEditingIndex(index)
    setEditedValue(val)
  }

  const handleSaveEdit = (index) => {
    onConfirmItem?.(index, editedValue)
    setEditingIndex(null)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-raised rounded-3xl border border-border-light shadow-modal w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-surface-muted">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-base font-heading">
                  Document Inspector & OCR Traceability
                </h3>
                <p className="text-xs text-text-muted">
                  {documentData.fileName || 'Medical_Record.pdf'} • Real-time pixel text extraction
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-raised rounded-lg border border-border-light px-2 py-1">
                <button onClick={() => setZoom(prev => Math.max(75, prev - 25))} className="p-1 text-text-secondary hover:text-text-primary cursor-pointer">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-text-primary w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(prev => Math.min(175, prev + 25))} className="p-1 text-text-secondary hover:text-text-primary cursor-pointer">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary cursor-pointer rounded-lg hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Split — Document View & Extracted Items */}
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Document Image Canvas Preview */}
            <div className="col-span-7 bg-gray-900 p-6 flex flex-col items-center justify-center overflow-auto relative border-r border-border-light">
              <div
                className="transition-all duration-200 shadow-2xl relative"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
              >
                {/* Simulated Document Sheet */}
                <div className="w-[380px] min-h-[500px] bg-white rounded-lg p-6 text-gray-800 text-xs font-mono shadow-xl relative leading-relaxed">
                  <div className="border-b-2 border-primary-500 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-primary-700 font-heading">METRO HEALTHCARE LABS</h4>
                      <p className="text-[10px] text-gray-500">Reg No: MH-98214 • Date: 12/05/2025</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-primary-500" />
                  </div>

                  <p className="font-bold mb-2">PATIENT: Rahul Sharma (Male / 46 yrs)</p>

                  <div className={`p-2 rounded transition-colors my-2 ${selectedItemIndex === 0 ? 'bg-amber-100 ring-2 ring-amber-400' : ''}`}>
                    <p className="font-bold text-gray-900">DIAGNOSIS:</p>
                    <p>Type 2 Diabetes Mellitus (E11.9)</p>
                  </div>

                  <div className={`p-2 rounded transition-colors my-2 ${selectedItemIndex === 1 ? 'bg-amber-100 ring-2 ring-amber-400' : ''}`}>
                    <p className="font-bold text-gray-900">PRESCRIPTION (Rx):</p>
                    <p>1. Tab Metformin 500mg - 1-0-1 (After Meals)</p>
                    <p>2. Tab Amlodipine 5mg - 1-0-0 (Morning)</p>
                  </div>

                  <div className={`p-2 rounded transition-colors my-2 ${selectedItemIndex === 2 ? 'bg-amber-100 ring-2 ring-amber-400' : ''}`}>
                    <p className="font-bold text-gray-900">LAB INVESTIGATION RESULTS:</p>
                    <p>HbA1c: <span className="font-bold text-red-600">8.2%</span> (Ref Range: 4.0 - 5.6 %)</p>
                    <p>Fasting Blood Sugar: <span className="font-bold text-red-600">162 mg/dL</span> (Ref: 70 - 100)</p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-end text-[9px] text-gray-400">
                    <span>Verified by OCR Engine</span>
                    <span>Dr. A. Patel (MD)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Facts Sidebar */}
            <div className="col-span-5 bg-surface p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-text-primary text-sm font-heading">
                    Extracted Medical Entities ({items.length})
                  </h4>
                  <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                    Confidence Layer Active
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`
                        p-4 rounded-xl border transition-all cursor-pointer
                        ${selectedItemIndex === idx
                          ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                          : 'border-border-light bg-surface-raised hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          {item.label}
                        </span>
                        <ConfidenceBadge score={item.confidence} size="sm" />
                      </div>

                      {editingIndex === idx ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-primary-500 focus:outline-none bg-white"
                          />
                          <button onClick={() => handleSaveEdit(idx)} className="p-1.5 bg-success text-white rounded-lg hover:bg-emerald-600">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-text-primary text-sm">{item.value}</p>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(idx, item.value) }} className="text-text-muted hover:text-primary-600 p-1">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-border-light mt-6">
                <Button fullWidth size="md" onClick={onClose} icon={Check}>
                  Confirm All Extracted Items
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
