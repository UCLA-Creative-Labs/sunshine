-- Add student metadata (major, graduation year) to profiles.
-- These fields are captured at signup and editable from the profile page.
-- Run via: `supabase db push` or execute directly in the Supabase SQL editor.

alter table public.profiles
  add column if not exists major text,
  add column if not exists grad_year smallint;

-- Sanity range on grad_year (safe to adjust; picked a wide window)
alter table public.profiles
  drop constraint if exists profiles_grad_year_range;

alter table public.profiles
  add constraint profiles_grad_year_range
  check (grad_year is null or (grad_year >= 2020 and grad_year <= 2040));

-- Optional: index if you plan to filter rosters by year later
-- create index if not exists profiles_grad_year_idx on public.profiles (grad_year);

comment on column public.profiles.major is 'student major, free-text (e.g. "Computer Science")';
comment on column public.profiles.grad_year is 'expected graduation year (e.g. 2027)';
