-- The baseline (20260613120001_remote_schema.sql) was dumped from the
-- public/app_auth/private schemas only, so it includes the function
-- private.handle_new_user() but NOT the trigger that fires it, because the
-- trigger is defined on auth.users (a schema we deliberately do not dump).
--
-- Recreate that trigger here so new signups provision a user_profile (and the
-- default role) exactly as they do in the dev project. The storage triggers
-- present in dev are Supabase-managed defaults and are intentionally NOT
-- recreated.

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
