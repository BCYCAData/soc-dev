# Legacy data migration (old StrengthenOurCommunity prod → new schema)

Moves the live users + data from the old prod project (`oiwbamoupmoudqwautha`, the old
monolithic `profile` schema) into the new decomposed schema. Re-runnable; contains **no PII**
(PII lives only in the databases and in gitignored dump files).

## Pieces

- **`transform.sql`** — the decomposition. Reads a `legacy` staging schema (old prod's public
  source tables) + the already-loaded `auth.users`, and (re)builds the new `public` tables:
  `user_profile`, `user_postal_address`, `user_communities`, `community_<slug>_profile`,
  `property_profile`, `property_agent`, `user_properties`, `user_property_profile_join`,
  `user_roles`. Idempotent (truncates what it owns, then rebuilds).

## Procedure (dry run on the local stack, then new prod)

1. **Export old prod** (access token only, no DB password needed):
   ```sh
   SUPABASE_ACCESS_TOKEN=$SUPABASE_PROD_ACCESS_TOKEN \
     npx supabase link --project-ref oiwbamoupmoudqwautha
   npx supabase db dump --linked --schema public -f /tmp/legacy/public_schema.sql   # DDL
   npx supabase db dump --linked --data-only --schema public -f /tmp/legacy/public_data.sql
   npx supabase db dump --linked --data-only --schema auth   -f /tmp/legacy/auth_data.sql
   ```
   Keep these dumps **out of git** (PII + a hardcoded key in old prod's own funcs is absent, but
   profiles/auth are PII).

2. **Stage into the target** under a `legacy` schema (rewrite `public.` → `legacy.`), and load
   `auth_data.sql` straight into `auth` (preserves UUIDs + password hashes; the data dump runs in
   `session_replication_role=replica`, so the signup trigger does not fire). The `legacy` DDL load
   is tolerant of `kyng_areas` (a generated column uses `extensions.urlencode`, absent locally —
   not needed for the user transform).

3. **Run the transform:** `psql ... -v ON_ERROR_STOP=1 -f transform.sql` (one transaction).

4. **Validate:** row counts + integrity (every user has a profile/role/community; exactly one
   community-profile FK; password hashes present). Then re-run against new prod
   (`rcnccgyvdgmcnomwcaja`) — the truncate-reload design means dry run and real load are identical.

## Decisions baked in

- Community per user = spatial intersection of the matched GNAF address point with
  `community_areas`, **most-specific (smallest) area wins**; unmatched → `external`.
- `stay_in_touch_choices` / `other_comments` → `user_profile` only.
- Dropped: `send_rfs_survival_plan`, `other_access_information` (empty).
- One `property_profile` per profile.

## Known gaps (pending)

- **44 unmatched users get no `property_profile`** (the new schema requires a NOT-NULL GNAF
  `principaladdresssiteoid`; their address didn't resolve). 29 of them typed a street address that
  is therefore not carried into a property record — decision needed (skip vs sentinel vs manual).
- **`property_geometry` not populated** — it requires `way_point` + `property` geometries (NOT
  NULL) that legacy lacks; populate after the new spatial reference data (`project_addresspoints`
  etc.) is loaded.
- `property_profile.community` / `.kyng` left null until the new `community_areas` / `kyng_areas`
  reference data is loaded (then backfill by `principaladdresssiteoid`).
- `property_geometry.principaladdresssiteoid` is `int4` in the new schema but `bigint` at source —
  a schema inconsistency worth fixing before relying on that column.
