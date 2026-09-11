create extension if not exists pgcrypto;

create type public.attendee_status as enum (
  'registered',
  'cancelled'
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  venue text,
  address text,
  starts_on date not null,
  ends_on date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.events (
  slug,
  name,
  venue,
  address,
  starts_on,
  ends_on
)
values (
  'oak-partner-gathering-2026',
  'OAK Zimbabwe Foundation Partner Gathering',
  'Cresta Lodge, Msasa',
  '19 Northampton Crescent, Harare, Zimbabwe',
  '2026-11-09',
  '2026-11-11'
);

create table public.event_days (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  event_date date not null,
  label text not null,
  created_at timestamptz not null default now(),
  unique(event_id, event_date)
);

insert into public.event_days (event_id, event_date, label)
select id, '2026-11-09', 'Day 1'
from public.events
where slug = 'oak-partner-gathering-2026';

insert into public.event_days (event_id, event_date, label)
select id, '2026-11-10', 'Day 2'
from public.events
where slug = 'oak-partner-gathering-2026';

insert into public.event_days (event_id, event_date, label)
select id, '2026-11-11', 'Day 3'
from public.events
where slug = 'oak-partner-gathering-2026';

create table public.attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  first_name text not null,
  last_name text not null,
  full_name text generated always as (
    trim(first_name || ' ' || last_name)
  ) stored,

  organization_name text not null,
  sub_partner_name text,
  role_title text,

  email text not null,
  phone text,

  dietary_requirements text,
  accessibility_requirements text,
  travel_requirements text,

  consent_given boolean not null default false,
  consent_at timestamptz,
  consent_version text not null default '2026-09',

  status public.attendee_status not null default 'registered',
  qr_token uuid not null unique default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (char_length(trim(first_name)) > 0),
  check (char_length(trim(last_name)) > 0),
  check (char_length(trim(organization_name)) > 0),
  check (email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
);

create index attendees_event_id_idx on public.attendees(event_id);
create index attendees_email_idx on public.attendees(lower(email));
create index attendees_full_name_idx on public.attendees(full_name);
create index attendees_qr_token_idx on public.attendees(qr_token);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  attendee_id uuid not null references public.attendees(id) on delete cascade,
  event_day_id uuid not null references public.event_days(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references auth.users(id) on delete set null,
  scan_source text not null default 'camera',

  unique(attendee_id, event_day_id)
);

create index attendance_event_day_idx on public.attendance(event_day_id);
create index attendance_attendee_idx on public.attendance(attendee_id);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website_url text,
  logo_path text,
  is_sub_partner boolean not null default false,
  parent_partner_id uuid references public.partners(id) on delete set null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_published_order_idx
on public.partners(is_published, display_order);

create table public.programme_sessions (
  id uuid primary key default gen_random_uuid(),
  event_day_id uuid not null references public.event_days(id) on delete cascade,
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  speaker_names text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (ends_at is null or ends_at > starts_at)
);

create index programme_sessions_day_order_idx
on public.programme_sessions(event_day_id, display_order, starts_at);

create table public.documentation_posts (
  id uuid primary key default gen_random_uuid(),
  event_day_id uuid not null references public.event_days(id) on delete cascade,
  title text not null,
  body text not null,
  cover_image_path text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documentation_photos (
  id uuid primary key default gen_random_uuid(),
  documentation_post_id uuid not null references public.documentation_posts(id) on delete cascade,
  image_path text not null,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger attendees_set_updated_at
before update on public.attendees
for each row execute procedure public.set_updated_at();

create trigger partners_set_updated_at
before update on public.partners
for each row execute procedure public.set_updated_at();

create trigger programme_sessions_set_updated_at
before update on public.programme_sessions
for each row execute procedure public.set_updated_at();

create trigger documentation_posts_set_updated_at
before update on public.documentation_posts
for each row execute procedure public.set_updated_at();