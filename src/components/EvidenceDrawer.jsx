import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Mic, ShieldCheck, Check, Edit3, ExternalLink } from 'lucide-react'
import Button from './Button'
import ConfidenceBadge from './ConfidenceBadge'

export default function EvidenceDrawer({ isOpen, onClose, evidenceData, onVerify }) {
  if (!isOpen || !evidenceData) return null

  const { title, source, type, confidence, snippet, documentName, timestamp } = evidenceData

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        >
          <div className="w-screen max-w-md bg-surface-raised border-l border-border-light shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border-light bg-surface-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                  {type === 'voice' ? <Mic className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base font-heading">
                    Evidence Traceability
                  </h3>
                  <p className="text-xs text-text-muted">Source Audit Trail</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary cursor-pointer rounded-lg hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Fact summary card */}
              <div className="bg-surface rounded-2xl border border-border-light p-4">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Clinical Fact
                </span>
                <h4 className="font-bold text-text-primary text-lg font-heading mb-2">{title}</h4>
                <div className="flex items-center gap-2">
                  <ConfidenceBadge score={confidence || 0.94} />
                  <span className="text-xs text-text-muted">{timestamp || '12 May 2025'}</span>
                </div>
              </div>

              {/* Original Source Evidence */}
              <div>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Original Source Snippet
                </span>
                <div className="bg-gray-900 text-white rounded-2xl p-5 font-mono text-xs leading-relaxed relative border border-gray-800 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-primary-400 mb-3 border-b border-gray-800 pb-2">
                    <span>{type === 'voice' ? '🎙️ Patient Voice Recording' : `📄 ${documentName || 'Prescription_12_May_2025.pdf'}`}</span>
                    <span>Verified Source</span>
                  </div>
                  <p className="italic text-gray-200">
                    "{snippet || 'Patient reports central chest pain for 3 days worsening with stairs. Metformin 500 mg prescribed twice daily.'}"
                  </p>
                </div>
              </div>

              {/* Source Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-border-light">
                  <span className="text-text-muted">Document / Origin:</span>
                  <span className="font-semibold text-text-primary">{source || 'City Hospital Prescription'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-light">
                  <span className="text-text-muted">Extraction Engine:</span>
                  <span className="font-semibold text-text-primary">ArogyaDarpan OCR + Clinical NLP</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-light">
                  <span className="text-text-muted">Verification Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Doctor Traceable
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-border-light bg-surface flex gap-3">
              <Button
                fullWidth
                variant="success"
                icon={Check}
                onClick={() => { onVerify?.(); onClose(); }}
              >
                Confirm Source Fact
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
