-- FCM device tokens, one row per device the user has signed in on. Apply
-- this once in the Supabase SQL editor. The Edge Function uses the service
-- role to read/write this table; clients never write to it directly.

create table if not exists device_tokens (
  user_id uuid not null references profiles(id) on delete cascade,
  fcm_token text not null,
  platform text not null default 'android',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (fcm_token)
);

create index if not exists device_tokens_user_idx
  on device_tokens (user_id);
