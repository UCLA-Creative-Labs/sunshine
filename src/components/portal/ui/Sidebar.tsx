'use client'

import React, { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from './cn'

export type SidebarItem = {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
}

export interface SidebarProps {
  items: SidebarItem[]
  header?: React.ReactNode
  label?: string
  footer?: React.ReactNode
  ariaLabel?: string
  className?: string
}

export function Sidebar({
  items,
  header,
  label,
  footer,
  ariaLabel = 'Portal sections',
  className,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSelect = useCallback(
    (item: SidebarItem) => {
      if (pathname !== item.href) router.push(item.href)
    },
    [pathname, router],
  )

  return (
    <aside
      className={cn(
        'flex w-[220px] min-h-full flex-col border-r-[1.5px] border-ink-200 bg-cream-50 py-5 pb-4',
        className,
      )}
    >
      {header ? <div className="mb-8 px-4">{header}</div> : null}

      {label ? (
        <div className="mb-3 px-4 font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">
          {label}
        </div>
      ) : null}

      <nav className="flex flex-col gap-1 px-3" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-2.5 rounded-lg px-[14px] py-3',
                'font-display text-[13px] font-bold uppercase tracking-[0.06em]',
                'transition-colors duration-fast',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
                isActive
                  ? 'bg-cl-blue-100 text-cl-blue-700'
                  : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-sm bg-cl-blue-700"
                />
              ) : null}
              {item.icon ?? null}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {footer ? (
        <>
          <div className="mx-4 my-4 h-px bg-ink-200" />
          <div className="px-4 font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">
            {footer}
          </div>
        </>
      ) : null}
    </aside>
  )
}

export default Sidebar

export type SidebarHeaderProps = {
  title: string
  logoUrl?: string
}

export function SidebarHeader({ title, logoUrl }: SidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="" className="h-full w-full object-contain" />
        </div>
      ) : null}
      <span className="font-display text-2xl leading-tight tracking-wide uppercase text-cl-blue-700">
        {title}
      </span>
    </div>
  )
}
