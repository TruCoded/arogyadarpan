import { useState } from 'react'
import { Stethoscope, Leaf, Sparkles } from 'lucide-react'

export default function AYUSHModeToggle({ currentMode = 'modern', onChangeMode, className = '' }) {
  return (
    <div className={`inline-flex items-center bg-surface-muted p-1 rounded-2xl border border-border-light ${className}`}>
      <button
        onClick={() => onChangeMode?.('modern')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer
          ${currentMode === 'modern'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white'
          }
        `}
      >
        <Stethoscope className="w-3.5 h-3.5" />
        Modern Medicine
      </button>

      <button
        onClick={() => onChangeMode?.('ayush')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer
          ${currentMode === 'ayush'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white'
          }
        `}
      >
        <Leaf className="w-3.5 h-3.5" />
        AYUSH Intake
      </button>
    </div>
  )
}
