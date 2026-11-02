-- Run this once in Supabase SQL Editor.
-- Keep public sign-ups disabled; create the admin account in Authentication first.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;
grant select on public.site_admins to authenticated;

drop policy if exists "Admins can read their own membership" on public.site_admins;
create policy "Admins can read their own membership"
  on public.site_admins for select to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.site_profile (
  id smallint primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_profile enable row level security;
grant select on public.site_profile to anon, authenticated;
grant insert, update on public.site_profile to authenticated;

drop policy if exists "Public can read the portfolio profile" on public.site_profile;
create policy "Public can read the portfolio profile"
  on public.site_profile for select to anon, authenticated
  using (true);

drop policy if exists "Admins can create the portfolio profile" on public.site_profile;
create policy "Admins can create the portfolio profile"
  on public.site_profile for insert to authenticated
  with check (exists (
    select 1 from public.site_admins
    where user_id = (select auth.uid())
  ));

drop policy if exists "Admins can update the portfolio profile" on public.site_profile;
create policy "Admins can update the portfolio profile"
  on public.site_profile for update to authenticated
  using (exists (
    select 1 from public.site_admins
    where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.site_admins
    where user_id = (select auth.uid())
  ));

create or replace function public.set_site_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_profile_updated_at on public.site_profile;
create trigger set_site_profile_updated_at
  before update on public.site_profile
  for each row execute procedure public.set_site_profile_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-assets', 'profile-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'profile-assets');

drop policy if exists "Admins can upload portfolio assets" on storage.objects;
create policy "Admins can upload portfolio assets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile-assets'
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Admins can update portfolio assets" on storage.objects;
create policy "Admins can update portfolio assets"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'profile-assets'
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'profile-assets'
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );

drop policy if exists "Admins can delete portfolio assets" on storage.objects;
create policy "Admins can delete portfolio assets"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'profile-assets'
    and exists (select 1 from public.site_admins where user_id = (select auth.uid()))
  );
