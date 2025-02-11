import { PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY } from '$env/static/public';
import * as mvt from '@mapbox/vector-tile';
import Protobuf from 'pbf';

interface GeoscapeMetadataLayer {
	name: string;
	minzoom: number;
	maxzoom: number;
	bounds: [number, number, number, number];
}

interface TileJsonMetadataResponse {
	tilejson: string;
	name: string;
	bounds: [number, number, number, number];
	minzoom: number;
	maxzoom: number;
	layers: GeoscapeMetadataLayer[];
}

export function getGeometryTypeFromLayer(layerId: string): 'Point' | 'LineString' | 'Polygon' {
	const geometryMap: Record<string, 'Point' | 'LineString' | 'Polygon'> = {
		address: 'Point',
		roads: 'LineString',
		parcels: 'Polygon'
		// Add more mappings as needed
	};
	return geometryMap[layerId] || 'Point';
}

export async function getLayerMetadata() {
	const response = await fetch(
		`https://api.psma.com.au/v1/maps/index.json?key=${PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY}`,
		{
			headers: {
				Accept: 'application/json',
				Authorization: PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY
			}
		}
	);
	return (await response.json()) as TileJsonMetadataResponse;
}

export async function fetchVectorTile(layerId: string, z: number, x: number, y: number) {
	const response = await fetch(
		`https://api.psma.com.au/v1/maps/${layerId}/${z}/${x}/${y}.pbf?key=${PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY}`,
		{
			headers: {
				Accept: 'application/vnd.mapbox-vector-tile, application/json',
				Authorization: PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY
			}
		}
	);
	return await response.arrayBuffer();
}

export function vectorTileToGeoJSON(
	buffer: ArrayBuffer,
	z: number,
	x: number,
	y: number,
	geometryType: 'Point' | 'LineString' | 'Polygon'
) {
	const textDecoder = new TextDecoder('utf-8');
	const text = textDecoder.decode(buffer);

	if (text.includes('"messages":["Tile not found"]')) {
		return { type: 'FeatureCollection', features: [] } as GeoJSON.FeatureCollection;
	}

	const tile = new mvt.VectorTile(new Protobuf(buffer));
	const features: GeoJSON.Feature[] = [];

	for (let layerName in tile.layers) {
		const layer = tile.layers[layerName];
		for (let i = 0; i < layer.length; i++) {
			const feature = layer.feature(i);
			const properties = Object.fromEntries(
				Object.entries(feature.properties).filter(
					([_, value]) => typeof value === 'string' || typeof value === 'number'
				)
			);

			const geometry = feature.loadGeometry();
			const extent = layer.extent || 4096;
			const size = extent * Math.pow(2, z);
			const x0 = extent * x;
			const y0 = extent * y;

			const coordinates = geometry.map((ring) =>
				ring.map((point) => {
					const lng = ((x0 + point.x) * 360) / size - 180;
					const lat =
						(Math.atan(Math.sinh(Math.PI * (1 - (2 * (y0 + point.y)) / size))) * 180) / Math.PI;
					return [lng, lat];
				})
			);

			features.push({
				type: 'Feature',
				geometry: {
					type: geometryType,
					coordinates:
						geometryType === 'Point'
							? coordinates[0][0]
							: geometryType === 'LineString'
								? coordinates[0]
								: coordinates
				},
				properties
			} as GeoJSON.Feature);
		}
	}

	return {
		type: 'FeatureCollection',
		features
	} as GeoJSON.FeatureCollection;
}
