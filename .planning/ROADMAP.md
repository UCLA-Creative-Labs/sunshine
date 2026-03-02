# Roadmap: Internal Page — Sunshine Portal

## Overview

Two-phase delivery: first establish the access-gated shell (nav, routing, layout), then build the Projects Committee feature inside it (browse projects, manage members). Phase 1 is a hard prerequisite — Phase 2 cannot ship without a working internal route.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Access-gated internal route with nav tab, layout shell, and committee sidebar (completed 2026-03-02)
- [ ] **Phase 2: Projects Committee** - Browse all projects and manage per-project member roles

## Phase Details

### Phase 1: Foundation
**Goal**: Internal users can access a properly gated `/portal/internal` route with the correct layout; non-internal users cannot
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, NAV-02, ACC-01, ACC-02, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04
**Success Criteria** (what must be TRUE):
  1. An internal user (director, president, or board) sees an "Internal" tab in the portal navbar
  2. A non-internal user sees no "Internal" tab and is redirected (or shown an error) when visiting `/portal/internal`
  3. The server rejects access to the internal layout for users without an internal role — a client-side workaround cannot bypass this
  4. Visiting `/portal/internal` lands on `/portal/internal/projects` automatically
  5. The internal page renders a two-column layout: left sidebar listing "Projects", right content area — styled consistently with the existing portal sidebar
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Nav tab conditional visibility (permissions helper + async portal layout)
- [x] 01-02-PLAN.md — Internal layout shell (server gate + two-column layout + InternalSidebar + redirect)

### Phase 2: Projects Committee
**Goal**: An internal user can browse all projects and perform full member management (view, add, change role, remove) on any project
**Depends on**: Phase 1
**Requirements**: PROJ-01, PROJ-02, PROJ-03, MEM-01, MEM-02, MEM-03, MEM-04, MEM-05
**Success Criteria** (what must be TRUE):
  1. Internal user sees a list of all projects (name, quarter/year) in the Projects committee view
  2. Clicking a project navigates to its member management view and the project is visually highlighted in the list
  3. Member management view shows all current members of the selected project with their external roles displayed
  4. Internal user can add a new member by searching by name or email and assigning an external role (lead or member)
  5. Internal user can change an existing member's role or remove them from the project (with confirmation)
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Project list view with active-row highlight and navigation to member management
- [ ] 02-02-PLAN.md — Member management page: display + add member modal + inline role change + inline remove

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-02 |
| 2. Projects Committee | 1/2 | In Progress|  |
