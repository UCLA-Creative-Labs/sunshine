import DashboardHero from '@/components/portal/DashboardHero'
import Link from 'next/link'
import { Avatar, Badge, Card } from '@/components/portal/ui'
import type { BadgeColor } from '@/components/portal/ui'

type AccentColor = 'pink' | 'blue' | 'lime' | 'mint' | 'ink'

type ActivityRow = {
  id: string
  avatar:
    | { kind: 'user'; name: string; color: AccentColor; initials?: string }
    | { kind: 'group'; count: number; color: AccentColor }
    | { kind: 'project'; name: string; color: AccentColor; initials: string }
  body: React.ReactNode
  timestamp: string
  chip: { label: string; tone: BadgeColor }
}

const ACTIVITY: ActivityRow[] = [
  {
    id: 'a1',
    avatar: { kind: 'user', name: 'Travis Nguyen', color: 'blue' },
    body: (
      <>
        <b className="font-semibold text-ink-900">Travis Nguyen</b>
        <span className="text-ink-600"> shipped Studybug — final demo posted</span>
      </>
    ),
    timestamp: '2h ago',
    chip: { label: 'Shipping', tone: 'mint' },
  },
  {
    id: 'a2',
    avatar: { kind: 'group', count: 3, color: 'blue' },
    body: (
      <>
        <b className="font-semibold text-ink-900">3 new members</b>
        <span className="text-ink-600"> joined this week</span>
      </>
    ),
    timestamp: '1d ago',
    chip: { label: 'Community', tone: 'pink' },
  },
  {
    id: 'a3',
    avatar: { kind: 'project', name: 'ThermoSense', color: 'lime', initials: 'TS' },
    body: (
      <>
        <b className="font-semibold text-ink-900">ThermoSense</b>
        <span className="text-ink-600"> posted a sprint update</span>
      </>
    ),
    timestamp: '1d ago',
    chip: { label: 'Update', tone: 'blue' },
  },
  {
    id: 'a4',
    avatar: { kind: 'user', name: 'Aarushi Gupta', color: 'mint' },
    body: (
      <>
        <b className="font-semibold text-ink-900">Aarushi Gupta</b>
        <span className="text-ink-600"> added 4 tasks to BruinBites</span>
      </>
    ),
    timestamp: '2d ago',
    chip: { label: 'Activity', tone: 'ink' },
  },
  {
    id: 'a5',
    avatar: { kind: 'project', name: 'Cohabit', color: 'ink', initials: 'CH' },
    body: (
      <>
        <b className="font-semibold text-ink-900">Cohabit</b>
        <span className="text-ink-600"> moved 2 tasks to Done</span>
      </>
    ),
    timestamp: '3d ago',
    chip: { label: 'Done', tone: 'mint' },
  },
]

type Announcement = {
  id: string
  index: string
  author: string
  role: string
  authorInitials: string
  authorColor: AccentColor
  title: string
  body: string
  tilt?: boolean
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'an1',
    index: '// announcement 01',
    author: 'Cecilia Liu',
    role: 'Internal',
    authorInitials: 'CL',
    authorColor: 'pink',
    title: 'Demo Day is May 17 — submit projects by May 10',
    body: "We're booking Kerckhoff Grand Salon again. If your project is shipping this quarter, fill out the submission form so we can prep signage and demo tables.",
  },
  {
    id: 'an2',
    index: '// announcement 02',
    author: 'MJ Bagaoisan',
    role: 'Officers',
    authorInitials: 'MB',
    authorColor: 'blue',
    title: 'Spring recruitment apps open next Monday',
    body: 'Project Lead applications go live on Apr 28; member apps follow on May 5. Draft your project proposals this weekend so we can review early.',
    tilt: true,
  },
  {
    id: 'an3',
    index: '// announcement 03',
    author: 'Travis Nguyen',
    role: 'Studybug',
    authorInitials: 'TN',
    authorColor: 'blue',
    title: 'Studybug is live on the app store — 🎉',
    body: 'First Creative Labs project to ship publicly this year. Huge thanks to the eight-person crew who carried it across the line. Retro notes in Notion.',
  },
]

type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'
type Task = {
  id: string
  title: string
  project: string
  statusLabel: string
  status: TaskStatus
  due: string
  dueSoon: boolean
}

const TASKS: Task[] = [
  { id: 't1', title: 'Wireframe onboarding flow', project: 'BruinBites', statusLabel: 'In Review',   status: 'in-review',   due: 'Due tue', dueSoon: true  },
  { id: 't2', title: 'Review sprint 3 PRs',        project: 'Studybug',   statusLabel: 'In Progress', status: 'in-progress', due: 'Due thu', dueSoon: true  },
  { id: 't3', title: 'Draft kickoff doc',          project: 'Cohabit',    statusLabel: 'Todo',        status: 'todo',        due: 'Jul 12',  dueSoon: false },
]

