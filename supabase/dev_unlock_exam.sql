-- supabase/dev_unlock_exam.sql
-- TESTING ONLY: mark every Beginner lesson complete for one user so the
-- "Beginner Exam" card unlocks in the app. Not for production data.
--
-- 1) Find your user id. In the app (browser devtools console or WebView):
--       localStorage.getItem('mymaqtab_user_id')
--    or look it up here (guests have a name you set at login):
--       select id, name from profiles order by name;
--
-- 2) Put that id below and run.

-- \set uid '00000000-0000-0000-0000-000000000000'   -- (psql only)
-- For the Supabase SQL editor, just replace USER_ID_HERE in both statements.

-- Mark all Beginner lessons (every language row) complete for the user.
insert into maqtab_progress (user_id, lesson_id, quiz_score)
select 'USER_ID_HERE', l.id, 100
from maqtab_lessons l
where l.level = 'Beginner'
  and not exists (
    select 1 from maqtab_progress p
    where p.user_id = 'USER_ID_HERE' and p.lesson_id = l.id
  );

-- Verify (should list the Beginner lessons now marked done):
-- select p.lesson_id, l.chapter_num, l.lesson_num, l.language, p.quiz_score
-- from maqtab_progress p join maqtab_lessons l on l.id = p.lesson_id
-- where p.user_id = 'USER_ID_HERE' and l.level = 'Beginner'
-- order by l.chapter_num, l.lesson_num;

-- ── To RE-LOCK (undo) for that user, delete the rows again: ──
-- delete from maqtab_progress
-- where user_id = 'USER_ID_HERE'
--   and lesson_id in (select id from maqtab_lessons where level = 'Beginner');
