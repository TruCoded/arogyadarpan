import { useNavigate } from 'react-router-dom'
import { CheckCircle2, FileText, FlaskConical, Pill } from 'lucide-react'
import StitchAppHeader from '../../components/StitchAppHeader'
import { useLanguage } from '../../context/LanguageContext'

export default function DocumentReview() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  let documents = []
  try { documents = JSON.parse(localStorage.getItem('arogya_documents') || '[]') } catch { documents = [] }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <StitchAppHeader title={t('reviewDocuments')} showBack onBack={() => navigate('/patient/documents')} />
      <main className="mx-auto max-w-xl px-4 py-7 pb-28">
        <h1 className="text-3xl font-extrabold">{t('extractedInfo')}</h1><p className="mt-2 text-slate-600">{t('reviewInfo')}</p>
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><FileText className="size-6 text-[#174ea6]" /><div><h2 className="font-bold">{t('sourceDocument')}</h2><p className="text-sm text-slate-500">{documents.length || 2} {t('documents')}</p></div></div></section>
        <div className="mt-4 space-y-3"><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 font-bold"><Pill className="size-5 text-[#174ea6]" /> {t('medicinesFound')}</div><p className="mt-3 font-semibold">Metformin 500 mg</p><p className="mt-1 text-sm text-slate-500">1 × 2</p></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 font-bold"><FlaskConical className="size-5 text-[#174ea6]" /> {t('labResults')}</div><p className="mt-3 font-semibold">HbA1c · 8.4%</p></article></div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-[#123b79]"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><p>{t('doctorWillVerify')}</p></div>
      </main>
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-4 pb-safe"><button type="button" onClick={() => navigate('/patient/confirmation')} className="mx-auto block w-full max-w-xl rounded-full bg-[#174ea6] px-5 py-3.5 font-bold text-white">{t('continueConfirmation')}</button></div>
    </div>
  )
}
