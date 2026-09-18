import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoEmblem from '../../assets/arogyadarpan_logo_emblem.png'
import { useLanguage } from '../../context/LanguageContext'

export default function SplashScreen({ onComplete }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const proceed = () => {
    if (onComplete) onComplete()
    else navigate('/patient/language')
  }

  useEffect(() => {
    const timer = window.setTimeout(proceed, 1400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main
      className="flex min-h-screen w-full cursor-pointer flex-col items-center justify-between bg-[#0954b8] px-6 pb-safe pt-safe text-white"
      onClick={proceed}
      aria-label={t('continue')}
    >
      <div />

      <div className="flex flex-col items-center text-center">
        <div className="flex size-32 items-center justify-center rounded-full bg-white p-3 shadow-md sm:size-36">
          <img src={logoEmblem} alt="ArogyaDarpan" className="size-full object-contain" />
        </div>
        <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl">ArogyaDarpan</h1>
        <p className="mt-2 text-xl font-semibold text-blue-100">{t('appName')}</p>
        <p className="mt-4 text-base text-blue-100">{t('tagline')}</p>
      </div>

      <div className="pb-10 text-center">
        <p className="text-sm font-semibold">SIH 2026</p>
        <p className="mt-1 text-xs text-blue-200">{t('continue')}</p>
      </div>
    </main>
  )
}
