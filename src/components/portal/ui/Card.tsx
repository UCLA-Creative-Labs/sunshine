import { HTMLAttributes, forwardRef } from 'react'
import { cn } from './cn'

export type CardVariant = 'default' | 'raised' | 'outlined'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variants: Record<CardVariant, string> = {
  default:  'bg-surface-card border border-ink-100 shadow-sm',
  raised:   'bg-surface-card border border-black/5 shadow-lg',
  outlined: 'bg-surface-card border border-ink-200',
}

const paddings = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', padding = 'md', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('rounded-lg', variants[variant], paddings[padding], className)}
      {...rest}
    />
  )
})
