-- Orbact V2 secure CMS schema
-- Public visitors can read published content. Only Supabase Auth users listed
-- in public.admin_users can create, update, delete, or upload CMS media.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.page_sections (
  id uuid default gen_random_uuid() primary key,
  page text not null,
  section_key text not null,
  label text,
  eyebrow text,
  headline text,
  subheadline text,
  body text,
  cta_label text,
  cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  image_url text,
  image_alt text,
  metadata jsonb default '{}'::jsonb,
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page, section_key)
);

create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  short_description text,
  full_description text,
  icon_name text default 'Bot',
  color text default 'text-emerald-400',
  features jsonb default '[]'::jsonb,
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique,
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  image_alt text,
  link text,
  huggingface_link text,
  stats jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_featured boolean default false,
  order_index integer default 0
);

alter table public.projects add column if not exists slug text unique;
alter table public.projects add column if not exists image_alt text;
alter table public.projects add column if not exists published boolean default true;
alter table public.projects add column if not exists order_index integer default 0;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'projects' and column_name = 'order'
  ) then
    execute 'update public.projects set order_index = coalesce(order_index, "order")';
  end if;
end $$;

create table if not exists public.pricing_tiers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price text not null,
  description text,
  features jsonb default '[]'::jsonb,
  recommended boolean default false,
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  page text default 'pricing',
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  image_alt text,
  linkedin_url text,
  twitter_url text,
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  quote text not null,
  author text not null,
  role text,
  company text,
  avatar_url text,
  rating integer default 5 check (rating between 1 and 5),
  published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.media_assets (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  file_path text not null unique,
  public_url text not null,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz default now()
);

create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  budget text,
  message text not null,
  source text default 'Orbact Website',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text,
  record_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_page_sections_page_section on public.page_sections(page, section_key);
create index if not exists idx_services_order on public.services(order_index);
create index if not exists idx_projects_order on public.projects(order_index);
create index if not exists idx_pricing_order on public.pricing_tiers(order_index);
create index if not exists idx_faqs_page_order on public.faqs(page, order_index);
create index if not exists idx_team_order on public.team_members(order_index);
create index if not exists idx_testimonials_order on public.testimonials(order_index);

alter table public.admin_users enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.faqs enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.admin_audit_log enable row level security;

drop policy if exists "Allow public read access" on public.projects;
drop policy if exists "Allow public insert" on public.projects;
drop policy if exists "Allow public update" on public.projects;
drop policy if exists "Allow public delete" on public.projects;
drop policy if exists "Public read services" on public.services;
drop policy if exists "Public insert services" on public.services;
drop policy if exists "Public update services" on public.services;
drop policy if exists "Public delete services" on public.services;
drop policy if exists "Public read pricing" on public.pricing_tiers;
drop policy if exists "Public insert pricing" on public.pricing_tiers;
drop policy if exists "Public update pricing" on public.pricing_tiers;
drop policy if exists "Public delete pricing" on public.pricing_tiers;
drop policy if exists "Public read faqs" on public.faqs;
drop policy if exists "Public insert faqs" on public.faqs;
drop policy if exists "Public update faqs" on public.faqs;
drop policy if exists "Public delete faqs" on public.faqs;
drop policy if exists "Public read team" on public.team_members;
drop policy if exists "Public insert team" on public.team_members;
drop policy if exists "Public update team" on public.team_members;
drop policy if exists "Public delete team" on public.team_members;
drop policy if exists "Public read testimonials" on public.testimonials;
drop policy if exists "Public insert testimonials" on public.testimonials;
drop policy if exists "Public update testimonials" on public.testimonials;
drop policy if exists "Public delete testimonials" on public.testimonials;
drop policy if exists "Public read settings" on public.site_settings;
drop policy if exists "Public update settings" on public.site_settings;

create policy "Admins can read admin users" on public.admin_users for select using (public.is_admin() or auth.uid() = user_id);
create policy "Admins can manage admin users" on public.admin_users for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published page sections" on public.page_sections for select using (published = true or public.is_admin());
create policy "Admins manage page sections" on public.page_sections for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published services" on public.services for select using (published = true or public.is_admin());
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published projects" on public.projects for select using (published = true or public.is_admin());
create policy "Admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published pricing" on public.pricing_tiers for select using (published = true or public.is_admin());
create policy "Admins manage pricing" on public.pricing_tiers for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published faqs" on public.faqs for select using (published = true or public.is_admin());
create policy "Admins manage faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published team" on public.team_members for select using (published = true or public.is_admin());
create policy "Admins manage team" on public.team_members for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read published testimonials" on public.testimonials for select using (published = true or public.is_admin());
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read site settings" on public.site_settings for select using (true);
create policy "Admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "Public read media assets" on public.media_assets for select using (true);
create policy "Admins manage media assets" on public.media_assets for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins read contact submissions" on public.contact_submissions for select using (public.is_admin());
create policy "Admins delete contact submissions" on public.contact_submissions for delete using (public.is_admin());

create policy "Admins read audit log" on public.admin_audit_log for select using (public.is_admin());
create policy "Admins write audit log" on public.admin_audit_log for insert with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Anyone can upload" on storage.objects;
drop policy if exists "Anyone can update" on storage.objects;
drop policy if exists "Anyone can delete" on storage.objects;
drop policy if exists "Public read site media" on storage.objects;
drop policy if exists "Admins upload site media" on storage.objects;
drop policy if exists "Admins update site media" on storage.objects;
drop policy if exists "Admins delete site media" on storage.objects;

create policy "Public read site media" on storage.objects
  for select using (bucket_id = 'site-media');
create policy "Admins upload site media" on storage.objects
  for insert with check (bucket_id = 'site-media' and public.is_admin());
create policy "Admins update site media" on storage.objects
  for update using (bucket_id = 'site-media' and public.is_admin());
create policy "Admins delete site media" on storage.objects
  for delete using (bucket_id = 'site-media' and public.is_admin());

insert into public.page_sections (page, section_key, label, eyebrow, headline, subheadline, body, cta_label, cta_href, secondary_cta_label, secondary_cta_href, metadata)
values
  ('home', 'hero', 'Home hero', 'AI-First Engineering', 'We Build', 'AI That Ships.', 'Custom AI agents, automations, and full-stack products - designed, built, and deployed by a team that actually understands your business.', 'Start Building', '/contact', 'Our Services', '/solutions', '{}'::jsonb),
  ('pricing', 'hero', 'Pricing hero', 'INVESTMENT_MODELS', 'Invest in', 'Velocity.', 'Stop hiring, training, and managing. Start shipping with the power level that matches your ambition.', 'Book a consultation', '/contact', null, null, '{}'::jsonb)
on conflict (page, section_key) do nothing;

insert into public.site_settings (key, value)
values
  ('brand', '{"name":"Orbact","email":"hello@orbact.com","phone":"+1 (555) 000-0000","siteUrl":"https://orbact.com"}'::jsonb),
  ('chatbot_context', '{"name":"Alex","role":"Senior Solutions Architect","tone":"concise, helpful, professional","cta":"/contact"}'::jsonb)
on conflict (key) do nothing;
