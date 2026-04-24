'use client'

import React, { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from './cn'

export type SidebarItem = {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

export interface SidebarProps {
  items: SidebarItem[]
  header?: React.ReactNode
  ariaLabel?: string
  className?: string
}

export function Sidebar({
  items,
  header,
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
        'flex min-h-screen w-60 flex-col border-r-2 border-border-default bg-surface-card px-6 py-6',
        className,
      )}
    >
      {header ? <div className="mt-4 mb-12">{header}</div> : null}

      <nav className="flex flex-col gap-2" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-ui font-semibold',
                'transition-colors duration-base',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
                isActive
                  ? 'bg-interactive-subtle text-interactive'
                  : 'text-text-secondary hover:bg-cream-100 hover:text-text-primary',
              )}
            >
              {Icon ? <Icon size={20} /> : null}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
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
      <span className="font-display text-2xl leading-tight text-cl-purple-700">
        {title}
      </span>
    </div>
  )
}
