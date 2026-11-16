-- Editable hiring facts used by the public portfolio assistant.
-- Safe to re-run.
alter table profile
add column if not exists chat_job_availability text not null default 'Open to work',
add column if not exists chat_preferred_roles text not null default 'Front-end, backend, or full-stack developer',
add column if not exists chat_work_arrangements text not null default 'Onsite, hybrid, and work-from-home',
add column if not exists chat_start_availability text not null default '1 week after notification',
add column if not exists chat_relocation text not null default 'Metro Manila (including Makati City, Quezon City, Taguig, Pasay, and other Metro Manila cities) and anywhere in the Bicol Region';
