import React from 'react'

function toPath(data, w = 200, h = 56) {
  if (!data || data.length === 0) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / span) * (h - 8) - 4
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function Sparkline({ data = [], className = '', strokeWidth = 2 }) {
  if (!data || data.length < 2) return null
  return (
    <svg viewBox="0 0 200 56" preserveAspectRatio="none" className={`h-14 w-full ${className}`}>
      <path
        d={toPath(data)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  )
}

export function BarSparkline({ data = [], className = '' }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data, 1)
  return (
    <div className={`flex h-14 items-end gap-[3px] ${className}`}>
      {data.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-current"
          style={{ height: `${Math.max(12, (v / max) * 100)}%`, opacity: 0.25 + (v / max) * 0.6 }}
        />
      ))}
    </div>
  )
}

const ECG_PATH =
  'M0,28 L18,28 L24,28 L30,12 L36,44 L42,28 L60,28 L72,28 L78,10 L84,46 L90,28 L112,28 L124,28 L130,12 L136,44 L142,28 L164,28 L176,28 L182,10 L188,46 L194,28 L220,28'

export function EcgLine({ className = '', strokeWidth = 2.4 }) {
  return (
    <svg viewBox="0 0 220 56" preserveAspectRatio="none" className={`h-14 w-full ${className}`}>
      <path d={ECG_PATH} fill="none" stroke="currentColor" strokeWidth={strokeWidth} opacity={0.2} />
      <path
        d={ECG_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-ecg"
      />
    </svg>
  )
}
