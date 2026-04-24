import { HTMLAttributes } from 'react'
import Image from 'next/image'
import { cn } from './cn'
import { AvatarColor, getInitials, pickAvatarColor } from './avatar-utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name?: string | null
  src?: string | null
  size?: AvatarSize
  color?: AvatarColor
  alt?: string
}

const sizes: Record<AvatarSize, { box: string; text: string; px: number }> = {
  xs: { box: 'w-6 h-6',     text: 'text-[10px]', px: 24 },
  sm: { box: 'w-8 h-8',     text: 'text-xs',     px: 32 },
  md: { box: 'w-11 h-11',   text: 'text-[15px]', px: 44 },
  lg: { box: 'w-16 h-16',   text: 'text-[22px]', px: 64 },
  xl: { box: 'w-[88px] h-[88px]', text: 'text-[30px]', px: 88 },
}

const colorBg: Record<AvatarColor, string> = {
  pink:   'bg-cl-pink-700',
  sky:    'bg-cl-sky-700',
  purple: 'bg-cl-purple-700',
  mint:   'bg-cl-mint-700',
  coral:  'bg-cl-coral-700',
  ink:    'bg-ink-900',
}

export function Avatar({ name, src, size = 'md', color, alt, className, ...rest }: AvatarProps) {
  const { box, text, px } = sizes[size]
  const initials = getInitials(name)
  const resolvedColor = color ?? pickAvatarColor(name)
  const label = alt ?? (name ? `${name}'s avatar` : 'Unknown user')

  if (src) {
    return (
      <span className={cn('relative inline-block rounded-full overflow-hidden', box, className)} {...rest}>
        <Image src={src} alt={label} width={px} height={px} className="object-cover w-full h-full" />
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-ui font-bold text-white tracking-wide select-none',
        box,
        text,
        colorBg[resolvedColor],
        className,
      )}
      {...rest}
    >
      {initials}
    </span>
  )
}
