import { useNavigate } from 'react-router-dom'
import { CheckCircle2, FileCheck2, HeartPulse, ShieldCheck, UserRound } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { getActivePatient } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function ConfirmationScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()
  let responses = [], documents = []
  try { responses = JSON.parse(localStorage.getItem('arogya_responses') || '[]') } catch { responses = [] }
  try { documents = JSON.parse(localStorage.getItem('arogya_documents') || '[]') } catch { documents = [] }
  const rows = [
    { icon: UserRound, label: t('patientInformation'), value: patient.name || t('patientDetails') },
    { icon: HeartPulse, label: t('clinicalAnswers'), value: `${responses.length} ${t('questionsAnswered')}` },
    { icon: FileCheck2, label: t('documents'), value: String(documents.length) },
    { icon: ShieldCheck, label: t('consentGiven'), value: t('confirmed') },
  ]
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('finalConfirmation')} showBack onBack={() => navigate('/patient/document-review')} />
      <main className="mx-auto max-w-xl px-4 py-7 pb-28">
        <h1 className="text-3xl font-extrabold">{t('finalConfirmation')}</h1>
        <p className="mt-2 leading-7 text-slate-600">{t('reviewBeforeSend')}</p>
        <div className="mt-7 space-y-3">
          {rows.map(({ icon: Icon, label, value }) => <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-[#174ea6]"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm text-slate-500">{label}</p><p className="truncate font-bold">{value}</p></div><CheckCircle2 className="size-5 text-green-600" /></article>)}
        </div>
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-[#123b79]">{t('doctorWillVerify')}</div>
      </main>
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-4 pb-safe"><button type="button" onClick={() => navigate('/patient/complete')} className="mx-auto block w-full max-w-xl rounded-full bg-[#174ea6] px-5 py-3.5 font-bold text-white">{t('sendDoctor')}</button></div>
    </div>
  )
}
