-- Phase 5 (caching hardening) — G11: provenance on cached NSW Spatial Services geometry.
--
-- The project_* tables are server-side caches of NSW Spatial Services reference data,
-- repopulated wholesale (TRUNCATE + INSERT) by the extract_* functions that
-- refresh_spatial_data() drives. Until now staleness was not queryable: the legacy
-- `refresh_date date` column was never populated by the extract functions.
--
-- We add provenance columns with DEFAULTs only. Because the extract functions INSERT
-- without naming these columns, every refresh auto-stamps them — no change to the
-- (large, fragile) extract function bodies is required. Existing rows keep NULL
-- fetched_at (their true fetch time is unknown); the next refresh stamps them.
--
-- now() inside the refresh transaction is the transaction start time, so all rows from
-- one refresh share a single fetched_at — exactly the semantics we want for staleness.

-- project_addresspoints — NSW_Geocoded_Addressing_Theme/FeatureServer/1 (AddressPoint) + /3 (AddressString)
ALTER TABLE public.project_addresspoints
	ADD COLUMN IF NOT EXISTS source       text,
	ADD COLUMN IF NOT EXISTS source_layer text,
	ADD COLUMN IF NOT EXISTS fetched_at   timestamptz;
ALTER TABLE public.project_addresspoints
	ALTER COLUMN source       SET DEFAULT 'NSW Spatial Services',
	ALTER COLUMN source_layer SET DEFAULT 'NSW_Geocoded_Addressing_Theme/FeatureServer/1+3',
	ALTER COLUMN fetched_at   SET DEFAULT now(),
	ALTER COLUMN refresh_date SET DEFAULT CURRENT_DATE;

-- project_waypoints — NSW_Geocoded_Addressing_Theme/FeatureServer/0 (AddressSitePoint)
ALTER TABLE public.project_waypoints
	ADD COLUMN IF NOT EXISTS source       text,
	ADD COLUMN IF NOT EXISTS source_layer text,
	ADD COLUMN IF NOT EXISTS fetched_at   timestamptz;
ALTER TABLE public.project_waypoints
	ALTER COLUMN source       SET DEFAULT 'NSW Spatial Services',
	ALTER COLUMN source_layer SET DEFAULT 'NSW_Geocoded_Addressing_Theme/FeatureServer/0',
	ALTER COLUMN fetched_at   SET DEFAULT now(),
	ALTER COLUMN refresh_date SET DEFAULT CURRENT_DATE;

-- project_proways — NSW_Geocoded_Addressing_Theme/FeatureServer/2 (Proway)
ALTER TABLE public.project_proways
	ADD COLUMN IF NOT EXISTS source       text,
	ADD COLUMN IF NOT EXISTS source_layer text,
	ADD COLUMN IF NOT EXISTS fetched_at   timestamptz;
ALTER TABLE public.project_proways
	ALTER COLUMN source       SET DEFAULT 'NSW Spatial Services',
	ALTER COLUMN source_layer SET DEFAULT 'NSW_Geocoded_Addressing_Theme/FeatureServer/2',
	ALTER COLUMN fetched_at   SET DEFAULT now(),
	ALTER COLUMN refresh_date SET DEFAULT CURRENT_DATE;

-- project_properties — NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/12 (Property)
ALTER TABLE public.project_properties
	ADD COLUMN IF NOT EXISTS source       text,
	ADD COLUMN IF NOT EXISTS source_layer text,
	ADD COLUMN IF NOT EXISTS fetched_at   timestamptz;
ALTER TABLE public.project_properties
	ALTER COLUMN source       SET DEFAULT 'NSW Spatial Services',
	ALTER COLUMN source_layer SET DEFAULT 'NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/12',
	ALTER COLUMN fetched_at   SET DEFAULT now(),
	ALTER COLUMN refresh_date SET DEFAULT CURRENT_DATE;

-- project_properties_singlepart — same source as project_properties (exploded to singlepart)
ALTER TABLE public.project_properties_singlepart
	ADD COLUMN IF NOT EXISTS source       text,
	ADD COLUMN IF NOT EXISTS source_layer text,
	ADD COLUMN IF NOT EXISTS fetched_at   timestamptz;
ALTER TABLE public.project_properties_singlepart
	ALTER COLUMN source       SET DEFAULT 'NSW Spatial Services',
	ALTER COLUMN source_layer SET DEFAULT 'NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/12',
	ALTER COLUMN fetched_at   SET DEFAULT now(),
	ALTER COLUMN refresh_date SET DEFAULT CURRENT_DATE;

-- Native NSW Spatial Services object ids already act as the per-row source_id on each
-- table; document the mapping rather than duplicating the column.
COMMENT ON COLUMN public.project_addresspoints.fetched_at IS 'When this row was last fetched from NSW Spatial Services (set per wholesale refresh). source_id = addresspointoid.';
COMMENT ON COLUMN public.project_waypoints.fetched_at IS 'When this row was last fetched from NSW Spatial Services (set per wholesale refresh). source_id = waypointoid.';
COMMENT ON COLUMN public.project_proways.fetched_at IS 'When this row was last fetched from NSW Spatial Services (set per wholesale refresh). source_id = prowayoid.';
COMMENT ON COLUMN public.project_properties.fetched_at IS 'When this row was last fetched from NSW Spatial Services (set per wholesale refresh). source_id = propertyoid.';
COMMENT ON COLUMN public.project_properties_singlepart.fetched_at IS 'When this row was last fetched from NSW Spatial Services (set per wholesale refresh). source_id = propertyoid.';
