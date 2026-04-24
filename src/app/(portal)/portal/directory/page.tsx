'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Avatar, Input } from '@/components/portal/ui'

type AccentColor = 'pink' | 'blue' | 'lime' | 'mint' | 'ink'
type ProjectStatus = 'active' | 'archived'

type Project = {
  id: string
  name: string
  initial: string
  description: string
  quarter: string
  startedAt: number
  logoColor: AccentColor
  status: ProjectStatus
  members: Array<{ name: string; initials?: string; color: AccentColor }>
  overflow: number
}

const PROJECTS: Project[] = [
  {
    id: 'p-bruinbites',
    name: 'BruinBites',
    initial: 'B',
    description: "Can't decide where to eat? A group decision-maker that shortlists 5 spots within walking distance.",
    quarter: 'Winter 25-26',
    startedAt: 20260108,
    logoColor: 'pink',
    status: 'active',
    members: [
      { name: 'MJ Bagaoisan', color: 'blue' },
      { name: 'Aarushi Gupta', color: 'mint' },
      { name: 'Travis Nguyen', color: 'pink' },
    ],
    overflow: 2,
  },
  {
    id: 'p-studybug',
    name: 'Studybug',
    initial: 'S',
    description: "Pomodoro study buddy that shows your cohort's focus streaks — shipped this quarter to the app store.",
    quarter: 'Winter 25-26',
    startedAt: 20260115,
    logoColor: 'blue',
    status: 'active',
    members: [
      { name: 'Travis Nguyen', color: 'blue' },
      { name: 'MJ Bagaoisan', color: 'pink' },
      { name: 'Shawn Lin', color: 'lime' },
    ],
    overflow: 5,
  },
  {
    id: 'p-cohabit',
    name: 'Cohabit',
    initial: 'C',
    description: 'Roommate-matching tool for UCLA transfers. Personality + habit prompts, no LinkedIn-style clout signals.',
    quarter: 'Winter 25-26',
    startedAt: 20260122,
    logoColor: 'ink',
    status: 'active',
    members: [
      { name: 'Cohabit', initials: 'CH', color: 'ink' },
      { name: 'Aarushi Gupta', color: 'mint' },
    ],
    overflow: 3,
  },
  {
    id: 'p-thermosense',
    name: 'ThermoSense',
    initial: 'T',
    description: 'Hardware + firmware sprint. Low-power temperature rig for the Kerckhoff greenhouse pilot.',
    quarter: 'Winter 25-26',
    startedAt: 20260201,
    logoColor: 'blue',
    status: 'active',
    members: [
      { name: 'ThermoSense', initials: 'TS', color: 'lime' },
      { name: 'MJ Bagaoisan', color: 'blue' },
    ],
    overflow: 4,
  },
  {
    id: 'p-alumni-map',
    name: 'Alumni Map',
    initial: 'A',
    description: 'Interactive map of where CL alumni landed. Opt-in pins, city-grained, no PII beyond first name + company.',
    quarter: 'Fall 25-26',
    startedAt: 20250920,
    logoColor: 'lime',
    status: 'archived',
    members: [
      { name: 'Shawn Lin', color: 'lime' },
      { name: 'Travis Nguyen', color: 'blue' },
    ],
    overflow: 1,
  },
  {
    id: 'p-bruinbeats',
    name: 'BruinBeats',
    initial: 'B',
    description: 'Collaborative Spotify playlist tool, auto-generated from the frat-row Friday queue. Shipped, then sunset.',
    quarter: 'Fall 25-26',
    startedAt: 20250915,
    logoColor: 'pink',
    status: 'archived',
    members: [{ name: 'Aarushi Gupta', color: 'mint' }],
    overflow: 2,
  },
  {
    id: 'p-nightsprint',
    name: 'NightSprint',
    initial: 'N',
    description: 'Late-night study check-ins for YRL. Never got past the pilot but the figma file is a treasure.',
    quarter: 'Spring 24-25',
    startedAt: 20250410,
    logoColor: 'pink',
    status: 'archived',
    members: [{ name: 'MJ Bagaoisan', color: 'blue' }],
    overflow: 0,
  },
  {
    id: 'p-classwatch',
    name: 'ClassWatch',
    initial: 'C',
    description: 'Registrar-seat-opening notifier. Ran one enrollment cycle before MyUCLA changed their endpoints on us.',
    quarter: 'Spring 24-25',
    startedAt: 20250405,
    logoColor: 'blue',
    status: 'archived',
    members: [{ name: 'Travis Nguyen', color: 'blue' }],
    overflow: 3,
  },
  {
    id: 'p-takeover-tracker',
    name: 'Takeover Tracker',
    initial: 'T',
    description: 'IG-story takeover schedule + analytics for Creative Labs + partner orgs during rush week.',
    quarter: 'Winter 24-25',
    startedAt: 20250120,
    logoColor: 'lime',
    status: 'archived',
    members: [{ name: 'Shawn Lin', color: 'lime' }],
    overflow: 1,
  },
  {
    id: 'p-slugprint',
    name: 'SlugPrint',
    initial: 'S',
    description: "Physical zine issue #3 — interviews with CL alumni now at Figma, Warby, and a solo studio in Brooklyn.",
    quarter: 'Fall 24-25',
    startedAt: 20240920,
    logoColor: 'lime',
    status: 'archived',
    members: [{ name: 'Aarushi Gupta', color: 'mint' }],
    overflow: 2,
  },
  {
    id: 'p-cycleshare',
    name: 'CycleShare',
    initial: 'C',
    description: 'Campus-cycle pickup pitch to UCLA Transportation. Deck, financial model, pilot-zone plan.',
    quarter: 'Fall 24-25',
    startedAt: 20240915,
    logoColor: 'mint',
    status: 'archived',
    members: [{ name: 'MJ Bagaoisan', color: 'blue' }],
    overflow: 1,
  },
  {
    id: 'p-campus-cooker',
    name: 'Campus Cooker',
    initial: 'C',
    description: 'Meal-kit prototype tuned to dorm microwaves. Two tasting rounds, one failed crowdfund, great memory.',
    quarter: 'Spring 23-24',
    startedAt: 20240410,
    logoColor: 'mint',
    status: 'archived',
    members: [{ name: 'Shawn Lin', color: 'lime' }],
    overflow: 0,
  },
]

