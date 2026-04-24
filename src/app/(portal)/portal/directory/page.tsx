'use client'

import { useEffect, useMemo, useState } from 'react'
import { RxGithubLogo, RxFigmaLogo, RxExternalLink, RxCross2 } from 'react-icons/rx'
import { Avatar, Input } from '@/components/portal/ui'
import { getPublicProjectDirectory, type DirectoryProject, type DirectoryPerson } from '@/lib/services/rosterService'

type AccentColor = 'pink' | 'blue' | 'lime' | 'mint' | 'ink'
type ProjectStatus = 'active' | 'archived'
type Project = DirectoryProject

type SortMode = 'newest' | 'alpha' | 'quarter'
type ViewMode = 'grid' | 'list'
type StatusFilter = 'all' | ProjectStatus

export default function ProjectDirectory() {
  const [query, setQuery]       = useState('')
  const [status, setStatus]     = useState<StatusFilter>('all')
  const [sort, setSort]         = useState<SortMode>('newest')
  const [view, setView]         = useState<ViewMode>('grid')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Project | null>(null)

  useEffect(() => {
    let cancelled = false
    getPublicProjectDirectory().then((list) => {
      if (cancelled) return
      setProjects(list)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const filtered = useMemo(() => {
    let list = projects
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
  }, [projects, query, status, sort])

  const activeList   = filtered.filter((p) => p.status === 'active')
  const archivedList = filtered.filter((p) => p.status === 'archived')

  const total         = projects.length
  const totalActive   = projects.filter((p) => p.status === 'active').length
  const totalArchived = total - totalActive

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

        {loading && (
          <div className="mt-16 flex flex-col items-center gap-2 py-14 text-center">
            <p className="font-accent italic text-[15px] text-ink-400">loading projects…</p>
          </div>
        )}

        {!loading && activeList.length > 0 && (
          <section className="mt-10">
            <SectionHeader
              num="A"
              context="in-progress"
              title="Active projects"
              count={activeList.length}
            />
            <ProjectList projects={activeList} view={view} onOpen={setSelected} />
          </section>
        )}

        {!loading && archivedList.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              num="B"
              context="shipped + archived"
              title="Archive"
              count={archivedList.length}
            />
            <ProjectList projects={archivedList} view={view} onOpen={setSelected} />
          </section>
        )}

        {!loading && filtered.length === 0 && (
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

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
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

function ProjectList({ projects, view, onOpen }: { projects: Project[]; view: ViewMode; onOpen: (p: Project) => void }) {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
        {projects.map((p) => (
          <ProjectListRow key={p.id} project={p} onOpen={onOpen} />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onOpen={onOpen} />
      ))}
    </div>
  )
}

function ProjectCard({ project: p, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const accent = p.logoColor
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className="group relative text-left bg-surface-card border border-ink-100 rounded-[12px] p-5 pl-6 flex flex-col gap-3.5 min-h-[200px] hover:border-ink-300 hover:-translate-y-[2px] shadow-card transition-all duration-fast ease-out hover:shadow-card-hover overflow-hidden"
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
            <span className="inline-flex items-center rounded-full bg-ink-100 text-ink-900 font-code text-[10px] px-2 py-0.5 tracking-wide">
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
          View →
        </span>
      </div>
    </button>
  )
}

function ProjectListRow({ project: p, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const accent = p.logoColor
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className="group relative text-left w-full flex items-center gap-4 bg-surface-card border border-ink-100 rounded-[12px] pl-6 pr-5 py-4 hover:border-ink-300 hover:-translate-y-[1px] shadow-card transition-all duration-fast ease-out hover:shadow-card-hover overflow-hidden"
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
        View →
      </span>
    </button>
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

function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const accent = project.logoColor
  const links = [
    project.githubUrl ? { label: 'GitHub', href: project.githubUrl, Icon: RxGithubLogo } : null,
    project.figmaUrl ? { label: 'Figma', href: project.figmaUrl, Icon: RxFigmaLogo } : null,
    project.demoUrl ? { label: 'Demo', href: project.demoUrl, Icon: RxExternalLink } : null,
  ].filter(Boolean) as { label: string; href: string; Icon: React.ComponentType<{ size?: number }> }[]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-surface-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 hover:text-ink-900"
        >
          <RxCross2 size={18} />
        </button>

        <div className={'h-2 w-full rounded-t-2xl ' + colorBg(accent)} />

        <div className="px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8">
          <div className="flex items-start gap-3">
            <span
              className={
                'w-12 h-12 rounded-[10px] shrink-0 inline-flex items-center justify-center font-display font-bold text-xl text-white leading-none ' +
                colorBg(accent)
              }
            >
              {project.initial}
            </span>
            <div className="min-w-0 flex-1 pr-8">
              <h2
                id="project-modal-title"
                className="font-ui font-extrabold text-[22px] leading-tight text-ink-900 m-0"
              >
                {project.name}
              </h2>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-ink-100 text-ink-900 font-code text-[10px] px-2 py-0.5 tracking-wide">
                  {project.quarter}
                </span>
                <span
                  className={
                    'inline-flex items-center rounded-full font-code text-[10px] px-2 py-0.5 tracking-wide ' +
                    (project.status === 'active'
                      ? 'bg-cl-blue-100 text-cl-blue-700'
                      : 'bg-ink-100 text-ink-600')
                  }
                >
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-code text-[10px] uppercase tracking-[0.14em] text-ink-400">
              description
            </p>
            {project.description ? (
              <p className="mt-1.5 font-ui text-sm leading-relaxed text-ink-900 whitespace-pre-wrap">
                {project.description}
              </p>
            ) : (
              <p className="mt-1.5 font-ui text-sm italic text-ink-400">
                No description yet.
              </p>
            )}
          </div>

          <div className="mt-5">
            <p className="font-code text-[10px] uppercase tracking-[0.14em] text-ink-400">
              links
            </p>
            {links.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {links.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-surface-card px-3.5 py-1.5 font-ui text-[13px] font-bold text-ink-900 hover:bg-ink-50"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 font-ui text-sm italic text-ink-400">
                No links set.
              </p>
            )}
          </div>

          <MemberGroup title="Leads" people={project.leads} emptyLabel="No leads listed" />
          <MemberGroup title="Members" people={project.otherMembers} emptyLabel="No members listed" />
        </div>
      </div>
    </div>
  )
}

function MemberGroup({
  title,
  people,
  emptyLabel,
}: {
  title: string
  people: DirectoryPerson[]
  emptyLabel: string
}) {
  return (
    <div className="mt-5">
      <div className="flex items-baseline gap-2">
        <p className="font-code text-[10px] uppercase tracking-[0.14em] text-ink-400">
          {title.toLowerCase()}
        </p>
        <span className="font-code text-[10px] text-ink-400">({people.length})</span>
      </div>
      {people.length === 0 ? (
        <p className="mt-1.5 font-ui text-sm italic text-ink-400">{emptyLabel}</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {people.map((m) => (
            <li key={m.name} className="flex items-center gap-2.5">
              <Avatar name={m.name} initials={m.initials} color={m.color} size="xs" className="w-7 h-7 text-[10px]" />
              <span className="font-ui text-sm text-ink-900">{m.name}</span>
            </li>
          ))}
        </ul>
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
