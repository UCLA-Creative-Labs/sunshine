-- Row level security for profiles, projects, project_members and activity_log.
--
-- Access rules:
--   profiles         signed-in users read all; each user writes only their own row
--   projects         anyone reads; project leads and
--                    directors/presidents edit; directors/presidents delete
--   project_members  signed-in users read all; project leads and directors/presidents
--                    add, change roles and remove; only project (external) roles allowed
--   activity_log     project members and internal members read; append-only
--
-- Server code using the service role key bypasses RLS and is unaffected.

-- ---------------------------------------------------------------------------
-- Helpers. SECURITY DEFINER so policies can check roles without depending on
-- the caller's own access to the role tables.
-- ---------------------------------------------------------------------------

-- True if the current user holds an internal role. Pass role names to require
-- one of them, e.g. has_internal_role(array['director', 'president']).
create or replace function public.has_internal_role(p_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_context_roles ucr
    join public.roles r on r.id = ucr.role_id
    where ucr.user_id = (select auth.uid())
      and r.context = 'internal'
      and (p_roles is null or r.name = any (p_roles))
  );
$$;

-- The old two-argument version referenced project_members.role, which no
-- longer exists, and nothing used it.
drop function if exists public.is_project_lead(uuid, uuid);

-- True if the current user is a project lead of the given project.
create or replace function public.is_project_lead(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_members pm
    join public.roles r on r.id = pm.rbac_role_id
    where pm.project_id = p_project_id
      and pm.user_id = (select auth.uid())
      and r.context = 'external'
      and r.name = 'project lead'
  );
$$;

-- True if the current user is a member of the given project.
create or replace function public.is_project_member(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = p_project_id
      and pm.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.has_internal_role(text[]) from public, anon;
revoke execute on function public.is_project_lead(uuid) from public, anon;
revoke execute on function public.is_project_member(uuid) from public, anon;
grant execute on function public.has_internal_role(text[]) to authenticated, service_role;
grant execute on function public.is_project_lead(uuid) to authenticated, service_role;
grant execute on function public.is_project_member(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- The creator of a project becomes its lead. Done in the database because a
-- new project has no lead yet who could be allowed to add the first member.
-- ---------------------------------------------------------------------------
create or replace function public.add_project_creator_as_lead()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.project_members (project_id, user_id, rbac_role_id, invited_by)
  select new.id, p.id, r.id, p.id
  from public.profiles p
  join public.roles r on r.context = 'external' and r.name = 'project lead'
  where p.id = (select auth.uid())
  on conflict (project_id, user_id) do nothing;
  return new;
end;
$$;

revoke execute on function public.add_project_creator_as_lead() from public, anon, authenticated;

drop trigger if exists on_project_created_add_lead on public.projects;
create trigger on_project_created_add_lead
  after insert on public.projects
  for each row execute function public.add_project_creator_as_lead();

-- ---------------------------------------------------------------------------
-- Table privileges. Start from nothing and grant only what the app uses.
-- ---------------------------------------------------------------------------
revoke all on public.profiles, public.projects, public.project_members, public.activity_log
  from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

grant select, insert, update, delete on public.project_members to authenticated;

grant select, insert on public.activity_log to authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "Signed-in users can view profiles"
  on public.profiles for select to authenticated
  using (true);

create policy "Users can create their own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

create policy "Anyone can view projects"
  on public.projects for select to anon, authenticated
  using (true);

create policy "Project leads and internal members can create projects"
  on public.projects for insert to authenticated
  with check (
    public.has_internal_role()
    or exists (
      select 1
      from public.project_members pm
      join public.roles r on r.id = pm.rbac_role_id
      where pm.user_id = (select auth.uid())
        and r.context = 'external'
        and r.name = 'project lead'
    )
  );

create policy "Project leads and directors can update projects"
  on public.projects for update to authenticated
  using (public.is_project_lead(id) or public.has_internal_role(array['director', 'president']))
  with check (public.is_project_lead(id) or public.has_internal_role(array['director', 'president']));

create policy "Directors can delete projects"
  on public.projects for delete to authenticated
  using (public.has_internal_role(array['director', 'president']));

-- ---------------------------------------------------------------------------
-- project_members
-- ---------------------------------------------------------------------------
-- Replaced below. The old SELECT policy queried project_members from its own
-- policy (infinite recursion), and the old INSERT policy checked
-- user_context_roles, which is not where project roles are stored.
drop policy if exists "Members can view project members" on public.project_members;
drop policy if exists "Users with add_member permission can add members" on public.project_members;

alter table public.project_members enable row level security;

create policy "Signed-in users can view project members"
  on public.project_members for select to authenticated
  using (true);

create policy "Project leads and directors can add members"
  on public.project_members for insert to authenticated
  with check (
    (public.is_project_lead(project_id) or public.has_internal_role(array['director', 'president']))
    and rbac_role_id in (select r.id from public.roles r where r.context = 'external')
  );

create policy "Project leads and directors can update members"
  on public.project_members for update to authenticated
  using (public.is_project_lead(project_id) or public.has_internal_role(array['director', 'president']))
  with check (
    (public.is_project_lead(project_id) or public.has_internal_role(array['director', 'president']))
    and rbac_role_id in (select r.id from public.roles r where r.context = 'external')
  );

create policy "Project leads and directors can remove members"
  on public.project_members for delete to authenticated
  using (public.is_project_lead(project_id) or public.has_internal_role(array['director', 'president']));

-- ---------------------------------------------------------------------------
-- activity_log (append-only: no update or delete policies)
-- ---------------------------------------------------------------------------
alter table public.activity_log enable row level security;

create policy "Project and internal members can view activity"
  on public.activity_log for select to authenticated
  using (public.is_project_member(project_id) or public.has_internal_role());

create policy "Members can log their own activity"
  on public.activity_log for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (public.is_project_member(project_id) or public.has_internal_role())
  );
