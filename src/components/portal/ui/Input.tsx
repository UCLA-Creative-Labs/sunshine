import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from './cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  sublabel?: string
  error?: string
  wrapperClassName?: string
}

const field =
  'w-full rounded-md border bg-white px-3.5 py-2.5 font-body text-sm text-ink-900 ' +
  'placeholder:text-ink-400 transition-colors duration-fast ' +
  'focus:outline-none focus:ring-4 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, sublabel, error, id, className, wrapperClassName, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hasError = Boolean(error)
  const describedBy = hasError ? `${inputId}-err` : sublabel ? `${inputId}-sub` : undefined

  return (
    <div className={cn('flex flex-col gap-2', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="font-ui font-bold text-[13px] text-ink-900">
          {label}
        </label>
      )}
      {sublabel && !hasError && (
        <span id={`${inputId}-sub`} className="font-ui text-[11px] font-semibold tracking-wide text-ink-600">
          {sublabel}
        </span>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          field,
          hasError
            ? 'border-cl-danger-700 focus:border-cl-danger-700 focus:ring-cl-pink-100'
            : 'border-ink-200 focus:border-cl-pink-700 focus:ring-cl-pink-100',
          className,
        )}
        {...rest}
      />
      {hasError && (
        <span id={`${inputId}-err`} role="alert" className="font-ui text-[11px] font-semibold tracking-wide text-cl-danger-700">
          {error}
        </span>
      )}
    </div>
  )
})
