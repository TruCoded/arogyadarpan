import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  LogIn,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import heartOrgan from '../assets/organ-heart.png'
import { BarSparkline, EcgLine, Sparkline } from './kiosk/Telemetry'
import { BionicKioskShell, useTrack } from './kiosk/BionicKioskShell'
import { bionicCareTeam, bionicOrgans, bionicVitals } from '../data/bionicData'
import { useLanguage } from '../context/LanguageContext'
import { getActivePatient, isAuthenticated } from '../services/sessionStore'
import BionicAuthModal from './kiosk/BionicAuthModal'

function statusTone(status) {
  if (status === 'critical') return 'text-coral font-bold'
  if (status === 'monitor' || status === 'abnormal') return 'text-amber font-bold'
  return 'text-emerald font-semibold'
}

function statusBadge(status) {
  const s = String(status).toLowerCase()
  if (s === 'critical') return 'border border-red-500 text-red-600 bg-transparent font-bold rounded-full px-2.5 py-0.5 text-[10px]'
  if (s === 'monitor' || s === 'abnormal') return 'border border-amber-500 text-amber-600 bg-transparent font-bold rounded-full px-2.5 py-0.5 text-[10px]'
  return 'border border-emerald-600 text-emerald-700 bg-transparent font-bold rounded-full px-2.5 py-0.5 text-[10px]'
}

