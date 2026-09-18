import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function RedFlagAlertModal({ isOpen, onClose, alertData, onAcknowledge }) {
  const { lang, t } = useLanguage()
  if (!isOpen || !alertData) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-lg rounded-3xl border-2 border-red-500 bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600"><ShieldAlert className="size-8" /></div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"><AlertTriangle className="size-4" />{t('priorityReviewRequired')}</div>
        <h2 className="mt-4 text-2xl font-extrabold text-red-700">{t('priorityReview')}</h2>
        {lang === 'en' && alertData.publicAlertMessage && <p className="mt-2 text-sm font-semibold text-slate-800">{alertData.publicAlertMessage}</p>}
        <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-900">{t('disclaimer')}</p>
        <p className="mt-3 text-sm text-slate-600">{t('doctorWillVerify')}</p>
        <button type="button" onClick={() => { onAcknowledge?.(); onClose?.() }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 font-bold text-white"><CheckCircle2 className="size-5" />{t('confirmed')}</button>
      </div>
    </div>
  )
}
