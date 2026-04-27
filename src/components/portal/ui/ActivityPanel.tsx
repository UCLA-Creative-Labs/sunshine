'use client'

import React from 'react'
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx'
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
  title = 'Project activity',
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
          'border-l border-ink-100 bg-cream-50 pt-5 pb-4',
          'font-ui text-[11px] font-medium text-ink-400',
          'hover:text-ink-900 hover:bg-overlay-hover transition-colors duration-fast',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100 focus-visible:ring-inset',
          className,
        )}
      >
        <RxDoubleArrowLeft size={14} />
        <span className="[writing-mode:vertical-rl] rotate-180">Show activity</span>
      </button>
    )
  }

  return (
    <aside
      aria-label={title}
      className={cn(
        'w-[280px] flex-shrink-0 border-l border-ink-100 bg-cream-50 px-5 py-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-ui font-extrabold text-[14px] text-ink-900 leading-none m-0">
          {title}
        </h3>
        {handleHide ? (
          <button
            type="button"
            onClick={handleHide}
            aria-label="Hide project activity"
            title="Hide project activity"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-400 transition-colors hover:text-ink-900 hover:bg-overlay-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-100"
          >
            <RxDoubleArrowRight size={14} />
          </button>
        ) : null}
      </div>

      {hasItems ? (
        <ol className="flex flex-col">
          {items!.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2.5 border-b border-ink-100 py-3 last:border-b-0"
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
                <span className="mt-0.5 block font-code text-[11px] text-ink-400">
                  {item.time}
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="font-ui text-[13px] text-ink-400">
          No recent activity
        </p>
      )}
    </aside>
  )
}

export default ActivityPanel
