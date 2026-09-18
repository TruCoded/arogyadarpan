import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, Hash, Info } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { clearPatientSession, getActivePatient } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function CompletionScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()
  const startNew = () => { clearPatientSession(); navigate('/patient/language') }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('complete')} />
      <main className="mx-auto max-w-xl px-4 py-8">
        <div className="text-center"><CheckCircle2 className="mx-auto size-16 text-green-600" /><h1 className="mt-4 text-3xl font-extrabold">{t('visitReadyName')}{patient.name ? `, ${patient.name}` : ''}!</h1><p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">{t('visitReady')}</p></div>
        <section className="mt-8 rounded-3xl bg-[#174ea6] p-6 text-white">
          <div className="flex items-center justify-between"><div><p className="text-sm text-blue-100">{t('queueToken')}</p><p className="mt-1 text-5xl font-black">A-14</p></div><Hash className="size-10 text-blue-200" /></div>
          <div className="mt-6 flex items-center gap-3 border-t border-white/20 pt-4"><Clock3 className="size-5" /><span>{t('estimatedWaitShort')}: 8–12 {t('minutes')}</span></div>
        </section>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold">{t('nextSteps')}</h2><div className="mt-4 space-y-3 text-slate-700"><p className="flex gap-3"><Info className="mt-0.5 size-5 shrink-0 text-[#174ea6]" />{t('waitArea')}</p><p className="flex gap-3"><Info className="mt-0.5 size-5 shrink-0 text-[#174ea6]" />{t('keepToken')}</p></div></section>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => navigate('/patient/dashboard')} className="rounded-full border border-[#174ea6] px-5 py-3.5 font-bold text-[#174ea6]">{t('viewDashboard')}</button><button type="button" onClick={startNew} className="rounded-full bg-[#174ea6] px-5 py-3.5 font-bold text-white">{t('startNewPatient')}</button></div>
      </main>
    </div>
  )
}
