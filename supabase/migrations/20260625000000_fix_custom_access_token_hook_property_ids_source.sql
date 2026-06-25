-- Fix: custom_access_token_hook built the JWT property_ids claim from
-- public.user_properties, an orphan denormalised copy that nothing keeps in
-- sync. Every other function (and the whole app) uses
-- public.user_property_profile_join as the canonical user<->property link.
--
-- Symptom: a user linked to a property via the canonical table could see the
-- property in the "My Place" menu (fed by get_profile_for_user) but got a 403
-- "Not authorized to view this property" from authGuard, because the JWT
-- property_ids claim (sourced from user_properties) was missing the link.
--
-- Fix: read property_ids from user_property_profile_join so the claim matches
-- the single source of truth. Affected users get a correct claim on their next
-- token refresh / sign-in.

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  claims jsonb;
  user_role text;
  user_permissions text[];
  property_ids uuid[];
  community_slugs text[];
  coordinates_kyng jsonb;
BEGIN
  claims := event->'claims';

  -- Get primary role from user_roles_primary
  SELECT role INTO user_role
  FROM public.user_roles_primary
  WHERE user_id = (event->>'user_id')::uuid;

  -- Get permissions array from user_permissions
  SELECT array_agg(DISTINCT permission) INTO user_permissions
  FROM public.user_permissions
  WHERE user_id = (event->>'user_id')::uuid;

  -- Get property IDs from the canonical link table (was public.user_properties)
  SELECT array_agg(property_id) INTO property_ids
  FROM public.user_property_profile_join
  WHERE user_id = (event->>'user_id')::uuid;

  -- Get community slugs
  SELECT array_agg(community_slug) INTO community_slugs
  FROM public.user_communities
  WHERE user_id = (event->>'user_id')::uuid;

  -- Get KYNG area details (keep if still needed)
  SELECT jsonb_agg(
    jsonb_build_object(
      'kyngAreaId', k.id,
      'kyngName', k.kyng
    )
  ) INTO coordinates_kyng
  FROM public.kyng_area_users_join j
  JOIN public.kyng_areas k ON k.id = j.kyng_area_id
  WHERE j.end_date IS NULL AND j.user_id = (event->>'user_id')::uuid;

  -- Set claims
  claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(user_role, 'user')));
  claims := jsonb_set(claims, '{permissions}', to_jsonb(COALESCE(user_permissions, ARRAY[]::text[])));
  claims := jsonb_set(claims, '{property_ids}', to_jsonb(COALESCE(property_ids, ARRAY[]::uuid[])));
  claims := jsonb_set(claims, '{community_slugs}', to_jsonb(COALESCE(community_slugs, ARRAY[]::text[])));

  IF coordinates_kyng IS NOT NULL THEN
    claims := jsonb_set(claims, '{coordinates_kyng}', coordinates_kyng);
  END IF;

  -- Update the event
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$function$;
