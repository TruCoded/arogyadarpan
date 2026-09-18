import React, { createContext, useContext, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Grid2x2,
  HeartPulse,
  Leaf,
  MessageSquareText,
  PhoneCall,
  Power,
  Search,
  ScanLine,
  Stethoscope,
  User,
  History,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { getActivePatient, isAuthenticated, logoutPatient } from '../../services/sessionStore'
import BionicAuthModal from './BionicAuthModal'

const TrackContext = createContext({
  track: 'modern',
  setTrack: () => {},
})

export const useTrack = () => useContext(TrackContext)

const navItems = [
  { to: '/kiosk', label: 'Vitals & Overview', icon: HeartPulse },
  { to: '/patient/interview', label: 'AI Clinical Intake', icon: MessageSquareText },
  { to: '/patient/documents', label: 'Document Intelligence', icon: ScanLine },
  { to: '/patient/document-review', label: 'Medical Timeline', icon: History },
  { to: '/doctor', label: 'Doctor Review', icon: Stethoscope },
]

function NavRail() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex w-[76px] shrink-0 flex-col items-center gap-3 py-6">
      <Link
        to="/kiosk"
        title="ArogyaDarpan MediKiosk"
        className="flex size-12 items-center justify-center rounded-2xl bg-white text-lg font-extrabold text-cobalt shadow-glass border border-slate-200/80 hover:scale-105 transition-transform"
      >
        AD<span className="-mt-2 text-xs font-bold text-emerald">+</span>
      </Link>

      <nav className="mt-6 flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/kiosk' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              title={label}
              className={
                active
                  ? 'flex size-12 items-center justify-center rounded-2xl bg-cobalt text-white shadow-cobalt transition'
                  : 'flex size-12 items-center justify-center rounded-2xl bg-white/80 text-slate-500 border border-slate-200/60 backdrop-blur transition hover:text-cobalt hover:shadow-glass hover:bg-white'
              }
            >
              <Icon className="size-5" />
            </Link>
          )
        })}

        <Link
          to="/demo"
          aria-label="All Modules Demo"
          title="Interactive Demo & Testing Suite"
          className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-slate-500 border border-slate-200/60 backdrop-blur transition hover:text-cobalt hover:shadow-glass hover:bg-white"
        >
          <Grid2x2 className="size-5" />
        </Link>
      </nav>

      <button
        onClick={() => navigate('/')}
        aria-label="Exit Kiosk"
        title="Exit to Portal Home"
        className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-slate-400 border border-slate-200/60 backdrop-blur transition hover:text-coral hover:bg-coral-soft cursor-pointer"
      >
        <Power className="size-5" />
      </button>
    </aside>
  )
}

