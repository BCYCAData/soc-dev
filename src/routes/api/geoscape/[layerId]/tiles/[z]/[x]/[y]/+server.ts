import { json } from '@sveltejs/kit';
import {
	fetchVectorTile,
	vectorTileToGeoJSON,
	getGeometryTypeFromLayer
} from '$lib/server/services/geoscape.service';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/auth/apiGuard';

export const GET: RequestHandler = async (event) => {
	await requireUser(event);
	const { layerId, z, x, y } = event.params;

	try {
		const buffer = await fetchVectorTile(layerId, Number(z), Number(x), Number(y));
		const geometryType = getGeometryTypeFromLayer(layerId);
		const geojson = vectorTileToGeoJSON(buffer, Number(z), Number(x), Number(y), geometryType);
		return json(geojson);
	} catch (error) {
		console.error(`Error processing ${layerId} tile:`, error);
		return json({ type: 'FeatureCollection', features: [] });
	}
};
