-- Visitor analytics schema.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Stores only an anonymous per-browser id + timestamps + page paths — no names, no IP, no PII.

create extension if not exists pgcrypto;

create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visit_count int not null default 1
);

create table if not exists page_views (
  id bigint generated always as identity primary key,
  session_id text not null,
  path text not null,
  viewed_at timestamptz not null default now()
);
create index if not exists page_views_session_idx on page_views(session_id);
create index if not exists page_views_path_idx on page_views(path);

alter table visitors enable row level security;
alter table page_views enable row level security;

-- The Admin dashboard reads through the same public anon key the site already uses,
-- so it needs select access. Direct writes to `visitors` are NOT allowed from the client —
-- only through the track_visit() function below (security definer, so it can bypass RLS
-- for its own write, without a client having a general "update visitors" grant).
create policy "anon can read visitors" on visitors for select to anon using (true);
create policy "anon can read page_views" on page_views for select to anon using (true);
create policy "anon can insert page_views" on page_views for insert to anon with check (true);

-- Upserts a visitor row. Increments visit_count only if this session's last visit
-- was on a different calendar day (so page refreshes / route changes within the same
-- visit don't inflate the "returning visitor" count — only a new day does).
create or replace function track_visit(p_session_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into visitors (session_id, first_seen, last_seen, visit_count)
  values (p_session_id, now(), now(), 1)
  on conflict (session_id) do update
    set last_seen = now(),
        visit_count = visitors.visit_count + case when visitors.last_seen::date < now()::date then 1 else 0 end;
end;
$$;

grant execute on function track_visit(text) to anon;