function KioskContent() {
  const { track } = useTrack()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeOrganId, setActiveOrganId] = useState('heart')
  const [currentDateIndex, setCurrentDateIndex] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [patient, setPatient] = useState(() => getActivePatient())
  const [isAuthed, setIsAuthed] = useState(() => isAuthenticated())

  const [bp, hr, cbc, glucose] = bionicVitals
  const activeOrgan = bionicOrgans.find((o) => o.id === activeOrganId) || bionicOrgans[1]
  const scheduleDates = ['20-March-26', '24-March-26', '28-March-26']

  const handleStartConsultation = () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true)
      return
    }
    navigate('/patient/interview')
  }

  const handleAuthSuccess = (logged) => {
    setPatient(logged)
    setIsAuthed(true)
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      {/* ── Section 1: Hero Anatomy & Body Condition ── */}
      <section className="xl:col-span-7 flex flex-col justify-between">
        <div>
          {/* Header Title with Glowing Lime Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              Overview{' '}
              <span className="rounded-xl sm:rounded-2xl bg-lime px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-lime-ink inline-block shadow-xs text-xl sm:text-4xl md:text-5xl">
                Conditions
              </span>
            </h1>

            {/* Check-In Status Indicator Badge */}
            {isAuthed ? (
              <div
                onClick={() => setShowAuthModal(true)}
                className="glass-pill px-3.5 py-1.5 bg-emerald-soft/60 border border-emerald/40 text-emerald flex items-center gap-1.5 cursor-pointer hover:bg-emerald-soft transition"
              >
                <span className="size-2 rounded-full bg-emerald animate-ping" />
                <span className="text-xs font-bold font-heading">{patient.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({patient.abhaId})</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="border border-amber-400 bg-amber-50/80 text-amber-800 rounded-full px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-100 transition shadow-xs"
              >
                <span className="text-sm leading-none">→</span>
                <span>CHECK-IN REQUIRED</span>
              </button>
            )}
          </div>
          <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500">
            Active Kiosk Session •{' '}
            <span className="font-semibold text-slate-800">
              {track === 'ayush' ? '🌿 AYUSH — Dashavidha Pariksha' : '🩺 General & Cardiology Medicine'}
            </span>
          </p>

          {/* 3D Anatomical Heart Hero Stage */}
          <div className="relative mt-3 sm:mt-5 flex h-[260px] sm:h-[380px] md:h-[420px] items-center justify-center overflow-visible">
            {/* Concentric Radar Rings & Glowing Auras */}
            <div className="absolute size-[240px] sm:size-[340px] md:size-[380px] rounded-full border border-cobalt/15" />
            <div className="absolute size-[180px] sm:size-[260px] md:size-[300px] rounded-full border border-cobalt/20 border-dashed" />
            <div className="absolute size-[210px] sm:size-[300px] md:size-[340px] rounded-full bg-white/60 blur-[2px]" />
            <div className="absolute size-[160px] sm:size-[220px] md:size-[260px] rounded-full bg-cobalt-soft blur-3xl pointer-events-none" />

            {/* Levitating 3D Heart Image */}
            <img
              src={heartOrgan}
              alt="Interactive 3D anatomical heart model with telemetry hotspots"
              className="relative h-[220px] sm:h-[320px] md:h-[380px] w-auto animate-float-slow drop-shadow-2xl z-10 transition-transform duration-500 hover:scale-105"
            />

            {/* Pulsating Radar Hotspots */}
            {[
              { top: '22%', left: '62%' },
              { top: '46%', left: '28%' },
              { top: '66%', left: '68%' },
            ].map((pos, i) => (
              <button
                key={i}
                onClick={() => setActiveOrganId('heart')}
                aria-label={`Hotspot ${i + 1}`}
                className="absolute size-4 rounded-full bg-white shadow-glass ring-4 ring-teal-400/40 animate-soft-pulse z-20 cursor-pointer hover:scale-125 transition-transform"
                style={pos}
              />
            ))}

            {/* Floating Glass ECG Telemetry Card (120 bpm) */}
            <div className="glass-card absolute bottom-1 left-0 sm:left-4 w-44 sm:w-56 p-3 sm:p-4 shadow-float bg-white/95 z-30 border border-slate-200/90 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
                  <Heart className="size-3.5 fill-current" />
                </span>
                <span className="text-xs font-semibold text-slate-500">Heart Rate</span>
              </div>
              <p className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
                120 <span className="text-xs font-medium text-slate-500">bpm</span>
              </p>
              <EcgLine className="mt-1 text-cobalt" />
            </div>

            {/* Organ Insight Floating Note */}
            <div className="hidden sm:block glass-card absolute top-4 right-0 max-w-[210px] p-3.5 shadow-glass bg-white/95 z-30 border border-slate-200/90 rounded-2xl">
              <span className={`status-chip ${statusBadge(activeOrgan.status)} uppercase font-bold tracking-wide`}>
                {activeOrgan.name} • {activeOrgan.hindi}
              </span>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 font-medium">
                {activeOrgan.summary}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bionic Consultation Command Card (Matching User Image 1) ── */}
        <div className="glass-card mt-3 sm:mt-4 p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/90 shadow-glass flex flex-col gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`size-3 rounded-full ${isAuthed ? 'bg-emerald animate-ping' : 'bg-emerald-300'}`} />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {isAuthed ? `ACTIVE: ${patient.name}` : 'CHECK-IN REQUIRED'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {isAuthed ? patient.abhaId : 'ABHA IDENTITY'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isAuthed
                ? 'Your clinical records and telemetry are synchronized. Ready for AI intake & physician triage.'
                : 'Please verify your phone number or ABHA ID before starting your clinical session.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleStartConsultation}
              className="btn-bionic w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-bold text-xs shadow-cobalt flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAuthed ? 'Start AI Clinical Intake' : 'Check In / Register Now'}</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={() => navigate('/patient/documents')}
              className="glass-pill px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="size-3.5 text-cobalt" />
              <span>OCR Scan</span>
            </button>
          </div>
        </div>

        {/* ── Organ Carousel ("My Body Condition" - Matching User Image 1) ── */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-900">
              <span className="size-2.5 rounded-full bg-emerald-700" /> My Body Condition
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const idx = bionicOrgans.findIndex((o) => o.id === activeOrganId)
                  const prev = idx > 0 ? bionicOrgans[idx - 1] : bionicOrgans[bionicOrgans.length - 1]
                  setActiveOrganId(prev.id)
                }}
                className="glass-pill flex size-8 items-center justify-center border border-slate-200 hover:bg-slate-50 transition cursor-pointer rounded-full"
                aria-label="Previous organ"
              >
                <ChevronLeft className="size-4 text-slate-600" />
              </button>
              <button
                onClick={() => {
                  const idx = bionicOrgans.findIndex((o) => o.id === activeOrganId)
                  const next = idx < bionicOrgans.length - 1 ? bionicOrgans[idx + 1] : bionicOrgans[0]
                  setActiveOrganId(next.id)
                }}
                className="glass-pill flex size-8 items-center justify-center border border-slate-200 hover:bg-slate-50 transition cursor-pointer rounded-full"
                aria-label="Next organ"
              >
                <ChevronRight className="size-4 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {bionicOrgans.map((organ) => {
              const active = organ.id === activeOrganId
              return (
                <button
                  key={organ.id}
                  onClick={() => setActiveOrganId(organ.id)}
                  className={`glass-card tile-lift flex h-32 sm:h-36 w-32 sm:w-38 md:w-42 shrink-0 flex-col justify-between p-3 sm:p-4 text-left cursor-pointer transition rounded-2xl sm:rounded-3xl ${
                    active
                      ? 'border-emerald-600 shadow-cobalt ring-2 ring-emerald-500/30 bg-white'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-end w-full">
                    <span className={statusBadge(organ.status)}>
                      {organ.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-900 font-heading leading-tight">
                      {organ.name}
                    </span>
                    <span className="block text-xs font-medium text-slate-500 mt-0.5">
                      {organ.hindi}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Section 2: Vitals Grid & Care Schedule (Matching User Image 5) ── */}
      <section className="xl:col-span-5 flex flex-col justify-between gap-4">
        {/* Bento 4 Vitals Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* 1. Blood Status */}
          <div className="glass-card tile-lift p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
            <span className="text-xs font-bold text-slate-500">{bp.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {bp.value}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">{bp.unit}</span>
            </div>
            <Sparkline data={bp.sparklineData} color="var(--cobalt)" className="mt-2 text-cobalt" />
          </div>

          {/* 2. Heart Rate Card */}
          <div className="glass-card tile-lift p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{hr.label}</span>
              <span className="border border-red-500 text-red-600 bg-transparent font-bold rounded-full px-2 py-0.5 text-[10px]">
                FLAGGED
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {hr.value}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">{hr.unit}</span>
            </div>
            <Sparkline data={hr.sparklineData} color="var(--coral)" className="mt-2 text-coral" />
          </div>

          {/* 3. Blood Count */}
          <div className="glass-card tile-lift p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
            <span className="text-xs font-bold text-slate-500">{cbc.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {cbc.value}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">{cbc.unit}</span>
            </div>
            <BarSparkline data={cbc.sparklineData} className="mt-2 text-cobalt" />
          </div>

          {/* 4. Glucose Level Card */}
          <div className="glass-card tile-lift p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{glucose.label}</span>
              <span className="border border-amber-500 text-amber-600 bg-transparent font-bold rounded-full px-2 py-0.5 text-[10px]">
                MONITOR
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {glucose.value}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">{glucose.unit}</span>
            </div>
            <Sparkline data={glucose.sparklineData} color="var(--amber)" className="mt-2 text-amber" />
          </div>
        </div>

        {/* Doctor & Consultation Schedule Card */}
        <div className="glass-card p-5 bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
              Assigned Clinicians & OPD Schedule
            </h3>
            <span className="status-chip bg-emerald-soft text-emerald font-bold">
              OPD Active
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Date Pill Switcher */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2 border border-slate-200/60 text-xs">
              <button
                onClick={() => setCurrentDateIndex((i) => (i > 0 ? i - 1 : scheduleDates.length - 1))}
                className="glass-pill p-1.5 hover:bg-white transition cursor-pointer"
                aria-label="Previous date"
              >
                <ChevronLeft className="size-4 text-slate-400" />
              </button>
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CalendarDays className="size-4 text-cobalt" />
                <span>{scheduleDates[currentDateIndex]}</span>
              </div>
              <button
                onClick={() => setCurrentDateIndex((i) => (i < scheduleDates.length - 1 ? i + 1 : 0))}
                className="glass-pill p-1.5 hover:bg-white transition cursor-pointer"
                aria-label="Next date"
              >
                <ChevronRight className="size-4 text-slate-400" />
              </button>
            </div>

            {/* Care Team List */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Assigned Clinicians
              </span>
              <ul className="space-y-2.5">
                {bionicCareTeam.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-emerald-soft text-xs font-bold text-emerald border border-emerald/20 shrink-0">
                      {doc.avatar}
                    </span>
                    <span className="leading-tight">
                      <span className="block text-xs font-bold text-slate-900">{doc.name}</span>
                      <span className="block text-[10px] text-slate-500">{doc.specialty}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleStartConsultation}
              className="btn-bionic mt-3 flex w-full items-center justify-between rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-cobalt transition hover:brightness-110 hover:shadow-float active:scale-98 cursor-pointer"
            >
              <span>{isAuthed ? 'Begin Clinical Consultation' : 'Check In & Consult Now'}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Quick Kiosk Links */}
        <div className="glass-card p-3 bg-white/80 border border-slate-200/70 text-center">
          <p className="text-[11px] text-slate-500">
            Smart India Hackathon 2026 • AI MediKiosk
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <Link
              to="/patient/documents"
              className="text-[10px] font-bold text-cobalt hover:underline"
            >
              OCR Scan
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/patient/document-review"
              className="text-[10px] font-bold text-cobalt hover:underline"
            >
              Timeline
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/doctor" className="text-[10px] font-bold text-cobalt hover:underline">
              Doctor Console
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded Bionic Authentication Modal */}
      <BionicAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default function KioskView() {
  return (
    <BionicKioskShell>
      <KioskContent />
    </BionicKioskShell>
  )
}
