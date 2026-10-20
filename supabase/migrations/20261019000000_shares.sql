-- Shared videos as links (lib/shares.js): kaleidotest.com/v/<id> unfurls with a big thumbnail and plays the video.
-- One row per share; only the server writes (service-role key) after checking the signed-in user.
-- No answers, scores or email are stored; the title is the profile name shown in the video.
-- The files live in the public bucket «shares» under <id>/ (video.mp4 or video.webm, poster.jpg, card.jpg).

create table if not exists public.shares (
  id text primary key check (id ~ '^[A-Za-z0-9]{10}$'),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  lang text not null default 'no' check (lang in ('no', 'en')),
  kind text not null default 'profile' check (kind in ('profile', 'report')),
  video_ext text not null check (video_ext in ('mp4', 'webm')),
  created_at timestamptz not null default now()
);

create index if not exists shares_user_created on public.shares (user_id, created_at);

alter table public.shares enable row level security;

create policy "Read own shares" on public.shares for select using (auth.uid() = user_id);

-- Public bucket: anyone with the link can watch. Uploads only through signed URLs from the server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('shares', 'shares', true, 52428800, array['video/mp4', 'video/webm', 'image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
