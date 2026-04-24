import React from 'react'
import { cn } from './cn'
import { Avatar } from './Avatar'
import { AvatarColor } from './avatar-utils'

export type ProjectHeaderLead = {
  name: string
  color?: AvatarColor
  src?: string | null
}

export interface ProjectHeaderBandProps {
  projectName: string
  eyebrowNumber?: string
  eyebrowState?: string
  subtitle?: string
  term?: string
  leads?: ProjectHeaderLead[]
  memberCount?: number
  githubUrl?: string | null
  actions?: React.ReactNode
  className?: string
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="flex-shrink-0"
    >
      <path
        d="M4 2h6v6M10 2l-6 6M2 5v5h5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ProjectHeaderBand({
  projectName,
  eyebrowNumber,
  eyebrowState,
  subtitle,
  term,
  leads,
  memberCount,
  githubUrl,
  actions,
  className,
}: ProjectHeaderBandProps) {
  const hasEyebrow = Boolean(eyebrowNumber || eyebrowState)
  const hasSubtitle = Boolean(subtitle || term)
  const leadsCount = leads?.length ?? 0
  const showLeadsRow = leadsCount > 0 || (memberCount !== undefined && memberCount > 0)
  const hasCustomActions = Boolean(actions)
  const showGithubLink = Boolean(githubUrl)
  const showActionsColumn = hasCustomActions || showGithubLink

  return (
    <header
      className={cn(
        'flex flex-col gap-6 border-b-[1.5px] border-ink-200 bg-cream-50 px-5 py-6',
        'md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-7',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {hasEyebrow ? (
          <div className="flex items-center gap-2.5">
            {eyebrowNumber ? (
              <span className="font-code text-[11px] text-ink-400">{eyebrowNumber}</span>
            ) : null}
            {eyebrowNumber && eyebrowState ? (
              <span className="text-ink-300">·</span>
            ) : null}
            {eyebrowState ? (
              <span className="font-code text-[11px] uppercase tracking-[0.12em] text-ink-600">
                {eyebrowState}
              </span>
            ) : null}
          </div>
        ) : null}

        <h1 className="font-display font-bold uppercase tracking-[-0.025em] leading-[0.9] text-ink-900 text-5xl md:text-6xl lg:text-7xl">
          {projectName}
        </h1>

        {hasSubtitle ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {subtitle ? <span className="text-[15px] text-ink-600">{subtitle}</span> : null}
            {term ? (
              <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-100 px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.06em] text-ink-900">
                {term}
              </span>
            ) : null}
          </div>
        ) : null}

        {showLeadsRow ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-code text-[11px] uppercase tracking-[0.12em] text-ink-600">
              Leads
            </span>
            {leadsCount > 0 ? (
              <>
                <span className="inline-flex">
                  {leads!.map((lead, i) => (
                    <Avatar
                      key={`${lead.name}-${i}`}
                      name={lead.name}
                      color={lead.color}
                      src={lead.src ?? undefined}
                      size="sm"
                      className={cn('ring-2 ring-cream-50', i > 0 && '-ml-2')}
                    />
                  ))}
                </span>
                <span className="text-sm font-medium text-ink-900">
                  {leads!.map((l) => l.name).join(', ')}
                </span>
              </>
            ) : (
              <span className="font-code text-[12px] uppercase tracking-[0.06em] text-ink-400">
                not yet assigned
              </span>
            )}
            {typeof memberCount === 'number' && memberCount > 0 ? (
              <>
                <span className="text-ink-300">·</span>
                <span className="text-sm text-ink-600">
                  + {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {showActionsColumn ? (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
          {showGithubLink ? (
            <a
              href={githubUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-2 font-ui text-[13px] font-semibold text-ink-600 transition-colors hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900"
            >
              view on github
              <ExternalLinkIcon />
            </a>
          ) : null}
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export default ProjectHeaderBand
