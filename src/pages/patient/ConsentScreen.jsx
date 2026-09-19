import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck, Volume2, VolumeX, Lock, FileCheck2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StitchAppHeader from '../../components/StitchAppHeader'
import { playLanguageAudio, stopLanguageAudio } from '../../services/audioTtsService'

export default function ConsentScreen() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const [agreed, setAgreed] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [options, setOptions] = useState({ historyCollection: true, documentOCR: true, abdmSync: false })

  useEffect(() => () => stopLanguageAudio(), [])

  const toggleSpeech = () => {
    if (speaking) {
      stopLanguageAudio()
      setSpeaking(false)
      return
    }
    const textToSpeak = (t('consentAudioNarrative') || `${t('consentText', '')} ${t('consentSubtitle', '')}`).trim()
    setSpeaking(true)
    playLanguageAudio(
      textToSpeak,
      lang,
      () => setSpeaking(false),
      () => setSpeaking(false)
    )
  }

  const toggleOption = (key) => setOptions((current) => ({ ...current, [key]: !current[key] }))

  const continueJourney = () => {
    stopLanguageAudio()
    if (!agreed) return
    localStorage.setItem(
      'arogya_consent',
      JSON.stringify({
        grantedAt: new Date().toISOString(),
        options,
        framework: 'DPDP_ACT_2023_AND_ABDM_M1_M2_M3',
      })
    )
    navigate('/patient')
  }

  const permissionRows = [
    ['historyCollection', t('consent1', 'Collect my symptoms and clinical history (SOCRATES Framework)')],
    ['documentOCR', t('consent2', 'Read and extract entities from uploaded prescriptions & lab reports')],
    ['abdmSync', t('consent3', 'Link this pre-consultation record to my ABHA Health ID (optional)')],
  ]

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <StitchAppHeader title={t('beforeWeBegin', 'Before we begin')} showBack onBack={() => navigate('/patient/language')} />

      <main className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:px-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#174ea6]">2 / 4</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
            <Lock className="size-3 text-emerald-600" />
            <span>{t('dpdpCompliantBadge', 'DPDP Act 2023 & ABDM Compliant')}</span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#174ea6] border border-blue-200">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('consentTitle', 'Consent & Privacy Framework')}
            </h1>
            <p className="mt-2 text-base leading-7 text-slate-600">{t('consentText')}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSpeech}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#174ea6] px-4 py-2.5 text-sm font-bold text-[#174ea6] transition hover:bg-blue-50 active:scale-98 cursor-pointer"
        >
          {speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {speaking ? t('stopAudio', 'Stop audio') : t('readAloud', 'Read aloud')}
        </button>

        {/* DPDP Act 2023 Specification Card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-4 border border-blue-200/80 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#174ea6]">
            <FileCheck2 className="size-4" />
            <span>{t('dpdpNoticeTitle', 'Digital Personal Data Protection (DPDP) Act 2023 Notice')}</span>
          </div>
          <p className="leading-relaxed">
            • <strong>{t('dpdpPurposeTitle', 'Purpose Limitation:')}</strong> {t('dpdpPurpose', "Data is collected solely for your attending physician's clinical review.")}
          </p>
          <p className="leading-relaxed">
            • <strong>{t('dpdpRightsTitle', 'Data Principal Rights:')}</strong> {t('dpdpRights', 'You have the right to view, correct, export, or withdraw consent at any time.')}
          </p>
          <p className="leading-relaxed">
            • <strong>{t('dpdpSecurityTitle', 'Security:')}</strong> {t('dpdpSecurity', 'All clinical data is encrypted in transit and stored locally during the triage session.')}
          </p>
        </div>

        <section className="mt-7">
          <h2 className="text-lg font-bold">{t('consentSubtitle', 'Choose what you want to share')}</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 shadow-xs bg-white">
            {permissionRows.map(([key, label], index) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleOption(key)}
                className={`flex w-full items-center gap-3.5 px-4 py-4 text-left transition hover:bg-slate-50 cursor-pointer ${
                  index ? 'border-t border-slate-200' : ''
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition ${
                    options[key] ? 'border-[#174ea6] bg-[#174ea6] text-white shadow-xs' : 'border-slate-300 bg-white'
                  }`}
                >
                  {options[key] && <Check className="size-4" />}
                </span>
                <span className="flex-1 text-sm font-semibold leading-6 text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs sm:text-sm leading-6 text-slate-600 border border-slate-200/60">
          {t('consentDetail')}
        </div>

        <button
          type="button"
          onClick={() => setAgreed((value) => !value)}
          className={`mt-6 flex w-full items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition cursor-pointer shadow-xs ${
            agreed ? 'border-[#174ea6] bg-blue-50/80' : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          <span
            className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition ${
              agreed ? 'border-[#174ea6] bg-[#174ea6] text-white shadow-xs' : 'border-slate-300'
            }`}
          >
            {agreed && <Check className="size-4" />}
          </span>
          <span className="text-sm font-bold leading-6 text-slate-900">
            {t('consentAgree', 'I understand and agree to continue')}
          </span>
        </button>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur shadow-lg">
        <button
          type="button"
          onClick={continueJourney}
          disabled={!agreed}
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full bg-[#174ea6] px-6 py-3.5 text-base font-bold text-white transition enabled:hover:bg-[#123b79] enabled:hover:shadow-lg active:scale-99 disabled:cursor-not-allowed disabled:bg-slate-300 cursor-pointer shadow-md"
        >
          <span>{t('continue', 'Continue')}</span>
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
