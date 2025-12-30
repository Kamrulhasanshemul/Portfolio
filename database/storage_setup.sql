-- Create a private bucket named 'images'
insert into storage.buckets
  (id, name, public)
values
  ('images', 'images', false)
on conflict (id) do nothing;

-- RLS Policy: Allow authenticated users to upload to their own folder
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Allow users to view their own images (via signed URL, RLS/Token still needed if not signed? Signed URLs bypass RLS if using service role to sign, or use the token. Actually standard signed URLs work with private buckets.)
-- But if strict RLS, we need this:
create policy "Users can view their own images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can delete their own images
create policy "Users can delete their own images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create image_metadata table
create table if not exists public.image_metadata (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  bucket_path text not null unique,
  mime_type text not null,
  file_size bigint not null,
  created_at timestamptz default now()
);

-- RLS for image_metadata
alter table public.image_metadata enable row level security;

create policy "Users can view their own image metadata"
on public.image_metadata for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own image metadata"
on public.image_metadata for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own image metadata"
on public.image_metadata for delete
to authenticated
using (auth.uid() = user_id);
