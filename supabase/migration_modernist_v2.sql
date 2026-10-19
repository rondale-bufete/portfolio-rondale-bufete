-- =============================================================
-- Modernist redesign wave 2 — new optional metadata columns.
-- Run this in: Supabase Dashboard -> SQL Editor -> New query
-- Safe to re-run: every statement is idempotent.
-- =============================================================

alter table projects add column if not exists provenance text not null default 'Personal';
alter table projects add column if not exists year text not null default '';
alter table projects add column if not exists role text not null default '';
alter table projects add column if not exists timeline text not null default '';
alter table projects add column if not exists outcome text not null default '';

alter table profile add column if not exists location text not null default '';
alter table profile add column if not exists phone text not null default '';
alter table profile add column if not exists open_to text not null default '';
alter table profile add column if not exists status_label text not null default 'OPEN TO WORK';
alter table profile add column if not exists available boolean not null default true;
