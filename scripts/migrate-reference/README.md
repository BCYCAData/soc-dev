# Reference / spatial data copy (dev → new prod)

The new app's **curated reference + spatial data** lives in the dev project
(`swyytxokzdqqitszxaep`), not in old prod. New prod (`rcnccgyvdgmcnomwcaja`) gets it by a
same-schema dev → new-prod copy. (Old prod is used only for the user migration in
`../migrate-legacy/`.)

## Tables copied (17)

Spatial: `project_addresspoints` (850), `project_waypoints` (857), `project_properties` (897),
`project_proways` (873), `project_area` (1), `coordinates_kyng` (1), `community_areas` (5),
`kyng_areas` (27).
Options / RBAC / lookups: `community_request_options_lut` (121),
`community_request_options_concordance` (17), `role_permissions` (38), `feature_templates` (9),
`template_fields` (18), `street_type_aliases` (34), `suburb_aliases` (8), `street_list` (1),
`geojson` (1).

**Excluded** (user-linked or per-deployment): `kyng_area_users_join`, `*_candidate`, `stg_*`,
`*_log`, `project_properties_singlepart`, `x_project_area`, and all user/property/survey tables
(those come from old prod via `../migrate-legacy/`).

## Procedure

1. Dump dev public data (access token only): `supabase db dump --linked --data-only --schema public`.
   pg_dump emits INSERTs and **omits generated columns**, so the load recomputes them.
2. Extract only the 17 reference tables' INSERT statements (statement-aware; drop all `SET`
   headers — `SET session_replication_role=replica` would fail on hosted new prod where `postgres`
   is not superuser).
3. Load into new prod in one transaction:
   - Drop 3 FKs that block load ordering, then `delete from` the 17 tables (idempotent), then the
     INSERTs, then re-add the FKs:
     - `community_request_options_concordance.option_id → lut(id)`
     - `community_request_options_lut.concordance → concordance(id)` (circular pair — not
       deferrable, hence drop/recreate)
     - `template_fields.template_id → feature_templates(id)`
   - `postgres` owns these public tables on new prod, so it can drop/add the constraints.
4. Verify row counts match dev (all 13 spot-checked matched: project_properties 897, etc.).

## After this + the user migration

Backfill `property_profile.community` / `.kyng` and `property_geometry` from the now-loaded spatial
tables, keyed by `principaladdresssiteoid` (same lookup `private.handle_new_user` uses for new
signups): intersect the `project_addresspoints` geom for the property's `principaladdresssiteoid`
with `community_areas` / `kyng_areas`.
