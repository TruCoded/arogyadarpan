import { useNavigate } from 'react-router-dom'
import { FileText, HeartPulse, Phone, UserRound } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { getActivePatient } from '../../services/sessionStore'
import { useLanguage } from '../../context/LanguageContext'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const patient = getActivePatient()
  let responses = [], documents = []
  try { responses = JSON.parse(localStorage.getItem('arogya_responses') || '[]') } catch { responses = [] }
  try { documents = JSON.parse(localStorage.getItem('arogya_documents') || '[]') } catch { documents = [] }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('patientDetails')} showBack onBack={() => navigate('/patient/complete')} />
      <main className="mx-auto max-w-xl px-4 py-7">
        <section className="rounded-3xl bg-[#174ea6] p-6 text-white"><div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-full bg-white/15"><UserRound className="size-7" /></div><div><h1 className="text-2xl font-extrabold">{patient.name || t('patientDetails')}</h1><p className="mt-1 text-blue-100">{patient.patientId || patient.abhaId || '—'}</p></div></div></section>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-extrabold">{t('patientInformation')}</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">{t('age')}</dt><dd className="font-bold">{patient.age || '—'}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">{t('gender')}</dt><dd className="font-bold">{patient.gender ? t(patient.gender.toLowerCase(), patient.gender) : '—'}</dd></div><div className="flex justify-between gap-4"><dt className="flex items-center gap-1 text-slate-500"><Phone className="size-4" />{t('phone')}</dt><dd className="font-bold">{patient.phone || '—'}</dd></div></dl></section>
        <div className="mt-5 grid grid-cols-2 gap-3"><article className="rounded-2xl border border-slate-200 bg-white p-5"><HeartPulse className="size-6 text-[#174ea6]" /><p className="mt-3 text-3xl font-black">{responses.length}</p><p className="mt-1 text-sm text-slate-500">{t('clinicalAnswers')}</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><FileText className="size-6 text-[#174ea6]" /><p className="mt-3 text-3xl font-black">{documents.length}</p><p className="mt-1 text-sm text-slate-500">{t('documents')}</p></article></div>
        <p className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-[#123b79]">{t('completeMessage')}</p>
      </main>
    </div>
  )
}
