

-- Experience table.
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text not null default '',
  company_url text not null default '',
  period text not null default '',       -- e.g. "Jan 2023 — Present"
  bullets text[] not null default '{}',  -- achievements / responsibilities
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table experience enable row level security;
create policy "public read experience" on experience for select using (true);

-- Add education bullet points.
alter table education add column if not exists bullets text[] not null default '{}';

-- Add certification credential IDs.
alter table certifications add column if not exists credential_id text not null default '';

-- Add project highlight bullet points.
alter table projects add column if not exists highlights text[] not null default '{}';

-- Allow the experience section kind.
alter table sections drop constraint if exists sections_kind_check;
alter table sections add constraint sections_kind_check
  check (kind in ('about', 'experience', 'skills', 'projects', 'contact', 'custom'));

-- Insert Experience after the first section and keep it hidden until enabled.
do $$
begin
  if not exists (select 1 from sections where kind = 'experience') then
    update sections set sort_order = sort_order + 1 where sort_order >= 1;
    insert into sections (kind, label, heading, sort_order, visible)
    values ('experience', '02 — Experience', 'Where I''ve worked', 1, false);
  end if;
end $$;
