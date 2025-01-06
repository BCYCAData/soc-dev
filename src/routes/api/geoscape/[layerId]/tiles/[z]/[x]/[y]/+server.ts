import { json } from '@sveltejs/kit';
import { fetchVectorTile, vectorTileToGeoJSON } from '$lib/server/services/geoscape.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { layerId, z, x, y } = params;

	try {
		const buffer = await fetchVectorTile(layerId, Number(z), Number(x), Number(y));

		const geojson = vectorTileToGeoJSON(buffer, Number(z), Number(x), Number(y));
		return json(geojson);
	} catch (error) {
		console.error(`Error processing ${layerId} tile:`, error);
		return json({ type: 'FeatureCollection', features: [] });
	}
};
