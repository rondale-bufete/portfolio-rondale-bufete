-- =============================================================
-- Chatbot rate limiting
-- Run this in Supabase -> SQL Editor
-- =============================================================

create table if not exists chat_rate_limits (
  session_id text not null,
  day date not null,
  count int not null default 0,
  primary key (session_id, day)
);

-- RLS enabled with NO policies at all — this locks the table to the
-- service role key only (used server-side in app/api/chat/route.js).
-- The public anon key used by the rest of the site has zero access,
-- which is exactly right: visitors should never be able to read or
-- reset their own rate-limit row directly.
alter table chat_rate_limits enable row level security;
