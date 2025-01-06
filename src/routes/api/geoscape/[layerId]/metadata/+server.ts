//
import { json } from '@sveltejs/kit';
import { getLayerMetadata } from '$lib/server/services/geoscape.service';
import type { RequestHandler } from './$types';
import type { GeoscapeLayer } from '$lib/data/spatial/types';

export const GET: RequestHandler = async ({ params }) => {
	const { layerId } = params;
	try {
		const metadata = await getLayerMetadata();
		const layers = Object.values(metadata) as GeoscapeLayer[];
		const matchingLayer = layers.find((layer: GeoscapeLayer) => layer.description === layerId);

		if (!matchingLayer) {
			return json({ error: `Layer ${layerId} not found` }, { status: 404 });
		}

		return json(matchingLayer);
	} catch (error) {
		console.error(`Error fetching metadata for ${layerId}:`, error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
