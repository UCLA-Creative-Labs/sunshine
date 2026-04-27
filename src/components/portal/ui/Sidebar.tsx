'use client'

import React, { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx'
import { cn } from './cn'
import { useUIStateOptional } from './UIStateProvider'

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
  collapsible?: boolean
}

export function Sidebar({
  items,
  header,
  label,
  footer,
  ariaLabel = 'Portal sections',
  className,
  collapsible = false,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const ui = useUIStateOptional()
  const collapsed = collapsible && ui ? ui.sidebarCollapsed : false

  const handleSelect = useCallback(
    (item: SidebarItem) => {
      if (pathname !== item.href) router.push(item.href)
    },
    [pathname, router],
  )

  return (
    <aside
      className={cn(
        'flex min-h-full flex-col border-r-[1.5px] border-ink-200 bg-cream-50 py-5 pb-4 transition-[width] duration-fast',
        collapsed ? 'w-[60px]' : 'w-[220px]',
        className,
      )}
    >
      {header ? (
        <div className={cn('mb-8', collapsed ? 'px-2 flex justify-center' : 'px-4')}>
          {header}
        </div>
      ) : null}

      {label && !collapsed ? (
        <div className="mb-3 px-4 font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">
          {label}
        </div>
      ) : null}

      <nav
        className={cn('flex flex-col gap-1', collapsed ? 'px-2' : 'px-3')}
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center rounded-lg py-3',
                'font-display text-[13px] font-bold uppercase tracking-[0.06em]',
                'transition-colors duration-fast',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
                collapsed ? 'justify-center px-0' : 'gap-2.5 px-[14px]',
                isActive
                  ? 'bg-cl-blue-100 text-cl-blue-700'
                  : 'text-ink-400 hover:bg-overlay-hover hover:text-ink-600',
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-sm bg-cl-blue-700"
                />
              ) : null}
              {item.icon ?? null}
              {!collapsed ? <span>{item.label}</span> : null}
            </button>
          )
        })}
      </nav>

      {collapsible && ui ? (
        <div className="mt-auto">
          <div className={cn('my-4 h-px bg-ink-100', collapsed ? 'mx-2' : 'mx-4')} />
          <div className={cn(collapsed ? 'px-2 flex justify-center' : 'px-4')}>
            <button
              type="button"
              onClick={ui.toggleSidebar}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'flex items-center rounded-md py-2',
                'font-code text-[11px] uppercase tracking-[0.12em] text-ink-400 hover:text-ink-600 hover:bg-overlay-hover',
                'transition-colors duration-fast',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100',
                collapsed ? 'w-full justify-center px-0' : 'gap-2 px-[10px]',
              )}
            >
              {collapsed ? (
                <RxDoubleArrowRight size={16} />
              ) : (
                <>
                  <RxDoubleArrowLeft size={14} />
                  <span>collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : footer ? (
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
