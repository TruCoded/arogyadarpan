import { useState } from 'react'
import { Calendar as CalendarIcon, Check } from 'lucide-react'
import Button from './Button'

/**
 * TouchDatePicker — Touch-optimized date selector for kiosks
 * Features quick relative shortcuts + direct date input
 */
export default function TouchDatePicker({
  value,
  onChange,
  onSubmit,
  max = new Date().toISOString().split('T')[0],
  submitLabel = 'Confirm Date',
}) {
  const [selectedDate, setSelectedDate] = useState(value || new Date().toISOString().split('T')[0])

  const quickDates = [
    {
      label: 'Today',
      labelHi: 'आज',
      calc: () => new Date().toISOString().split('T')[0]
    },
    {
      label: 'Yesterday',
      labelHi: 'कल',
      calc: () => {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        return d.toISOString().split('T')[0]
      }
    },
    {
      label: '2-3 Days Ago',
      labelHi: '2-3 दिन पहले',
      calc: () => {
        const d = new Date()
        d.setDate(d.getDate() - 3)
        return d.toISOString().split('T')[0]
      }
    },
    {
      label: '1 Week Ago',
      labelHi: '1 सप्ताह पहले',
      calc: () => {
        const d = new Date()
        d.setDate(d.getDate() - 7)
        return d.toISOString().split('T')[0]
      }
    },
    {
      label: '1 Month Ago',
      labelHi: '1 महीना पहले',
      calc: () => {
        const d = new Date()
        d.setMonth(d.getMonth() - 1)
        return d.toISOString().split('T')[0]
      }
    },
    {
      label: '6+ Months Ago',
      labelHi: '6+ महीने पहले',
      calc: () => {
        const d = new Date()
        d.setMonth(d.getMonth() - 6)
        return d.toISOString().split('T')[0]
      }
    }
  ]

  const handleQuickSelect = (calcFn) => {
    const d = calcFn()
    setSelectedDate(d)
    onChange?.(d)
  }

  const handleCustomChange = (e) => {
    const val = e.target.value
    setSelectedDate(val)
    onChange?.(val)
  }

  return (
    <div className="max-w-md mx-auto w-full bg-surface-raised p-5 rounded-3xl border border-border-light shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-text-muted uppercase tracking-wider">
        <CalendarIcon className="w-4 h-4 text-primary-600" />
        <span>Quick Date Shortcuts</span>
      </div>

      {/* Quick Date Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {quickDates.map((item, idx) => {
          const dateVal = item.calc()
          const isSelected = selectedDate === dateVal
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSelect(item.calc)}
              className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                  : 'bg-white border-border-light text-text-primary hover:border-primary-300 hover:bg-primary-50/20'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Custom Calendar Date Selector */}
      <div className="space-y-1.5 mb-4">
        <label className="block text-xs font-medium text-text-secondary">
          Or Select Specific Date:
        </label>
        <input
          type="date"
          max={max}
          value={selectedDate}
          onChange={handleCustomChange}
          className="w-full px-4 py-3.5 rounded-2xl border border-border-light bg-white text-text-primary text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        />
      </div>

      {onSubmit && (
        <Button
          size="lg"
          fullWidth
          onClick={() => onSubmit(selectedDate)}
          className="flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{submitLabel}</span>
        </Button>
      )}
    </div>
  )
}
