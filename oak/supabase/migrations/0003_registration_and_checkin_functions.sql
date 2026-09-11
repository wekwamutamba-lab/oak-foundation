

create or replace function public.register_attendee(
  p_event_slug text,
  p_first_name text,
  p_last_name text,
  p_organization_name text,
  p_sub_partner_name text,
  p_role_title text,
  p_email text,
  p_phone text,
  p_dietary_requirements text,
  p_accessibility_requirements text,
  p_travel_requirements text,
  p_consent_given boolean
)
returns table (
  attendee_id uuid,
  full_name text,
  organization_name text,
  qr_token uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
begin
  if p_consent_given is not true then
    raise exception 'Consent is required to register';
  end if;

  select id
  into v_event_id
  from public.events
  where slug = trim(p_event_slug)
    and is_active = true;

  if v_event_id is null then
    raise exception 'This event is unavailable';
  end if;

  return query
  insert into public.attendees (
    event_id,
    first_name,
    last_name,
    organization_name,
    sub_partner_name,
    role_title,
    email,
    phone,
    dietary_requirements,
    accessibility_requirements,
    travel_requirements,
    consent_given,
    consent_at
  )
  values (
    v_event_id,
    trim(p_first_name),
    trim(p_last_name),
    trim(p_organization_name),
    nullif(trim(coalesce(p_sub_partner_name, '')), ''),
    nullif(trim(coalesce(p_role_title, '')), ''),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_dietary_requirements, '')), ''),
    nullif(trim(coalesce(p_accessibility_requirements, '')), ''),
    nullif(trim(coalesce(p_travel_requirements, '')), ''),
    true,
    now()
  )
  returning
    attendees.id,
    attendees.full_name,
    attendees.organization_name,
    attendees.qr_token;
end;
$$;

revoke all on function public.register_attendee(
  text, text, text, text, text, text, text, text, text, text, text, boolean
) from public;

grant execute on function public.register_attendee(
  text, text, text, text, text, text, text, text, text, text, text, boolean
) to anon, authenticated;


create or replace function public.check_in_attendee(
  p_qr_token uuid,
  p_event_day_id uuid
)
returns table (
  attendee_id uuid,
  full_name text,
  organization_name text,
  checked_in_at timestamptz,
  already_checked_in boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attendee_id uuid;
  v_full_name text;
  v_organization_name text;
  v_checked_in_at timestamptz;
  v_already_checked_in boolean := false;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: admin access is required';
  end if;

  select
    a.id,
    a.full_name,
    a.organization_name
  into
    v_attendee_id,
    v_full_name,
    v_organization_name
  from public.attendees as a
  inner join public.event_days as d
    on d.event_id = a.event_id
  where a.qr_token = p_qr_token
    and d.id = p_event_day_id
    and a.status = 'registered';

  if v_attendee_id is null then
    raise exception 'Invalid attendee pass for this event day';
  end if;

  select att.checked_in_at
  into v_checked_in_at
  from public.attendance as att
  where att.attendee_id = v_attendee_id
    and att.event_day_id = p_event_day_id;

  if v_checked_in_at is not null then
    v_already_checked_in := true;
  else
    insert into public.attendance (
      attendee_id,
      event_day_id,
      checked_in_by,
      scan_source
    )
    values (
      v_attendee_id,
      p_event_day_id,
      auth.uid(),
      'camera'
    )
    returning attendance.checked_in_at
    into v_checked_in_at;
  end if;

  return query
  select
    v_attendee_id,
    v_full_name,
    v_organization_name,
    v_checked_in_at,
    v_already_checked_in;
end;
$$;

revoke all on function public.check_in_attendee(uuid, uuid) from public;

grant execute on function public.check_in_attendee(uuid, uuid) to authenticated;


create or replace view public.admin_daily_headcount
with (security_invoker = true)
as
select
  day.id as event_day_id,
  day.event_date,
  day.label,
  count(attendance.id)::integer as checked_in_count
from public.event_days day
left join public.attendance
  on attendance.event_day_id = day.id
group by day.id, day.event_date, day.label
order by day.event_date;