export function BottomNav() {
  const location = useLocation()

  const mobileNavItems = [
    { to: '/kiosk', label: 'Vitals', icon: HeartPulse },
    { to: '/patient/interview', label: 'Intake', icon: MessageSquareText },
    { to: '/patient/documents', label: 'OCR', icon: ScanLine },
    { to: '/patient/document-review', label: 'Timeline', icon: History },
    { to: '/doctor', label: 'Doctor', icon: Stethoscope },
  ]

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile Navigation">
      {mobileNavItems.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to || (to !== '/kiosk' && location.pathname.startsWith(to))
        return (
          <Link
            key={to}
            to={to}
            className={`mobile-bottom-nav-item tap-bounce ${active ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <Icon />
            </div>
            <span>{label}</span>
            {active && (
              <span className="size-1 rounded-full bg-cobalt mt-0.5 animate-pulse" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function TopBar({ track, setTrack, patient, isAuthed, onOpenAuth, onLogout }) {
  const [showEmergency, setShowEmergency] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { lang, setLanguage, languages } = useLanguage()

  return (
    <header className="flex flex-wrap items-center gap-2 sm:gap-3 py-3 sm:py-5 pr-1 border-b border-slate-200/60 mb-4 sm:mb-6">
      {/* Modern vs AYUSH Pill Switcher — compact on mobile */}
      <div className="glass-pill flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-white shadow-xs">
        <button
          onClick={() => setTrack('modern')}
          className={
            track === 'modern'
              ? 'flex items-center gap-1 sm:gap-2 rounded-full bg-cobalt px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold text-white shadow-cobalt transition cursor-pointer'
              : 'flex items-center gap-1 sm:gap-2 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer'
          }
        >
          <Stethoscope className="size-3.5 sm:size-4" />
          <span className="hidden sm:inline">Modern Medicine</span>
          <span className="sm:hidden">Modern</span>
        </button>
        <button
          onClick={() => setTrack('ayush')}
          className={
            track === 'ayush'
              ? 'flex items-center gap-1 sm:gap-2 rounded-full bg-emerald px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-semibold text-white shadow-glass transition cursor-pointer'
              : 'flex items-center gap-1 sm:gap-2 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium text-slate-500 hover:text-emerald-700 transition cursor-pointer'
          }
        >
          <Leaf className="size-3.5 sm:size-4" />
          <span className="hidden sm:inline">AYUSH Intake</span>
          <span className="sm:hidden">AYUSH</span>
        </button>
      </div>

      {/* Clinical Search Bar with live suggestions (matching image 3) */}
      <div className="relative hidden sm:block min-w-[220px] flex-1">
        <label className="glass-pill flex w-full items-center gap-3 px-4 py-2.5 bg-white shadow-xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-slate-400 text-slate-800"
            placeholder="Search symptoms, medications, lab reports..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ×
            </button>
          )}
        </label>

        {/* Live Search Suggestions Dropdown (as in image 3) */}
        {searchQuery.trim().length > 1 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white border border-slate-200/90 shadow-float p-2 text-xs">
            <span className="block px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinical Suggestions for "{searchQuery}"
            </span>
            {[
              { label: 'Fever & Rigors (तेज़ बुखार)', type: 'Symptom', route: '/patient/interview' },
              { label: 'Chest Pressure / Angina (सीने में दर्द)', type: 'Emergency', route: '/patient/interview' },
              { label: 'HbA1c & Fasting Glucose', type: 'Lab Biomarker', route: '/patient/documents' },
              { label: 'Tab Paracetamol 650mg', type: 'Medication', route: '/patient/documents' },
            ]
              .filter(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                searchQuery.toLowerCase().includes('fiv') || 
                searchQuery.toLowerCase().includes('fev')
              )
              .map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSearchQuery(''); navigate(item.route) }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-medium transition cursor-pointer"
                >
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="status-chip bg-cobalt-soft text-cobalt">{item.type}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Language Switcher */}
      <select
        value={lang}
        onChange={(e) => setLanguage(e.target.value)}
        className="glass-pill px-3 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-xs outline-none cursor-pointer"
      >
        {languages.map((l) => (
          <option key={l.id} value={l.id}>
            {l.flag} {l.native}
          </option>
        ))}
      </select>

      {/* Emergency Hotline Button */}
      <button
        onClick={() => setShowEmergency(true)}
        aria-label="Call Assistance"
        title="Immediate Nurse / Clinician Assistance"
        className="hidden sm:flex size-10 sm:size-11 items-center justify-center rounded-full bg-[#0d5c52] text-white shadow-cobalt hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
      >
        <PhoneCall className="size-4" />
      </button>

      {/* Notification Bell with pulse — hidden on mobile */}
      <button
        aria-label="Notifications"
        title="Active Clinical Alerts"
        className="glass-pill relative hidden sm:flex size-10 sm:size-11 items-center justify-center bg-white shadow-xs cursor-pointer shrink-0"
      >
        <Bell className="size-4 text-slate-700" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-coral animate-soft-pulse" />
      </button>

      {/* ABHA Patient Profile Badge or Login Button */}
      {isAuthed ? (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenAuth}
            className="glass-pill flex items-center gap-1.5 sm:gap-2.5 py-1 sm:py-1.5 pl-1 sm:pl-1.5 pr-2 sm:pr-4 bg-white shadow-xs hover:border-cobalt transition cursor-pointer border border-slate-200/80"
            title="Click to Switch Patient or View Details"
          >
            <span className="flex size-7 sm:size-9 items-center justify-center rounded-full bg-emerald-soft text-[10px] sm:text-xs font-bold text-cobalt border border-cobalt/20">
              {patient?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2) || 'AD'}
            </span>
            <span className="leading-tight text-left">
              <span className="block text-[11px] sm:text-sm font-semibold text-slate-900 truncate max-w-[80px] sm:max-w-none">
                {patient?.name || 'Rahul Sharma'}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-mono">
                {patient?.abhaId || 'ABHA-1234-5678'}
              </span>
            </span>
          </button>
          <button
            onClick={onLogout}
            title="Sign Out Patient"
            className="glass-pill p-1.5 sm:p-2 text-slate-400 hover:text-coral transition cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenAuth}
          className="btn-bionic flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-bold shadow-cobalt transition cursor-pointer"
        >
          <LogIn className="size-4" />
          <span>Check In / Register</span>
        </button>
      )}

      {/* Emergency Assistance Modal Banner */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 text-center shadow-float bg-white border border-slate-200/90 rounded-3xl">
            <div className="size-14 rounded-2xl bg-coral-soft text-coral flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="size-7 animate-bounce" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900">
              Emergency Clinical Assistance Triggered
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              The on-duty triage nurse and clinical attendant have been alerted to <strong>Kiosk Terminal #04</strong>.
              Please remain seated. A healthcare provider is arriving within 60 seconds.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
              Hotline: +91 1800-425-9999 • Kiosk Token: AD-EMG-STAT
            </div>
            <button
              onClick={() => setShowEmergency(false)}
              className="mt-5 w-full rounded-full bg-slate-950 py-3 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Acknowledge & Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export function BionicKioskShell({ children, activeTrack, onTrackChange }) {
  const [track, setTrack] = useState(() => {
    return activeTrack || localStorage.getItem('arogya_track') || 'modern'
  })

  const [patient, setPatient] = useState(() => getActivePatient())
  const [isAuthed, setIsAuthed] = useState(() => isAuthenticated())
  const [showAuthModal, setShowAuthModal] = useState(false)

  const refreshPatientState = () => {
    setPatient(getActivePatient())
    setIsAuthed(isAuthenticated())
  }

  useEffect(() => {
    refreshPatientState()
  }, [])

  const handleTrackChange = (newTrack) => {
    setTrack(newTrack)
    localStorage.setItem('arogya_track', newTrack)
    if (onTrackChange) onTrackChange(newTrack)
  }

  const handleLogout = () => {
    logoutPatient()
    refreshPatientState()
  }

  const handleAuthSuccess = (loggedPatient) => {
    setPatient(loggedPatient)
    setIsAuthed(true)
  }

  return (
    <TrackContext.Provider value={{ track, setTrack: handleTrackChange }}>
      <div className="kiosk-canvas min-h-screen p-1 sm:p-5 pb-28 md:pb-6 overflow-y-auto">
        <div className="mx-auto flex max-w-[1540px] gap-0 md:gap-4 rounded-2xl md:rounded-[2.25rem] border border-slate-200/80 bg-white/95 px-2 sm:px-6 shadow-glass backdrop-blur-md min-h-[92vh]">
          <NavRail />
          <div className="min-w-0 flex-1 pb-4 sm:pb-8 flex flex-col">
            <TopBar
              track={track}
              setTrack={handleTrackChange}
              patient={patient}
              isAuthed={isAuthed}
              onOpenAuth={() => setShowAuthModal(true)}
              onLogout={handleLogout}
            />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>

      <BottomNav />

      <BionicAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </TrackContext.Provider>
  )
}

export default BionicKioskShell
