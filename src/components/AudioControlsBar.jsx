import { useState, useEffect } from 'react'
import { Volume2, VolumeX, RotateCcw, Gauge, Sparkles, Check } from 'lucide-react'

export default function AudioControlsBar({
  onRepeatQuestion,
  isSpeaking = false,
  volume = 1.0,
  onVolumeChange,
  speechRate = 0.95,
  onSpeechRateChange,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isSlowSpeed = speechRate <= 0.8

  const toggleSlowSpeed = () => {
    if (isSlowSpeed) {
      onSpeechRateChange?.(1.0)
    } else {
      onSpeechRateChange?.(0.75) // Slow speech for elderly / low literacy patients
    }
  }

  const toggleMute = () => {
    if (volume > 0) {
      onVolumeChange?.(0)
    } else {
      onVolumeChange?.(1.0)
    }
  }

  return (
    <div className={`bg-surface-raised border border-border-light rounded-2xl p-2 sm:p-2.5 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Repeat Question Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRepeatQuestion}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${isSpeaking
                ? 'bg-amber-500 text-white animate-pulse shadow-md'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
              }
            `}
            title="Listen to this question again"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span>{isSpeaking ? 'Speaking...' : 'Repeat Question'}</span>
          </button>

          {/* Slow Speech Toggle (For Elderly / Low-Literacy) */}
          <button
            type="button"
            onClick={toggleSlowSpeed}
            className={`
              flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border
              ${isSlowSpeed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-surface-muted text-text-secondary hover:text-text-primary border-border-light'
              }
            `}
            title="Slow down speech for clearer understanding"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{isSlowSpeed ? 'Slow Speech (0.75x) ✓' : 'Slow Speech'}</span>
          </button>
        </div>

        {/* Right: Volume Controls & Slider */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            title={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary-600" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
            className="w-16 sm:w-20 h-1.5 bg-border-light rounded-lg appearance-none cursor-pointer accent-primary-600"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />

          <span className="text-[11px] font-semibold text-text-muted w-7 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}
