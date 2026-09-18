export default function Card({
  children,
  className = '',
  hover = false,
  selected = false,
  onClick,
  padding = 'p-6',
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface-raised rounded-2xl
        shadow-card
        border border-border-light
        transition-all duration-200 ease-out
        ${padding}
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
