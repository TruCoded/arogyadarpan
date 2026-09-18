import { useState } from 'react'

export default function ArogyaDarpanLogo({ size = 'md', className = '', showSubtitle = false }) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-36 h-36 sm:w-44 sm:h-44'
  }[size] || 'w-12 h-12'

  const STITCH_LOGO_URL =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD3eHJKlVlUerGVveGjWkAx0cFSCFro69yrIgqK3eka9ng6vqBFVGwgS2A1JBO0Lkr1B0YbrOAAqvpUol5ZixVmusIi8jYTSaQiV7PMb6CxrfSD-IXp-euifp5q0XRj-wTGxgLPdrcblNl08nnijat-BbHaH3XgsPx0yCKVhGM61cCDKXumY2fD-oQOhvcj5VgkwBSyiovAsy0-8W-nsfxyd2QqLNcETBIQ-JauQLnM_nekVmrRDp-J'

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Glow Aura */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-500 opacity-25 blur-xl pointer-events-none" />

      {/* Frosted Mirror Disc */}
      <div className={`relative ${sizeClasses} rounded-full p-1 bg-white/90 shadow-xl flex items-center justify-center backdrop-blur-xl border border-white/80`}>
        {!imgError ? (
          <img
            src={STITCH_LOGO_URL}
            alt="ArogyaDarpan Emblem"
            className="w-full h-full object-contain p-1 rounded-full transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-Fidelity SVG Fallback */
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-inner text-white">
            <svg viewBox="0 0 48 48" className="w-3/5 h-3/5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 24h6l4-10 6 20 6-14 4 6h10" />
              <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeDasharray="4 4" />
            </svg>
          </div>
        )}

        {/* Orbit Ring */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90" viewBox="0 0 200 200">
          <circle className="text-teal-500/20" cx="100" cy="100" fill="none" r="95" stroke="currentColor" strokeDasharray="6 8" strokeWidth="2" />
          <circle className="text-teal-600" cx="100" cy="100" fill="none" r="95" stroke="currentColor" strokeDasharray="24 160" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      </div>

      {showSubtitle && (
        <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold tracking-wider font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ABDM CERTIFIED • v3.4
        </div>
      )}
    </div>
  )
}
