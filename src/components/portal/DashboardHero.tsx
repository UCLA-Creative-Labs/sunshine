'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type PartOfDay = 'morning' | 'afternoon' | 'evening'

function partOfDayFromHour(h: number): PartOfDay {
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

export default function DashboardHero() {
  const [firstName, setFirstName] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState<number | null>(null)
  const [partOfDay, setPartOfDay] = useState<PartOfDay>('morning')

  useEffect(() => {
    setPartOfDay(partOfDayFromHour(new Date().getHours()))

    let cancelled = false
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid || cancelled) return

      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from('profiles').select('first_name, display_name').eq('id', uid).single(),
        supabase.from('project_members')
          .select('project_id', { count: 'exact', head: true })
          .eq('user_id', uid),
      ])
      if (cancelled) return

      setFirstName(profile?.first_name ?? profile?.display_name ?? null)
      setProjectCount(count ?? 0)
    })()

    return () => { cancelled = true }
  }, [])

  const countLine =
    projectCount == null
      ? 'Welcome back.'
      : projectCount === 0
        ? "You're not on any projects yet."
        : `${projectCount} active project${projectCount === 1 ? '' : 's'} · Welcome back.`

  return (
    <section
      className="relative overflow-hidden border-b border-ink-100"
      style={{ backgroundColor: '#FFF8EF' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px circle at 22% 28%, rgba(255,174,171,0.55), transparent 62%),' +
            'radial-gradient(1100px circle at 80% 88%, rgba(255,174,171,0.50), transparent 68%),' +
            'radial-gradient(520px circle at 92% 12%, rgba(158,204,255,0.30), transparent 60%),' +
            'radial-gradient(440px circle at 8% 90%, rgba(189,213,130,0.28), transparent 60%),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,201,181,0.28))',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage: 'url(/textures/noise.png)',
          backgroundSize: '240px 240px',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-8 py-8 md:px-20 md:py-10 motion-safe:animate-cl-fade-up">
        <h1 className="font-display text-[48px] font-bold leading-[0.95] tracking-[-0.025em] text-ink-900 md:text-[64px]">
          Good {partOfDay}
          {firstName ? (
            <>
              , <span className="text-cl-blue-700">{firstName}</span>
            </>
          ) : null}
          <span className="text-ink-900">.</span>
        </h1>
        <p className="mt-4 font-ui text-base text-ink-600">{countLine}</p>
      </div>
    </section>
  )
}