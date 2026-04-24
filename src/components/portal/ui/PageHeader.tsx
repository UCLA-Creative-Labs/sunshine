import React from 'react'
import { cn } from './cn'

export interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  action?: React.ReactNode
  className?: string
  as?: 'h1' | 'h2'
}

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  className,
  as: HeadingTag = 'h1',
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {eyebrow ? (
            <span className="font-ui text-xs font-semibold uppercase tracking-wider text-text-muted">
              {eyebrow}
            </span>
          ) : null}
          <HeadingTag className="font-display text-3xl leading-tight text-text-primary md:text-4xl">
            {title}
          </HeadingTag>
        </div>
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>
      {description ? (
        <p className="font-body text-base text-text-secondary md:max-w-2xl">{description}</p>
      ) : null}
    </header>
  )
}

export default PageHeader
