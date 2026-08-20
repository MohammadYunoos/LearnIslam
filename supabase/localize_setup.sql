-- supabase/localize_setup.sql
-- One-time setup for the auto-localize (english-urdu) feature.
-- The /localize/hook + /localize/backfill routes upsert the english-urdu
-- sibling of an english row. Upsert needs a unique index on the LOGICAL key
-- (id auto-generates, so id is not the conflict target).
--
-- If either CREATE fails with a duplicate-key error, you have existing rows
-- that violate the key (e.g. two english rows with the same
-- level/chapter_num/lesson_num). Dedup those first, then re-run.

create unique index if not exists maqtab_lessons_logical_uq
  on maqtab_lessons (level, chapter_num, lesson_num, language);

create unique index if not exists qa_volumes_logical_uq
  on qa_volumes (volume_no, language);
