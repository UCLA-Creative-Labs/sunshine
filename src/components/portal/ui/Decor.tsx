import { HTMLAttributes, ReactNode, SVGProps } from 'react'
import { cn } from './cn'

/**
 * Decorative vocabulary from the CL Figma 2D-assets board.
 * Grid + noise textures live in /public/textures/ and are referenced by
 * GridTexture / NoiseTexture. The rest are inline SVG / styled primitives.
 */

/* ================================================================
 * GridTexture — graph-paper background
 * ================================================================
 * Two render modes:
 *   <GridTexture variant="raster" /> → uses /public/textures/grid.png
 *   <GridTexture variant="css" />    → pure-CSS repeating linear-gradient
 * CSS mode scales infinitely and is recommended for large backgrounds;
 * raster mode matches the Figma source exactly.
 */
export interface GridTextureProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'raster' | 'css'
  /** cell size in px for CSS variant. default 24 */
  cellSize?: number
  /** 0..1, default 0.08 (CSS) / 0.4 (raster) */
  opacity?: number
}

export function GridTexture({
  variant = 'css',
  cellSize = 24,
  opacity,
  className,
  style,
  ...rest
}: GridTextureProps) {
  if (variant === 'raster') {
    return (
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-0', className)}
        style={{
          backgroundImage: "url('/textures/grid.png')",
          backgroundSize: '670px auto',
          backgroundRepeat: 'repeat',
          opacity: opacity ?? 0.4,
          ...style,
        }}
        {...rest}
      />
    )
  }
  const cs = `${cellSize}px ${cellSize}px`
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(26 26 26 / 0.06) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgb(26 26 26 / 0.06) 1px, transparent 1px)',
        backgroundSize: cs,
        opacity: opacity ?? 1,
        ...style,
      }}
      {...rest}
    />
  )
}

/* ================================================================
 * NoiseTexture — dark speckled background
 * ================================================================ */
export interface NoiseTextureProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number
}

export function NoiseTexture({ opacity = 0.8, className, style, ...rest }: NoiseTextureProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: "url('/textures/noise.png')",
        backgroundSize: '840px 1056px',
        backgroundRepeat: 'repeat',
        opacity,
        ...style,
      }}
      {...rest}
    />
  )
}

/* ================================================================
 * DashedBox — dashed-border wrapper
 * ================================================================ */
export interface DashedBoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DashedBox({ className, children, ...rest }: DashedBoxProps) {
  return (
    <div
      className={cn(
        'rounded-md border-2 border-dashed border-ink-400 p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ================================================================
 * PillLockup — black pill with uppercase DIN Condensed text
 * ================================================================
 * Matches "CREATIVE LABS FALL 25" vibe from the Figma board.
 * Also accepts a tone prop to flip colors (e.g. white pill + black text).
 */
export type PillTone = 'ink' | 'blue' | 'ghost'

export interface PillLockupProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
}

const pillTones: Record<PillTone, string> = {
  ink:   'bg-ink-900 text-white',
  blue:  'bg-cl-blue-700 text-white',
  ghost: 'bg-transparent text-ink-900 ring-2 ring-ink-900',
}

export function PillLockup({ tone = 'ink', className, children, ...rest }: PillLockupProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-display font-bold text-xs tracking-[0.08em] uppercase px-3 py-1.5 leading-none',
        pillTones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

/* ================================================================
 * SpeechBubble — rounded pill with tail, supports accent italic text
 * ================================================================ */
export type SpeechBubbleTone = 'blue' | 'ink' | 'cream'
export type SpeechBubbleTail = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SpeechBubbleTone
  tail?: SpeechBubbleTail
}

const bubbleTones: Record<SpeechBubbleTone, string> = {
  blue:  'bg-cl-blue-700 text-white',
  ink:   'bg-ink-900 text-white',
  cream: 'bg-cream-100 text-ink-900 ring-2 ring-ink-900',
}

const tailPositions: Record<SpeechBubbleTail, string> = {
  'bottom-left':  'after:left-4 after:-bottom-2 after:border-t-[10px] after:border-l-[10px] after:border-r-0 after:border-b-0',
  'bottom-right': 'after:right-4 after:-bottom-2 after:border-t-[10px] after:border-r-[10px] after:border-l-0 after:border-b-0',
  'top-left':     'after:left-4 after:-top-2 after:border-b-[10px] after:border-l-[10px] after:border-r-0 after:border-t-0',
  'top-right':    'after:right-4 after:-top-2 after:border-b-[10px] after:border-r-[10px] after:border-l-0 after:border-t-0',
}

const tailColorClass: Record<SpeechBubbleTone, string> = {
  blue:  'after:border-t-cl-blue-700 after:border-l-cl-blue-700 after:border-b-cl-blue-700 after:border-r-cl-blue-700',
  ink:   'after:border-t-ink-900 after:border-l-ink-900 after:border-b-ink-900 after:border-r-ink-900',
  cream: 'after:border-t-cream-100 after:border-l-cream-100 after:border-b-cream-100 after:border-r-cream-100',
}

export function SpeechBubble({
  tone = 'blue',
  tail = 'bottom-left',
  className,
  children,
  ...rest
}: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full px-4 py-2 font-ui font-semibold text-sm leading-tight',
        'after:content-[""] after:absolute after:w-0 after:h-0 after:border-solid',
        bubbleTones[tone],
        tailColorClass[tone],
        tailPositions[tail],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ================================================================
 * Cursor — blue arrow cursor icon (like Figma's selection cursor)
 * ================================================================ */
export interface CursorIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

export function CursorIcon({ size = 24, className, ...rest }: CursorIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      aria-hidden
      {...rest}
    >
      <path
        d="M5 3L19 12L12 13L9 20L5 3Z"
        fill="rgb(var(--color-cl-blue-500))"
        stroke="rgb(var(--color-black))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ================================================================
 * Squiggle — blue doodle line (like the Figma board accent)
 * ================================================================ */
export interface SquiggleProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

export function Squiggle({ width = 60, height = 24, className, ...rest }: SquiggleProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      aria-hidden
      {...rest}
    >
      <path
        d="M2 12 C 8 2, 16 22, 22 12 S 36 2, 42 12 S 56 22, 58 12"
        stroke="rgb(var(--color-cl-blue-500))"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
