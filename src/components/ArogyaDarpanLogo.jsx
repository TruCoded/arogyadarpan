import emblem from '../assets/arogyadarpan_logo_emblem.png'

export default function ArogyaDarpanLogo({ size = 'md', className = '', showSubtitle = false }) {
  const sizeClasses = {
    sm: 'size-9',
    md: 'size-12',
    lg: 'size-20',
    xl: 'size-32 sm:size-36',
  }[size] || 'size-12'

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses} overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm`}>
        <img src={emblem} alt="ArogyaDarpan emblem" className="size-full object-contain" />
      </div>
      {showSubtitle && (
        <span className="mt-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#174ea6]">
          Clinical intake prototype
        </span>
      )}
    </div>
  )
}
