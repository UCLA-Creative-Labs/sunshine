import React from 'react'
import { cn } from './cn'
import { Avatar } from './Avatar'
import { AvatarColor } from './avatar-utils'

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
}

export function ActivityPanel({
  items,
  title = 'Project Activity',
  onHide,
  className,
}: ActivityPanelProps) {
  const hasItems = items && items.length > 0

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
        {onHide ? (
          <button
            type="button"
            onClick={onHide}
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