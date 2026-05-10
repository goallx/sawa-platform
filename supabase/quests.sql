create extension if not exists pgcrypto;

create table if not exists quests (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  duration_days int default 3,
  status text default 'draft' check (status in ('draft','active','archived')),
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists quest_steps (
  id uuid default gen_random_uuid() primary key,
  quest_id uuid references quests(id) on delete cascade,
  title text not null,
  content text not null,
  order_index int not null,
  estimated_minutes int default 15,
  deliverable_type text default 'text' check (deliverable_type in ('text','url','screenshot','none')),
  deliverable_prompt text,
  created_at timestamptz default now()
);

create table if not exists enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  quest_id uuid references quests(id),
  status text default 'active' check (status in ('active','completed','dropped')),
  enrolled_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists progress (
  id uuid default gen_random_uuid() primary key,
  enrollment_id uuid references enrollments(id) on delete cascade,
  step_id uuid references quest_steps(id),
  status text default 'locked' check (status in ('locked','in_progress','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  deliverable text,
  notes text
);

alter table enrollments enable row level security;
alter table progress enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can view own enrollments'
      and tablename = 'enrollments'
  ) then
    create policy "Users can view own enrollments"
      on enrollments for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can insert own enrollments'
      and tablename = 'enrollments'
  ) then
    create policy "Users can insert own enrollments"
      on enrollments for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can update own enrollments'
      and tablename = 'enrollments'
  ) then
    create policy "Users can update own enrollments"
      on enrollments for update using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can view own progress'
      and tablename = 'progress'
  ) then
    create policy "Users can view own progress"
      on progress for select using (
        enrollment_id in (select id from enrollments where user_id = auth.uid())
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can insert own progress'
      and tablename = 'progress'
  ) then
    create policy "Users can insert own progress"
      on progress for insert with check (
        enrollment_id in (select id from enrollments where user_id = auth.uid())
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Users can update own progress'
      and tablename = 'progress'
  ) then
    create policy "Users can update own progress"
      on progress for update using (
        enrollment_id in (select id from enrollments where user_id = auth.uid())
      );
  end if;
end $$;
