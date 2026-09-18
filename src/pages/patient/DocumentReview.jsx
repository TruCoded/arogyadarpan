import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StitchAppHeader from '../../components/StitchAppHeader'
import Timeline from '../../components/Timeline'
import { getActivePatient } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function DocumentReview() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeBbox, setActiveBbox] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMedName, setNewMedName] = useState('')
  const [newMedDosage, setNewMedDosage] = useState('')

  const [records, setRecords] = useState([
    {
      id: 'rec-1',
      bboxId: 'bbox-1',
      title: 'Tab. Metformin 500mg',
      hindiSubtitle: '(दिन में दो बार)',
      regimen: '1 tab - Morning & Night • Duration: 30 days',
      timing: 'Timing: After meals (भोजन के बाद)',
      pageRef: 'Prescription Pg 1, Line 4',
      confidence: '96% High Confidence',
      confidenceType: 'emerald',
      icon: 'medication',
      iconBg: 'bg-emerald-50 text-[#006947]',
    },
    {
      id: 'rec-2',
      bboxId: 'bbox-2',
      title: 'Tab. Atorvastatin 20mg',
      hindiSubtitle: '(रात को)',
      regimen: '1 tab - Bedtime • Lipid Control',
      timing: 'Timing: Once at bedtime (सोते समय)',
      pageRef: 'Prescription Pg 1, Line 6',
      confidence: '88% Confidence',
      confidenceType: 'cyan',
      icon: 'pill',
      iconBg: 'bg-cyan-50 text-cyan-700',
    },
    {
      id: 'rec-3',
      bboxId: 'bbox-3',
      title: 'HbA1c Glycated Hemoglobin',
      isLab: true,
      value: '8.4%',
      rangeTag: 'High Range',
      comparison: 'Previous: 7.8% (Recorded 90 days ago)',
      pageRef: 'Prescription Pg 1, Line 9',
      confidence: '94% Verified',
      confidenceType: 'emerald',
      flagText: 'Doctor review recommended prior to prescription renewal',
      icon: 'vital_signs',
      iconBg: 'bg-amber-50 text-amber-600',
    }
  ])

  const handleAddRecord = (e) => {
    e.preventDefault()
    if (!newMedName) return
    const newEntry = {
      id: `rec-${Date.now()}`,
      title: newMedName,
      hindiSubtitle: '(Manual Addition)',
      regimen: newMedDosage || 'As directed by physician',
      timing: 'Custom entry added by patient',
      pageRef: 'Patient Reported',
      confidence: '100% Patient Confirmed',
      confidenceType: 'emerald',
      icon: 'medication',
      iconBg: 'bg-teal-50 text-teal-700',
    }
    setRecords(prev => [...prev, newEntry])
    setNewMedName('')
    setNewMedDosage('')
    setShowAddModal(false)
  }

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col font-sans text-slate-800 pb-24 select-none">
      <StitchAppHeader
        title="Extracted Medical Information"
        subtitle="निकाली गई जानकारी"
        showBack
        onBack={() => navigate('/patient/documents')}
      />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-3 pb-36 flex flex-col gap-4">
        {/* Progress Header & Context Guidance */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-teal-800 tracking-wider uppercase font-bold">
              Step 4 of 6 • दस्तावेज़ सत्यापन
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-mono text-[10px] font-bold bg-slate-200/80 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px] text-[#006947]">document_scanner</span>
              ABDM FHIR R4
            </span>
          </div>

          {/* Stepper Indicator */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1">
            <div className="bg-teal-700 h-full rounded-full transition-all duration-500" style={{ width: '66.6%' }} />
          </div>

          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Extracted Medical Information <span className="text-slate-500 font-normal text-base">(निकाली गई जानकारी)</span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Review what our AI extracted from your prescription. Tap any item to inspect bounding boxes or make corrections.
          </p>
        </div>

        {/* Interactive Document Preview Strip */}
        <div className="relative w-full rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-teal-700">find_in_page</span>
              <span className="font-heading text-xs font-bold text-slate-800">Source Document Scan</span>
              <span className="bg-teal-50 text-teal-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200/60">
                {records.length} Matches
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 font-mono text-[10px] font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'COLLAPSE' : 'EXPAND VIEW'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {/* Prescription Document Area with OCR bounding overlays */}
          <div
            className={`relative w-full transition-all duration-300 overflow-hidden bg-slate-900 ${
              isExpanded ? 'h-72' : 'h-44'
            }`}
          >
            <img
              className="w-full h-full object-cover object-top opacity-90"
              alt="Handwritten prescription with OCR overlays"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMJS-5H3OBXkDd5RVw5Y7fzvVpByxTAbS-7M5zIqah8dYh8X7aNOV1dT7ghIRnZJn0BHa1VAaCXGtKLusTjEyeWpOi6YPZirv1a7mp-tU61o5KJIc_dA0yW488TZPzP7HJ5Y-BovK5D4W9SXtcfSQEnW3vDdLbGu3p5mMNHSsJXEcz2xX_IF0oT-Lt7S8sYBKw_5EpxkNpzW3NFzjc1WZI9UfFSRauo99PoBisaa-ZQ-zS0YQyoKaI"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

            {/* OCR Bounding Box 1: Metformin (Emerald Glow) */}
            <div
              onClick={() => setActiveBbox(activeBbox === 'rec-1' ? null : 'rec-1')}
              className={`absolute left-6 top-8 w-56 h-7 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-between px-2 ${
                activeBbox === 'rec-1'
                  ? 'bg-emerald-500/40 shadow-[0_0_0_2px_#10B981,0_0_12px_rgba(16,185,129,0.5)] scale-105'
                  : 'bg-emerald-500/20 shadow-[0_0_0_1.5px_#00855b]'
              }`}
            >
              <span className="font-mono text-[9px] font-bold text-[#006947] bg-white px-1.5 py-0.5 rounded shadow-xs">
                Rx: Metformin 500mg
              </span>
              <span className="material-symbols-outlined text-[13px] text-white drop-shadow">verified</span>
            </div>

            {/* OCR Bounding Box 2: Atorvastatin (Cyan Glow) */}
            <div
              onClick={() => setActiveBbox(activeBbox === 'rec-2' ? null : 'rec-2')}
              className={`absolute left-6 top-18 w-52 h-7 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-between px-2 ${
                activeBbox === 'rec-2'
                  ? 'bg-cyan-500/40 shadow-[0_0_0_2px_#06B6D4,0_0_12px_rgba(6,182,212,0.5)] scale-105'
                  : 'bg-cyan-500/20 shadow-[0_0_0_1.5px_#008378]'
              }`}
            >
              <span className="font-mono text-[9px] font-bold text-cyan-800 bg-white px-1.5 py-0.5 rounded shadow-xs">
                Rx: Atorvastatin 20mg
              </span>
              <span className="material-symbols-outlined text-[13px] text-white drop-shadow">check_circle</span>
            </div>

            {/* OCR Bounding Box 3: HbA1c (Amber Warning Glow) */}
            <div
              onClick={() => setActiveBbox(activeBbox === 'rec-3' ? null : 'rec-3')}
              className={`absolute left-6 top-28 w-44 h-7 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-between px-2 ${
                activeBbox === 'rec-3'
                  ? 'bg-amber-500/40 shadow-[0_0_0_2px_#F59E0B,0_0_12px_rgba(245,158,11,0.5)] scale-105'
                  : 'bg-amber-500/20 shadow-[0_0_0_1.5px_#F59E0B]'
              }`}
            >
              <span className="font-mono text-[9px] font-bold text-amber-700 bg-white px-1.5 py-0.5 rounded shadow-xs">
                HbA1c: 8.4%
              </span>
              <span className="material-symbols-outlined text-[13px] text-white drop-shadow">priority_high</span>
            </div>

            {/* Real-time OCR scanner HUD indicator */}
            <div className="absolute bottom-2 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md shadow-sm text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px]">OCR Engine V2.8 Active</span>
            </div>
          </div>
        </div>

        {/* Extracted Records List Stack */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-heading font-bold text-xs text-slate-800">
              Parsed Line Items ({records.length})
            </span>
            <span className="font-mono text-[10px] text-slate-400 font-bold">
              TAP CARD TO INSPECT
            </span>
          </div>

          {records.map((rec) => {
            const isSelected = activeBbox === rec.id
            return (
              <div
                key={rec.id}
                onClick={() => setActiveBbox(isSelected ? null : rec.id)}
                className={`group relative rounded-2xl bg-white p-3.5 shadow-xs border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${rec.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className="material-symbols-outlined text-[22px]">{rec.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-heading font-bold text-sm text-slate-900 truncate">{rec.title}</span>
                        {rec.hindiSubtitle && (
                          <span className="text-xs text-slate-500">{rec.hindiSubtitle}</span>
                        )}
                      </div>

                      {rec.isLab ? (
                        <>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-mono text-xl text-amber-600 font-black">{rec.value}</span>
                            <span className="font-mono text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                              {rec.rangeTag}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-[14px] text-red-500">trending_up</span>
                            <span>{rec.comparison}</span>
                          </div>
                          {rec.flagText && (
                            <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-medium border border-red-200/80">
                              <span className="material-symbols-outlined text-[15px] shrink-0">flag</span>
                              <span className="truncate">{rec.flagText}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">{rec.regimen}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{rec.timing}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      alert(`Editing: ${rec.title}`)
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-700 transition-all shrink-0 cursor-pointer"
                    title="Edit entry"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>

                {/* Metadata & Confidence Pill Row */}
                <div className="flex items-center justify-between mt-3 pt-2 bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-100">
                  <div className="flex items-center gap-1 text-teal-700 font-mono text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                    <span className="underline decoration-dotted underline-offset-2">{rec.pageRef}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    rec.confidenceType === 'cyan'
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                      : 'bg-emerald-50 text-[#006947] border border-emerald-200'
                  }`}>
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    {rec.confidence}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Manual Entry Fallback */}
        <div className="flex items-center justify-center py-1">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-teal-700 font-heading font-bold text-xs border border-slate-200/80 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Missing Medication or Lab Result</span>
          </button>
        </div>

        {/* Clinical AI Assurance Banner */}
        <div className="rounded-2xl bg-slate-100/90 border border-slate-200 p-3.5 flex items-start gap-3">
          <span className="material-symbols-outlined text-teal-700 text-[22px] shrink-0 mt-0.5">verified_user</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading font-bold text-xs text-slate-900">Human Doctor Review Guard</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dr. Ananya Sharma will review original scans alongside these extracted items (ABDM FHIR R4 Ready). No prescription is dispatched without clinical validation.
            </p>
          </div>
        </div>

        {/* Unified Medical Timeline Section */}
        <div className="mt-2 pt-4 border-t border-slate-200">
          <Timeline />
        </div>

        {/* Bottom Floating CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto px-4 pb-safe pt-2 z-40">
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/patient/confirmation')}
              className="w-full h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-heading text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Confirm Extracted Records & Proceed</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-center">
              <span className="material-symbols-outlined text-[12px] text-[#006947]">lock</span>
              <span className="font-mono text-[10px] text-slate-500">
                Encrypted & Stored in Ayushman Bharat Health Locker (ABHA)
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Add Missing Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-heading font-bold text-sm text-slate-900">Add Medication / Lab Result</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Medicine / Test Name
                  </label>
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Tab. Telmisartan 40mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dosage / Notes
                  </label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g. 1 tab daily after breakfast"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-heading font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white font-heading font-bold text-xs"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