type ProjectRole = 'Project Lead' | 'Project Member'
type ProjectMeta = {
  id: string
  name: string
  initial: string
  logoColor: AccentColor
  quarter: string
  role: ProjectRole
  roleTone: BadgeColor
  description: string
  members: Array<{ name: string; color: AccentColor; initials?: string }>
  overflow: number
  footerMeta?: { kind: 'text'; value: string } | { kind: 'badge'; label: string; tone: BadgeColor }
}

const PROJECTS: ProjectMeta[] = [
  {
    id: 'p1',
    name: 'BruinBites',
    initial: 'B',
    logoColor: 'pink',
    quarter: 'Winter 25-26',
    role: 'Project Lead',
    roleTone: 'pink',
    description:
      "Can't decide where to eat? A group decision-maker that shortlists 5 spots within walking distance.",
    members: [
      { name: 'MJ Bagaoisan', color: 'blue' },
      { name: 'Aarushi Gupta', color: 'mint' },
      { name: 'Travis Nguyen', color: 'pink' },
    ],
    overflow: 2,
    footerMeta: { kind: 'text', value: '8 open tasks' },
  },
  {
    id: 'p2',
    name: 'Studybug',
    initial: 'S',
    logoColor: 'blue',
    quarter: 'Winter 25-26',
    role: 'Project Member',
    roleTone: 'blue',
    description:
      "Pomodoro study buddy that shows your cohort's focus streaks — shipped this week to the app store.",
    members: [
      { name: 'Travis Nguyen', color: 'blue' },
      { name: 'MJ Bagaoisan', color: 'pink' },
      { name: 'Shawn Lin', color: 'lime' },
    ],
    overflow: 5,
    footerMeta: { kind: 'badge', label: 'Shipping', tone: 'mint' },
  },
]

type WeekEvent = {
  id: string
  dow: string
  date: string
  title: string
  typeTone: BadgeColor
  typeLabel: string
}

const WEEK: WeekEvent[] = [
  { id: 'e1', dow: 'Mon · Apr 20', date: '20', title: 'Officer sync · Ackerman 2408',     typeTone: 'blue', typeLabel: 'General'   },
  { id: 'e2', dow: 'Tue · Apr 21', date: '21', title: 'Design crit · BruinBites flow',    typeTone: 'pink', typeLabel: 'Design'    },
  { id: 'e3', dow: 'Wed · Apr 22', date: '22', title: 'Sprint 3 kickoff · Cohabit',       typeTone: 'blue', typeLabel: 'General'   },
  { id: 'e4', dow: 'Thu · Apr 23', date: '23', title: 'ThermoSense demo · sensor rig v2', typeTone: 'mint', typeLabel: 'Ship demo' },
  { id: 'e5', dow: 'Fri · Apr 24', date: '24', title: 'Club social · Kerckhoff patio',    typeTone: 'blue', typeLabel: 'General'   },
]

export default function PortalDashboard() {
  return (
    <div className="flex-1 w-full flex flex-col bg-cream-50">
      <DashboardHero />
      <div className="mx-auto max-w-[1200px] w-full px-8 md:px-20 pt-6 pb-12 space-y-8">
        <RecentActivity />
        <Announcements />
        <YourStuff />
        <ThisWeek />
      </div>
      <PortalFooter />
    </div>
  )
}

function SectionHeader({
  title,
  count,
  trailing,
}: {
  title: string
  count?: number
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div className="flex-1 min-w-0">
        <h2 className="font-ui font-extrabold text-[30px] leading-none tracking-[-0.02em] text-ink-900 flex items-baseline gap-3">
          {title}
          {typeof count === 'number' && (
            <span className="font-code text-sm text-ink-600 font-normal tracking-normal">({count})</span>
          )}
        </h2>
      </div>
      {trailing && <div className="pb-1 shrink-0">{trailing}</div>}
    </div>
  )
}

function ViewLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-ui text-[13px] font-bold text-cl-blue-700 hover:underline underline-offset-4"
    >
      {children}
    </Link>
  )
}

