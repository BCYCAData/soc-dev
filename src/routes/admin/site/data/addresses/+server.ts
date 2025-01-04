import { json } from '@sveltejs/kit';
import { PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import * as mvt from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const z = Number(url.searchParams.get('z'));
	const x = Number(url.searchParams.get('x'));
	const y = Number(url.searchParams.get('y'));

	try {
		const options = {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.mapbox-vector-tile, application/json',
				Authorization: PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY
			}
		};

		const response = await fetch(
			`https://api.psma.com.au/v1/maps/geoscape_v1/gnaf/${z}/${x}/${y}.pbf?key=${PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY}`,
			options
		);

		const buffer = await response.arrayBuffer();

		// Check for JSON response first
		const textDecoder = new TextDecoder('utf-8');
		const text = textDecoder.decode(buffer);

		if (text.includes('"messages":["Tile not found"]')) {
			return json({ type: 'FeatureCollection', features: [] });
		}

		// Process vector tile
		const tile = new mvt.VectorTile(new Protobuf(buffer));

		const features = [];
		for (let layerName in tile.layers) {
			const layer = tile.layers[layerName];

			for (let i = 0; i < layer.length; i++) {
				const feature = layer.feature(i);

				const properties: Record<string, string | number> = {};
				const featureProps = feature.properties;
				for (const key in featureProps) {
					if (typeof featureProps[key] === 'string' || typeof featureProps[key] === 'number') {
						properties[key] = featureProps[key];
					}
				}

				const geometry = feature.loadGeometry();
				if (geometry && geometry[0] && geometry[0][0]) {
					const point = geometry[0][0];

					const extent = layer.extent || 4096;
					const size = extent * Math.pow(2, z);
					const x0 = extent * x;
					const y0 = extent * y;

					const lng = ((x0 + point.x) * 360) / size - 180;
					const lat =
						(Math.atan(Math.sinh(Math.PI * (1 - (2 * (y0 + point.y)) / size))) * 180) / Math.PI;

					features.push({
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [lng, lat]
						},
						properties
					});
				}
			}
		}

		return json({
			type: 'FeatureCollection',
			features
		});
	} catch (error) {
		console.error('Error processing tile:', error);
		return json({ type: 'FeatureCollection', features: [] });
	}
};
