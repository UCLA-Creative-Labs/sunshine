'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Avatar, Badge, Input } from '@/components/portal/ui'
import type { BadgeColor } from '@/components/portal/ui'
import {
  getInternalRoster,
  getProjectRosters,
  type InternalRow,
  type Member,
  type ProjectGroup,
  type ProjectMemberRow,
  type ProjectPosition,
} from '@/lib/services/rosterService'

type AccentColor = 'pink' | 'blue' | 'lime' | 'mint' | 'ink'

type InternalTeam =
  | 'presidents'
  | 'senior-advisor'
  | 'projects'
  | 'tech'
  | 'marketing'
  | 'finance'
  | 'design'
  | 'alumni'

const INTERNAL_TEAMS: Array<{
  id: InternalTeam
  label: string
  badgeLabel: string
  eyebrow: string
  blurb: string
  tone: BadgeColor
}> = [
  { id: 'presidents',     label: 'Presidents',         badgeLabel: 'President',  eyebrow: 'exec',         blurb: 'Co-presidents steering club direction and partnerships.',  tone: 'pink' },
  { id: 'senior-advisor', label: 'Senior Advisor',     badgeLabel: 'Advisor',    eyebrow: 'institutional', blurb: 'Continuity + mentorship across generations of the club.',  tone: 'ink'  },
  { id: 'projects',       label: 'Project directors',  badgeLabel: 'Projects',   eyebrow: 'projects',     blurb: 'Oversee the active portfolio and run project reviews.',    tone: 'blue' },
  { id: 'tech',           label: 'Tech board',         badgeLabel: 'Tech',       eyebrow: 'engineering',  blurb: 'Infra, shared tooling, and engineering standards.',        tone: 'blue' },
  { id: 'marketing',      label: 'Marketing team',     badgeLabel: 'Marketing',  eyebrow: 'external',     blurb: 'Brand, comms, socials, and the recruitment funnel.',       tone: 'lime' },
  { id: 'finance',        label: 'Finance team',       badgeLabel: 'Finance',    eyebrow: 'operations',   blurb: 'Budget, sponsorships, and reimbursement flow.',            tone: 'mint' },
  { id: 'design',         label: 'Design team',        badgeLabel: 'Design',     eyebrow: 'craft',        blurb: 'Visual identity, templates, and in-house design reviews.', tone: 'pink' },
  { id: 'alumni',         label: 'Alumni',             badgeLabel: 'Alumni',     eyebrow: 'legacy',       blurb: 'Past members who helped shape the club.',                  tone: 'ink'  },
]

type Scope = 'all' | 'internal' | 'projects'

