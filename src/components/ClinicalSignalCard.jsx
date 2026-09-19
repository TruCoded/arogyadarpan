import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
    dot: '🔴',
  },
  high: {
    icon: AlertCircle,
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconColor: 'text-orange-500',
    textColor: 'text-orange-800',
    dot: '🟠',
  },
  medium: {
    icon: ShieldAlert,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-800',
    dot: '🟡',
  },
  low: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
    dot: '🔵',
  },
}

export default function ClinicalSignalCard({
  severity = 'medium',
  message,
  detail,
  disclaimer,
  currentValue,
  previousValue,
  compact = false,
  className = '',
}) {
  const { t } = useLanguage()
  const config = severityConfig[severity]
  const Icon = config.icon

  const localizedMessage = message ? t(message, message) : ''
  const localizedDetail = detail ? t(detail, detail) : ''

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span>{config.dot}</span>
        <span className={`text-sm font-medium ${config.textColor}`}>{localizedMessage}</span>
      </div>
    )
  }

  return (
    <div
      className={`
        rounded-xl border p-4
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${config.textColor}`}>{localizedMessage}</h4>
          {localizedDetail && <p className="text-sm text-gray-600 mt-1">{localizedDetail}</p>}

          {/* Conflict display */}
          {currentValue && previousValue && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{t('currentResponse', 'Current response:')}</span>
                <span className="font-medium">{t(currentValue, currentValue)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{t('previousRecord', 'Previous record:')}</span>
                <span className="font-medium">{t(previousValue, previousValue)}</span>
              </div>
            </div>
          )}

          {disclaimer && (
            <p className="text-xs text-gray-400 mt-3 italic">{disclaimer}</p>
          )}
        </div>
      </div>
    </div>
  )
}
