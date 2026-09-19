import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Leaf, Stethoscope } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { getActivePatient } from '../../services/sessionStore'

const TrackContext = createContext({ track: 'modern', setTrack: () => {} })
export const useTrack = () => useContext(TrackContext)

export function BottomNav() {
  return null
}

export function BionicKioskShell({ children, activeTrack, onTrackChange }) {
  const navigate = useNavigate()
  const { t, lang, setLanguage, languages } = useLanguage()
  const [patient] = useState(() => getActivePatient())
  const [track, setTrack] = useState(() => activeTrack || localStorage.getItem('arogya_track') || 'modern')

  useEffect(() => {
    if (activeTrack && activeTrack !== track) setTrack(activeTrack)
  }, [activeTrack, track])

  const changeTrack = (nextTrack) => {
    setTrack(nextTrack)
    localStorage.setItem('arogya_track', nextTrack)
    onTrackChange?.(nextTrack)
  }

  return (
    <TrackContext.Provider value={{ track, setTrack: changeTrack }}>
      <div className="min-h-screen bg-[#f7f8fa] text-slate-950">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white pt-safe">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/patient')}
              className="flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label={t('back', 'Back')}
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-[#123b79]">
                {t('appName', 'ArogyaDarpan')}
              </p>
              <p className="truncate text-xs text-slate-500">
                {patient?.name || t('clinicalIntake', 'Clinical Intake')}
              </p>
            </div>
            <select
              value={lang}
              onChange={(event) => setLanguage(event.target.value)}
              className="max-w-36 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#174ea6] cursor-pointer"
              aria-label={t('switchLanguage', 'Language')}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.native}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <div className="inline-flex rounded-full border border-slate-300 bg-white p-1">
            <button
              type="button"
              onClick={() => changeTrack('modern')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition ${
                track === 'modern' ? 'bg-[#174ea6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="size-4" /> {t('modernMedicine', 'General Medicine')}
            </button>
            <button
              type="button"
              onClick={() => changeTrack('ayush')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition ${
                track === 'ayush' ? 'bg-[#174ea6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="size-4" /> {t('ayush', 'AYUSH')}
            </button>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6">{children}</main>
      </div>
    </TrackContext.Provider>
  )
}

export default BionicKioskShell
