'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from './cn'

export type PortalNavTab = {
  id: string
  label: string
  href?: string
  disabled?: boolean
}

export interface PortalNavbarProps {
  tabs: PortalNavTab[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  trailing?: React.ReactNode
}

// "My Project" tab href is /portal/my-project but actual project sub-routes
// live under /portal/projects/[id]/* — without this alias no tab highlights
// when the user is inside a project.
const PATHNAME_ALIASES: Array<{ prefix: string; id: string }> = [
  { prefix: '/portal/projects/', id: 'my-project' },
]

export function PortalNavbar({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
  trailing,
}: PortalNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    defaultValue ?? tabs[0]?.id,
  )

  const derivedId = (() => {
    if (!pathname) return undefined
    const alias = PATHNAME_ALIASES.find(({ prefix }) => pathname.startsWith(prefix))
    if (alias) return alias.id
    const matches = tabs.filter((t) => t.href && pathname.startsWith(t.href))
    if (matches.length === 0) return undefined
    return matches.reduce((a, b) =>
      (a.href?.length ?? 0) > (b.href?.length ?? 0) ? a : b,
    ).id
  })()

  const currentValue = isControlled ? value : (derivedId ?? uncontrolled)

  useEffect(() => {
    if (!isControlled && defaultValue !== undefined) setUncontrolled(defaultValue)
  }, [defaultValue, isControlled])

  const handleSelect = useCallback(
    (tab: PortalNavTab) => {
      if (tab.disabled) return
      if (!isControlled) setUncontrolled(tab.id)
      onValueChange?.(tab.id)
      if (tab.href && pathname !== tab.href) router.push(tab.href)
    },
    [isControlled, onValueChange, pathname, router],
  )

  const listRef = useRef<HTMLDivElement | null>(null)

  // WAI-ARIA tablist roving focus: cycle only enabled tabs.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!listRef.current) return
    const enabled = tabs.map((tab, index) => ({ tab, index })).filter(({ tab }) => !tab.disabled)
    const cur = enabled.findIndex(({ index }) => index === idx)
    if (cur === -1) return

    const focusAt = (eIdx: number) => {
      const target = enabled[(eIdx + enabled.length) % enabled.length]
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button[data-tab-id]')
      buttons?.[target.index]?.focus()
      handleSelect(target.tab)
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusAt(cur + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusAt(cur - 1)
        break
      case 'Home':
        event.preventDefault()
        focusAt(0)
        break
      case 'End':
        event.preventDefault()
        focusAt(enabled.length - 1)
        break
    }
  }

  return (
    <header
      className={cn(
        'w-full bg-surface-card border-b border-ink-200 px-6 md:px-8 h-[68px]',
        className,
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full gap-6">
        <div className="flex items-center gap-2.5 justify-self-start">
          <Image src="/cl-logo.svg" alt="Creative Labs Logo" width={28} height={28} />
          <span className="font-display font-bold text-lg uppercase tracking-wide text-ink-900 leading-none">
            CREATIVE LABS
          </span>
        </div>

        <nav aria-label="Membership portal navigation" className="justify-self-center">
          <div ref={listRef} role="tablist" className="flex items-center gap-10">
            {tabs.map((tab, idx) => {
              const isSelected = tab.id === currentValue
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-disabled={tab.disabled || undefined}
                  disabled={tab.disabled}
                  data-tab-id={tab.id}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelect(tab)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={cn(
                    'relative px-0 py-1 font-display font-bold uppercase text-[13px] tracking-[0.06em]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
                    'transition-colors duration-base',
                    isSelected
                      ? 'text-ink-900'
                      : 'text-ink-600 hover:text-ink-900',
                    tab.disabled && 'opacity-40 cursor-not-allowed hover:text-ink-600',
                  )}
                >
                  <span className="relative inline-flex flex-col items-center">
                    <span>{tab.label}</span>
                    {isSelected && (
                      <span className="mt-1.5 h-[2px] w-full bg-cl-blue-700" aria-hidden="true" />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="justify-self-end flex items-center">{trailing}</div>
      </div>
    </header>
  )
}

export default PortalNavbar
