import { Check } from 'lucide-react'

export default function ProgressBar({
  steps = [],
  currentStep = 0,
  className = '',
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-border-light" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-primary-500 transition-all duration-500 ease-out"
          style={{ width: `calc(${(currentStep / Math.max(steps.length - 1, 1)) * 100}% - 48px)` }}
        />

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10 relative">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-semibold transition-all duration-300
                ${index < currentStep
                  ? 'bg-primary-500 text-white'
                  : index === currentStep
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-surface-raised text-text-muted border-2 border-border-light'
                }
              `}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium whitespace-nowrap
                ${index <= currentStep ? 'text-primary-600' : 'text-text-muted'}
              `}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
