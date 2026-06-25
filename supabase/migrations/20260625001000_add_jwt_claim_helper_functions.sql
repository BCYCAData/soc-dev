-- Helpers to parse JSON-array JWT claims correctly inside RLS policies.
--
-- Root issue: policies used (auth.jwt() ->> 'claim')::uuid[] / ::text[]. The ->>
-- operator yields the claim as JSON text (e.g. ["uuid"]), which cannot be cast
-- to a Postgres array (those use {uuid}), throwing 22P02 "malformed array
-- literal". This was dormant until custom_access_token_hook was enabled and
-- began populating property_ids / permissions / coordinates_kyng.
--
-- These helpers return proper Postgres arrays/booleans. No-arg variants are
-- STABLE with no row-dependent input, so they evaluate once per statement.

-- All property UUIDs from the property_ids claim.
CREATE OR REPLACE FUNCTION public.jwt_property_ids()
RETURNS uuid[]
LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT coalesce(array_agg(value::uuid), '{}'::uuid[])
  FROM jsonb_array_elements_text(coalesce(auth.jwt() -> 'property_ids', '[]'::jsonb))
$$;

-- KYNG area UUIDs from the coordinates_kyng claim ([{kyngAreaId,kyngName},...]).
CREATE OR REPLACE FUNCTION public.jwt_kyng_area_ids()
RETURNS uuid[]
LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT coalesce(array_agg((k ->> 'kyngAreaId')::uuid), '{}'::uuid[])
  FROM jsonb_array_elements(coalesce(auth.jwt() -> 'coordinates_kyng', '[]'::jsonb)) AS k
$$;

-- True if the caller is an admin, or the given permission token is present in
-- the (comma-joined-bundle) permissions claim. Preserves the original policies'
-- "user_role='admin' OR perm = ANY(permissions)" exact-match intent.
CREATE OR REPLACE FUNCTION public.jwt_can(perm text)
RETURNS boolean
LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT coalesce((auth.jwt() ->> 'user_role') = 'admin', false)
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(coalesce(auth.jwt() -> 'permissions', '[]'::jsonb)) AS b(bundle),
           unnest(string_to_array(b.bundle, ',')) AS p
      WHERE p = perm
    )
$$;
