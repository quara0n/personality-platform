-- Saved profiles for signed-in users (app/account.js).
-- One row per account: the 120 answers as the same code as the profile link ('1' + 120 digits 1–5).
-- Row-level security lets each user read, write and delete only their own row.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  answers text not null check (answers ~ '^1[1-5]{120}$'),
  language text not null default 'no' check (language in ('no', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Update own profile" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own profile" on public.profiles for delete using (auth.uid() = user_id);

-- Lets a signed-in user delete their own account; the profile row goes with it (on delete cascade).
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
