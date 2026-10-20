-- Create chatbot rate limiting in the Supabase SQL Editor.

create table if not exists chat_rate_limits (
  session_id text not null,
  day date not null,
  count int not null default 0,
  primary key (session_id, day)
);

-- No RLS policies restrict this table to the server-side service role.
alter table chat_rate_limits enable row level security;
