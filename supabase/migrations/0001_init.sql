-- Ever After: full schema, run once in Supabase SQL Editor (or via `supabase db push`)
-- Safe to re-run: uses "if not exists" / "or replace" everywhere.

create extension if not exists pgcrypto;

-- =========================================================
-- TABLES
-- =========================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  gender text,
  age int,
  created_at timestamptz not null default now()
);

create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  partner_name text,
  wedding_date date,
  budget numeric,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists wedding_members (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'partner', 'collaborator')),
  status text not null default 'accepted' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (wedding_id, user_id)
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  invited_by uuid references profiles (id),
  name text,
  email text not null,
  role text not null check (role in ('partner', 'collaborator')),
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  name text not null,
  email text,
  max_guests int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists task_completions (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  task_key text not null,
  completed boolean not null default false,
  completed_by uuid references profiles (id),
  completed_at timestamptz,
  unique (wedding_id, task_key)
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  author_id uuid references profiles (id),
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  channel text not null default 'group' check (channel in ('partner', 'group')),
  sender_id uuid references profiles (id),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  category text not null,
  vendor_id text not null,
  vendor_name text not null,
  created_at timestamptz not null default now(),
  unique (wedding_id, category, vendor_id)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings (id) on delete cascade,
  category text not null,
  vendor_id text not null,
  vendor_name text not null,
  vendor_contact text,
  message text,
  requested_by uuid references profiles (id),
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id),
  message text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- HELPER FUNCTIONS
-- =========================================================

create or replace function is_wedding_member(wid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from wedding_members
    where wedding_id = wid and user_id = auth.uid() and status = 'accepted'
  );
$$;

create or replace function is_wedding_editor(wid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from wedding_members
    where wedding_id = wid and user_id = auth.uid() and status='accepted'
      and role in ('owner','partner')
  );
$$;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table profiles enable row level security;
alter table weddings enable row level security;
alter table wedding_members enable row level security;
alter table invites enable row level security;
alter table guests enable row level security;
alter table task_completions enable row level security;
alter table notes enable row level security;
alter table messages enable row level security;
alter table saved_items enable row level security;
alter table bookings enable row level security;
alter table feedback enable row level security;

drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles for select
  using (
    id = auth.uid()
    or id in (
      select wm2.user_id from wedding_members wm1
      join wedding_members wm2 on wm2.wedding_id = wm1.wedding_id
      where wm1.user_id = auth.uid() and wm1.status = 'accepted'
    )
  );
drop policy if exists "profiles_insert" on profiles;
create policy "profiles_insert" on profiles for insert with check (id = auth.uid());
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update using (id = auth.uid());

drop policy if exists "weddings_select" on weddings;
create policy "weddings_select" on weddings for select using (is_wedding_member(id));
drop policy if exists "weddings_insert" on weddings;
create policy "weddings_insert" on weddings for insert with check (owner_id = auth.uid());
drop policy if exists "weddings_update" on weddings;
create policy "weddings_update" on weddings for update using (is_wedding_editor(id));

drop policy if exists "wedding_members_select" on wedding_members;
create policy "wedding_members_select" on wedding_members for select using (is_wedding_member(wedding_id));
drop policy if exists "wedding_members_insert" on wedding_members;
create policy "wedding_members_insert" on wedding_members for insert with check (user_id = auth.uid());
drop policy if exists "wedding_members_update" on wedding_members;
create policy "wedding_members_update" on wedding_members for update using (is_wedding_editor(wedding_id) or user_id = auth.uid());
drop policy if exists "wedding_members_delete" on wedding_members;
create policy "wedding_members_delete" on wedding_members for delete using (is_wedding_editor(wedding_id) or user_id = auth.uid());

drop policy if exists "invites_select" on invites;
create policy "invites_select" on invites for select
  using (is_wedding_member(wedding_id) or email = (auth.jwt() ->> 'email'));
drop policy if exists "invites_insert" on invites;
create policy "invites_insert" on invites for insert with check (is_wedding_editor(wedding_id));
drop policy if exists "invites_update" on invites;
create policy "invites_update" on invites for update
  using (is_wedding_editor(wedding_id) or email = (auth.jwt() ->> 'email'));
drop policy if exists "invites_delete" on invites;
create policy "invites_delete" on invites for delete using (is_wedding_editor(wedding_id));

drop policy if exists "guests_select" on guests;
create policy "guests_select" on guests for select using (is_wedding_member(wedding_id));
drop policy if exists "guests_write" on guests;
create policy "guests_write" on guests for insert with check (is_wedding_editor(wedding_id));
drop policy if exists "guests_update" on guests;
create policy "guests_update" on guests for update using (is_wedding_editor(wedding_id));
drop policy if exists "guests_delete" on guests;
create policy "guests_delete" on guests for delete using (is_wedding_editor(wedding_id));

drop policy if exists "tasks_select" on task_completions;
create policy "tasks_select" on task_completions for select using (is_wedding_member(wedding_id));
drop policy if exists "tasks_insert" on task_completions;
create policy "tasks_insert" on task_completions for insert with check (is_wedding_editor(wedding_id));
drop policy if exists "tasks_update" on task_completions;
create policy "tasks_update" on task_completions for update using (is_wedding_editor(wedding_id));

drop policy if exists "notes_select" on notes;
create policy "notes_select" on notes for select using (is_wedding_member(wedding_id));
drop policy if exists "notes_insert" on notes;
create policy "notes_insert" on notes for insert with check (is_wedding_editor(wedding_id));
drop policy if exists "notes_update" on notes;
create policy "notes_update" on notes for update using (is_wedding_editor(wedding_id));
drop policy if exists "notes_delete" on notes;
create policy "notes_delete" on notes for delete using (is_wedding_editor(wedding_id));

drop policy if exists "messages_select" on messages;
create policy "messages_select" on messages for select
  using (is_wedding_member(wedding_id) and (channel = 'group' or is_wedding_editor(wedding_id)));
drop policy if exists "messages_insert" on messages;
create policy "messages_insert" on messages for insert
  with check (is_wedding_member(wedding_id) and (channel = 'group' or is_wedding_editor(wedding_id)));

drop policy if exists "saved_select" on saved_items;
create policy "saved_select" on saved_items for select using (is_wedding_member(wedding_id));
drop policy if exists "saved_insert" on saved_items;
create policy "saved_insert" on saved_items for insert with check (is_wedding_member(wedding_id));
drop policy if exists "saved_delete" on saved_items;
create policy "saved_delete" on saved_items for delete using (is_wedding_member(wedding_id));

drop policy if exists "bookings_select" on bookings;
create policy "bookings_select" on bookings for select using (is_wedding_member(wedding_id));
drop policy if exists "bookings_insert" on bookings;
create policy "bookings_insert" on bookings for insert with check (is_wedding_editor(wedding_id));
drop policy if exists "bookings_update" on bookings;
create policy "bookings_update" on bookings for update using (is_wedding_editor(wedding_id));

drop policy if exists "feedback_select" on feedback;
create policy "feedback_select" on feedback for select using (user_id = auth.uid());
drop policy if exists "feedback_insert" on feedback;
create policy "feedback_insert" on feedback for insert with check (user_id = auth.uid());

-- =========================================================
-- REALTIME (for live chat)
-- =========================================================
alter publication supabase_realtime add table messages;
