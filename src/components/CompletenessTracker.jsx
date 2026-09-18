import { Check, AlertCircle, MinusCircle } from 'lucide-react'

const statusConfig = {
  collected: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  needs_clarification: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
  not_collected: { icon: MinusCircle, color: 'text-gray-300', bg: 'bg-gray-50' },
}

export default function CompletenessTracker({
  categories = [],
  percent = 0,
  className = '',
}) {
  return (
    <div className={`bg-surface-raised rounded-2xl border border-border-light/60 p-5 ${className}`}>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary font-[family-name:var(--font-heading)]">
          History completeness
        </h3>
        <span className="text-2xl font-bold text-primary-600 font-[family-name:var(--font-heading)]">
          {percent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Category list */}
      <div className="space-y-2.5">
        {categories.map(cat => {
          const config = statusConfig[cat.status]
          const Icon = config.icon
          return (
            <div key={cat.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              <span className={`text-sm ${cat.status === 'not_collected' ? 'text-text-muted' : 'text-text-primary'}`}>
                {cat.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
