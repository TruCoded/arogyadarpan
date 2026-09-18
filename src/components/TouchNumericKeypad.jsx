import { useState } from 'react'
import { Delete, Plus, Minus, Check } from 'lucide-react'
import Button from './Button'

/**
 * TouchNumericKeypad — Touchscreen-optimized numeric input keypad & counter stepper
 * Perfect for kiosk touchscreens (severity rating, number of days, dosage, blood pressure, etc.)
 */
export default function TouchNumericKeypad({
  value,
  onChange,
  onSubmit,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  placeholder = '0',
  submitLabel = 'Confirm'
}) {
  const [internalVal, setInternalVal] = useState(String(value ?? ''))

  const handleDigit = (digit) => {
    const next = internalVal === '0' ? String(digit) : internalVal + String(digit)
    const num = parseInt(next, 10)
    if (!isNaN(num) && num <= max) {
      setInternalVal(next)
      onChange?.(num)
    }
  }

  const handleBackspace = () => {
    const next = internalVal.slice(0, -1)
    setInternalVal(next)
    onChange?.(next ? parseInt(next, 10) : min)
  }

  const handleClear = () => {
    setInternalVal('')
    onChange?.(min)
  }

  const handleIncrement = () => {
    const current = parseInt(internalVal || String(min), 10)
    const next = Math.min(max, current + step)
    setInternalVal(String(next))
    onChange?.(next)
  }

  const handleDecrement = () => {
    const current = parseInt(internalVal || String(min), 10)
    const next = Math.max(min, current - step)
    setInternalVal(String(next))
    onChange?.(next)
  }

  const handleConfirm = () => {
    const finalVal = internalVal ? parseInt(internalVal, 10) : min
    onSubmit?.(finalVal)
  }

  const digits = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]

  return (
    <div className="max-w-xs mx-auto w-full bg-surface-raised p-5 rounded-3xl border border-border-light shadow-sm select-none">
      {/* Value Display with Large Stepper */}
      <div className="flex items-center justify-between mb-5 bg-surface-muted/60 p-3 rounded-2xl border border-border-light">
        <button
          type="button"
          onClick={handleDecrement}
          className="w-11 h-11 rounded-xl bg-white border border-border-light flex items-center justify-center text-text-primary hover:bg-gray-100 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="text-center px-4">
          <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 font-heading">
            {internalVal || placeholder}
          </span>
          {unit && <span className="text-xs font-semibold text-text-muted ml-1.5">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          className="w-11 h-11 rounded-xl bg-white border border-border-light flex items-center justify-center text-text-primary hover:bg-gray-100 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* 3x3 Digit Grid */}
      <div className="space-y-2 mb-2">
        {digits.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-3 gap-2">
            {row.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => handleDigit(d)}
                className="h-13 rounded-2xl bg-white border border-border-light text-xl font-bold text-text-primary hover:border-primary-400 hover:bg-primary-50/30 active:scale-95 transition-all shadow-xs flex items-center justify-center cursor-pointer"
              >
                {d}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom Row: Clear, 0, Backspace */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="h-13 rounded-2xl bg-surface-muted text-xs font-bold text-text-secondary hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit(0)}
            className="h-13 rounded-2xl bg-white border border-border-light text-xl font-bold text-text-primary hover:border-primary-400 hover:bg-primary-50/30 active:scale-95 transition-all shadow-xs flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-13 rounded-2xl bg-surface-muted text-text-secondary hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      {onSubmit && (
        <Button
          size="lg"
          fullWidth
          onClick={handleConfirm}
          className="mt-3 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{submitLabel}</span>
        </Button>
      )}
    </div>
  )
}
