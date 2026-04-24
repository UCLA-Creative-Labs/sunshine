import { SelectHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from './cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  sublabel?: string
  error?: string
  wrapperClassName?: string
}

// Native select appearance is suppressed; the caret glyph is painted with
// two background gradients positioned in the right padding gutter.
const caret =
  "bg-[linear-gradient(45deg,transparent_50%,rgb(var(--color-ink-600))_50%),linear-gradient(135deg,rgb(var(--color-ink-600))_50%,transparent_50%)] " +
  'bg-[length:5px_5px,5px_5px] ' +
  'bg-[position:calc(100%-18px)_50%,calc(100%-13px)_50%] ' +
  'bg-no-repeat'

const field =
  'w-full appearance-none rounded-md border bg-white pl-3.5 pr-10 py-2.5 ' +
  'font-body text-sm text-ink-900 transition-colors duration-fast ' +
  'focus:outline-none focus:ring-4 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, sublabel, error, id, className, wrapperClassName, children, ...rest },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId
  const hasError = Boolean(error)
  const describedBy = hasError ? `${selectId}-err` : sublabel ? `${selectId}-sub` : undefined

  return (
    <div className={cn('flex flex-col gap-2', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="font-ui font-bold text-[13px] text-ink-900">
          {label}
        </label>
      )}
      {sublabel && !hasError && (
        <span id={`${selectId}-sub`} className="font-ui text-[11px] font-semibold tracking-wide text-ink-600">
          {sublabel}
        </span>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          field,
          caret,
          hasError
            ? 'border-cl-danger-700 focus:border-cl-danger-700 focus:ring-cl-pink-100'
            : 'border-ink-200 focus:border-cl-pink-700 focus:ring-cl-pink-100',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {hasError && (
        <span id={`${selectId}-err`} role="alert" className="font-ui text-[11px] font-semibold tracking-wide text-cl-danger-700">
          {error}
        </span>
      )}
    </div>
  )
})
