-- ============================================================
-- Admin Panel Upgrade: New Tables + Status Updates
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Gallery Images
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'Practice',
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.gallery_images enable row level security;
create policy "Public read gallery" on public.gallery_images for select to anon, authenticated using (true);

-- 2. Blog Posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  author text not null default 'Rekha Bala',
  category text not null default 'Akashic Reading',
  image_url text not null default '',
  tags text[] not null default '{}',
  read_time text not null default '5 min read',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create policy "Public read published blogs" on public.blog_posts for select to anon, authenticated using (published = true);

-- 3. Reviews / Testimonials
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'Client',
  location text not null default '',
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  review text not null,
  full_review text not null default '',
  service text not null default '',
  color text not null default 'from-purple-400 to-violet-600',
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Public read reviews" on public.reviews for select to anon, authenticated using (true);

-- 4. Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  duration text not null default '',
  level text not null default 'All Levels' check (level in ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  price text not null default '',
  original_price text not null default '',
  emoji text not null default '✨',
  category text not null default '',
  features text[] not null default '{}',
  popular boolean not null default false,
  color text not null default 'from-violet-500 to-purple-600',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;
create policy "Public read published courses" on public.courses for select to anon, authenticated using (published = true);

-- 5. Update consultancy_requests status check to allow more statuses
-- First, fix any existing rows to match the new constraint
update public.consultancy_requests 
set status = 'new' 
where status not in ('new', 'in-progress', 'completed', 'cancelled') 
   or status is null;

-- (If the column has a check constraint, we drop and re-add it)
alter table public.consultancy_requests drop constraint if exists consultancy_requests_status_check;
alter table public.consultancy_requests add constraint consultancy_requests_status_check
  check (status in ('new', 'in-progress', 'completed', 'cancelled'));

-- 6. Update bookings status check to allow 'completed'
-- Fix existing rows first
update public.bookings 
set status = 'pending' 
where status not in ('pending', 'confirmed', 'completed', 'cancelled') 
   or status is null;

alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'completed', 'cancelled'));
