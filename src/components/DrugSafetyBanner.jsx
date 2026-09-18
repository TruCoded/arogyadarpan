import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { checkDrugInteractions } from '../services/drugInteractionEngine'

export default function DrugSafetyBanner({ medications = [], allergies = [], className = '' }) {
  const warnings = checkDrugInteractions(medications, allergies)

  if (warnings.length === 0) {
    return (
      <div className={`bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center gap-3 ${className}`}>
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-emerald-900 font-medium">
          Drug Safety Check Clear: No drug-drug interactions or allergy contraindications detected.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {warnings.map(warn => (
        <div
          key={warn.id}
          className={`rounded-2xl border p-4 flex items-start gap-3 shadow-xs ${
            warn.severity === 'high' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <ShieldAlert className={`w-5 h-5 mt-0.5 flex-shrink-0 ${warn.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-0.5">{warn.title}</h4>
            <p className="text-xs opacity-90 leading-relaxed mb-1.5">{warn.message}</p>
            <p className="text-[11px] font-bold underline">Recommendation: {warn.recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
