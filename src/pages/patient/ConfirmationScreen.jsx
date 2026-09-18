import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ClipboardCheck, Check, Edit3, ArrowRight, ArrowLeft,
  AlertTriangle, CheckCircle2, Clock, Volume2, ShieldCheck,
  Sparkles, History, Mic
} from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { getActivePatient, buildDynamicConfirmationItems } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function ConfirmationScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()

  // Dynamically build confirmation items from active interview responses & OCR
  const initialItems = useMemo(() => buildDynamicConfirmationItems(), [])
  const [items, setItems] = useState(initialItems)
  const [keepFlag, setKeepFlag] = useState(true)

  const toggleStatus = (index) => {
    setItems(prev => prev.map((item, i) =>
      i === index
        ? { ...item, status: item.status === 'confirmed' ? 'needs_review' : 'confirmed' }
        : item
    ))
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col select-none pb-28 pb-safe">
      <StitchAppHeader title="अंतिम पुष्टि (Final Confirmation)" showBack onBack={() => navigate('/patient/document-review')} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Progress Header Meta */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-teal-800">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Step 5 of 6 • अंतिम समीक्षा (Final Review)
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-500">85% COMPLETE</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: '85%' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t('letsConfirm', "Let's Confirm What We Understood")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Review your clinical intake before it is securely encrypted and submitted to <span className="font-semibold text-teal-700">Dr. Ananya Sharma</span>.
              </p>
            </div>
          </div>

          {/* Doctor & Intake Summary Snapshot Card */}
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_vnaonz1_3Nzdgz6hH7_03cwDYwEEpn8cLmuZa2dxh3Jkp0OnCq5e7o5uB4JRzoWIQKylgRbAw_KLNFgpe9_mDpmSjJ2S_lWN7GJSU5JeVGai4MFaLdNKtIuvcmWh3mR_T1lNUxZr2E_YRz6A6U7gYMoB8TlhFSLDMoiM75Iiev51tQcz2lYsQrtc4gzki9DTUDp6XLhszNCJ05i59NiNzQuH5aV9eQC__mFxevP1t2XE3X09Arm"
                alt="Dr. Ananya Sharma"
                className="w-12 h-12 rounded-full object-cover shadow-xs ring-2 ring-teal-500/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm text-slate-900 truncate">Dr. Ananya Sharma</span>
                <span className="text-teal-600 inline-flex items-center text-xs">✓</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Consultant Cardiologist • Apex Health Center</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-700 font-semibold">
                  <Clock className="size-3" /> Next In Queue (~12 min wait)
                </span>
              </div>
            </div>
          </div>

          {/* FLAGSHIP FEATURE: Clinical Contradiction Alert Card */}
          <div className="relative overflow-hidden rounded-2xl bg-amber-500/10 border-2 border-amber-400 p-4 shadow-amber-glow transition-all">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                <AlertTriangle className="size-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                    Clinical Contradiction Detected
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-amber-800 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-300">
                    AI Safety Net
                  </span>
                </div>
                <span className="text-xs text-slate-600 mt-0.5">
                  Flagged for doctor review prior to prescription drafting
                </span>
              </div>
            </div>

            {/* Contradiction Diff Box */}
            <div className="rounded-xl bg-white/95 backdrop-blur-md p-3.5 mb-3 space-y-2.5 border border-amber-200 shadow-2xs">
              {/* Stated Today */}
              <div className="flex items-start gap-2.5">
                <Mic className="size-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Stated Today (Interview Q7)</span>
                    <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">Oral Intake</span>
                  </div>
                  <p className="font-heading font-bold text-sm text-slate-900 mt-0.5">“No known drug allergies”</p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Historical Record */}
              <div className="flex items-start gap-2.5">
                <History className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Historical Health Record (Oct 2024)</span>
                    <span className="font-mono text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      Penicillin Sensitive
                    </span>
                  </div>
                  <p className="font-heading font-bold text-sm text-red-600 mt-0.5">
                    “Penicillin allergy documented at City Hospital”
                  </p>
                </div>
              </div>
            </div>

            {/* Reassurance Message */}
            <p className="text-xs text-slate-700 leading-snug mb-3">
              💡 We highlighted this discrepancy so Dr. Sharma can double-check with you in person before prescribing antibiotics.
            </p>

            {/* Action Chips */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKeepFlag(true)}
                className={`py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  keepFlag
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="size-4" />
                <span>Keep Highlight</span>
              </button>

              <button
                type="button"
                onClick={() => setKeepFlag(false)}
                className={`py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !keepFlag
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Edit3 className="size-4" />
                <span>Update Answer</span>
              </button>
            </div>
          </div>

          {/* Checklist Header */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-heading font-bold text-sm text-slate-900">Pre-Intake Verified Checklist</span>
            <span className="font-mono text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> All Verified
            </span>
          </div>

          {/* Dynamic Confirmation Cards */}
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-heading font-bold text-slate-900 text-sm">{item.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(i)}
                    className={`size-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      item.status === 'confirmed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Check className="size-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Final Submit Bar */}
          <div className="sticky bottom-0 pt-4 pb-safe bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/95 to-transparent backdrop-blur-xs">
            <button
              type="button"
              onClick={() => navigate('/patient/complete')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-heading font-bold text-base shadow-teal-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & Lock Intake for Dr. Sharma</span>
              <ArrowRight className="size-5" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
