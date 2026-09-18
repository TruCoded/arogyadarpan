import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm border border-transparent',
  secondary: 'bg-surface-raised text-text-primary border border-border-light hover:bg-surface-muted active:bg-gray-100',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary active:bg-gray-100 border border-transparent',
  danger: 'bg-critical text-white hover:bg-red-600 active:bg-red-700 border border-transparent',
  success: 'bg-success text-white hover:bg-emerald-600 active:bg-emerald-700 border border-transparent',
  outline: 'border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
  xl: 'px-8 py-4 text-xl rounded-2xl',
}

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold font-heading
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer select-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-5 h-5" />}
    </button>
  )
})

export default Button
