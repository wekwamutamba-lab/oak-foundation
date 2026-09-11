create policy "Admins can upload documentation photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documentation-photos'
  and public.is_admin()
);

create policy "Admins can update documentation photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documentation-photos'
  and public.is_admin()
)
with check (
  bucket_id = 'documentation-photos'
  and public.is_admin()
);

create policy "Admins can delete documentation photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documentation-photos'
  and public.is_admin()
);