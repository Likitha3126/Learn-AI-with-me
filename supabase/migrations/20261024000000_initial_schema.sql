-- ============================================================================
-- LEARN AI WITH ME — SUPABASE DATABASE MIGRATION
-- Migration: 20261024000000_initial_schema.sql
-- Description: Sets up user profiles, cloud progress tracking, and daily notes
--              with Row Level Security (RLS) and strict ownership policies.
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. USER PROFILES TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Comments
comment on table public.user_profiles is 'Stores public/app profile information for authenticated learners.';
comment on column public.user_profiles.id is 'Matches the authenticated Supabase user id.';

-- ----------------------------------------------------------------------------
-- 2. USER DAY PROGRESS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.user_day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number int not null check (day_number between 1 and 70),
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  completed_tasks int[] not null default '{}',
  updated_at timestamptz not null default now(),

  constraint uq_user_day_progress unique (user_id, day_number)
);

comment on table public.user_day_progress is 'Tracks personal learning status and completed tasks for each day.';
create index if not exists idx_user_day_progress_user on public.user_day_progress(user_id);
create index if not exists idx_user_day_progress_lookup on public.user_day_progress(user_id, day_number);

-- ----------------------------------------------------------------------------
-- 3. USER DAY NOTES TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.user_day_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number int not null check (day_number between 1 and 70),
  notes_markdown text not null default '' check (length(notes_markdown) <= 50000),
  updated_at timestamptz not null default now(),

  constraint uq_user_day_notes unique (user_id, day_number)
);

comment on table public.user_day_notes is 'Stores personal Markdown notes written by the learner for each day.';
create index if not exists idx_user_day_notes_user on public.user_day_notes(user_id);
create index if not exists idx_user_day_notes_lookup on public.user_day_notes(user_id, day_number);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all user tables
alter table public.user_profiles enable row level security;
alter table public.user_day_progress enable row level security;
alter table public.user_day_notes enable row level security;

-- Policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policies for user_day_progress
create policy "Users can view their own progress"
  on public.user_day_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_day_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_day_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_day_progress
  for delete
  using (auth.uid() = user_id);

-- Policies for user_day_notes
create policy "Users can view their own notes"
  on public.user_day_notes
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.user_day_notes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.user_day_notes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.user_day_notes
  for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger firing on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. UPDATED_AT TIMESTAMP TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_profiles_updated_at on public.user_profiles;
create trigger touch_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_user_day_progress_updated_at on public.user_day_progress;
create trigger touch_user_day_progress_updated_at
  before update on public.user_day_progress
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_user_day_notes_updated_at on public.user_day_notes;
create trigger touch_user_day_notes_updated_at
  before update on public.user_day_notes
  for each row execute procedure public.touch_updated_at();
