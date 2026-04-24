import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-ui font-bold ' +
  'leading-tight transition-colors duration-fast ' +
  'focus-visible:outline-none focus-visible:ring-4 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-cl-pink-700 text-white hover:bg-cl-pink-800 focus-visible:ring-cl-pink-100',
  secondary:
    'bg-white text-cl-sky-700 border border-cl-sky-700 hover:bg-cl-sky-100 focus-visible:ring-cl-sky-100',
  ghost:
    'bg-transparent text-ink-900 hover:bg-ink-100 focus-visible:ring-cl-pink-100',
  danger:
    'bg-white text-cl-danger-700 border border-cl-danger-700 hover:bg-cl-danger-700 hover:text-white focus-visible:ring-cl-pink-100',
  icon:
    'bg-white text-ink-900 border border-ink-200 hover:bg-cream-100 hover:border-ink-900 focus-visible:ring-cl-pink-100',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[13px] px-3.5 py-2',
  md: 'text-sm px-[18px] py-2.5',
  lg: 'text-[15px] px-[22px] py-3',
}

const iconSquare = 'w-10 h-10 p-0'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leadingIcon, trailingIcon, className, children, type, ...rest },
  ref,
) {
  const isIconOnly = variant === 'icon'
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(base, variants[variant], isIconOnly ? iconSquare : sizes[size], className)}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})