function RecentActivity() {
  return (
    <section>
      <SectionHeader
        title="Recent activity"
        trailing={<ViewLink href="#">View all →</ViewLink>}
      />
      <Card padding="none" className="px-7 shadow-none">
        <ul>
          {ACTIVITY.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3.5 py-4 -mx-2 px-2 rounded-lg hover:bg-overlay-hover transition-colors duration-200"
            >
              <ActivityAvatar avatar={row.avatar} />
              <div className="flex-1 min-w-0 font-ui text-sm truncate">{row.body}</div>
              <Badge color={row.chip.tone} dot className="text-[11px] shrink-0">
                {row.chip.label}
              </Badge>
              <span className="font-code text-[11px] text-ink-600 shrink-0 whitespace-nowrap">
                {row.timestamp}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}

function ActivityAvatar({ avatar }: { avatar: ActivityRow['avatar'] }) {
  if (avatar.kind === 'group') {
    return (
      <span
        className={
          'inline-flex items-center justify-center rounded-full w-8 h-8 shrink-0 font-ui font-extrabold text-white text-[11px] ' +
          colorBg(avatar.color)
        }
        aria-label={`${avatar.count} new members`}
      >
        +{avatar.count}
      </span>
    )
  }
  if (avatar.kind === 'project') {
    return <Avatar size="sm" color={avatar.color} name={avatar.name} initials={avatar.initials} />
  }
  return <Avatar size="sm" color={avatar.color} name={avatar.name} initials={avatar.initials} />
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

function logoBg(c: AccentColor): string {
  return colorBg(c)
}

function Announcements() {
  return (
    <section>
      <SectionHeader
        title="Announcements"
        trailing={<ViewLink href="#">View all →</ViewLink>}
      />
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-8 px-8 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [mask-image:linear-gradient(to_right,transparent_0,#000_24px,#000_calc(100%-40px),transparent_100%)] md:[mask-image:none]">
        {ANNOUNCEMENTS.map((a) => (
          <article
            key={a.id}
            className={
              'min-w-[280px] md:min-w-0 snap-start ' +
              'bg-surface-card border border-ink-100 rounded-[12px] shadow-sm ' +
              'shadow-card transition-all duration-fast ease-out hover:shadow-card-hover ' +
              'p-[22px] pb-[18px] flex flex-col gap-3.5 min-h-[200px] ' +
              (a.tilt ? 'md:-rotate-[1.2deg] md:origin-center' : '')
            }
          >
            <div className="flex items-center gap-2.5">
              <span className="font-ui font-extrabold text-[13px] text-ink-900">
                {a.author}{' '}
                <span className="text-ink-600 font-semibold">· {a.role}</span>
              </span>
            </div>
            <h3 className="font-ui font-extrabold text-base text-ink-900 leading-[1.3] m-0">
              {a.title}
            </h3>
            <p className="font-ui text-sm text-ink-600 leading-[1.5] m-0 line-clamp-2">{a.body}</p>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <Avatar size="xs" color={a.authorColor} name={a.author} initials={a.authorInitials} />
              <Link
                href="#"
                className="font-ui text-[13px] font-bold text-cl-blue-700 hover:underline underline-offset-4"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function YourStuff() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <MyTasks />
      <MyProjects />
    </section>
  )
}

function MyTasks() {
  return (
    <div id="my-tasks" className="scroll-mt-24">
      <SectionHeader
        title="My tasks"
        count={TASKS.length}
      />
      <div className="space-y-2.5">
        {TASKS.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[auto_1fr_auto] gap-4 items-center bg-surface-card border border-ink-100 rounded-[12px] px-[18px] py-[14px] hover:border-ink-300 shadow-card transition-all duration-fast ease-out hover:shadow-card-hover"
          >
            <StatusIcon status={t.status} />
            <div className="min-w-0">
              <p className="font-ui font-bold text-sm text-ink-900 leading-[1.3] m-0 truncate">
                {t.title}
              </p>
              <p className="font-code text-[11px] text-ink-600 mt-0.5">
                {t.project} · {t.statusLabel}
              </p>
            </div>
            <span
              className={
                'font-code font-semibold text-[11px] px-2.5 py-1 rounded-full shrink-0 tracking-wide ' +
                (t.dueSoon ? 'bg-cl-lime-100 text-cl-lime-700' : 'bg-ink-100 text-ink-900')
              }
            >
              {t.due}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <ViewLink href="#">View board →</ViewLink>
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const common = 'w-[18px] h-[18px] shrink-0 inline-flex items-center justify-center'
  switch (status) {
    case 'todo':
      return (
        <span className={common + ' text-cl-blue-700'} aria-label="Todo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      )
    case 'in-progress':
      return (
        <span className={common + ' text-cl-pink-700'} aria-label="In Progress">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 2 A6 6 0 0 1 8 14 Z" fill="currentColor" />
          </svg>
        </span>
      )
    case 'in-review':
      return (
        <span className={common + ' text-cl-lime-700'} aria-label="In Review">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="#fff" />
          </svg>
        </span>
      )
    case 'done':
      return (
        <span className={common + ' text-cl-mint-700'} aria-label="Done">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="currentColor" />
            <path
              d="M5 8 L7.5 10.5 L11 6.5"
              stroke="#fff"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )
  }
}

function MyProjects() {
  return (
    <div>
      <SectionHeader title="My projects" />
      <div className="space-y-3.5">
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            className="bg-surface-card border border-ink-100 rounded-[12px] p-5 flex flex-col gap-3 hover:border-ink-300 shadow-card transition-all duration-fast ease-out hover:shadow-card-hover"
          >
            <div className="flex items-center gap-3.5">
              <span
                className={
                  'w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center font-display font-bold text-lg text-white leading-none ' +
                  logoBg(p.logoColor)
                }
              >
                {p.initial}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-ui font-extrabold text-[17px] text-ink-900 leading-[1.2] m-0">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="inline-flex items-center rounded-full bg-ink-100 text-ink-900 font-code text-[10px] px-2 py-0.5 tracking-wide">
                    {p.quarter}
                  </span>
                  <Badge color={p.roleTone} className="text-[11px]">
                    {p.role}
                  </Badge>
                </div>
              </div>
              <AvatarCluster members={p.members} overflow={p.overflow} />
            </div>
            <p className="font-ui text-sm text-ink-600 leading-[1.45] m-0">{p.description}</p>
            <div className="flex items-center justify-between">
              <ViewLink href="#">Open project →</ViewLink>
              {p.footerMeta?.kind === 'text' && (
                <span className="font-code text-[11px] text-ink-600">{p.footerMeta.value}</span>
              )}
              {p.footerMeta?.kind === 'badge' && (
                <Badge color={p.footerMeta.tone} dot className="text-[11px]">
                  {p.footerMeta.label}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AvatarCluster({
  members,
  overflow,
}: {
  members: ProjectMeta['members']
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

function ThisWeek() {
  const today = new Date().getDate().toString()
  return (
    <section>
      <SectionHeader
        title="This week"
        trailing={<ViewLink href="#">Open calendar →</ViewLink>}
      />
      <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-8 px-8 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 [mask-image:linear-gradient(to_right,transparent_0,#000_24px,#000_calc(100%-40px),transparent_100%)] md:[mask-image:none]">
        {WEEK.map((e) => {
          const isToday = e.date === today
          return (
            <div
              key={e.id}
              aria-current={isToday ? 'date' : undefined}
              className={
                'min-w-[150px] md:min-w-0 snap-start rounded-[12px] p-4 flex flex-col gap-2 min-h-[150px] transition-all duration-fast ease-out ' +
                (isToday
                  ? 'bg-cl-blue-100 border border-ink-900 ring-1 ring-ink-900 shadow-card-hover relative'
                  : 'bg-surface-card border border-ink-100 hover:border-ink-300 shadow-card hover:-translate-y-1 hover:shadow-card-hover')
              }
            >
              <div className="flex items-center gap-2">
                <span className="font-code text-[11px] text-ink-600 tracking-[0.1em] uppercase">
                  {e.dow}
                </span>
                {isToday && (
                  <span className="font-code text-[10px] tracking-[0.1em] uppercase text-cl-blue-700 font-bold">
                    · today
                  </span>
                )}
              </div>
              <span className="font-ui font-extrabold text-[28px] text-ink-900 leading-none tracking-[-0.02em]">
                {e.date}
              </span>
              <p className="font-ui text-sm text-ink-900 leading-[1.35] m-0 mt-1">{e.title}</p>
              <div className="mt-auto">
                <Badge color={e.typeTone} dot className="text-[11px]">
                  {e.typeLabel}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PortalFooter() {
  return (
    <footer className="bg-cream-50 border-t border-ink-100">
      <div className="mx-auto max-w-[1200px] px-8 md:px-20 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 font-code text-[11px] text-ink-600">
          <svg width="18" height="18" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#1A1A1A" strokeWidth="2.4" />
            <path d="M20 20 L20 2 A18 18 0 0 1 36 25 Z" fill="#1A1A1A" />
          </svg>
          <span>© 2026 Creative Labs at UCLA</span>
          <span className="font-accent italic text-ink-400 ml-2">made with care</span>
        </div>
        <div className="flex gap-5 font-code text-[11px] text-ink-600">
          <Link href="#" className="hover:text-ink-900">
            Privacy
          </Link>
          <Link href="#" className="hover:text-ink-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
