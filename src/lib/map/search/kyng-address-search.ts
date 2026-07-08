import type { AddressSearchEntry } from '$lib/map/profiles/types';

type FeatureCollection = GeoJSON.FeatureCollection | null | undefined;

type PropertyRecord = {
	id: string;
	bounds: [[number, number], [number, number]];
	address: string;
	alternate: string[];
	secondary: string[];
};

function textProp(properties: GeoJSON.GeoJsonProperties | null | undefined, key: string): string {
	const value = properties?.[key];
	return typeof value === 'string' ? value : '';
}

function normalizeAddress(value: string): string {
	return value
		.toUpperCase()
		.replace(/,/g, ' ')
		.replace(/\s+NSW\s+\d{4}\s*$/, '')
		.replace(/\s+NSW\s*$/, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function splitAddressList(value: string): string[] {
	return value
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);
}

function geometryBounds(
	geometry: GeoJSON.Geometry | null | undefined
): [[number, number], [number, number]] | null {
	if (!geometry) return null;
	let minLat = Number.POSITIVE_INFINITY;
	let minLng = Number.POSITIVE_INFINITY;
	let maxLat = Number.NEGATIVE_INFINITY;
	let maxLng = Number.NEGATIVE_INFINITY;

	function visit(coords: unknown) {
		if (!Array.isArray(coords)) return;
		if (
			coords.length >= 2 &&
			typeof coords[0] === 'number' &&
			typeof coords[1] === 'number'
		) {
			const lng = coords[0];
			const lat = coords[1];
			if (lat < minLat) minLat = lat;
			if (lat > maxLat) maxLat = lat;
			if (lng < minLng) minLng = lng;
			if (lng > maxLng) maxLng = lng;
			return;
		}
		for (const child of coords) visit(child);
	}

	if (geometry.type === 'GeometryCollection') {
		for (const child of geometry.geometries) {
			const childBounds = geometryBounds(child);
			if (!childBounds) continue;
			minLat = Math.min(minLat, childBounds[0][0]);
			minLng = Math.min(minLng, childBounds[0][1]);
			maxLat = Math.max(maxLat, childBounds[1][0]);
			maxLng = Math.max(maxLng, childBounds[1][1]);
		}
	} else {
		visit(geometry.coordinates);
	}
	if (!Number.isFinite(minLat) || !Number.isFinite(minLng)) return null;
	return [
		[minLat, minLng],
		[maxLat, maxLng]
	];
}

function collectionFeatures(collection: FeatureCollection): GeoJSON.Feature[] {
	if (!collection?.features) return [];
	return collection.features;
}

function addAddressLookup(map: Map<string, PropertyRecord[]>, value: string, property: PropertyRecord) {
	const key = normalizeAddress(value);
	if (!key) return;
	const existing = map.get(key) ?? [];
	existing.push(property);
	map.set(key, existing);
}

function getOid(properties: GeoJSON.GeoJsonProperties | null | undefined): string {
	const raw = properties?.['Principal Address Site OID'];
	if (raw === null || raw === undefined) return '';
	return String(raw);
}

function getAddressPointOid(properties: GeoJSON.GeoJsonProperties | null | undefined): string {
	const raw = properties?.['Address Point OID'];
	if (raw === null || raw === undefined) return '';
	return String(raw);
}

function featureHighlightPoint(feature: GeoJSON.Feature): [number, number] | undefined {
	if (feature.geometry?.type === 'Point') {
		const [lng, lat] = feature.geometry.coordinates;
		if (typeof lat === 'number' && typeof lng === 'number') return [lat, lng];
	}
	const bounds = geometryBounds(feature.geometry);
	if (!bounds) return undefined;
	const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
	const centerLng = (bounds[0][1] + bounds[1][1]) / 2;
	return [centerLat, centerLng];
}

/**
 * Build address-search entries for KYNG maps from already loaded layer data.
 * Emits one entry per address point (when a property match is found), so all
 * available addresses can be searched and selected.
 */
export function buildKyngAddressSearchEntries({
	propertyAreas,
	addressPoints
}: {
	propertyAreas: FeatureCollection;
	addressPoints: FeatureCollection;
}): AddressSearchEntry[] {
	const byOid = new Map<string, PropertyRecord>();
	const byAddress = new Map<string, PropertyRecord[]>();
	const entries: AddressSearchEntry[] = [];

	for (const feature of collectionFeatures(propertyAreas)) {
		const bounds = geometryBounds(feature.geometry);
		if (!bounds) continue;

		const properties = feature.properties;
		const oid = getOid(properties);
		const address = textProp(properties, 'Address');
		if (!oid && !address) continue;

		const record: PropertyRecord = {
			id: oid || `${bounds[0][0]},${bounds[0][1]},${bounds[1][0]},${bounds[1][1]}`,
			bounds,
			address,
			alternate: splitAddressList(textProp(properties, 'Alternate Addresses')),
			secondary: splitAddressList(textProp(properties, 'Secondary Addresses'))
		};

		if (oid && !byOid.has(oid)) byOid.set(oid, record);
		if (record.address) addAddressLookup(byAddress, record.address, record);
		for (const alt of record.alternate) addAddressLookup(byAddress, alt, record);
		for (const sec of record.secondary) addAddressLookup(byAddress, sec, record);
	}

	for (const [index, feature] of collectionFeatures(addressPoints).entries()) {
		const properties = feature.properties;

		const label = textProp(properties, 'Address');
		const houseNumber = textProp(properties, 'House Number');
		const addressPointOid = getAddressPointOid(properties);
		const oid = getOid(properties);
		const matched =
			(oid ? byOid.get(oid) : undefined) ??
			(byAddress.get(normalizeAddress(label)) ?? [])[0];
		if (!matched) continue;

		const keywords = [matched.address, houseNumber, ...matched.alternate, ...matched.secondary].filter(
			Boolean
		);
		entries.push({
			id: `kyng-address-${matched.id}-${addressPointOid || index}`,
			label: label || matched.address,
			keywords,
			highlightPoint: featureHighlightPoint(feature),
			zoomBounds: matched.bounds,
			zoomMax: 18
		});
	}

	entries.sort((a, b) => a.label.localeCompare(b.label));
	return entries;
}
