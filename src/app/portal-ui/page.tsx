'use client'

import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Input,
  Select,
  Switch,
} from '@/components/portal/ui'

export default function PortalUiGallery() {
  const [checked, setChecked] = useState(false)
  const [on, setOn] = useState(true)

  return (
    <main className="min-h-screen bg-surface font-body text-text-primary">
      <div className="max-w-6xl mx-auto px-8 py-16 space-y-16">
        <header className="space-y-2 pb-6 border-b border-ink-900">
          <p className="font-ui text-xs font-bold text-ink-600 tracking-widest uppercase">Phase 2 — Core components</p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.035em]">Portal UI Gallery</h1>
          <p className="font-body text-base text-ink-600 max-w-prose">
            Visual verification of the Phase 2 token-driven component set. All styles consume
            <span className="mx-1 font-ui font-semibold text-sm bg-ink-100 px-1.5 py-0.5 rounded">src/styles/tokens.css</span> via Tailwind aliases.
          </p>
        </header>

        <Section num="01" title="Buttons">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary">+ Add Task</Button>
            <Button variant="secondary">New Announcement</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete project</Button>
            <Button variant="icon" aria-label="add">
              <span aria-hidden>+</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center mt-4">
            <Button variant="primary" size="sm">small</Button>
            <Button variant="primary" size="md">base</Button>
            <Button variant="primary" size="lg">large</Button>
            <Button variant="primary" disabled>disabled</Button>
          </div>
        </Section>

        <Section num="02" title="Badges">
          <div className="flex flex-wrap gap-2.5">
            <Badge color="sky" dot>Todo</Badge>
            <Badge color="coral" dot>In Progress</Badge>
            <Badge color="yellow" dot>In Review</Badge>
            <Badge color="mint" dot>Done</Badge>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-3">
            <Badge color="pink">Marketing</Badge>
            <Badge color="sky">Engineering</Badge>
            <Badge color="purple">Design</Badge>
            <Badge color="mint">Docs</Badge>
            <Badge color="yellow">UX</Badge>
            <Badge color="coral">Ops</Badge>
            <Badge color="ink">Alumni</Badge>
          </div>
        </Section>

        <Section num="03" title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card variant="default">
              <h5 className="font-ui font-black text-lg">Default card</h5>
              <p className="text-sm text-ink-600 mt-2">Subtle shadow + ink-100 border.</p>
            </Card>
            <Card variant="raised">
              <h5 className="font-ui font-black text-lg">Raised card</h5>
              <p className="text-sm text-ink-600 mt-2">Bigger shadow, lighter border.</p>
            </Card>
            <Card variant="outlined">
              <h5 className="font-ui font-black text-lg">Outlined card</h5>
              <p className="text-sm text-ink-600 mt-2">No shadow, crisp border.</p>
            </Card>
          </div>
        </Section>

        <Section num="04" title="Avatars">
          <div className="flex items-end gap-5 flex-wrap">
            <AvatarDemo name="Anna Duong" size="xs" />
            <AvatarDemo name="Bryan Kim" size="sm" />
            <AvatarDemo name="Chloe Lin" size="md" />
            <AvatarDemo name="Derek Orozco" size="lg" />
            <AvatarDemo name="Eun-ji Park" size="xl" />
          </div>
          <div className="mt-6 p-4 rounded-md bg-cl-mint-100 border-l-4 border-cl-mint-700">
            <p className="font-ui font-bold text-sm text-cl-mint-700">Unknown-user fallback check</p>
            <div className="flex gap-3 mt-3 items-center">
              <Avatar name={null} size="md" />
              <Avatar name="" size="md" />
              <Avatar name={undefined} size="md" />
              <span className="font-ui text-xs font-medium text-ink-600">null / "" / undefined → "?" on ink-900</span>
            </div>
          </div>
        </Section>

        <Section num="05" title="Forms">
          <Card variant="outlined" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <Input label="Email" sublabel="we'll never share it" placeholder="you@ucla.edu" />
              <Input label="Project name" defaultValue="Creative Lab Demo" />
              <Input label="Error state" defaultValue="too short" error="Must be at least 10 characters." />
              <Select label="Quarter" defaultValue="winter">
                <option value="fall">Fall 25</option>
                <option value="winter">Winter 25–26</option>
                <option value="spring">Spring 26</option>
              </Select>
              <div className="flex flex-col gap-3">
                <Checkbox
                  label="Send me weekly digest"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <Checkbox label="Disabled option" disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Switch label="Notifications" checked={on} onCheckedChange={setOn} />
                <Switch label="Disabled" checked={false} disabled />
              </div>
            </div>
          </Card>
        </Section>

        <Section num="06" title="Empty state">
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start tracking work for this project."
            action={<Button variant="primary">+ Add Task</Button>}
          />
        </Section>
      </div>
    </main>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="flex items-baseline justify-between gap-6 pb-3 border-b border-ink-900">
        <h2 className="font-ui font-extrabold text-2xl tracking-tight">{title}</h2>
        <span className="font-ui text-xs font-bold text-ink-600 tracking-widest uppercase">{num}</span>
      </div>
      {children}
    </section>
  )
}

function AvatarDemo({ name, size }: { name: string; size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar name={name} size={size} />
      <span className="font-ui font-bold text-xs text-ink-900">{name}</span>
      <span className="font-ui text-[10px] font-bold text-ink-600 uppercase tracking-widest">{size}</span>
    </div>
  )
}
