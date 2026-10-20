-- Add a rerunnable admin toggle for the public chat widget; the API remains available.
alter table profile
add column if not exists chat_visible boolean not null default true;
