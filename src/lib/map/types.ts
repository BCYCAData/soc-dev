/**
 * Single entry point for the v2 map engine's public types (GIS refactor G7).
 *
 * Types are organised by concern rather than dumped in one file:
 * - **engine types** (config schema, profiles, runtime registry) live under `lib/map/*` and are
 *   re-exported here so callers have one import: `import type { LayerConfig, MapProfile } from '$lib/map/types'`;
 * - **data-shape types** (RPC / external-API return shapes, e.g. `AddressPointsGeoJSON`,
 *   `GeoscapeLayer`) stay in `$lib/data/spatial` — they describe data, not the map engine.
 *
 * The v1 `lib/leaflet/*` type files (`spatial.d.ts`, `types.d.ts`) that caused the original
 * scatter were removed in Phase 6.
 */

// Layer configuration schema
export type {
	GeometryType,
	StyleMode,
	MarkerShape,
	LayerConfig,
	StyleConfig,
	PointStyle,
	LineStyle,
	PolygonStyle,
	CategoryStyle,
	InteractionConfig,
	QueryConfig,
	FilterDefinition,
	FilterOperator,
	EditConfig,
	ValidationRule,
	PropertySchema,
	LayerRegistry
} from '$lib/map/layers/schemas/layer-config.types';

// Profiles (map purpose: basemaps, controls, view, attribution) + per-render inputs
export type {
	BaseLayerDef,
	ControlPolicy,
	MapProfile,
	MapViewTarget,
	ResolvedLayer
} from '$lib/map/profiles/types';

// Runtime layer registry / descriptors
export type {
	MapLayerDescriptor,
	LayerMeta,
	MapLayerRegistry,
	MapContext
} from '$lib/map/map-types';
