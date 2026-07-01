import type L from 'leaflet';

/**
 * Web-Mercator tile maths for viewport-driven tile fetching (e.g. Geoscape GNAF
 * vector tiles). Ported from the v1 `geometryUtilities.ts` so the v2 map stack has
 * no dependency on `$lib/leaflet/*` (GIS refactor Phase 6).
 */
export interface Bounds {
	north: number;
	south: number;
	east: number;
	west: number;
}

export function convertLeafletBounds(leafletBounds: L.LatLngBounds): Bounds {
	return {
		north: leafletBounds.getNorth(),
		south: leafletBounds.getSouth(),
		east: leafletBounds.getEast(),
		west: leafletBounds.getWest()
	};
}

/** Clamp a viewport to the source layer's advertised coverage bounds. */
export function validateAndClampBounds(bounds: Bounds, apiBounds: Bounds): Bounds {
	return {
		north: Math.min(Math.max(bounds.north, apiBounds.south), apiBounds.north),
		south: Math.min(Math.max(bounds.south, apiBounds.south), apiBounds.north),
		east: Math.min(Math.max(bounds.east, apiBounds.west), apiBounds.east),
		west: Math.min(Math.max(bounds.west, apiBounds.west), apiBounds.east)
	};
}

export function latLngToTile(lat: number, lon: number, zoom: number) {
	const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
	const y = Math.floor(
		((1 -
			Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
			2) *
			Math.pow(2, zoom)
	);
	return { x, y };
}

/** Enumerate the {x,y,z} tiles covering a lat/lng extent at a fixed zoom. */
export function getTilesForExtent(bounds: Bounds, zoom: number) {
	const minTile = latLngToTile(bounds.north, bounds.west, zoom);
	const maxTile = latLngToTile(bounds.south, bounds.east, zoom);

	const tiles: Array<{ x: number; y: number; z: number }> = [];
	for (let x = minTile.x; x <= maxTile.x; x++) {
		for (let y = minTile.y; y <= maxTile.y; y++) {
			tiles.push({ x, y, z: zoom });
		}
	}
	return tiles;
}
