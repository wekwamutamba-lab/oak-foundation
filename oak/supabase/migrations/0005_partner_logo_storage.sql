create policy "Admins can upload partner logos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'partner-logos'
  and public.is_admin()
);

create policy "Admins can update partner logos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'partner-logos'
  and public.is_admin()
)
with check (
  bucket_id = 'partner-logos'
  and public.is_admin()
);

create policy "Admins can delete partner logos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'partner-logos'
  and public.is_admin()
);