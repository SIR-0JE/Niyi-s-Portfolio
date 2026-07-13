-- Contact form message storage.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Lets contact form submissions show up in Admin → Messages, in addition to the
-- Web3Forms email notification (VITE_WEB3FORMS_KEY) that's already wired up.

create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);
create index if not exists contact_messages_created_idx on contact_messages(created_at desc);

alter table contact_messages enable row level security;

-- Same trust model as the rest of this app: the anon key is public in the site's
-- JS bundle, and Admin auth is a client-side password check, not real Supabase auth.
create policy "anon can insert contact_messages" on contact_messages for insert to anon with check (true);
create policy "anon can read contact_messages" on contact_messages for select to anon using (true);
create policy "anon can update contact_messages" on contact_messages for update to anon using (true) with check (true);
create policy "anon can delete contact_messages" on contact_messages for delete to anon using (true);
