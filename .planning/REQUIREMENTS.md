# Requirements: Internal Page

**Defined:** 2026-03-02
**Core Value:** Internal role users can browse projects and manage project memberships without going through project leads

## v1 Requirements

### Navigation

- [x] **NAV-01**: "Internal" tab is conditionally shown in portal navbar only for users with an internal role (context = 'internal' in user_context_roles)
- [x] **NAV-02**: Nav visibility logic is isolated in a single, easily-switchable location (flag/constant)

### Access Control

- [x] **ACC-01**: Visiting `/portal/internal` without an internal role redirects to `/portal` or shows an access-denied state
- [x] **ACC-02**: Server-side role check gates the internal layout (not just client-side)

### Layout & Structure

- [x] **LAYOUT-01**: Internal page uses a two-column layout: left sidebar listing committees + right content area
- [x] **LAYOUT-02**: Sidebar matches visual style of existing `MembershipPortalSidebar` (same font, colors, borders)
- [x] **LAYOUT-03**: Sidebar lists "Projects" committee as the first (and currently only) item
- [x] **LAYOUT-04**: Default route `/portal/internal` redirects to `/portal/internal/projects`

### Projects Committee — Project Browsing

- [x] **PROJ-01**: Projects committee view lists all projects (name, quarter/year)
- [x] **PROJ-02**: Selecting a project navigates to a member management view for that project
- [x] **PROJ-03**: Selected project is visually highlighted in the project list

### Projects Committee — Member Management

- [ ] **MEM-01**: Member management view shows current members of the selected project with their external roles
- [ ] **MEM-02**: User can add a new member to the project by searching existing profiles by name or email
- [ ] **MEM-03**: When adding a member, user selects their external role (project lead or project member)
- [ ] **MEM-04**: User can change an existing member's external role via a dropdown/selector
- [ ] **MEM-05**: User can remove a member from a project (with confirmation)

## v2 Requirements

### Future Committees

- **COMM-01**: Finance committee view
- **COMM-02**: Marketing committee view
- **COMM-03**: Design committee view
- **COMM-04**: Tech committee view

### Enhanced Member Management

- **MEM-06**: Bulk role assignment for multiple members at once
- **MEM-07**: Activity log of role changes

## Out of Scope

| Feature | Reason |
|---------|--------|
| Assigning internal roles (director, president, board) from this UI | Not in issue scope |
| Project creation or editing | Handled by existing project settings |
| Non-Projects committees | v1 only; architecture accommodates them |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Complete (01-01) |
| NAV-02 | Phase 1 | Complete (01-01) |
| ACC-01 | Phase 1 | Complete |
| ACC-02 | Phase 1 | Complete (01-01) |
| LAYOUT-01 | Phase 1 | Complete |
| LAYOUT-02 | Phase 1 | Complete |
| LAYOUT-03 | Phase 1 | Complete |
| LAYOUT-04 | Phase 1 | Complete |
| PROJ-01 | Phase 2 | Complete |
| PROJ-02 | Phase 2 | Complete |
| PROJ-03 | Phase 2 | Complete |
| MEM-01 | Phase 2 | Pending |
| MEM-02 | Phase 2 | Pending |
| MEM-03 | Phase 2 | Pending |
| MEM-04 | Phase 2 | Pending |
| MEM-05 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after 01-01 completion (NAV-01, NAV-02, ACC-02 complete)*
