-- =========================================================
-- OAK Partner Gathering: Row Level Security policies
-- =========================================================

-- Returns true only when the logged-in Supabase Auth user
-- has an entry in public.admin_profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Enable RLS on every application table.
alter table public.admin_profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_days enable row level security;
alter table public.attendees enable row level security;
alter table public.attendance enable row level security;
alter table public.partners enable row level security;
alter table public.programme_sessions enable row level security;
alter table public.documentation_posts enable row level security;
alter table public.documentation_photos enable row level security;

-- =========================================================
-- ADMIN PROFILES
-- =========================================================

create policy "Admins can view admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_admin());

-- =========================================================
-- EVENTS
-- Public users can see only active event information.
-- =========================================================

create policy "Anyone can view active events"
on public.events
for select
to anon, authenticated
using (is_active = true);

create policy "Admins manage events"
on public.events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- EVENT DAYS
-- =========================================================

create policy "Anyone can view days for active events"
on public.event_days
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_days.event_id
      and e.is_active = true
  )
);

create policy "Admins manage event days"
on public.event_days
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- ATTENDEES
-- No anonymous/select policy exists. Private data is visible
-- only to logged-in users who are listed in admin_profiles.
-- =========================================================

create policy "Admins can view attendees"
on public.attendees
for select
to authenticated
using (public.is_admin());

create policy "Admins can update attendees"
on public.attendees
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete attendees"
on public.attendees
for delete
to authenticated
using (public.is_admin());

-- Important:
-- There is deliberately no public INSERT rule. The next
-- migration adds a narrow registration function instead.

-- =========================================================
-- ATTENDANCE
-- =========================================================

create policy "Admins can view attendance"
on public.attendance
for select
to authenticated
using (public.is_admin());

create policy "Admins can create attendance"
on public.attendance
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update attendance"
on public.attendance
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete attendance"
on public.attendance
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- PARTNERS
-- The public can read published directory entries only.
-- =========================================================

create policy "Public can view published partners"
on public.partners
for select
to anon, authenticated
using (is_published = true);

create policy "Admins manage partners"
on public.partners
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- PROGRAMME SESSIONS
-- The public can read published sessions only.
-- =========================================================

create policy "Public can view published programme sessions"
on public.programme_sessions
for select
to anon, authenticated
using (is_published = true);

create policy "Admins manage programme sessions"
on public.programme_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- DOCUMENTATION POSTS AND PHOTOS
-- Public visitors can see only published event documentation.
-- =========================================================

create policy "Public can view published documentation posts"
on public.documentation_posts
for select
to anon, authenticated
using (is_published = true);

create policy "Admins manage documentation posts"
on public.documentation_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view photos for published posts"
on public.documentation_photos
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.documentation_posts post
    where post.id = documentation_photos.documentation_post_id
      and post.is_published = true
  )
);

create policy "Admins manage documentation photos"
on public.documentation_photos
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());