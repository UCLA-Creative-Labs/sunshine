import { HTMLAttributes } from 'react'
import { cn } from './cn'

export type BadgeColor = 'pink' | 'purple' | 'mint' | 'yellow' | 'sky' | 'coral' | 'ink'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor
  dot?: boolean
}

const colors: Record<BadgeColor, string> = {
  pink:   'bg-cl-pink-100 text-cl-pink-700',
  purple: 'bg-cl-purple-100 text-cl-purple-700',
  mint:   'bg-cl-mint-100 text-cl-mint-700',
  yellow: 'bg-cl-yellow-100 text-cl-yellow-700',
  sky:    'bg-cl-sky-100 text-cl-sky-700',
  coral:  'bg-cl-coral-100 text-cl-coral-700',
  ink:    'bg-ink-100 text-ink-900',
}

export function Badge({ color = 'ink', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-ui font-bold text-xs leading-tight',
        colors[color],
        className,
      )}
      {...rest}
    >
      {dot && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-current opacity-90" />}
      {children}
    </span>
  )
}
