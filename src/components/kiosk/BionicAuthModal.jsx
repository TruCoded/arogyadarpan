import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, CreditCard, ShieldCheck, CheckCircle2,
  X, ArrowRight, Sparkles, UserCheck, Calendar, Heart,
  Droplet, AlertCircle, RefreshCw, KeyRound
} from 'lucide-react'
import {
  findPatientByIdentifier,
  getRegisteredPatients,
  loginPatient,
  saveRegisteredPatient,
  generatePatientId
} from '../../services/sessionStore'

export default function BionicAuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialMode) // 'login' | 'register' | 'demo'
  
  // Login Form
  const [identifier, setIdentifier] = useState('')
  const [otpCode, setOtpCode] = useState(['', '', '', ''])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [matchedPatient, setMatchedPatient] = useState(null)

  // Registration Form
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '',
    abhaId: '',
  })
  const [regError, setRegError] = useState('')

  const demoPatients = getRegisteredPatients()

  if (!isOpen) return null

  // Handle Returning Patient Search / OTP request
  const handleRequestOtp = (e) => {
    e?.preventDefault()
    setLoginError('')
    if (!identifier.trim()) {
      setLoginError('Please enter your Mobile Number or ABHA ID')
      return
    }

    const patient = findPatientByIdentifier(identifier.trim())
    if (patient) {
      setMatchedPatient(patient)
      setIsOtpSent(true)
      setOtpCode(['1', '2', '3', '4']) // Pre-populate simulated OTP for seamless testing
    } else {
      setLoginError('No existing patient record found with this Mobile/ABHA. Please register or select a demo profile.')
    }
  }

  // Confirm Login
  const handleVerifyOtp = () => {
    if (matchedPatient) {
      const logged = loginPatient(matchedPatient)
      onSuccess?.(logged)
      onClose?.()
    }
  }

  // Instant 1-Click Profile Selection
  const handleSelectDemo = (patient) => {
    const logged = loginPatient(patient)
    onSuccess?.(logged)
    onClose?.()
  }

  // Handle New Patient Registration
  const handleRegister = (e) => {
    e?.preventDefault()
    setRegError('')

    if (!regForm.name.trim() || !regForm.phone.trim() || !regForm.age) {
      setRegError('Please complete all required fields (*)')
      return
    }

    if (regForm.phone.replace(/\D/g, '').length < 10) {
      setRegError('Please enter a valid 10-digit mobile number')
      return
    }

    const generatedAbha = regForm.abhaId || `ABHA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    const newPatient = {
      patientId: generatePatientId(),
      name: regForm.name.trim(),
      phone: regForm.phone.trim(),
      age: String(regForm.age),
      gender: regForm.gender,
      bloodGroup: regForm.bloodGroup,
      emergencyContact: regForm.emergencyContact || 'Family Member',
      abhaId: generatedAbha,
      registeredAt: new Date().toISOString(),
    }

    saveRegisteredPatient(newPatient)
    const logged = loginPatient(newPatient)
    onSuccess?.(logged)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-xl bg-white border border-slate-200/90 shadow-float rounded-2xl sm:rounded-3xl overflow-hidden relative max-h-[90dvh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="size-8 sm:size-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cobalt to-cobalt-deep text-white flex items-center justify-center shadow-cobalt">
              <UserCheck className="size-4 sm:size-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-lg text-slate-900">
                Patient Check-In
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                ABDM Digital Health Linked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4">
          <div className="flex p-0.5 sm:p-1 bg-slate-100 rounded-xl sm:rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setIsOtpSent(false); setLoginError('') }}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Phone className="size-3 sm:size-3.5 text-cobalt" />
              <span className="hidden sm:inline">Mobile / ABHA</span>
              <span className="sm:hidden">Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setRegError('') }}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="size-3 sm:size-3.5 text-emerald" />
              <span className="hidden sm:inline">New Patient</span>
              <span className="sm:hidden">Register</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="size-3 sm:size-3.5 text-amber-500" />
              <span className="hidden sm:inline">1-Click Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Returning Patient Login */}
        {activeTab === 'login' && (
          <div className="p-4 sm:p-6 space-y-4">
            {!isOtpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Mobile Number or ABHA ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or ABHA-1234-5678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Try entering test mobile: <strong className="text-slate-700 cursor-pointer" onClick={() => setIdentifier('9876543210')}>9876543210</strong> (Rahul Sharma)
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-coral-soft/50 border border-coral/30 text-xs text-coral font-bold flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-bionic w-full py-3.5 rounded-full text-white font-bold text-xs shadow-cobalt hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Send OTP / Verify Patient Record</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-soft/50 border border-emerald/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald uppercase tracking-wider">Patient Identified</span>
                    <h4 className="font-heading font-black text-slate-900 text-sm">{matchedPatient.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{matchedPatient.phone} • {matchedPatient.abhaId}</p>
                  </div>
                  <span className="status-chip bg-emerald-soft text-emerald font-bold">Verified</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Enter 4-Digit Security OTP (Simulated: 1 2 3 4)
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value
                          setOtpCode(prev => {
                            const copy = [...prev]
                            copy[idx] = val
                            return copy
                          })
                        }}
                        className="size-12 rounded-xl text-center font-bold text-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cobalt focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="glass-pill px-4 py-3 text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="btn-bionic flex-1 py-3.5 rounded-full text-white font-bold text-xs shadow-cobalt hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Confirm & Launch MediKiosk</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: New Patient Registration */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-4 sm:p-6 space-y-3.5 max-h-[50dvh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                placeholder="e.g. Vikramaditya Sen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="10-digit phone"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={regForm.age}
                  onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                  placeholder="e.g. 42"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={regForm.gender}
                  onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt focus:outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={regForm.bloodGroup}
                  onChange={(e) => setRegForm({ ...regForm, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-cobalt/40 focus:border-cobalt focus:outline-none cursor-pointer"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cobalt-soft/40 border border-cobalt/20 text-xs text-cobalt flex items-center justify-between">
              <span className="font-semibold">Auto-generate ABHA ID on submit:</span>
              <span className="status-chip bg-white text-cobalt border border-cobalt/20 font-mono">
                ABHA-AUTO-PROVISION
              </span>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-coral-soft/50 border border-coral/30 text-xs text-coral font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-bionic w-full py-3.5 rounded-full text-white font-bold text-xs shadow-cobalt hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="size-4" />
              <span>Register & Check Into MediKiosk</span>
            </button>
          </form>
        )}

        {/* Tab 3: 1-Click Demo Profiles */}
        {activeTab === 'demo' && (
          <div className="p-6 space-y-3">
            <p className="text-xs text-slate-500 font-medium mb-1">
              Select an existing clinical scenario for immediate live testing:
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {demoPatients.slice(0, 4).map((p) => (
                <div
                  key={p.patientId}
                  onClick={() => handleSelectDemo(p)}
                  className="glass-card tile-lift p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-cobalt cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-cobalt-soft text-cobalt font-bold text-xs flex items-center justify-center shrink-0 font-heading">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-sm flex items-center gap-1.5">
                        {p.name}
                        <span className="text-[10px] font-bold text-slate-400">({p.age}y / {p.gender[0]})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {p.phone} • {p.abhaId}
                      </p>
                    </div>
                  </div>

                  <span className="status-chip bg-cobalt-soft text-cobalt font-bold flex items-center gap-1">
                    <span>Select</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              Selecting a profile immediately personalizes telemetry, medical records, and intake.
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
