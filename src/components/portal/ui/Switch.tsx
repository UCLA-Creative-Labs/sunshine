import { ButtonHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from './cn'

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: boolean
  onCheckedChange?: (next: boolean) => void
  label?: string
  wrapperClassName?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onCheckedChange, label, id, className, wrapperClassName, disabled, onClick, ...rest },
  ref,
) {
  const autoId = useId()
  const switchId = id ?? autoId

  return (
    <span className={cn('inline-flex items-center gap-2.5 font-body text-sm text-ink-900', wrapperClassName)}>
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${switchId}-lbl` : undefined}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) onCheckedChange?.(!checked)
        }}
        className={cn(
          'relative w-[38px] h-[22px] shrink-0 rounded-full transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cl-pink-100',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          checked ? 'bg-cl-pink-700' : 'bg-ink-200',
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-fast',
            checked && 'translate-x-[16px]',
          )}
        />
      </button>
      {label && <label id={`${switchId}-lbl`} htmlFor={switchId}>{label}</label>}
    </span>
  )
})
