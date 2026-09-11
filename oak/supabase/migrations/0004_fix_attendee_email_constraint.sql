alter table public.attendees
drop constraint if exists attendees_email_check;

alter table public.attendees
add constraint attendees_email_check
check (
  email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);