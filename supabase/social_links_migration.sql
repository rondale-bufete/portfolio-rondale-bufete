-- Add Facebook and Instagram profile links.
alter table profile
add column if not exists facebook text not null default '';

alter table profile
add column if not exists instagram text not null default '';