export default function MembersDirectory() {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<Scope>('all')
  const [internal, setInternal] = useState<InternalRow[]>([])
  const [projects, setProjects] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([getInternalRoster(), getProjectRosters()]).then(
      ([internalRows, projectRows]) => {
        if (cancelled) return
        setInternal(internalRows)
        setProjects(projectRows)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  const q = query.trim().toLowerCase()
  const matches = (m: Member, extra = '') =>
    !q ||
    m.name.toLowerCase().includes(q) ||
    (m.major ?? '').toLowerCase().includes(q) ||
    (m.gradYear ?? '').toLowerCase().includes(q) ||
    extra.toLowerCase().includes(q)

  const internalFiltered = useMemo(
    () => internal.filter((r) => matches(r.member, `${r.title} ${r.team}`)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, internal],
  )

  const projectsFiltered = useMemo(
    () =>
      projects
        .map((p) => ({
          ...p,
          members: p.members.filter((pm) => matches(pm.member, `${pm.position} ${p.name}`)),
        }))
        .filter((p) => p.members.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, projects],
  )

  const showInternal = scope !== 'projects'
  const showProjects = scope !== 'internal'

  const totalMembersUnique = useMemo(() => {
    const ids = new Set<string>()
    internal.forEach((r) => ids.add(r.member.id))
    projects.forEach((p) => p.members.forEach((pm) => ids.add(pm.member.id)))
    return ids.size
  }, [internal, projects])

  const internalCount = showInternal ? internalFiltered.length : 0
  const projectsMemberCount = showProjects
    ? projectsFiltered.reduce((acc, p) => acc + p.members.length, 0)
    : 0

  const hasFilters = Boolean(q) || scope !== 'all'
  const clearFilters = () => {
    setQuery('')
    setScope('all')
  }

  const emptyInternal = showInternal && internalFiltered.length === 0
  const emptyProjects = showProjects && projectsFiltered.length === 0
  const totallyEmpty =
    (scope === 'internal' && emptyInternal) ||
    (scope === 'projects' && emptyProjects) ||
    (scope === 'all' && emptyInternal && emptyProjects)

  return (
    <div className="flex-1 w-full bg-cream-50">
      <section className="border-b border-ink-200 bg-cream-50">
        <div className="mx-auto max-w-[1200px] px-8 md:px-20 pt-14 pb-10 md:pt-20 md:pb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="font-code text-[11px] tracking-[0.08em] text-ink-400">04 / 07</span>
            <span className="font-code text-[11px] tracking-[0.12em] uppercase text-ink-600">
              · everyone here
            </span>
          </div>
          <h1 className="font-display font-bold text-[56px] md:text-[80px] leading-[0.92] tracking-[-0.035em] text-ink-900">
            Members
          </h1>
          <p className="mt-5 font-ui text-lg text-ink-600 max-w-2xl leading-relaxed">
            Internal board + everyone on an active project.{' '}
            <span className="font-code text-[13px] text-ink-400">
              {totalMembersUnique} unique · {internal.length} internal seats · {projects.length} active projects
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] w-full px-8 md:px-20 pt-10 pb-16">
        <FilterBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} />

        <div className="mt-4 flex items-center gap-2 flex-wrap font-code text-[12px] text-ink-600">
          {showInternal && (
            <>
              <span className="text-cl-blue-700 font-bold">{internalCount} internal</span>
              {showProjects && <span className="text-ink-400">·</span>}
            </>
          )}
          {showProjects && (
            <span>
              {projectsMemberCount} project seats across {projectsFiltered.length} project{projectsFiltered.length === 1 ? '' : 's'}
            </span>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-2 font-ui font-bold text-cl-blue-700 hover:underline underline-offset-4"
            >
              clear filters
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-16 flex flex-col items-center gap-2 py-14 text-center">
            <p className="font-accent italic text-[15px] text-ink-400">loading roster…</p>
          </div>
        )}

        {!loading && showInternal && internalFiltered.length > 0 && (
          <section className="mt-10">
            <SectionHeader
              num="A"
              context="club leadership"
              title="Internal board"
              count={internalFiltered.length}
            />
            <div className="space-y-10 mt-2">
              {INTERNAL_TEAMS.map((t, idx) => {
                const rows = internalFiltered
                  .filter((r) => r.team === t.id)
                  .sort((a, b) => {
                    if (a.isDirector !== b.isDirector) return a.isDirector ? -1 : 1
                    return a.member.name.localeCompare(b.member.name)
                  })
                if (rows.length === 0 && t.id !== 'alumni') return null
                return (
                  <TeamBlock
                    key={t.id}
                    index={String(idx + 1).padStart(2, '0')}
                    eyebrow={t.eyebrow}
                    label={t.label}
                    blurb={t.blurb}
                    tone={t.tone}
                    badgeLabel={t.badgeLabel}
                    count={rows.length}
                  >
                    {rows.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rows.map((r) => (
                          <InternalCard key={r.member.id} row={r} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <p className="font-code text-[11px] tracking-[0.12em] uppercase text-ink-400">
                          empty roster
                        </p>
                        <p className="font-ui text-sm text-ink-400 mt-2">
                          Past members will land here once we start tracking them.
                        </p>
                      </div>
                    )}
                  </TeamBlock>
                )
              })}
            </div>
          </section>
        )}

        {!loading && showProjects && projectsFiltered.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              num="B"
              context="by project"
              title="On a project"
              count={projectsFiltered.length}
            />
            <div className="space-y-10 mt-2">
              {projectsFiltered.map((p) => (
                <ProjectBlock key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {!loading && totallyEmpty && (
          <div className="mt-16 flex flex-col items-center gap-4 py-14 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-ink-100 border border-ink-200 flex items-center justify-center">
              <svg
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-ink-400"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div>
              <p className="font-ui font-extrabold text-lg text-ink-900">
                {q ? (
                  <>No members match <span className="text-cl-blue-700">&ldquo;{query}&rdquo;</span></>
                ) : (
                  <>No members in this view</>
                )}
              </p>
              <p className="font-ui text-sm text-ink-600 mt-1">Try clearing filters or a different search term.</p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="font-ui font-bold text-sm text-cl-blue-700 hover:underline underline-offset-4"
            >
              clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({
  num,
  context,
  title,
  count,
}: {
  num: string
  context: string
  title: string
  count?: number
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="font-code text-[11px] tracking-[0.08em] text-ink-400">{num}</span>
          <span className="font-code text-[11px] tracking-[0.12em] uppercase text-ink-600">
            · {context}
          </span>
        </div>
        <h2 className="font-ui font-extrabold text-[30px] leading-none tracking-[-0.02em] text-ink-900 flex items-baseline gap-3">
          {title}
          {typeof count === 'number' && (
            <span className="font-code text-sm text-ink-600 font-normal tracking-normal">({count})</span>
          )}
        </h2>
      </div>
    </div>
  )
}

function FilterBar({
  query,
  setQuery,
  scope,
  setScope,
}: {
  query: string
  setQuery: (v: string) => void
  scope: Scope
  setScope: (v: Scope) => void
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
      <div className="relative flex-1 md:max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <Input
          type="search"
          placeholder="Search members, team, major, project…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search members"
        />
      </div>

      <PillGroup
        value={scope}
        onChange={setScope}
        options={[
          { value: 'all',      label: 'All' },
          { value: 'internal', label: 'Internal' },
          { value: 'projects', label: 'On a project' },
        ]}
      />
    </div>
  )
}

function PillGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <div className="inline-flex items-center gap-1 bg-ink-100/60 rounded-full p-1 shrink-0">
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              'px-3.5 py-1.5 rounded-full font-ui font-bold text-[12px] transition-all duration-200 ' +
              (selected
                ? 'bg-surface-card text-ink-900 shadow-sm'
                : 'text-ink-600 hover:text-ink-900')
            }
            aria-pressed={selected}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function TeamBlock({
  index,
  eyebrow,
  label,
  blurb,
  tone,
  badgeLabel,
  count,
  children,
}: {
  index: string
  eyebrow: string
  label: string
  blurb: string
  tone: BadgeColor
  badgeLabel: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="border-[1.5px] border-dashed border-ink-300 rounded-[14px] p-5 md:p-6">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="font-code text-[11px] tracking-[0.08em] text-ink-400">{index}</span>
            <span className="font-code text-[11px] tracking-[0.12em] uppercase text-ink-600">
              · {eyebrow}
            </span>
          </div>
          <h3 className="font-ui font-extrabold text-[20px] leading-none tracking-[-0.01em] text-ink-900 flex items-baseline gap-2">
            {label}
            <span className="font-code text-xs text-ink-600 font-normal tracking-normal">({count})</span>
          </h3>
          <p className="font-ui text-sm text-ink-600 mt-1.5 leading-snug">{blurb}</p>
        </div>
        <Badge color={tone} className="text-[11px] shrink-0 mb-1">
          {badgeLabel}
        </Badge>
      </div>
      {children}
    </div>
  )
}

function InternalCard({ row }: { row: InternalRow }) {
  const { member, title, isDirector } = row
  return (
    <Link
      href={`#${member.id}`}
      className="group bg-surface-card border border-ink-100 rounded-[12px] p-4 flex items-center gap-3.5 hover:border-ink-300 hover:-translate-y-[2px] shadow-card transition-all duration-fast ease-out hover:shadow-card-hover"
    >
      <Avatar name={member.name} initials={member.initials} color={member.avatarColor} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-ui font-extrabold text-[15px] text-ink-900 leading-tight m-0 truncate">
            {member.name}
          </h4>
          {isDirector && (
            <span className="inline-flex items-center rounded-full bg-cl-blue-700 text-white font-ui font-extrabold text-[9px] px-1.5 py-0.5 tracking-wider uppercase">
              Director
            </span>
          )}
        </div>
        <p className="font-ui text-[13px] text-ink-600 leading-snug mt-0.5 truncate">{title}</p>
        <p className="font-code text-[10px] text-ink-400 mt-1 tracking-wide truncate">
          {member.gradYear ? `Class of ${member.gradYear}` : ''}
          {member.gradYear && member.major ? ' · ' : ''}
          {member.major ?? ''}
        </p>
      </div>
    </Link>
  )
}

const POSITION_ORDER: Record<ProjectPosition, number> = { lead: 0, pm: 1, member: 2 }

function ProjectBlock({ project }: { project: ProjectGroup }) {
  const sorted = [...project.members].sort(
    (a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position],
  )
  const counts = {
    lead:   sorted.filter((m) => m.position === 'lead').length,
    pm:     sorted.filter((m) => m.position === 'pm').length,
    member: sorted.filter((m) => m.position === 'member').length,
  }
  return (
    <div className="relative bg-surface-card border border-ink-100 rounded-[14px] p-5 md:p-6 overflow-hidden">
      <span
        aria-hidden="true"
        className={'absolute left-0 top-0 bottom-0 w-[4px] ' + colorBg(project.logoColor)}
      />
      <div className="flex items-start gap-4 mb-5 pl-1">
        <span
          className={
            'w-11 h-11 rounded-[10px] shrink-0 inline-flex items-center justify-center font-display font-bold text-[22px] text-white leading-none ' +
            colorBg(project.logoColor)
          }
        >
          {project.initial}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-ui font-extrabold text-[20px] text-ink-900 leading-none m-0">
              {project.name}
            </h3>
            <span className="font-code text-[11px] text-ink-400">· {project.quarter}</span>
          </div>
          <p className="font-code text-[11px] text-ink-600 mt-1.5 tracking-wide">
            {counts.lead} lead · {counts.pm} pm · {counts.member} member{counts.member === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-1">
        {sorted.map((pm) => (
          <ProjectMemberCard key={`${project.id}-${pm.member.id}`} row={pm} />
        ))}
      </div>
    </div>
  )
}

function ProjectMemberCard({ row }: { row: ProjectMemberRow }) {
  const { member, position } = row
  return (
    <Link
      href={`#${member.id}`}
      className="group flex items-center gap-3 bg-cream-50 border border-ink-100 rounded-[10px] px-3.5 py-3 hover:border-ink-300 hover:-translate-y-[1px] shadow-card transition-all duration-fast ease-out hover:shadow-card-hover"
    >
      <Avatar name={member.name} initials={member.initials} color={member.avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="font-ui font-bold text-[13px] text-ink-900 leading-tight m-0 truncate">
            {member.name}
          </h4>
          <PositionPill position={position} />
        </div>
        {(member.major || member.gradYear) && (
          <p className="font-code text-[10px] text-ink-400 mt-1 tracking-wide truncate">
            {member.major ?? ''}
            {member.major && member.gradYear ? ' · ' : ''}
            {member.gradYear ? `'${member.gradYear.slice(-2)}` : ''}
          </p>
        )}
      </div>
    </Link>
  )
}

function PositionPill({ position }: { position: ProjectPosition }) {
  if (position === 'lead') {
    return (
      <span className="inline-flex items-center rounded-full bg-cl-blue-700 text-white font-ui font-extrabold text-[9px] px-1.5 py-0.5 tracking-wider uppercase">
        Lead
      </span>
    )
  }
  if (position === 'pm') {
    return (
      <span className="inline-flex items-center rounded-full bg-cl-pink-700 text-white font-ui font-extrabold text-[9px] px-1.5 py-0.5 tracking-wider uppercase">
        PM
      </span>
    )
  }
  return null
}

function colorBg(c: AccentColor): string {
  switch (c) {
    case 'pink': return 'bg-cl-pink-700'
    case 'blue': return 'bg-cl-blue-700'
    case 'lime': return 'bg-cl-lime-700'
    case 'mint': return 'bg-cl-mint-700'
    case 'ink':  return 'bg-ink-900'
  }
}
