import { Check, Edit3, X } from 'lucide-react'
import Button from './Button'

export default function VerificationButtons({
  onConfirm,
  onEdit,
  onReject,
  status = 'unverified',
  size = 'sm',
  className = '',
}) {
  if (status === 'doctor_confirmed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <Check className="w-3.5 h-3.5" /> Verified
      </span>
    )
  }

  if (status === 'doctor_edited' || status === 'doctor_corrected') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
        <Edit3 className="w-3.5 h-3.5" /> Corrected by Physician
      </span>
    )
  }

  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
        <X className="w-3.5 h-3.5" /> Rejected
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onConfirm && (
        <Button
          variant="success"
          size={size}
          icon={Check}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      )}
      {onEdit && (
        <Button
          variant="secondary"
          size={size}
          icon={Edit3}
          onClick={onEdit}
        >
          Edit
        </Button>
      )}
      {onReject && (
        <Button
          variant="ghost"
          size={size}
          icon={X}
          onClick={onReject}
          className="text-red-500 hover:bg-red-50"
        >
          Reject
        </Button>
      )}
    </div>
  )
}
