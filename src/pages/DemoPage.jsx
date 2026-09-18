import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play, Stethoscope, User, Heart, Zap, ArrowRight, ArrowLeft,
  Sparkles, Activity, FileText, History, ShieldCheck, CheckCircle2,
  ChevronRight, LogIn, PhoneCall
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'
import { loginPatient, getRegisteredPatients } from '../services/sessionStore'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function DemoPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleStartPatientDemo = () => {
    const demoPatient = getRegisteredPatients()[0] || {
      patientId: 'pt_00291',
      name: 'Rahul Sharma',
      age: '46',
      gender: 'Male',
      phone: '9876543210',
      abhaId: '91-4829-1029',
      bloodGroup: 'B+',
    }
    loginPatient(demoPatient)
    navigate('/kiosk')
  }

  const handleStartGoldenPath = () => {
    const demoPatient = getRegisteredPatients()[0] || {
      patientId: 'pt_00291',
      name: 'Rahul Sharma',
      age: '46',
      gender: 'Male',
      phone: '9876543210',
      abhaId: '91-4829-1029',
      bloodGroup: 'B+',
    }
    loginPatient(demoPatient)
    navigate('/kiosk')
  }

  return (
    <div className="kiosk-canvas min-h-screen text-slate-900 pb-28 overflow-y-auto">
      {/* ── Top Frosted Glass Navbar ── */}
      <header className="glass-card sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xs">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-cobalt to-cobalt-deep flex items-center justify-center shadow-cobalt text-white font-extrabold text-base">
              AD<span className="-mt-2 text-xs font-bold text-emerald">+</span>
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
                ArogyaDarpan
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                Interactive Testing Suite • SIH 2026
              </span>
            </div>
          </div>

          {/* Nav Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="compact" />
            <button
              onClick={() => navigate('/kiosk')}
              className="glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="size-3.5 text-cobalt" />
              <span>MediKiosk View</span>
            </button>
            <button
              onClick={() => navigate('/doctor')}
              className="glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-cobalt border border-slate-200 transition cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Stethoscope className="size-3.5 text-emerald" />
              <span>Doctor Portal</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-bionic-outline px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              <span>Home</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14">
        <motion.div initial="hidden" animate="visible" className="text-center space-y-4 mb-10">
          {/* Top Chip */}
          <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2">
            <span className="status-chip bg-cobalt-soft text-cobalt border border-cobalt/20 py-1 px-3.5 text-xs font-bold shadow-xs">
              <Sparkles className="size-3.5 mr-1 text-cobalt" />
              Pre-loaded Clinical Evaluation Scenarios
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={1}
            variants={fadeInUp}
            className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Quick Clinical{' '}
            <span className="rounded-2xl bg-lime px-4 py-0.5 text-lime-ink inline-block shadow-xs">
              Demo
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeInUp}
            className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed"
          >
            Choose a clinical track to test ArogyaDarpan's conversational triage,
            handwritten prescription OCR, and physician decision workbench.
          </motion.p>
        </motion.div>

        {/* ── Golden Demo Path Card (Hero Highlight) ── */}
        <motion.div
          custom={3}
          variants={fadeInUp}
          className="glass-card p-6 sm:p-8 bg-white border border-slate-200/90 shadow-float rounded-3xl mb-8 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-soft/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="status-chip bg-emerald-soft text-emerald font-bold border border-emerald/20 flex items-center gap-1">
                  <Zap className="size-3.5 fill-current" />
                  GOLDEN DEMO PATH • RECOMMENDED
                </span>
                <span className="text-xs font-mono text-slate-400">1-Click Automated Setup</span>
              </div>

              <h2 className="font-heading text-2xl font-black text-slate-900">
                End-to-End Patient Kiosk to Doctor Review
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Automatically logs in as <strong>Rahul Sharma (46y / M)</strong>, launches the 
                <strong> MediKiosk Conditions Screen</strong>, connects with live telemetry,
                and synchronizes prescription OCR with the attending physician.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  ✓ ABHA: 91-4829-1029
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  ✓ Squeezing Chest Pain (ESI Level 2)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  ✓ Metformin + ECG Telemetry
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <button
                onClick={handleStartGoldenPath}
                className="btn-bionic px-7 py-4 rounded-full text-white font-bold text-xs sm:text-sm shadow-cobalt flex items-center justify-center gap-2.5 hover:scale-105 active:scale-98 transition-all cursor-pointer"
              >
                <Play className="size-4 fill-white" />
                <span>Start Golden Path Demo</span>
                <ArrowRight className="size-4" />
              </button>
              <span className="text-[10px] text-center text-slate-400 font-mono">
                Launches MediKiosk Console
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Two Column Split: Patient Flow vs Doctor Flow ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Patient MediKiosk Journey */}
          <motion.div
            custom={4}
            variants={fadeInUp}
            className="glass-card tile-lift p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-glass flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-2xl bg-cobalt-soft text-cobalt flex items-center justify-center shadow-xs">
                  <User className="size-6" />
                </div>
                <span className="status-chip bg-slate-100 text-slate-700 font-bold text-[10px]">
                  PATIENT PORTAL
                </span>
              </div>

              <h3 className="font-heading text-xl font-black text-slate-900 mb-1.5">
                Patient MediKiosk Journey
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Experience the patient intake flow from regional language selection, ABHA identification,
                to real-time medical OCR analysis.
              </p>

              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 mb-6">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cobalt" />
                  <span>Rahul Sharma, 46 years (ABHA Linked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-coral" />
                  <span>Chest pain for 3 days (Squeezing pressure)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald" />
                  <span>Voice synthesis + touch multilingual triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>Handwritten prescription & Lab OCR scanner</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleStartPatientDemo}
                className="btn-bionic w-full py-3.5 rounded-full text-white font-bold text-xs shadow-cobalt flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch MediKiosk Overview</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate('/patient/interview')}
                className="btn-bionic-outline w-full py-2.5 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>Direct to AI Clinical Interview</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Doctor Dashboard */}
          <motion.div
            custom={5}
            variants={fadeInUp}
            className="glass-card tile-lift p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-glass flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-2xl bg-emerald-soft text-emerald flex items-center justify-center shadow-xs">
                  <Stethoscope className="size-6" />
                </div>
                <span className="status-chip bg-emerald-soft text-emerald font-bold text-[10px]">
                  PHYSICIAN WORKBENCH
                </span>
              </div>

              <h3 className="font-heading text-xl font-black text-slate-900 mb-1.5">
                Doctor Review Dashboard
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                See how clinicians review AI-prepared health dossiers, check biomarker flags,
                and inspect potential drug-drug interactions.
              </p>

              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 mb-6">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-coral" />
                  <span>Priority patient queue with ESI Level triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>Automated allergy & drug conflict detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald" />
                  <span>Evidence-backed clinical summary cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cobalt" />
                  <span>Doctor decision loop: Verify, Edit, or Reject</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/doctor')}
                className="btn-bionic w-full py-3.5 rounded-full text-white font-bold text-xs shadow-cobalt flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Physician Workbench</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate('/doctor/patient/pt_00291')}
                className="btn-bionic-outline w-full py-2.5 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>Inspect Rahul Sharma's Dossier</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Direct Module Navigation Matrix ── */}
        <div className="glass-card p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
            Direct Access to Individual Clinical Modules
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => navigate('/kiosk')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1.5 text-slate-800 font-bold transition cursor-pointer"
            >
              <Activity className="size-5 text-cobalt" />
              <span>MediKiosk Overview</span>
            </button>
            <button
              onClick={() => navigate('/patient/documents')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1.5 text-slate-800 font-bold transition cursor-pointer"
            >
              <FileText className="size-5 text-cobalt" />
              <span>Medical OCR Scanner</span>
            </button>
            <button
              onClick={() => navigate('/patient/document-review')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1.5 text-slate-800 font-bold transition cursor-pointer"
            >
              <History className="size-5 text-cobalt" />
              <span>Health Timeline</span>
            </button>
            <button
              onClick={() => navigate('/doctor')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1.5 text-slate-800 font-bold transition cursor-pointer"
            >
              <Stethoscope className="size-5 text-emerald" />
              <span>Doctor Console</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cobalt transition-colors cursor-pointer py-2 px-4 rounded-full hover:bg-white"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to ArogyaDarpan Portal Home</span>
          </button>
        </div>
      </main>
    </div>
  )
}
