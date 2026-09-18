import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic, FileText, Brain, ClipboardCheck,
  Stethoscope, ArrowRight, Shield, Globe,
  Heart, CheckCircle2, Sparkles, User, UserCheck,
  Activity, ShieldCheck, Lock, ChevronRight, Phone, Smartphone
} from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'
import { getActivePatient, isAuthenticated } from '../services/sessionStore'
import BionicAuthModal from '../components/kiosk/BionicAuthModal'
import { EcgLine } from '../components/kiosk/Telemetry'
import heartOrgan from '../assets/organ-heart.png'

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('login')
  const [isAuthed, setIsAuthed] = useState(() => isAuthenticated())
  const [currentPatient, setCurrentPatient] = useState(() => getActivePatient())

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode)
    setAuthModalOpen(true)
  }

  const handleAuthSuccess = (patient) => {
    setCurrentPatient(patient)
    setIsAuthed(true)
    navigate('/kiosk')
  }

  const flowSteps = [
    { icon: UserCheck, label: '1. Check-In / Register', desc: 'ABHA linking & patient token' },
    { icon: Mic, label: '2. Clinical Intake', desc: 'Adaptive voice + touch triage' },
    { icon: FileText, label: '3. Medical OCR', desc: 'Extracts labs & prescriptions' },
    { icon: ClipboardCheck, label: '4. Health Timeline', desc: 'Longitudinal record synthesis' },
    { icon: Stethoscope, label: '5. Doctor Review', desc: 'Physician workbench & decisions' },
  ]

  const features = [
    {
      icon: Globe,
      title: '10+ Indian Regional Languages',
      desc: 'Bilingual Hindi, English, Bengali, Tamil, Telugu, Marathi, and Gujarati with voice synthesis and accent adaptation.',
      tag: 'Multilingual AI'
    },
    {
      icon: ShieldCheck,
      title: 'DPDP Act 2023 & ABDM Compliant',
      desc: 'Strict non-diagnostic triage. AI prepares and explains; the consulting physician makes all final decisions.',
      tag: 'Govt Standards'
    },
    {
      icon: FileText,
      title: 'Evidence-Backed Document OCR',
      desc: 'Extracts handwritten prescriptions, flags abnormal biomarkers, and checks drug-drug interactions like Warfarin + Aspirin.',
      tag: 'Clinical Intelligence'
    },
    {
      icon: Activity,
      title: 'AYUSH & Modern Medicine Dual Track',
      desc: 'Seamlessly switch between Western clinical SOCRATES triage and classical Dashavidha Pariksha assessment.',
      tag: 'Integrated Health'
    },
  ]

  return (
    <div className="kiosk-canvas min-h-screen text-slate-900 select-none pb-16">
      {/* ── Top Frosted Glass Navbar ── */}
      <header className="glass-card sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xs">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-cobalt to-cobalt-deep flex items-center justify-center shadow-cobalt text-white font-extrabold text-base">
              AD<span className="-mt-2 text-xs font-bold text-emerald">+</span>
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
                ArogyaDarpan
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                Bionic Health Nexus • SIH 2026
              </span>
            </div>
          </div>

          {/* Nav Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="compact" />

            {/* If Authenticated: Show Name & Go to Kiosk */}
            {isAuthed ? (
              <button
                onClick={() => navigate('/kiosk')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cobalt to-cobalt-deep text-white text-xs font-bold shadow-cobalt hover:brightness-110 transition cursor-pointer"
              >
                <span>Kiosk Console ({currentPatient.name.split(' ')[0]})</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="size-3.5 text-cobalt" />
                  <span>Check In / Login</span>
                </button>
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cobalt to-cobalt-deep text-white text-xs font-bold shadow-cobalt hover:brightness-110 transition cursor-pointer"
                >
                  <User className="size-3.5" />
                  <span>Register Patient</span>
                </button>
              </>
            )}

            <button
              onClick={() => navigate('/splash')}
              className="glass-pill px-3.5 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 border border-teal-200 bg-teal-50/50 hover:bg-teal-50 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Smartphone className="size-3.5 text-teal-600" />
              <span>Mobile App</span>
            </button>

            <button
              onClick={() => navigate('/doctor')}
              className="glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-cobalt border border-slate-200 transition cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <Stethoscope className="size-3.5" />
              <span>Doctor Portal</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-12 text-center">
        <motion.div initial="hidden" animate="visible" className="space-y-6">
          {/* Top Pill Disclaimer */}
          <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2">
            <span className="status-chip bg-cobalt-soft text-cobalt border border-cobalt/20 py-1 px-3 text-xs font-bold shadow-xs">
              <Shield className="size-3.5 mr-1" />
              AI Prepares. AI Explains. The Doctor Decides.
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            custom={1}
            variants={fadeInUp}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]"
          >
            Your complete health story, organized{' '}
            <span className="rounded-2xl bg-lime px-4 py-0.5 text-lime-ink inline-block shadow-xs">
              before
            </span>{' '}
            the doctor consultation.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeInUp}
            className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Multilingual hospital kiosk combining conversational AI triage, handwritten prescription OCR,
            drug safety intelligence, and ABDM health records in 10+ Indian languages.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            custom={3}
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={() => handleOpenAuth('login')}
              className="btn-bionic px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-cobalt flex items-center gap-2.5 scale-100 hover:scale-105 transition-all"
            >
              <UserCheck className="size-5" />
              <span>Patient Check-In & Launch Kiosk</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={() => navigate('/splash')}
              className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-teal-glow bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center gap-2 hover:brightness-110 transition cursor-pointer"
            >
              <Smartphone className="size-4" />
              <span>Mobile App Flow (Stitch UI)</span>
            </button>

            <button
              onClick={() => navigate('/kiosk')}
              className="btn-bionic-outline px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
            >
              <Activity className="size-4 text-cobalt" />
              <span>Explore MediKiosk Terminal</span>
            </button>

            <button
              onClick={() => navigate('/doctor')}
              className="btn-bionic-outline px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
            >
              <Stethoscope className="size-4 text-emerald" />
              <span>Physician Workbench</span>
            </button>
          </motion.div>

          {/* Interactive Bionic Preview Teaser Card */}
          <motion.div
            custom={4}
            variants={fadeInUp}
            className="glass-card mt-10 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-float rounded-3xl max-w-4xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left preview: 3D Heart & Live Telemetry */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 relative overflow-hidden">
                <div className="absolute size-44 rounded-full bg-cobalt-soft blur-2xl pointer-events-none" />
                <img
                  src={heartOrgan}
                  alt="3D Heart Model"
                  className="size-36 object-contain animate-float-slow drop-shadow-xl z-10"
                />
                <div className="w-full mt-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Heart className="size-3 fill-cobalt text-cobalt" /> Live Rhythm
                    </span>
                    <span className="text-xs font-black text-slate-900">120 bpm</span>
                  </div>
                  <EcgLine className="mt-1 text-cobalt h-6 w-full" />
                </div>
              </div>

              {/* Right preview: Patient Dossier Snapshot */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="status-chip bg-emerald-soft text-emerald font-bold">
                    ACTIVE KIOSK ENCOUNTER
                  </span>
                  <span className="text-xs font-mono text-slate-400">ABHA: 91-4829-1029</span>
                </div>

                <h3 className="font-heading font-black text-xl text-slate-900">
                  Rahul Sharma, 46y / Male
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Chief Complaint: Squeezing chest pressure radiating to left arm.
                  Documented Type 2 Diabetes, on Metformin 500mg BD.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">TRIAGE SEVERITY</span>
                    <span className="font-bold text-coral flex items-center gap-1 mt-0.5">
                      🔴 ESI Level 2 Priority
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">OCR DRUG CHECK</span>
                    <span className="font-bold text-emerald flex items-center gap-1 mt-0.5">
                      ✓ No Contraindications
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAuth('login')}
                  className="btn-bionic w-full py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 mt-1"
                >
                  <span>Sign In or Select Demo Patient Profile</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Clinical Workflow Stepper ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="glass-card p-6 sm:p-10 bg-white border border-slate-200/80 shadow-xs rounded-3xl">
          <div className="text-center mb-8">
            <span className="status-chip bg-cobalt-soft text-cobalt font-bold mb-2">
              End-to-End Patient Journey
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              How ArogyaDarpan Works
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Seamless transition from kiosk registration to physician consultation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {flowSteps.map((step, i) => (
              <div
                key={i}
                className="glass-card tile-lift p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center flex flex-col items-center justify-between h-44"
              >
                <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-cobalt shadow-xs mb-2">
                  <step.icon className="size-6" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 mb-1">
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  Phase 0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Feature Architecture Bento Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass-card tile-lift p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-2xl bg-cobalt-soft text-cobalt flex items-center justify-center shadow-xs">
                    <feat.icon className="size-6" />
                  </div>
                  <span className="status-chip bg-slate-100 text-slate-600 font-mono">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-heading font-black text-lg text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-cobalt">
                <span>Integrated into MediKiosk</span>
                <ChevronRight className="size-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 text-center text-xs text-slate-500 font-medium">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-coral fill-coral" />
            <span className="font-bold text-slate-800 font-heading">
              ArogyaDarpan — Smart India Hackathon 2026
            </span>
          </div>
          <p className="text-slate-400">
            Open-standard ABDM M1, M2 & M3 compliant. Built for hospital OPD kiosks & remote health centers.
          </p>
        </div>
      </footer>

      {/* ── Bionic Authentication Modal ── */}
      <BionicAuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
