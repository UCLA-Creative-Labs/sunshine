# Internal Page — Sunshine Portal

## What This Is

A restricted internal-facing page within the Sunshine membership portal, accessible only to users with internal roles (director, president, board members). It provides a committee-based interface starting with the Projects Committee, which allows internal users to manage project memberships and assign external roles (project lead / project member) to users across all projects.

## Core Value

Internal role users can browse projects and manage who is on each project and in what role — without needing to go through project leads.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Navbar shows "Internal" tab only to users with an internal role (director, president, board)
- [ ] `/portal/internal` is access-gated — non-internal users are redirected or shown an error
- [ ] Left sidebar lists committees; currently only "Projects" committee
- [ ] Projects committee: browse all projects, select one to manage its members
- [ ] Per-project member management: view current members + their external roles
- [ ] Assign a user to a project with an external role (lead or member)
- [ ] Change an existing member's external role
- [ ] Remove a member from a project

### Out of Scope

- Other committees (Finance, Marketing, etc.) — future, architecture accommodates them
- Internal role assignment from this UI — out of scope per issue
- Project creation/editing — that's in the existing project settings

## Context

- Stack: Next.js 14 App Router, Supabase, Tailwind, TypeScript
- Auth: Supabase auth + RBAC system
- Internal roles stored in `user_context_roles` table → `roles` table (context = 'internal')
- External roles (project lead, project member) stored in `project_members.rbac_role_id` → `roles`
- Existing sidebar pattern: `MembershipPortalSidebar` component with icon nav items
- Portal navbar: `MembershipPortalNavbar` driven by `portalTabs` array in layout
- Nav visibility should be implemented as an isolated, easy-to-flip condition

## Constraints

- **Tech stack**: Next.js App Router only — no new frameworks
- **Pattern**: Match the visual format of the existing "My Project" / project sidebar pages
- **Scope**: Projects committee only for v1; architecture must allow adding more committees later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nav tab hidden for non-internal users | UX requirement; easy-to-flip flag for future change | — Pending |
| Browse by project first, then assign members | User preference from clarification | — Pending |
| Use existing `MembershipPortalSidebar` for left panel | Consistency with existing design system | — Pending |

---
*Last updated: 2026-03-02 after initialization*
