import { useState } from 'react'
import { Calendar, Check } from 'lucide-react'
import Button from './Button'
import { useLanguage } from '../context/LanguageContext'

export default function TouchDatePicker({ value, onChange, onSubmit, max = new Date().toISOString().split('T')[0], submitLabel }) {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState(value || '')
  const change = (event) => { setSelectedDate(event.target.value); onChange?.(event.target.value) }
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><Calendar className="size-4 text-[#174ea6]" />{t('question')}</label>
      <input type="date" max={max} value={selectedDate} onChange={change} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-semibold outline-none focus:border-[#174ea6]" />
      {onSubmit && <Button size="lg" fullWidth onClick={() => onSubmit(selectedDate)} disabled={!selectedDate} className="mt-4 flex items-center justify-center gap-2"><Check className="size-4" /><span>{submitLabel || t('confirm')}</span></Button>}
    </div>
  )
}
