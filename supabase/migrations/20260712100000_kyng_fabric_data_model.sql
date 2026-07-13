-- KYNG boundary editor, Phase 1a — fabric parcel-assignment data model
-- (docs/design/kyng-boundary-editor.md).
--
-- The cadastral fabric is a noded, gap-free tessellation harvested from the NSW
-- Land Parcel Property Theme (Lot + Road/Rail/Water corridors + Unidentified).
-- KYNG editing becomes assigning each fabric polygon to exactly one KYNG area;
-- a KYNG boundary is the union of its assigned polygons, so adjacent areas share
-- identical fabric edges and gaps/overlaps are impossible by construction.
--
-- SRID contract: storage 7844 (as everywhere), plus a prebuilt 7856 (MGA zone 56)
-- copy for metric ops — the whole AOI sits in zone 56 and ST_Transform is not
-- immutable, so the MGA copy is populated by the build step, not generated.

-- Raw harvested source polygons, one row per NSW service feature. Persisted (not
-- temp) so fabric rebuilds don't have to re-fetch, and so the QA gate can compare
-- faces against their sources.
create table public.cadastre_fabric_src (
	id bigint generated always as identity primary key,
	src_layer text not null check (
		src_layer in ('lot', 'road', 'rail', 'water', 'water_corridor', 'unidentified')
	),
	src_layer_id int not null,
	src_objectid bigint not null,
	cadid bigint,
	lotidstring text,
	lastupdate timestamptz,
	geom geometry(MultiPolygon, 7844) not null,
	source text not null default 'NSW Spatial Services',
	source_layer text,
	fetched_at timestamptz not null default now(),
	unique (src_layer, src_objectid)
);
create index cadastre_fabric_src_geom_gix on public.cadastre_fabric_src using gist (geom);

-- The assembled coverage: faces produced by snapping/noding/polygonizing the
-- source boundaries. src_* columns carry the best-matching source feature
-- ('unmatched' = a face no source polygon claims — surfaced by the QA gate).
create table public.cadastre_fabric (
	fabric_id bigint generated always as identity primary key,
	src_layer text not null check (
		src_layer in ('lot', 'road', 'rail', 'water', 'water_corridor', 'unidentified', 'unmatched')
	),
	src_objectid bigint,
	lotidstring text,
	cadid bigint,
	geom geometry(Polygon, 7844) not null,
	geom_mga geometry(Polygon, 7856) not null,
	area_m2 double precision not null,
	fabric_version int not null,
	source text not null default 'NSW Spatial Services',
	source_layer text not null default 'NSW_Land_Parcel_Property_Theme_multiCRS (fabric build)',
	fetched_at timestamptz not null default now()
);
create index cadastre_fabric_geom_gix on public.cadastre_fabric using gist (geom);
create index cadastre_fabric_geom_mga_gix on public.cadastre_fabric using gist (geom_mga);

-- Edit sessions: the draft workspace for one boundary-reconfiguration exercise.
-- Candidate assignments live in kyng_fabric_assignment_candidate; derived
-- candidate geometry goes to the existing kyng_areas_candidate table.
create table public.kyng_edit_session (
	session_id uuid primary key default gen_random_uuid(),
	kyng_ids uuid[] not null,
	status text not null default 'draft' check (
		status in ('draft', 'validated', 'promoted', 'rejected')
	),
	-- Raw control lines as drawn (GeoJSON, EPSG:4326) — kept for audit/re-propose.
	control_lines jsonb,
	-- Sub-region owner overrides from the last propose ([{region, kyng_id}]).
	region_assignments jsonb,
	-- Result of the last validate run.
	validation jsonb,
	created_by uuid not null default auth.uid(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- The heart of the model: fabric polygon → KYNG. PRIMARY KEY (fabric_id) is the
-- structural no-overlap guarantee (one KYNG per polygon).
create table public.kyng_fabric_assignment (
	fabric_id bigint primary key references public.cadastre_fabric (fabric_id) on delete cascade,
	kyng_id uuid not null references public.kyng_areas (id) on delete cascade,
	assigned_at timestamptz not null default now(),
	assigned_by uuid,
	edit_session_id uuid references public.kyng_edit_session (session_id) on delete set null
);
create index kyng_fabric_assignment_kyng_gix on public.kyng_fabric_assignment (kyng_id);

-- Session-scoped candidate twin of kyng_fabric_assignment.
create table public.kyng_fabric_assignment_candidate (
	session_id uuid not null references public.kyng_edit_session (session_id) on delete cascade,
	fabric_id bigint not null references public.cadastre_fabric (fabric_id) on delete cascade,
	kyng_id uuid not null references public.kyng_areas (id) on delete cascade,
	primary key (session_id, fabric_id)
);
create index kyng_fabric_assignment_candidate_kyng_gix
	on public.kyng_fabric_assignment_candidate (session_id, kyng_id);

-- RLS: boundary reconfiguration is an admin task guarded by the existing
-- admin.site.data.kyng-boundaries permission token (app_data bundle). Policies
-- TO public per repo convention; jwt_can() covers the admin role. Reads only —
-- all writes go through the SECURITY DEFINER session RPCs (Phase 3), so no
-- insert/update/delete policies exist.
alter table public.cadastre_fabric_src enable row level security;
alter table public.cadastre_fabric enable row level security;
alter table public.kyng_edit_session enable row level security;
alter table public.kyng_fabric_assignment enable row level security;
alter table public.kyng_fabric_assignment_candidate enable row level security;

create policy "Kyng boundary admins can read fabric sources"
	on public.cadastre_fabric_src for select to public
	using (jwt_can('admin.site.data.kyng-boundaries'));

create policy "Kyng boundary admins can read fabric"
	on public.cadastre_fabric for select to public
	using (jwt_can('admin.site.data.kyng-boundaries'));

create policy "Kyng boundary admins can read edit sessions"
	on public.kyng_edit_session for select to public
	using (jwt_can('admin.site.data.kyng-boundaries'));

create policy "Kyng boundary admins can read assignments"
	on public.kyng_fabric_assignment for select to public
	using (jwt_can('admin.site.data.kyng-boundaries'));

create policy "Kyng boundary admins can read candidate assignments"
	on public.kyng_fabric_assignment_candidate for select to public
	using (jwt_can('admin.site.data.kyng-boundaries'));

comment on table public.cadastre_fabric_src is
	'Raw NSW Land Parcel Property Theme fabric-primitive polygons (Lot/Road/Rail/Water/WaterCorridor/Unidentified) harvested in-database for the fabric build. source_id = src_objectid per layer.';
comment on table public.cadastre_fabric is
	'Noded, gap-free cadastral fabric faces (polygonized from cadastre_fabric_src boundaries). KYNG boundaries are unions of these faces via kyng_fabric_assignment.';
comment on table public.kyng_edit_session is
	'KYNG boundary edit sessions (draft → validated → promoted/rejected). Candidate assignments in kyng_fabric_assignment_candidate; candidate geometry in kyng_areas_candidate.';
comment on table public.kyng_fabric_assignment is
	'Canonical fabric→KYNG mapping. PK(fabric_id) makes overlap structurally impossible; a KYNG boundary is ST_Union of its assigned faces.';
comment on table public.kyng_fabric_assignment_candidate is
	'Per-session candidate fabric→KYNG mapping produced by propose_kyng_boundary; promoted into kyng_fabric_assignment by promote_kyng_edit_session.';
