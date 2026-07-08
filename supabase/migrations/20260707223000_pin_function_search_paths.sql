-- C3: pin search_path on every public function that lacks one (advisor:
-- function_search_path_mutable ×103). `public, extensions` replicates the
-- session default these functions already resolve against (Supabase DB default
-- is "$user", public, extensions), so behaviour is unchanged while search_path
-- injection is closed off. Schema-qualified references (auth.*, vault.*,
-- cron.*) are unaffected.
DO $$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND NOT EXISTS (
        SELECT 1 FROM unnest(coalesce(p.proconfig, '{}'::text[])) c
        WHERE c LIKE 'search_path=%'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, extensions', fn.sig);
  END LOOP;
END $$;
