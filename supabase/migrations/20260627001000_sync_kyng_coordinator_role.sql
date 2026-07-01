-- Keep the 'kyng' role in sync with active KYNG coordinator assignments.
--
-- Accessing /kyng-coordinator requires the 'kyng' permission (granted by the
-- 'kyng' role) AND a matching coordinates_kyng claim. But coordinator
-- assignment — via the admin UI's add_kyng_area_user RPC, or end_kyng_area_user
-- to revoke — only writes public.kyng_area_users_join; it never touches
-- user_roles. So assigning a coordinator gave them the area claim but NOT the
-- 'kyng' permission, leaving them 403'd out of the section.
--
-- This ties the 'kyng' role to active coordinator status: a user with at least
-- one active assignment (end_date IS NULL) gets the 'kyng' role; when their last
-- active assignment ends/deletes, it is removed. Writes to user_roles cascade
-- through the existing user_roles_materialize trigger, which keeps
-- user_permissions / user_roles_primary (and thus the JWT claims) current.
-- ('kyng' only gates the coordinator section, so it is meaningless without an
-- assignment — hence safe to mirror.)

CREATE OR REPLACE FUNCTION public.sync_kyng_coordinator_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.kyng_area_users_join
    WHERE user_id = p_user_id AND end_date IS NULL
  ) THEN
    -- Has an active assignment → ensure the 'kyng' role exists.
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = 'kyng'
    ) THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'kyng');
    END IF;
  ELSE
    -- No active assignment → drop the 'kyng' role if present.
    DELETE FROM public.user_roles WHERE user_id = p_user_id AND role = 'kyng';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_kyng_coordinator_role_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_kyng_coordinator_role(OLD.user_id);
    RETURN OLD;
  END IF;

  PERFORM public.sync_kyng_coordinator_role(NEW.user_id);
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    PERFORM public.sync_kyng_coordinator_role(OLD.user_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS kyng_coordinator_role_sync ON public.kyng_area_users_join;
CREATE TRIGGER kyng_coordinator_role_sync
AFTER INSERT OR UPDATE OR DELETE ON public.kyng_area_users_join
FOR EACH ROW
EXECUTE FUNCTION public.trg_kyng_coordinator_role_sync();

-- Backfill: reconcile every user who either has an active assignment or
-- currently holds the 'kyng' role.
DO $$
DECLARE
  uid uuid;
BEGIN
  FOR uid IN
    SELECT user_id FROM public.kyng_area_users_join WHERE end_date IS NULL
    UNION
    SELECT user_id FROM public.user_roles WHERE role = 'kyng'
  LOOP
    PERFORM public.sync_kyng_coordinator_role(uid);
  END LOOP;
END;
$$;
