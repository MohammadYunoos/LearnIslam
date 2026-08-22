-- supabase/exam_setup.sql
-- Beginner exam: question pool + per-user attempt history.
-- Questions are inserted MANUALLY (see the example inserts at the bottom).
-- The exam picks up to 50 questions, split evenly across chapters, and is
-- scored server-side by the Edge function (/exam/submit). 75% is the pass mark.

create table if not exists beginner_exam_questions (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'Beginner',
  language text not null default 'english',   -- 'english' | 'english-urdu' (Roman)
  chapter_num int not null,
  question text not null,
  options jsonb not null,          -- array of exactly 4 strings
  correct_idx int not null,        -- 0..3
  explanation text,
  sort_order int default 0
);
-- If the table already exists without the column, add it:
alter table beginner_exam_questions
  add column if not exists language text not null default 'english';
create index if not exists beginner_exam_questions_lvl_lang_chapter
  on beginner_exam_questions (level, language, chapter_num);

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  level text not null default 'Beginner',
  score int not null,
  total int not null,
  percent numeric not null,
  passed boolean not null,
  elapsed_seconds int,
  created_at timestamptz not null default now()
);
create index if not exists exam_attempts_user
  on exam_attempts (user_id, level, created_at desc);

-- ── Example questions (manual authoring template) ───────────────────────────
-- Copy this shape. `options` is a JSON array of 4 strings; `correct_idx` is the
-- 0-based index of the right option. `chapter_num` should match the Beginner
-- chapter the question belongs to so the paper stays chapter-balanced.
--
-- English rows use language='english'; Roman-Urdu rows use language='english-urdu'.
-- insert into beginner_exam_questions (level, language, chapter_num, question, options, correct_idx, explanation) values
--   ('Beginner', 'english', 1, 'How many pillars (arkan) does Islam have?',
--    '["3","4","5","6"]'::jsonb, 2, 'Islam is built upon five pillars.'),
--   ('Beginner', 'english-urdu', 1, 'Islam ke kitne arkan (pillars) hain?',
--    '["3","4","5","6"]'::jsonb, 2, 'Islam paanch arkan par qaaim hai.'),
--   ('Beginner', 'english', 3, 'How many fard rak’ahs are in Fajr?',
--    '["2","3","4","5"]'::jsonb, 0, 'Fajr has two fard rak’ahs.');
