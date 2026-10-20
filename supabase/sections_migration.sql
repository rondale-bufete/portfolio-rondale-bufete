-- Add section configuration after schema.sql; safe to rerun.

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('about', 'skills', 'projects', 'contact', 'custom')),
  label text not null default '',      -- small mono label, e.g. "01 — About"
  heading text not null default '',    -- big section heading
  body text not null default '',       -- only used by kind = 'custom'
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Allow one of each structural section and unlimited custom sections.
create unique index if not exists sections_unique_structural
  on sections (kind)
  where kind <> 'custom';

alter table sections enable row level security;

create policy "public read sections" on sections for select using (true);

-- Seed the default section order only when the table is empty.
insert into sections (kind, label, heading, sort_order)
select * from (
  values
    ('about', '01 — About', 'A bit about how I work', 0),
    ('skills', '02 — Skills', 'Tools I reach for', 1),
    ('projects', '03 — Projects', 'Things I''ve built', 2),
    ('contact', '04 — Contact', 'Let''s work together', 3)
) as v(kind, label, heading, sort_order)
where not exists (select 1 from sections);
