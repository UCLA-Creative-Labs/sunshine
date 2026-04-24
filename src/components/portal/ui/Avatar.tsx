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
  initials?: string
  /** Show a white separator ring. Defaults to true. Disable inside same-color surfaces. */
  ring?: boolean
}

const sizes: Record<AvatarSize, { box: string; text: string; px: number; ring: string }> = {
  xs: { box: 'w-6 h-6',           text: 'text-[10px]', px: 24, ring: 'ring-[1.5px]' },
  sm: { box: 'w-8 h-8',           text: 'text-xs',     px: 32, ring: 'ring-[1.5px]' },
  md: { box: 'w-11 h-11',         text: 'text-[15px]', px: 44, ring: 'ring-2' },
  lg: { box: 'w-16 h-16',         text: 'text-[22px]', px: 64, ring: 'ring-2' },
  xl: { box: 'w-[88px] h-[88px]', text: 'text-[30px]', px: 88, ring: 'ring-[3px]' },
}

// 135° gradient (from-500 to-700) — lifts the flat solid to a premium feel
// without changing per-user identity color.
const colorGradient: Record<AvatarColor, string> = {
  pink: 'bg-gradient-to-br from-cl-pink-500 to-cl-pink-700',
  blue: 'bg-gradient-to-br from-cl-blue-500 to-cl-blue-700',
  lime: 'bg-gradient-to-br from-cl-lime-500 to-cl-lime-700',
  mint: 'bg-gradient-to-br from-cl-mint-500 to-cl-mint-700',
  ink:  'bg-gradient-to-br from-ink-600 to-ink-900',
}

export function Avatar({
  name,
  src,
  size = 'md',
  color,
  alt,
  initials: initialsOverride,
  ring = true,
  className,
  ...rest
}: AvatarProps) {
  const { box, text, px, ring: ringWidth } = sizes[size]
  const initials = initialsOverride ?? getInitials(name)
  const resolvedColor = color ?? pickAvatarColor(name)
  const label = alt ?? (name ? `${name}'s avatar` : 'Unknown user')
  const ringClasses = ring ? `${ringWidth} ring-white` : ''

  if (src) {
    return (
      <span
        className={cn(
          'relative inline-block overflow-hidden rounded-full',
          box,
          ringClasses,
          className,
        )}
        {...rest}
      >
        <Image src={src} alt={label} width={px} height={px} className="h-full w-full object-cover" />
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-full font-ui font-bold tracking-wide text-white',
        box,
        text,
        colorGradient[resolvedColor],
        ringClasses,
        className,
      )}
      {...rest}
    >
      {initials}
    </span>
  )
}
