-- «Send profilen til e-posten din» (lib/profile-email.js): one row per email sent, only to enforce the daily limits.
-- Only HMAC hashes of the address and the caller's IP are kept, never the address, answers or scores.
-- Only the server reads and writes (service-role key); rows older than two days are deleted when the next email is sent.

create table if not exists public.profile_emails (
  id bigint generated always as identity primary key,
  to_hash text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists profile_emails_created on public.profile_emails (created_at);

alter table public.profile_emails enable row level security;
