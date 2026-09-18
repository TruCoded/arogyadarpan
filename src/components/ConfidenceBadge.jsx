import { ShieldCheck, ShieldAlert } from 'lucide-react'

const confidenceLevels = {
  high: { label: 'High confidence', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: ShieldCheck },
  medium: { label: 'Medium confidence', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: ShieldAlert },
  low: { label: 'Needs verification', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert },
}

export function getConfidenceLevel(score) {
  if (score >= 0.85) return 'high'
  if (score >= 0.65) return 'medium'
  return 'low'
}

export default function ConfidenceBadge({ score, showPercent = true, size = 'sm', className = '' }) {
  const level = getConfidenceLevel(score)
  const config = confidenceLevels[level]
  const Icon = config.icon

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        font-medium
        ${config.bg} ${config.color} ${config.border}
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${className}
      `}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {showPercent ? `${Math.round(score * 100)}%` : config.label}
    </span>
  )
}