type SortMode = 'newest' | 'alpha' | 'quarter'
type ViewMode = 'grid' | 'list'
type StatusFilter = 'all' | ProjectStatus

export default function ProjectDirectory() {
  const [query, setQuery]   = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort]     = useState<SortMode>('newest')
  const [view, setView]     = useState<ViewMode>('grid')

  const filtered = useMemo(() => {
    let list = PROJECTS
    if (status !== 'all') list = list.filter((p) => p.status === status)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }
    list = [...list].sort((a, b) => {
      if (sort === 'alpha')   return a.name.localeCompare(b.name)
      if (sort === 'quarter') return b.quarter.localeCompare(a.quarter)
      return b.startedAt - a.startedAt
    })
    return list
  }, [query, status, sort])

  const activeList   = filtered.filter((p) => p.status === 'active')
  const archivedList = filtered.filter((p) => p.status === 'archived')

  const total          = PROJECTS.length
  const totalActive    = PROJECTS.filter((p) => p.status === 'active').length
  const totalArchived  = total - totalActive

  const hasFilters = Boolean(query.trim()) || status !== 'all'
  const clearFilters = () => {
    setQuery('')
    setStatus('all')
  }

  return (
    <div className="flex-1 w-full bg-cream-50">
      <section className="border-b border-ink-200 bg-cream-50">
        <div className="mx-auto max-w-[1200px] px-8 md:px-20 pt-14 pb-10 md:pt-20 md:pb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="font-code text-[11px] tracking-[0.08em] text-ink-400">07 / 07</span>
            <span className="font-code text-[11px] tracking-[0.12em] uppercase text-ink-600">
              · browse + discover
            </span>
          </div>
          <h1 className="font-display font-bold text-[56px] md:text-[80px] leading-[0.92] tracking-[-0.035em] text-ink-900">
            Projects
          </h1>
          <p className="mt-5 font-ui text-lg text-ink-600 max-w-2xl leading-relaxed">
            Browse and discover ongoing and completed Creative Labs projects.{' '}
            <span className="font-code text-[13px] text-ink-400">
              {total} total · {totalActive} active · {totalArchived} archived
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] w-full px-8 md:px-20 pt-10 pb-16">
        <FilterBar
          query={query} setQuery={setQuery}
          status={status} setStatus={setStatus}
          sort={sort} setSort={setSort}
          view={view} setView={setView}
        />

        <div className="mt-4 flex items-center gap-2 flex-wrap font-code text-[12px] text-ink-600">
          <span>
            {filtered.length} of {total} projects
          </span>
          <span className="text-ink-400">·</span>
          <span className="text-cl-blue-700 font-bold">{activeList.length} active</span>
          <span className="text-ink-400">·</span>
          <span>{archivedList.length} archived</span>
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

        {activeList.length > 0 && (
          <section className="mt-10">
            <SectionHeader
              num="A"
              context="in-progress"
              title="Active projects"
              count={activeList.length}
            />
            <ProjectList projects={activeList} view={view} />
          </section>
        )}

        {archivedList.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              num="B"
              context="shipped + archived"
              title="Archive"
              count={archivedList.length}
            />
            <ProjectList projects={archivedList} view={view} />
          </section>
        )}

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-4 py-14 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-cream-100 border border-ink-200 flex items-center justify-center">
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
                {query ? (
                  <>No projects match <span className="text-cl-blue-700">&ldquo;{query}&rdquo;</span></>
                ) : (
                  <>No projects in this view</>
                )}
              </p>
              <p className="font-ui text-sm text-ink-600 mt-1">
                Try clearing filters or a different search term.
              </p>
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
  query, setQuery,
  status, setStatus,
  sort, setSort,
  view, setView,
}: {
  query: string
  setQuery: (v: string) => void
  status: StatusFilter
  setStatus: (v: StatusFilter) => void
  sort: SortMode
  setSort: (v: SortMode) => void
  view: ViewMode
  setView: (v: ViewMode) => void
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
          placeholder="Search projects, team, or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search projects"
        />
      </div>

      <PillGroup
        value={status}
        onChange={setStatus}
        options={[
          { value: 'all',      label: 'All' },
          { value: 'active',   label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <div className="flex items-center gap-2 md:ml-auto">
        <label className="font-code text-[11px] tracking-[0.08em] uppercase text-ink-600 shrink-0">
          sort
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="font-ui text-sm bg-surface-card border border-ink-200 rounded-md px-3 py-[7px] text-ink-900 focus:outline-none focus:border-cl-blue-700 focus:ring-1 focus:ring-cl-blue-700/30"
          aria-label="Sort projects"
        >
          <option value="newest">Newest</option>
          <option value="alpha">Alphabetical</option>
          <option value="quarter">Quarter</option>
        </select>

        <ViewToggle value={view} onChange={setView} />
      </div>
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

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const btn = (mode: ViewMode, label: string, icon: React.ReactNode) => {
    const selected = mode === value
    return (
      <button
        key={mode}
        type="button"
        onClick={() => onChange(mode)}
        aria-label={`${label} view`}
        aria-pressed={selected}
        className={
          'w-8 h-8 rounded-md inline-flex items-center justify-center transition-colors ' +
          (selected
            ? 'bg-ink-900 text-white'
            : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100')
        }
      >
        {icon}
      </button>
    )
  }
  return (
    <div className="inline-flex items-center gap-1 shrink-0">
      {btn(
        'grid',
        'Grid',
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>,
      )}
      {btn(
        'list',
        'List',
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="1" y="2" width="14" height="2" rx="1" />
          <rect x="1" y="7" width="14" height="2" rx="1" />
          <rect x="1" y="12" width="14" height="2" rx="1" />
        </svg>,
      )}
    </div>
  )
}

function ProjectList({ projects, view }: { projects: Project[]; view: ViewMode }) {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
        {projects.map((p) => (
          <ProjectListRow key={p.id} project={p} />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}

function ProjectCard({ project: p }: { project: Project }) {
  const accent = p.logoColor
  return (
    <Link
      href={`#${p.id}`}
      className="group relative bg-surface-card border border-ink-100 rounded-[12px] p-5 pl-6 flex flex-col gap-3.5 min-h-[200px] hover:border-ink-300 hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={'absolute left-0 top-0 bottom-0 w-[4px] ' + colorBg(accent)}
      />
      <div className="flex items-center gap-3">
        <span
          className={
            'w-10 h-10 rounded-[10px] shrink-0 inline-flex items-center justify-center font-display font-bold text-lg text-white leading-none ' +
            colorBg(accent)
          }
        >
          {p.initial}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-ui font-extrabold text-[17px] text-ink-900 leading-[1.2] m-0 truncate">
            {p.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-cream-100 text-ink-900 font-code text-[10px] px-2 py-0.5 tracking-wide">
              {p.quarter}
            </span>
          </div>
        </div>
      </div>
      <p className="font-ui text-sm text-ink-600 leading-[1.45] m-0 line-clamp-2">
        {p.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <AvatarCluster members={p.members} overflow={p.overflow} />
        <span className="font-ui text-[13px] font-bold text-cl-blue-700 group-hover:underline underline-offset-4">
          Open →
        </span>
      </div>
    </Link>
  )
}

function ProjectListRow({ project: p }: { project: Project }) {
  const accent = p.logoColor
  return (
    <Link
      href={`#${p.id}`}
      className="group relative flex items-center gap-4 bg-surface-card border border-ink-100 rounded-[12px] pl-6 pr-5 py-4 hover:border-ink-300 hover:-translate-y-[1px] hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={'absolute left-0 top-0 bottom-0 w-[4px] ' + colorBg(accent)}
      />
      <span
        className={
          'w-9 h-9 rounded-[10px] shrink-0 inline-flex items-center justify-center font-display font-bold text-base text-white leading-none ' +
          colorBg(accent)
        }
      >
        {p.initial}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-ui font-extrabold text-[15px] text-ink-900 leading-none m-0 truncate">
            {p.name}
          </h3>
          <span className="font-code text-[11px] text-ink-400">· {p.quarter}</span>
        </div>
        <p className="font-ui text-sm text-ink-600 mt-1 leading-[1.4] m-0 truncate">
          {p.description}
        </p>
      </div>
      <AvatarCluster members={p.members} overflow={p.overflow} />
      <span className="font-ui text-[13px] font-bold text-cl-blue-700 shrink-0 group-hover:underline underline-offset-4">
        Open →
      </span>
    </Link>
  )
}

function AvatarCluster({
  members,
  overflow,
}: {
  members: Project['members']
  overflow: number
}) {
  return (
    <div className="flex items-center shrink-0">
      <div className="flex -space-x-2">
        {members.map((m) => (
          <Avatar
            key={m.name}
            name={m.name}
            initials={m.initials}
            color={m.color}
            size="xs"
            className="ring-2 ring-white w-7 h-7 text-[10px]"
          />
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-1 inline-flex items-center justify-center rounded-full w-7 h-7 bg-ink-100 text-ink-900 font-ui font-extrabold text-[10px] ring-2 ring-white">
          +{overflow}
        </span>
      )}
    </div>
  )
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
