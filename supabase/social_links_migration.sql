-- Add Facebook and Instagram profile links, alongside the existing
-- github/linkedin columns.
alter table profile
add column if not exists facebook text not null default '';

alter table profile
add column if not exists instagram text not null default '';
