-- Allow the app's admin emails to read and manage all bookings directly from Supabase.
-- This supports the frontend talking to the bookings table without depending on an edge function.

alter table public.bookings enable row level security;

drop policy if exists "Admins can read all bookings" on public.bookings;
create policy "Admins can read all bookings"
on public.bookings
for select
to authenticated
using (lower(auth.jwt() ->> 'email') in ('aryanjain281005@gmail.com', 'vyanasoul369@vyanasoul.com'));

drop policy if exists "Admins can update all bookings" on public.bookings;
create policy "Admins can update all bookings"
on public.bookings
for update
to authenticated
using (lower(auth.jwt() ->> 'email') in ('aryanjain281005@gmail.com', 'vyanasoul369@vyanasoul.com'))
with check (lower(auth.jwt() ->> 'email') in ('aryanjain281005@gmail.com', 'vyanasoul369@vyanasoul.com'));
