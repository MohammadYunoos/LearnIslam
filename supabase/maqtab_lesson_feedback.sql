-- Per-user Maqtab lesson feedback. Apply this once in the Supabase SQL editor.
-- The Edge Function uses the service role to access these tables; clients never
-- write to them directly.

create table if not exists maqtab_lesson_likes (
  lesson_id uuid not null references maqtab_lessons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);

create index if not exists maqtab_lesson_likes_lesson_idx
  on maqtab_lesson_likes (lesson_id);

create table if not exists maqtab_lesson_ratings (
  lesson_id uuid not null references maqtab_lessons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);

create index if not exists maqtab_lesson_ratings_lesson_idx
  on maqtab_lesson_ratings (lesson_id);
