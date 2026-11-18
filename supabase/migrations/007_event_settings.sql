create table if not exists public.event_settings (
  event_id text primary key,
  sales_open boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.event_settings enable row level security;

drop policy if exists "public can read event settings" on public.event_settings;
create policy "public can read event settings"
on public.event_settings for select to anon, authenticated using (true);

insert into public.event_settings (event_id, sales_open)
values ('DJNIGHT2026', false)
on conflict (event_id) do nothing;
