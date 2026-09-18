const severityStyles = {
  critical: 'bg-critical-light text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-warning-light text-amber-700 border-amber-200',
  low: 'bg-info-light text-blue-700 border-blue-200',
  success: 'bg-success-light text-emerald-700 border-emerald-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
}

const dotColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
  success: 'bg-emerald-500',
  neutral: 'bg-gray-400',
  primary: 'bg-primary-500',
}

export default function Badge({
  children,
  severity = 'neutral',
  dot = false,
  size = 'sm',
  className = '',
}) {
  const sizeClass = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${severityStyles[severity]}
        ${sizeClass}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[severity]}`} />
      )}
      {children}
    </span>
  )
}
