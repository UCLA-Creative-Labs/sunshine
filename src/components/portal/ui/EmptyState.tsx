import { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: ReactNode
  illustration?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-ink-200 bg-surface-card p-10',
        'flex flex-col items-center text-center gap-4',
        'sm:flex-row sm:text-left sm:gap-8',
        className,
      )}
      {...rest}
    >
      {illustration && <div className="shrink-0">{illustration}</div>}
      <div className="flex-1 min-w-0">
        <h4 className="font-ui font-black text-2xl text-ink-900 tracking-tight">{title}</h4>
        {description && <p className="mt-1.5 text-[15px] text-ink-600 max-w-prose">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
