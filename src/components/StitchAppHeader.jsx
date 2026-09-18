import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Languages } from 'lucide-react'
import ArogyaDarpanLogo from './ArogyaDarpanLogo'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function StitchAppHeader({ title = '', subtitle = '', showBack = false, onBack }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white pt-safe">
      <div className="mx-auto flex min-h-16 w-full max-w-3xl items-center gap-3 px-4 py-2.5">
        {showBack ? (
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 active:bg-slate-200"
            aria-label={t('back')}
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : (
          <button type="button" onClick={() => navigate('/')} className="shrink-0" aria-label={t('appName')}>
            <ArogyaDarpanLogo size="sm" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold tracking-tight text-[#123b79]">ArogyaDarpan</p>
          {title && <p className="truncate text-xs font-medium text-slate-600">{title}</p>}
          {subtitle && <p className="truncate text-[11px] text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          <Languages className="hidden size-4 text-[#174ea6] sm:block" aria-hidden="true" />
          <LanguageSelector variant="compact" />
        </div>
      </div>
    </header>
  )
}
