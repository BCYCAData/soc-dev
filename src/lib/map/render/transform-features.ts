/**
 * Group flat spatial-feature + attribute rows (as returned by get_spatial_features
 * and get_spatial_feature_attributes) into a GeoJSON FeatureCollection per
 * template id, folding each feature's attributes into its properties.
 *
 * Canonical home for what was previously duplicated in
 * $lib/leaflet/spatialutilities.svelte.ts and the my-map +page.svelte (G6).
 */

export interface SpatialFeatureLike {
	id: string;
	template_id: string;
	geom: GeoJSON.Geometry;
}

export interface FeatureAttributeLike {
	feature_id: string;
	field_id: string;
	value: unknown;
}

export function transformFeaturesToGeoJSON(
	features: Record<string, SpatialFeatureLike> | null | undefined,
	attributes: Record<string, FeatureAttributeLike> | null | undefined
): Record<string, GeoJSON.FeatureCollection> {
	const byTemplate: Record<string, GeoJSON.FeatureCollection> = {};
	if (!features || !attributes) return byTemplate;

	const attrList = Object.values(attributes);

	for (const feature of Object.values(features)) {
		(byTemplate[feature.template_id] ??= { type: 'FeatureCollection', features: [] }).features.push(
			{
				type: 'Feature',
				geometry: feature.geom,
				properties: {
					id: feature.id,
					...attrList
						.filter((attr) => attr.feature_id === feature.id)
						.reduce<
							Record<string, unknown>
						>((acc, attr) => ({ ...acc, [attr.field_id]: attr.value }), {})
				}
			}
		);
	}

	return byTemplate;
}
