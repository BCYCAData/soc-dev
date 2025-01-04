import type L from 'leaflet';

// Bounding box calculations
export function getPointBBox(coords: number[]): number[] {
	return [coords[0], coords[1], coords[0], coords[1]];
}

export function getLineStringBBox(coords: number[][]): number[] {
	const xs = coords.map((c) => c[0]);
	const ys = coords.map((c) => c[1]);
	return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

export function getPolygonBBox(coords: number[][][]): number[] {
	const flatCoords = coords[0]; // Outer ring
	return getLineStringBBox(flatCoords);
}

export function getMultiPointBBox(coords: number[][]): number[] {
	return getLineStringBBox(coords);
}

export function getMultiLineStringBBox(coords: number[][][]): number[] {
	const flatCoords = coords.flat();
	return getLineStringBBox(flatCoords);
}

export function getMultiPolygonBBox(coords: number[][][][]): number[] {
	const flatCoords = coords.flat(2);
	return getLineStringBBox(flatCoords);
}

export function getGeometryCollectionBBox(geometries: GeoJSON.Geometry[]): number[] {
	const boxes = geometries
		.map((geom) => {
			switch (geom.type) {
				case 'Point':
					return getPointBBox(geom.coordinates);
				case 'LineString':
					return getLineStringBBox(geom.coordinates);
				case 'Polygon':
					return getPolygonBBox(geom.coordinates);
				case 'MultiPoint':
					return getMultiPointBBox(geom.coordinates);
				case 'MultiLineString':
					return getMultiLineStringBBox(geom.coordinates);
				case 'MultiPolygon':
					return getMultiPolygonBBox(geom.coordinates);
				default:
					return null;
			}
		})
		.filter((box): box is number[] => box !== null);

	return [
		Math.min(...boxes.map((b) => b[0])),
		Math.min(...boxes.map((b) => b[1])),
		Math.max(...boxes.map((b) => b[2])),
		Math.max(...boxes.map((b) => b[3]))
	];
}

// Spatial operations
export function bboxIntersectsBounds(bbox: number[], bounds: L.LatLngBounds): boolean {
	const [minX, minY, maxX, maxY] = bbox;
	const boundsMin = bounds.getSouthWest();
	const boundsMax = bounds.getNorthEast();

	return !(
		minX > boundsMax.lng ||
		maxX < boundsMin.lng ||
		minY > boundsMax.lat ||
		maxY < boundsMin.lat
	);
}

export function expandBounds(bounds: L.LatLngBounds, ratio: number): L.LatLngBounds {
	return bounds.pad(ratio);
}

export function coordsToCell(lng: number, lat: number, cellSize: number): string {
	const x = Math.floor(lng / cellSize) * cellSize;
	const y = Math.floor(lat / cellSize) * cellSize;
	return `${x},${y}`;
}

export function getCellsInBounds(bounds: L.LatLngBounds, cellSize: number): string[] {
	const cells: string[] = [];
	const sw = bounds.getSouthWest();
	const ne = bounds.getNorthEast();

	for (
		let x = Math.floor(sw.lng / cellSize) * cellSize;
		x <= Math.ceil(ne.lng / cellSize) * cellSize;
		x += cellSize
	) {
		for (
			let y = Math.floor(sw.lat / cellSize) * cellSize;
			y <= Math.ceil(ne.lat / cellSize) * cellSize;
			y += cellSize
		) {
			cells.push(`${x},${y}`);
		}
	}

	return cells;
}

// Coordinate transformations
export function normalizeCoordinates(coords: number[]): number[] {
	let [lng, lat] = coords;

	// Normalize longitude to [-180, 180]
	lng = ((lng + 180) % 360) - 180;

	// Clamp latitude to [-90, 90]
	lat = Math.max(-90, Math.min(90, lat));

	return [lng, lat];
}

export function getTilesForExtent(bounds: Bounds, zoom: number) {
	// Always use zoom 15 for complete GNAF coverage
	const minTile = latLngToTile(bounds.north, bounds.west, zoom);
	const maxTile = latLngToTile(bounds.south, bounds.east, zoom);

	const tiles = [];
	for (let x = minTile.x; x <= maxTile.x; x++) {
		for (let y = minTile.y; y <= maxTile.y; y++) {
			tiles.push({ x, y, z: zoom });
		}
	}
	return tiles;
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

export function validateAndClampBounds(bounds: Bounds, apiBounds: Bounds): Bounds {
	return {
		north: Math.min(Math.max(bounds.north, apiBounds.south), apiBounds.north),
		south: Math.min(Math.max(bounds.south, apiBounds.south), apiBounds.north),
		east: Math.min(Math.max(bounds.east, apiBounds.west), apiBounds.east),
		west: Math.min(Math.max(bounds.west, apiBounds.west), apiBounds.east)
	};
}
