import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StitchAppHeader from '../../components/StitchAppHeader'

export default function ConsentScreen() {
  const navigate = useNavigate()
  const { t, speechLocale } = useLanguage()
  const [agreed, setAgreed] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [options, setOptions] = useState({ historyCollection: true, documentOCR: true, abdmSync: false })

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const speech = new SpeechSynthesisUtterance(`${t('consentText')} ${t('consentDetail')}`)
    speech.lang = speechLocale
    speech.rate = 0.88
    speech.onend = () => setSpeaking(false)
    speech.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(speech)
  }

  const toggleOption = (key) => setOptions((current) => ({ ...current, [key]: !current[key] }))

  const continueJourney = () => {
    if (!agreed) return
    localStorage.setItem('arogya_consent', JSON.stringify({ grantedAt: new Date().toISOString(), options }))
    navigate('/patient')
  }

  const permissionRows = [
    ['historyCollection', t('consent1', 'Collect my symptoms and clinical history')],
    ['documentOCR', t('consent2', 'Read the medical documents I choose to upload')],
    ['abdmSync', t('consent3', 'Link this visit with my ABHA record (optional)')],
  ]

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <StitchAppHeader title={t('beforeWeBegin', 'Before we begin')} showBack onBack={() => navigate('/patient/language')} />

      <main className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:px-8">
        <p className="mb-2 text-sm font-semibold text-[#174ea6]">2 / 4</p>
        <div className="flex items-start gap-4">
          <div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#174ea6]">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('consentTitle', 'Consent and privacy')}</h1>
            <p className="mt-2 text-base leading-7 text-slate-600">{t('consentText')}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSpeech}
          className="mt-6 flex items-center gap-2 rounded-full border border-[#174ea6] px-4 py-2.5 text-sm font-bold text-[#174ea6] transition hover:bg-blue-50"
        >
          {speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {speaking ? t('stopAudio', 'Stop audio') : t('readAloud', 'Read aloud')}
        </button>

        <section className="mt-8">
          <h2 className="text-lg font-bold">{t('consentSubtitle', 'Choose what you want to share')}</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
            {permissionRows.map(([key, label], index) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleOption(key)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left ${index ? 'border-t border-slate-200' : ''}`}
              >
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md border ${options[key] ? 'border-[#174ea6] bg-[#174ea6] text-white' : 'border-slate-300 bg-white'}`}>
                  {options[key] && <Check className="size-4" />}
                </span>
                <span className="flex-1 text-sm font-semibold leading-6 text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {t('consentDetail')}
        </div>

        <button
          type="button"
          onClick={() => setAgreed((value) => !value)}
          className={`mt-6 flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${agreed ? 'border-[#174ea6] bg-blue-50' : 'border-slate-300 bg-white'}`}
        >
          <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border ${agreed ? 'border-[#174ea6] bg-[#174ea6] text-white' : 'border-slate-300'}`}>
            {agreed && <Check className="size-4" />}
          </span>
          <span className="text-sm font-bold leading-6 text-slate-900">{t('consentAgree', 'I understand and agree to continue')}</span>
        </button>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <button
          type="button"
          onClick={continueJourney}
          disabled={!agreed}
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition enabled:hover:bg-[#123b79] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {t('continue', 'Continue')}
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
