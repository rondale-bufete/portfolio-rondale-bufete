-- Editable headline numbers under the homepage intro, e.g. [{"value":"300+","label":"subscriber accounts"}].
-- Safe to re-run. The homepage hides the strip while this is empty.
alter table profile
add column if not exists stats jsonb not null default '[]'::jsonb;
