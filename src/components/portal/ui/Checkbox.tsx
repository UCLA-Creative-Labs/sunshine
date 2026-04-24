import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from './cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  wrapperClassName?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, wrapperClassName, disabled, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2.5 font-body text-sm text-ink-900',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        wrapperClassName,
      )}
    >
      {/* Native input visually hidden but focusable; the styled <span> below is the visible control. */}
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden
        className={cn(
          'relative w-[18px] h-[18px] shrink-0 rounded border-[1.5px] bg-white transition-colors duration-fast',
          'border-ink-400',
          'peer-checked:bg-cl-pink-700 peer-checked:border-cl-pink-700',
          'peer-focus-visible:ring-4 peer-focus-visible:ring-cl-pink-100',
          "peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:left-[3px] peer-checked:after:top-[2px] peer-checked:after:w-[10px] peer-checked:after:h-[5px] peer-checked:after:border-l-2 peer-checked:after:border-b-2 peer-checked:after:border-white peer-checked:after:rotate-[-45deg]",
          className,
        )}
      />
      {label && <span>{label}</span>}
    </label>
  )
})
