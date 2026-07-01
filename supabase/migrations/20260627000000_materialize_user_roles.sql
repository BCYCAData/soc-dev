-- Materialize user_roles → user_roles_primary + user_permissions
--
-- The active JWT hook (public.custom_access_token_hook) builds the `user_role`
-- and `permissions` claims from public.user_roles_primary and
-- public.user_permissions. But the only writer of role assignments — the admin
-- Roles UI (admin/site/roles/assignments) — writes ONLY public.user_roles, and
-- nothing kept the two derived tables in sync. Result: both derived tables were
-- empty, so every user resolved to user_role='user' with no permissions and
-- nobody could actually be an admin.
--
-- This installs the missing materialization:
--   • user_roles_primary.role = 'admin' when the user holds the 'admin' role,
--     else 'user'  (the table's CHECK only allows 'user' | 'admin').
--   • user_permissions = the FLATTENED set of dot-notation tokens for all of the
--     user's roles. role_permissions.permission stores comma-joined bundles
--     (e.g. 'admin,admin.site,admin.site.messages'); user_permissions has a
--     PRIMARY KEY (user_id, permission), so tokens are split out and de-duped.
--     Flattening also lets the DB-side has_permission()/RLS match individual
--     tokens (e.g. 'admin.site.profile-requirements').
-- A trigger keeps both in sync on every user_roles change, and the tail
-- backfills all existing users.

CREATE OR REPLACE FUNCTION public.sync_user_role_materialization(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Rebuild flattened permissions for this user from all of their roles.
  DELETE FROM public.user_permissions WHERE user_id = p_user_id;

  INSERT INTO public.user_permissions (user_id, permission)
  SELECT DISTINCT p_user_id, btrim(tok)
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON rp.role = ur.role
  CROSS JOIN LATERAL unnest(string_to_array(rp.permission, ',')) AS tok
  WHERE ur.user_id = p_user_id
    AND btrim(tok) <> '';

  -- Rebuild the coarse primary role flag ('admin' if they hold the admin role).
  DELETE FROM public.user_roles_primary WHERE user_id = p_user_id;

  INSERT INTO public.user_roles_primary (user_id, role)
  VALUES (
    p_user_id,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_user_id AND role = 'admin'
      ) THEN 'admin'
      ELSE 'user'
    END
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_user_roles_materialize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_user_role_materialization(OLD.user_id);
    RETURN OLD;
  END IF;

  PERFORM public.sync_user_role_materialization(NEW.user_id);
  -- Handle the (rare) case of a user_id being reassigned on UPDATE.
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    PERFORM public.sync_user_role_materialization(OLD.user_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_materialize ON public.user_roles;
CREATE TRIGGER user_roles_materialize
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.trg_user_roles_materialize();

-- Backfill every existing user that has a role assignment.
DO $$
DECLARE
  uid uuid;
BEGIN
  FOR uid IN SELECT DISTINCT user_id FROM public.user_roles LOOP
    PERFORM public.sync_user_role_materialization(uid);
  END LOOP;
END;
$$;
