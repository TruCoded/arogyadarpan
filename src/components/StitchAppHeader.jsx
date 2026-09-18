import { useNavigate } from 'react-router-dom'
import ArogyaDarpanLogo from './ArogyaDarpanLogo'
import LanguageSelector from './LanguageSelector'
import { getActivePatient } from '../services/sessionStore'

const STITCH_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDUwTVsok33NhN3uyVg_5gp51TupZxxTlKRj9Y84DbEVCaaZnURSBEjAYKp-kKzg6gYf31I_qP6meiSs0gi7CR3L9Wck8VisP_GhGxCpHwkNq8VUUp_aubu7-SeWCSFGWVD0Q2vHtDSqfIjtq0nSU5k4U6LDxR937bK2XNe6w43A_gd9gAyiIxT7WN_AGaEQnqMWtHxKdj4n54_2uuyxAmyrX7A2-ljU1b6A5KWEjPtV1CGf-BifjE2'

export default function StitchAppHeader({ title = 'Clinical Intake', subtitle = '', showBack = false, onBack }) {
  const navigate = useNavigate()
  const patient = getActivePatient()

  return (
    <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] select-none pt-safe">
      <div className="max-w-2xl mx-auto h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left branding & title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <button
              onClick={onBack || (() => navigate(-1))}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <ArogyaDarpanLogo size="sm" className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')} />
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-heading text-xs sm:text-sm font-bold text-teal-800 tracking-tight">ArogyaDarpan</span>
              <span className="text-[11px] text-slate-500 font-medium hidden xs:inline">आरोग्यदर्पण</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-900 truncate" title={title}>
                {title}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 text-[9px] font-mono font-bold flex-shrink-0">
                ABDM
              </span>
            </div>
          </div>
        </div>

        {/* Right language switcher & avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <LanguageSelector variant="compact" />
          <div
            onClick={() => navigate('/patient/dashboard')}
            className="cursor-pointer group relative flex-shrink-0"
            title={patient?.name || 'Rahul Sharma'}
          >
            <img
              src={STITCH_AVATAR_URL}
              alt="Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/30 shadow-2xs group-hover:ring-teal-500 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
