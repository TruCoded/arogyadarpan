import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2, ArrowRight, RefreshCw, QrCode, Clock, Sparkles
} from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { clearPatientSession, getActivePatient } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function CompletionScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()
  const [showQrModal, setShowQrModal] = useState(false)

  const handleStartNew = () => {
    clearPatientSession()
    navigate('/patient/language')
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col select-none pb-28 pb-safe">
      <StitchAppHeader title="सफलता (Intake Ready)" showBack={false} />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-4 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Celebration Header Block */}
          <div className="flex flex-col items-center text-center pt-2 px-1 relative">
            <div className="absolute -top-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

            {/* Radiant Emerald Badge with Healing Petals */}
            <div className="relative flex items-center justify-center mb-2">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-md animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center relative z-10 border border-white/60">
                <svg className="w-10 h-10 text-teal-700" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C18 10 12 18 14 26C15.5 32 20 36 24 38C28 36 32.5 32 34 26C36 18 30 10 24 4Z" fill="rgba(16, 185, 129, 0.15)" />
                  <path d="M24 16V36M24 24C20 22 17 19 16 15M24 28C28 26 31 23 32 19" stroke="#00855b" strokeLinecap="round" strokeWidth="2" />
                  <circle cx="24" cy="24" r="18" stroke="#008378" strokeDasharray="2 3" strokeWidth="2" />
                  <path d="M17 24.5L22 29.5L31 19.5" stroke="#00685f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 tracking-tight font-bold">
              You Are All Set, {patient.name || 'Rahul'}!
            </h1>
            <span className="text-xs text-teal-800 font-semibold mt-0.5">
              आपकी तैयारी पूरी हो गई है
            </span>
            <p className="text-xs text-slate-600 mt-1 max-w-[340px] leading-relaxed">
              Your complete bilingual clinical summary is already synced with Dr. Ananya Sharma’s workstation tablet.
            </p>
          </div>

          {/* Hero Digital Clinic Token Pass (Skeuomorphic Boarding Pass Style) */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
            {/* Top Pass Segment */}
            <div className="p-4 flex flex-col relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-mono text-[10px] font-bold border border-cyan-200/60">
                  <span className="material-symbols-outlined text-[13px]">confirmation_number</span>
                  <span>OFFICIAL OPD QUEUE PASS</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#006947]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00855b] animate-ping" />
                  <span>ACTIVE NOW</span>
                </div>
              </div>

              {/* Token Number & Room Header */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Assigned Queue Pass</span>
                  <span className="font-mono text-4xl sm:text-5xl text-teal-800 tracking-tight font-black">#A-14</span>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-900 font-mono text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px] text-teal-700">meeting_room</span>
                    <span>OPD Room 204</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Second Floor, East Wing</span>
                </div>
              </div>

              {/* Doctor Meta Badge */}
              <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-semibold border border-teal-200/60">
                    <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs text-slate-900 leading-tight">Dr. Ananya Sharma</div>
                    <div className="text-[11px] text-slate-500">Consultant Cardiologist • DM (Card)</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-teal-700 text-[18px]">verified_user</span>
              </div>
            </div>

            {/* Skeuomorphic Perforated Tear Notch & Dashed Line */}
            <div className="relative w-full flex items-center justify-between py-1 bg-transparent">
              {/* Left Notch Hole */}
              <div className="w-5 h-7 rounded-r-full bg-[#f7f9fb] shadow-inner -ml-0.5 border-r border-t border-b border-slate-200/60" />
              {/* Dashed Perforation Line */}
              <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2 opacity-60" />
              {/* Right Notch Hole */}
              <div className="w-5 h-7 rounded-l-full bg-[#f7f9fb] shadow-inner -mr-0.5 border-l border-t border-b border-slate-200/60" />
            </div>

            {/* Lower Pass Segment: Live Queue Tracker */}
            <div className="p-4 pt-2 bg-gradient-to-b from-white to-slate-50/60">
              {/* Real-time telemetry banner */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Currently In Consultation</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-xl text-slate-900 font-extrabold">#A-12</span>
                    <span className="font-mono text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                      IN SESSION
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Est. Consultation Call</span>
                  <div className="flex items-center justify-end gap-1 text-teal-700 font-mono text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>~8 to 12 mins</span>
                  </div>
                </div>
              </div>

              {/* Visual Patient Queue Flow Map */}
              <div className="p-3 rounded-2xl bg-white shadow-xs border border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-600 mb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Queue Position: 2 Ahead
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">ABDM TELEMETRY</span>
                </div>

                {/* Animated Progress Runway */}
                <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex items-center">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-teal-600 to-[#00855b] w-3/4 rounded-full transition-all duration-700" />
                </div>

                {/* Checkpoints Along Runway */}
                <div className="flex justify-between items-center mt-3 text-center">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[10px] font-semibold">#12</span>
                    <span className="font-mono text-[9px] text-slate-400 mt-0.5">Inside</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-mono text-[10px] font-bold">#13</span>
                    <span className="font-mono text-[9px] text-slate-600 mt-0.5">Next</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-7 h-7 rounded-full bg-teal-500/20 animate-ping" />
                      <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-md">#14</span>
                    </div>
                    <span className="font-mono text-[9px] text-teal-700 font-bold mt-0.5">YOU</span>
                  </div>
                  <div className="flex flex-col items-center opacity-40">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-mono text-[10px]">#15</span>
                    <span className="font-mono text-[9px] text-slate-400 mt-0.5">Queue</span>
                  </div>
                  <div className="flex flex-col items-center text-[#006947]">
                    <span className="material-symbols-outlined text-[18px]">door_open</span>
                    <span className="font-mono text-[9px] text-[#006947] font-semibold mt-0.5">Doc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next Guide */}
          <div className="flex flex-col space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">checklist</span>
                What to Expect Next
              </h2>
              <span className="font-mono text-[10px] text-teal-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200/60">
                Step-by-Step
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-teal-800 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-xs text-slate-900">Relax in the OPD Waiting Lobby</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Take a comfortable seat in Waiting Lounge B outside OPD Room 204.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-800 font-mono text-xs flex items-center justify-center shrink-0 font-bold border border-teal-200/60">
                2
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-xs text-slate-900">Digital Call Announcement</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Token #A-14 will chime across the overhead display when Dr. Sharma is ready.
                </p>
              </div>
            </div>
          </div>

          {/* ABDM Health Pass Export Action */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <QrCode className="size-4 text-teal-700" />
            <span>View & Save ABDM Health Pass (FHIR QR Code)</span>
          </button>

          {/* Doctor Dashboard Presentation Shortcut */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold font-mono text-teal-300 tracking-wider uppercase">FOR JUDGES & DOCTOR REVIEW</p>
              <p className="text-xs text-slate-300">Inspect Rahul Sharma in the Doctor Clinical Decision Station</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/doctor')}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-heading font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Open Doctor Queue</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Start New Session */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleStartNew}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              <span>{t('newPatient', 'Start New Patient Session')}</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* ABDM QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-heading font-bold text-sm text-slate-900">ABDM Digital Health Pass</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl p-3 border-2 border-dashed border-teal-500/40 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ABDM-FHIR-BUNDLE-TOKEN-A14-${patient.patientId || 'P10024'}`}
                alt="ABDM FHIR QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="font-mono text-xs font-bold text-teal-800">
              ABHA: {patient.abhaId || '91-8842-1920-4491'}
            </p>
            <p className="text-xs text-slate-500">
              Scan with any ABDM PHR app (Aarogya Setu, ABHA App) to import this encrypted clinical intake bundle.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs hover:bg-teal-700 cursor-pointer"
            >
              Close Health Pass
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
