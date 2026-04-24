'use client'

import React from 'react'
import { RxDoubleArrowLeft } from 'react-icons/rx'
import { cn } from './cn'
import { Avatar } from './Avatar'
import { AvatarColor } from './avatar-utils'
import { useUIStateOptional } from './UIStateProvider'

export type ActivityItem = {
  id: string
  actor: string
  actorColor?: AvatarColor
  actorAvatarSrc?: string | null
  text: React.ReactNode
  time: string
}

export interface ActivityPanelProps {
  items?: ActivityItem[]
  title?: string
  onHide?: () => void
  className?: string
  controlled?: boolean
}

export function ActivityPanel({
  items,
  title = 'Project Activity',
  onHide,
  className,
  controlled = false,
}: ActivityPanelProps) {
  const hasItems = items && items.length > 0
  const ui = useUIStateOptional()
  const isHidden = controlled && ui ? ui.activityHidden : false
  const handleHide = controlled && ui ? ui.toggleActivity : onHide
  const handleShow = controlled && ui ? ui.toggleActivity : undefined

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={handleShow}
        aria-label="Show project activity"
        title="Show project activity"
        className={cn(
          'flex w-[32px] flex-shrink-0 flex-col items-center justify-start gap-3',
          'border-l-[1.5px] border-ink-200 bg-cream-50 pt-5 pb-4',
          'font-code text-[10px] uppercase tracking-[0.12em] text-ink-400',
          'hover:text-ink-600 hover:bg-ink-100 transition-colors duration-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100 focus-visible:ring-inset',
          className,
        )}
      >
        <RxDoubleArrowLeft size={14} />
        <span className="[writing-mode:vertical-rl] rotate-180">show activity</span>
      </button>
    )
  }

  return (
    <aside
      aria-label={title}
      className={cn(
        'w-[280px] flex-shrink-0 border-l-[1.5px] border-ink-200 bg-cream-50 px-5 py-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-sm font-bold uppercase tracking-[0.06em] text-ink-900">
          {title}
        </span>
        {handleHide ? (
          <button
            type="button"
            onClick={handleHide}
            className="font-code text-[11px] text-ink-400 hover:text-ink-600"
          >
            hide →
          </button>
        ) : null}
      </div>

      {hasItems ? (
        <ol className="flex flex-col">
          {items!.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2.5 border-b border-ink-200 py-3 last:border-b-0"
            >
              <Avatar
                name={item.actor}
                color={item.actorColor}
                src={item.actorAvatarSrc ?? undefined}
                size="xs"
              />
              <div className="min-w-0 flex-1 text-[13px] leading-[1.4] text-ink-900">
                <span className="font-semibold">{item.actor}</span>{' '}
                {item.text}
                <span className="mt-0.5 block font-code text-[10px] uppercase tracking-[0.04em] text-ink-400">
                  {item.time}
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
          no recent activity
        </p>
      )}
    </aside>
  )
}

export default ActivityPanel
