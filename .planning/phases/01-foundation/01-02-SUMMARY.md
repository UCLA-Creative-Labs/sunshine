---
phase: 01-foundation
plan: "02"
subsystem: ui
tags: [next.js, react, tailwind, rbac, server-components, routing]

# Dependency graph
requires:
  - phase: 01-foundation
    plan: "01"
    provides: "getInternalRoleForUser and hasInternalRole helpers in src/lib/internal/permissions.ts"
provides:
  - "Access-gated internal layout at src/app/(portal)/portal/internal/layout.tsx"
  - "Auto-redirect from /portal/internal to /portal/internal/projects"
  - "Placeholder Projects committee page at /portal/internal/projects"
  - "InternalSidebar component matching MembershipPortalSidebar visual style"
affects:
  - 02-project-browsing
  - future internal sections (finance, marketing, design committees)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Async server layout component as server-side access gate — check auth/role then redirect before rendering"
    - "Two-column layout: flex-shrink-0 sidebar + flex-1 content area with max-w-5xl"
    - "Client sidebar with usePathname().startsWith() for active state detection"

key-files:
  created:
    - src/app/(portal)/portal/internal/layout.tsx
    - src/app/(portal)/portal/internal/page.tsx
    - src/app/(portal)/portal/internal/projects/page.tsx
    - src/components/portal/internal/InternalSidebar.tsx
  modified: []

key-decisions:
  - "Server-side role check happens in layout.tsx before any HTML renders — client-side workarounds cannot bypass"
  - "InternalSidebar uses identical NAV_STYLES constants as MembershipPortalSidebar for visual consistency"
  - "projects/page.tsx is intentionally a placeholder — Phase 2 replaces content with actual project list"

patterns-established:
  - "Internal route gate: async layout calls getInternalRoleForUser() + hasInternalRole(), redirect('/portal') if false"
  - "Client sidebar pattern: COMMITTEE_ITEMS const array, usePathname startsWith for active, useRouter for nav"

requirements-completed: [ACC-01, ACC-02, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 1 Plan 02: Internal Layout Summary

**Server-gated two-column internal layout with InternalSidebar, auto-redirect to /portal/internal/projects, and placeholder Projects committee page**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-02T20:30:25Z
- **Completed:** 2026-03-02T20:32:19Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments
- Server-side access gate in layout.tsx prevents non-internal users from reaching any /portal/internal/* route — redirect runs before any UI renders
- InternalSidebar component matches MembershipPortalSidebar visual style exactly (same Tailwind classes, same active/inactive states, same font styling)
- Auto-redirect from /portal/internal to /portal/internal/projects with placeholder page ready for Phase 2 content

## Task Commits

Each task was committed atomically:

1. **Task 1: Create InternalSidebar component** - `9c8d150` (feat)
2. **Task 2: Create internal layout with server-side access gate** - `2bb4f8c` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/components/portal/internal/InternalSidebar.tsx` - Client sidebar listing "Projects" nav item, styled to match MembershipPortalSidebar, active state via usePathname().startsWith()
- `src/app/(portal)/portal/internal/layout.tsx` - Async server component: checks internal role, redirects to /portal if unauthorized, renders two-column flex layout
- `src/app/(portal)/portal/internal/page.tsx` - Immediately redirects /portal/internal → /portal/internal/projects
- `src/app/(portal)/portal/internal/projects/page.tsx` - Placeholder heading for Projects committee (Phase 2 will fill this in)

## Decisions Made
- Server-side check in layout.tsx means the gate runs even before React renders on the client — no client-side bypass possible
- Chose to use `redirect('/portal')` (not `/portal/internal/error`) so unauthorized users land back on the familiar portal home
- Kept projects/page.tsx as a minimal placeholder with an explanatory message rather than an empty page

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Pre-existing TypeScript errors in `.next/dev/types/validator.ts` (unrelated board/list/overview pages) were present before this plan and are out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Internal section foundation is complete: layout gate works, sidebar renders, projects page is reachable
- Phase 2 can replace `src/app/(portal)/portal/internal/projects/page.tsx` with the actual project list
- Future committees (Finance, Marketing, Design) can be added by extending `COMMITTEE_ITEMS` in InternalSidebar.tsx and adding route directories

---
*Phase: 01-foundation*
*Completed: 2026-03-02*
