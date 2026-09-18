import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Bell, PhoneCall, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RedFlagAlertModal({
  isOpen,
  onClose,
  alertData,
  onAcknowledge,
  lang = 'en',
}) {
  // Play subtle warning audio chime on mount if permitted
  useEffect(() => {
    if (isOpen) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) {
          const ctx = new AudioCtx()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15) // A5
          gain.gain.setValueAtTime(0.15, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.4)
        }
      } catch { /* ignore audio failure */ }
    }
  }, [isOpen])

  if (!isOpen || !alertData) return null

  const isHindi = lang === 'hi'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative bg-white rounded-3xl border-2 border-red-500 shadow-coral-glow max-w-lg w-full p-6 text-center overflow-hidden"
      >
        {/* Ambient Coral Halo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />

        {/* Flashing Top Alert Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />

        {/* Emergency Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50 shadow-inner">
          <ShieldAlert className="w-9 h-9 animate-bounce" />
        </div>

        {/* Non-Diagnostic Safety Heading */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          {isHindi ? 'प्राथमिकता चिकित्सा समीक्षा' : 'Priority Clinical Review Flagged'}
        </span>

        <h2 className="text-xl sm:text-2xl font-extrabold text-red-700 font-heading mb-2 leading-tight">
          {alertData.publicAlertMessage || 'Chest pain radiating to left arm with breathlessness detected.'}
        </h2>

        {isHindi && (
          <p className="text-xs sm:text-sm font-semibold text-red-800 mb-3">
            संभावित आपातकालीन लक्षण पाए गए हैं। कृपया तुरंत स्वास्थ्य कर्मियों को सूचित करें।
          </p>
        )}

        {/* Guidance Box with Doctor Escalation Note */}
        <div className="bg-red-50/90 border border-red-200/80 rounded-2xl p-4 text-left mb-5 space-y-2.5 text-xs sm:text-sm text-red-900">
          <div className="flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed font-medium">
              {isHindi
                ? 'हमने आपके परामर्श को डॉक्टर के डैशबोर्ड पर उच्च प्राथमिकता (🔴 High Priority) पर स्वचालित रूप से भेज दिया है।'
                : 'We have automatically escalated your intake to Dr. Sharma as High Priority (🔴 Priority Review) in the clinic queue.'
              }
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed text-slate-600 text-xs">
              {isHindi
                ? 'कृपया आगे की नर्सिंग डेस्क या आपातकालीन स्टाफ को तुरंत बताएं।'
                : 'Please alert the nearest triage nurse or OPD reception desk immediately.'
              }
            </p>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <p className="text-[11px] text-slate-500 mb-6">
          🛡️ <strong>Clinical Safety Protocol:</strong> AI assists preparation only. Final triage assessment is conducted by licensed clinical staff.
        </p>

        {/* Dual Emergency Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              onAcknowledge?.()
              onClose()
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-sm shadow-coral-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="size-4" />
            <span>{isHindi ? '🚨 मैंने स्टाफ को सूचित कर दिया है' : '🚨 Alert Front Reception / Nursing Staff'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{isHindi ? 'मैं पहले से ही प्रतीक्षा क्षेत्र में बैठा हूँ →' : 'I Am Already Seated in Waiting Area →'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
