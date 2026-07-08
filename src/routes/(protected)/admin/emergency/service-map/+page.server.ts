import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type { PropertyAddress } from '$lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RfsMapRow = {
	property_id: string;
	phone: string | null;
	address: string;
	property: {
		identification: string;
		truck_access: string;
		critical_assets: string;
		vulnerable: string;
	} | null;
	residents: Array<Record<string, string>> | null;
	property_geojson: {
		type: 'Feature';
		geometry: GeoJSON.Geometry | null;
		properties: {
			address_point: GeoJSON.Geometry | null;
			way_point: GeoJSON.Geometry | null;
		};
	} | null;
	feature_layers: Record<string, GeoJSON.FeatureCollection> | null;
};

type Bounds = { minLat: number; minLng: number; maxLat: number; maxLng: number };

function extendBounds(geometry: GeoJSON.Geometry | null | undefined, b: Bounds): void {
	if (!geometry) return;
	if (geometry.type === 'GeometryCollection') {
		for (const g of geometry.geometries) extendBounds(g, b);
		return;
	}
	const walk = (coords: unknown): void => {
		if (!Array.isArray(coords)) return;
		if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
			const [lng, lat] = coords as [number, number];
			b.minLat = Math.min(b.minLat, lat);
			b.maxLat = Math.max(b.maxLat, lat);
			b.minLng = Math.min(b.minLng, lng);
			b.maxLng = Math.max(b.maxLng, lng);
			return;
		}
		for (const c of coords) walk(c);
	};
	walk(geometry.coordinates);
}

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const { data: streetsData, error: getStreetsError } = await supabase.rpc('get_street_list', {});
	if (getStreetsError) {
		console.error('error getting street list:', getStreetsError);
		error(400, getStreetsError.message);
	}

	const { data: propertyData, error: getPropertyError } = await supabase.rpc(
		'get_property_address_list'
	);
	if (getPropertyError) {
		console.error('error getting property address list:', getPropertyError);
		error(400, getPropertyError.message);
	}

	const streetList: string[] = (streetsData ?? []).map(
		({ streets }: { streets: string }) => streets
	);
	const propertyAddressList = (propertyData?.property_address_list ?? []) as PropertyAddress[];

	// Selected property ids arrive as `?ids=<uuid,uuid,…>` so a selection is
	// linkable/shareable and the load stays the single data path.
	const ids = (url.searchParams.get('ids') ?? '')
		.split(',')
		.map((id) => id.trim())
		.filter((id) => UUID_RE.test(id));

	if (ids.length === 0) {
		return { streetList, propertyAddressList, selection: null };
	}

	const { data: mapRows, error: mapDataError } = await supabase.rpc(
		'get_rfs_user_map_data_for_porperties',
		{ property_ids: ids }
	);
	if (mapDataError) {
		console.error('error getting RFS map data:', mapDataError);
		error(400, mapDataError.message);
	}

	const rows = (mapRows ?? []) as unknown as RfsMapRow[];

	const bounds: Bounds = {
		minLat: Infinity,
		minLng: Infinity,
		maxLat: -Infinity,
		maxLng: -Infinity
	};

	const propertyFeatures: GeoJSON.Feature[] = [];
	const addressPointFeatures: GeoJSON.Feature[] = [];
	const wayPointFeatures: GeoJSON.Feature[] = [];
	const featureLayerGroups = new Map<string, GeoJSON.Feature[]>();

	for (const row of rows) {
		// Popup payload shared by the boundary polygon and the address point.
		const popupProperties = {
			property_id: row.property_id,
			address: row.address,
			phone: row.phone,
			identification: row.property?.identification ?? 'No information provided.',
			truck_access: row.property?.truck_access ?? 'No information provided.',
			vulnerable: row.property?.vulnerable ?? 'No information provided.',
			residents: row.residents ?? []
		};

		const boundaryGeometry = row.property_geojson?.geometry ?? null;
		if (boundaryGeometry) {
			extendBounds(boundaryGeometry, bounds);
			propertyFeatures.push({
				type: 'Feature',
				geometry: boundaryGeometry,
				properties: popupProperties
			});
		}

		const addressPoint = row.property_geojson?.properties?.address_point ?? null;
		if (addressPoint) {
			extendBounds(addressPoint, bounds);
			addressPointFeatures.push({
				type: 'Feature',
				geometry: addressPoint,
				properties: popupProperties
			});
		}

		const wayPoint = row.property_geojson?.properties?.way_point ?? null;
		if (wayPoint) {
			extendBounds(wayPoint, bounds);
			wayPointFeatures.push({
				type: 'Feature',
				geometry: wayPoint,
				properties: { address: `Way point — ${row.address}` }
			});
		}

		for (const [key, collection] of Object.entries(row.feature_layers ?? {})) {
			if (!collection?.features?.length) continue;
			const group = featureLayerGroups.get(key) ?? [];
			for (const feature of collection.features) {
				extendBounds(feature.geometry, bounds);
				group.push(feature);
			}
			featureLayerGroups.set(key, group);
		}
	}

	const mapExtent: [[number, number], [number, number]] | null =
		bounds.minLat === Infinity
			? null
			: [
					[bounds.minLat, bounds.minLng],
					[bounds.maxLat, bounds.maxLng]
				];

	const toCollection = (features: GeoJSON.Feature[]): GeoJSON.FeatureCollection => ({
		type: 'FeatureCollection',
		features
	});

	return {
		streetList,
		propertyAddressList,
		selection: {
			ids,
			mapExtent,
			properties: toCollection(propertyFeatures),
			addressPoints: toCollection(addressPointFeatures),
			wayPoints: toCollection(wayPointFeatures),
			// `<category>_<geometryType>` groups, merged across the selection.
			featureLayers: [...featureLayerGroups.entries()].map(([key, features]) => {
				const geometryType = key.slice(key.lastIndexOf('_') + 1);
				const category = key.slice(0, key.lastIndexOf('_'));
				return { key, category, geometryType, data: toCollection(features) };
			})
		}
	};
};
