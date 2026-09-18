import { Loader2 } from 'lucide-react'

export default function LoadingState({
  message = 'Processing...',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-primary-100 border-t-primary-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-text-secondary font-medium">{message}</p>
      <div className="flex gap-1 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

export function SkeletonLine({ width = 'w-full', className = '' }) {
  return (
    <div className={`h-4 rounded-md bg-gray-100 animate-pulse ${width} ${className}`} />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface-raised rounded-2xl border border-border-light/60 p-6 ${className}`}>
      <SkeletonLine width="w-1/3" className="mb-4" />
      <SkeletonLine width="w-full" className="mb-2" />
      <SkeletonLine width="w-2/3" />
    </div>
  )
}
