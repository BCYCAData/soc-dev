import { json } from '@sveltejs/kit';
import {
	fetchVectorTile,
	vectorTileToGeoJSON,
	getGeometryTypeFromLayer
} from '$lib/server/services/geoscape.service';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/auth/apiGuard';

// Geoscape/PSMA reference tiles are keyed by layer + z/x/y and change rarely, so we
// edge-cache the proxy (G8): browsers hold a day, the CDN holds a month and revalidates
// in the background. Content is non-sensitive public reference data, so a shared `public`
// cache is intended even though the route is auth-gated. Transient failures fall back to a
// short TTL so an empty tile never sticks for long.
const TILE_CACHE = 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400';
const EMPTY_TILE_CACHE = 'public, max-age=60';

export const GET: RequestHandler = async (event) => {
	await requireUser(event);
	const { layerId, z, x, y } = event.params;

	try {
		const buffer = await fetchVectorTile(layerId, Number(z), Number(x), Number(y));
		const geometryType = getGeometryTypeFromLayer(layerId);
		const geojson = vectorTileToGeoJSON(buffer, Number(z), Number(x), Number(y), geometryType);
		return json(geojson, { headers: { 'Cache-Control': TILE_CACHE } });
	} catch (error) {
		console.error(`Error processing ${layerId} tile:`, error);
		return json(
			{ type: 'FeatureCollection', features: [] },
			{ headers: { 'Cache-Control': EMPTY_TILE_CACHE } }
		);
	}
};
