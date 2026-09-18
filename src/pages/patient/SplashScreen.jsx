import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoEmblem from '../../assets/arogyadarpan_logo_emblem.png'

export default function SplashScreen({ onComplete }) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(68)
  const [statusText, setStatusText] = useState('Securing clinical workspace...')
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const stages = [
    { p: 76, label: 'Calibrating diagnostic matrix...' },
    { p: 89, label: 'Establishing ABDM gateway...' },
    { p: 97, label: 'Verifying cryptographic vault...' },
    { p: 100, label: 'Workspace initialized' }
  ]

  useEffect(() => {
    let stageIdx = 0
    const interval = setInterval(() => {
      if (stageIdx < stages.length) {
        setProgress(stages[stageIdx].p)
        setStatusText(stages[stageIdx].label)
        stageIdx++
      } else {
        clearInterval(interval)
        setIsReady(true)
      }
    }, 900)

    return () => clearInterval(interval)
  }, [])

  const handleProceed = () => {
    if (onComplete) {
      onComplete()
    } else {
      navigate('/patient/language')
    }
  }

  const handleTouchEmblem = () => {
    setRotationAngle(prev => prev + 90)
  }

  return (
    <main className="flex flex-col relative w-full bg-[#f7f9fb] min-h-screen pt-safe pb-safe select-none overflow-hidden">
      {/* Background Ambient Glow & Concentric Rings Layer */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-teal-500/20 blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute w-[440px] h-[440px] rounded-full bg-cyan-400/15 blur-2xl opacity-40" />
        <div className="absolute w-[320px] h-[320px] rounded-full bg-emerald-400/10 animate-ping" style={{ animationDuration: '6s', animationIterationCount: 'infinite' }} />
        <div className="absolute w-[260px] h-[260px] rounded-full bg-white/40 shadow-xs backdrop-blur-xs" />
      </div>

      <div className="flex flex-col w-full relative z-10 items-center justify-between min-h-[92vh] px-5 py-4 max-w-md mx-auto">
        {/* Top Status Bar & Quick Evaluator Switcher */}
        <div className="w-full flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md border border-slate-200/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Clinical Mirror Engine • v3.4
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('/doctor')}
              className="px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[10px] font-mono font-bold text-teal-800 border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
              title="Doctor Console Access"
            >
              Doctor
            </button>
            <button
              onClick={() => navigate('/kiosk')}
              className="px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[10px] font-mono font-bold text-slate-700 border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
              title="PHC Kiosk Terminal"
            >
              Kiosk
            </button>
          </div>
        </div>

        {/* Central Visual Section: Mirror Emblem & Identity */}
        <div className="flex flex-col items-center justify-center text-center my-auto w-full">
          {/* Emblem Container with Glass Aura */}
          <div
            className="relative flex items-center justify-center mb-7 group cursor-pointer"
            id="brand-touch-zone"
            onClick={handleTouchEmblem}
          >
            {/* Glow Aura Behind Logo */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-cyan-300 via-teal-300 to-teal-600 opacity-30 blur-xl group-hover:opacity-45 transition-opacity duration-700" />

            {/* Frosted Mirror Disc Housing Image */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full p-2.5 bg-white/90 shadow-xl flex items-center justify-center backdrop-blur-xl border border-white/80">
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-50 shadow-inner">
                <img
                  alt="ArogyaDarpan Emblem"
                  src={logoEmblem}
                  className="w-full h-full object-contain p-3 transform transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>

              {/* Concentric Circular Accent Orbit Rings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90" viewBox="0 0 200 200">
                <circle
                  className="text-teal-600/15"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="95"
                  stroke="currentColor"
                  strokeDasharray="6 8"
                  strokeWidth="2"
                />
                <circle
                  className="text-teal-600 transition-transform duration-700 ease-out"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="95"
                  stroke="currentColor"
                  strokeDasharray="24 160"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  style={{
                    transformOrigin: '100px 100px',
                    transform: `rotate(${rotationAngle}deg)`,
                  }}
                />
              </svg>
            </div>

            {/* Floating Clinical Rhythm Indicator */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 shadow-md px-3.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md border border-slate-100 whitespace-nowrap">
              <span className="material-symbols-outlined text-teal-600 text-[16px] animate-pulse">
                ecg_heart
              </span>
              <span className="font-mono text-[11px] text-teal-800 tracking-tight font-semibold">
                98.4 BPM SYNCHRONIZED
              </span>
            </div>
          </div>

          {/* Title & Bilingual Typography */}
          <div className="space-y-1 flex flex-col items-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              ArogyaDarpan
            </h1>
            <p className="font-heading text-lg sm:text-xl text-slate-600 font-semibold tracking-normal">
              आरोग्यदर्पण
            </p>
          </div>

          {/* Proposition Pill Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-teal-900 shadow-xs border border-emerald-500/20">
            <span className="material-symbols-outlined text-[16px] text-emerald-700" style={{ fontVariationSettings: "'FILL' 1" }}>
              neurology
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-tight text-teal-900">
              AI prepares. <span className="font-bold text-emerald-800">Doctor decides.</span>
            </span>
          </div>
        </div>

        {/* Bottom Interactive Shimmer & Verification Credentials */}
        <div className="w-full flex flex-col items-center space-y-3 pt-2">
          {/* Telemetry Diagnostic Loading Bar */}
          <div className="w-full flex flex-col items-center space-y-1.5">
            <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="w-full flex justify-between items-center px-1">
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wide">
                {statusText}
              </span>
              <span className="font-mono text-[11px] font-bold text-teal-700">
                {progress}%
              </span>
            </div>
          </div>

          {/* Regulatory Compliance & Security Trust Card */}
          <div className="w-full bg-white/85 rounded-xl px-3.5 py-2.5 shadow-xs backdrop-blur-md border border-slate-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-700">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                ABDM Integrated • Ayushman Bharat
              </p>
              <p className="text-[11px] text-slate-500 leading-normal flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[13px] text-teal-600">lock</span>
                256-Bit Hardware Encrypted Enclave
              </p>
            </div>
          </div>

          {/* Ambient Touch Prompt Button */}
          <button
            onClick={handleProceed}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-heading text-sm font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isReady
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-500/30'
                : 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/30'
            }`}
            type="button"
          >
            <span>{isReady ? 'Diagnostic Vault Ready' : 'Entering Secure Mirror'}</span>
            <span className="material-symbols-outlined text-[18px]">
              {isReady ? 'check_circle' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </div>
    </main>
  )
}
