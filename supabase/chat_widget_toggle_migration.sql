-- Lets the admin hide/show the floating chat widget on the public site.
-- Only hides the UI; /api/chat keeps working. Safe to re-run.
alter table profile
add column if not exists chat_visible boolean not null default true;
