-- Move existing booking records from the legacy kv store into the real bookings table.
-- Safe to run more than once; duplicate ids are ignored.

insert into public.bookings (
  id,
  user_id,
  user_name,
  user_email,
  service,
  booking_date,
  booking_time,
  notes,
  status,
  created_at,
  updated_at
)
select
  (value->>'id') as id,
  (value->>'userId')::uuid as user_id,
  coalesce(value->>'userName', value->>'userEmail', 'User') as user_name,
  coalesce(value->>'userEmail', '') as user_email,
  value->>'service' as service,
  (value->>'date')::date as booking_date,
  coalesce(value->>'time', '') as booking_time,
  coalesce(value->>'notes', '') as notes,
  coalesce(value->>'status', 'pending') as status,
  coalesce((value->>'createdAt')::timestamptz, now()) as created_at,
  coalesce((value->>'createdAt')::timestamptz, now()) as updated_at
from public.kv_store_d03e957c
where key like 'booking:%'
on conflict (id) do nothing;
