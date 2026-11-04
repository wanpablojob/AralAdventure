-- AralAdventure initial schema
-- Run with: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  name text not null,
  grade_band text not null check (grade_band in ('1-3', '4-6')),
  teacher_code text,
  points integer not null default 0 check (points >= 0),
  level integer not null default 1 check (level >= 1),
  xp integer not null default 0 check (xp >= 0),
  completed_quests text[] not null default '{}',
  owned_items text[] not null default '{}',
  equipped_outfit_id text,
  equipped_pet_id text,
  equipped_trail_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now()
);

create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  quest_id text not null,
  subject text not null check (subject in ('math', 'english')),
  grade_band text not null check (grade_band in ('1-3', '4-6')),
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists players_teacher_code_idx on public.players (teacher_code);
create index if not exists quest_completions_player_id_idx on public.quest_completions (player_id);
create index if not exists quest_completions_completed_at_idx on public.quest_completions (completed_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
before update on public.players
for each row
execute function public.set_updated_at();

alter table public.players enable row level security;
alter table public.quest_completions enable row level security;

-- MVP sync policies for the Expo app's anon key.
-- The teacher dashboard should use authenticated or service-role access later.
drop policy if exists "anon can read players" on public.players;
create policy "anon can read players"
on public.players for select
to anon
using (true);

drop policy if exists "anon can insert players" on public.players;
create policy "anon can insert players"
on public.players for insert
to anon
with check (true);

drop policy if exists "anon can update players" on public.players;
create policy "anon can update players"
on public.players for update
to anon
using (true)
with check (true);

drop policy if exists "anon can read completions" on public.quest_completions;
create policy "anon can read completions"
on public.quest_completions for select
to anon
using (true);

drop policy if exists "anon can insert completions" on public.quest_completions;
create policy "anon can insert completions"
on public.quest_completions for insert
to anon
with check (true);
