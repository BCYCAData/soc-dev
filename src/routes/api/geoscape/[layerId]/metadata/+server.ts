//
import { json } from '@sveltejs/kit';
import { getLayerMetadata } from '$lib/server/services/geoscape.service';
import type { RequestHandler } from './$types';
import type { GeoscapeLayer } from '$lib/data/spatial/types';
import { requireUser } from '$lib/server/auth/apiGuard';

// Layer metadata (TileJSON bounds/zoom) is effectively static reference data; edge-cache it
// (G8). Errors are returned uncached so a transient upstream failure isn't pinned.
const METADATA_CACHE = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600';

export const GET: RequestHandler = async (event) => {
	await requireUser(event);
	const { layerId } = event.params;
	try {
		const metadata = await getLayerMetadata();
		const layers = Object.values(metadata) as GeoscapeLayer[];
		const matchingLayer = layers.find((layer: GeoscapeLayer) => layer.description === layerId);

		if (!matchingLayer) {
			return json({ error: `Layer ${layerId} not found` }, { status: 404 });
		}

		return json(matchingLayer, { headers: { 'Cache-Control': METADATA_CACHE } });
	} catch (error) {
		console.error(`Error fetching metadata for ${layerId}:`, error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
