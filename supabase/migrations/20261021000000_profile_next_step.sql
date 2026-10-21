-- «Dine neste steg» (app/next-steps.js): the one experiment the person picked and whether they tried it, kept with
-- the saved profile so it follows the account to other devices. Small JSON object; the existing row-level
-- security on profiles already limits it to the owner.
alter table public.profiles add column if not exists next_step jsonb
  check (next_step is null or (jsonb_typeof(next_step) = 'object' and pg_column_size(next_step) < 2048));
