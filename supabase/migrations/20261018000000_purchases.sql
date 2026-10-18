-- Purchases from Stripe Checkout (lib/payments.js). One row per paid Checkout Session; only the server writes
-- (with the service-role key, after reading the paid session from Stripe). Each user can read their own rows.
-- No answers or scores are stored here. Test purchases (livemode false) do not count once live keys are in.

create table if not exists public.purchases (
  id text primary key,                 -- Stripe Checkout Session id (cs_test_… / cs_live_…)
  user_id uuid not null references auth.users (id) on delete cascade,
  tier text not null check (tier in ('base', 'plus')),
  amount integer not null,             -- minor units (øre / cents)
  currency text not null check (currency in ('nok', 'usd')),
  payment_intent text,
  livemode boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists purchases_user_id on public.purchases (user_id);

alter table public.purchases enable row level security;

create policy "Read own purchases" on public.purchases for select using (auth.uid() = user_id);
