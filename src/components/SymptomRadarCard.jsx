import { motion } from 'framer-motion'
import { Activity, ShieldAlert, Sparkles, HeartPulse, ChevronRight } from 'lucide-react'
import Badge from './Badge'

export default function SymptomRadarCard({ triageData, onSelectDynamicQuestion, className = '' }) {
  if (!triageData) return null

  const { riskScore, priorityStatus, detectedSymptoms, detectedLabResults, dynamicQuestions } = triageData

  const severityBadge = priorityStatus === 'critical' ? 'critical' :
                        priorityStatus === 'priority' ? 'high' :
                        priorityStatus === 'urgent' ? 'medium' : 'success'

  return (
    <div className={`bg-surface-raised rounded-2xl border border-border-light shadow-card p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-light">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-text-primary font-heading">
              AI Problem & Triage Radar
            </h3>
            <p className="text-[11px] text-text-muted">Real-time NLP Symptom Extractor</p>
          </div>
        </div>
        <Badge severity={severityBadge} dot size="sm">
          {priorityStatus.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Risk Gauge */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-text-secondary">Clinical Severity Risk Index</span>
          <span className="text-primary-700 font-bold">{riskScore} / 100</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              riskScore > 75 ? 'bg-red-500' :
              riskScore > 45 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Detected Symptoms */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
          Detected Clinical Entities ({detectedSymptoms.length + detectedLabResults.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {detectedSymptoms.map((sym, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 bg-primary-50 text-primary-800 border border-primary-200 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              <HeartPulse className="w-3 h-3 text-primary-600" />
              {sym.label}
            </motion.span>
          ))}
          {detectedLabResults.map((lab, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium border ${
                lab.status === 'abnormal' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              🧪 {lab.name}: {lab.value} {lab.unit}
            </span>
          ))}
          {detectedSymptoms.length === 0 && detectedLabResults.length === 0 && (
            <p className="text-xs text-text-muted italic">Listening to response for problem detection...</p>
          )}
        </div>
      </div>

      {/* Dynamic Targeted Follow-ups */}
      {dynamicQuestions.length > 0 && (
        <div className="pt-3 border-t border-border-light">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic Adaptive Questions Available</span>
          </div>
          <div className="space-y-1.5">
            {dynamicQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectDynamicQuestion?.(q)}
                className="w-full text-left text-xs bg-surface-muted hover:bg-primary-50 text-text-primary p-2 rounded-lg border border-border-light hover:border-primary-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="font-medium group-hover:text-primary-700">{q.question}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary-600 flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
