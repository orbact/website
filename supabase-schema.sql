-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  link text,
  huggingface_link text,
  stats jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_featured boolean default false,
  "order" integer default 0
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Allow public read access (anyone can view projects)
create policy "Allow public read access"
  on projects for select
  using (true);

-- Allow public insert (for now - we'll add auth later)
create policy "Allow public insert"
  on projects for insert
  with check (true);

-- Allow public update
create policy "Allow public update"
  on projects for update
  using (true);

-- Allow public delete
create policy "Allow public delete"
  on projects for delete
  using (true);

-- Create storage bucket for project images
insert into storage.buckets (id, name, public) 
values ('project-images', 'project-images', true);

-- Storage policy for public access
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Allow anyone to upload
create policy "Anyone can upload"
  on storage.objects for insert
  with check (bucket_id = 'project-images');

-- Allow anyone to update their uploads
create policy "Anyone can update"
  on storage.objects for update
  using (bucket_id = 'project-images');

-- Allow anyone to delete
create policy "Anyone can delete"
  on storage.objects for delete
  using (bucket_id = 'project-images');
