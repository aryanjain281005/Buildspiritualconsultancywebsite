-- Create a clean bookings table for consultation bookings.
-- Run this in the Supabase SQL editor or via migrations.

create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_name text not null,
  user_email text not null,
  service text not null,
  booking_date date not null,
  booking_time text not null default '',
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

-- The app uses the service-role key in its edge function, so it can read/write regardless of RLS.
-- These policies make the table friendlier if you later query it directly from authenticated clients.
drop policy if exists "Users can read own bookings" on public.bookings;
create policy "Users can read own bookings"
on public.bookings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own bookings" on public.bookings;
create policy "Users can create own bookings"
on public.bookings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own bookings" on public.bookings;
create policy "Users can update own bookings"
on public.bookings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
