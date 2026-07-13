import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requirePermission } from '$lib/server/auth/apiGuard';
import { PERMISSIONS } from '$lib/constants/permissions';

/**
 * Viewport fabric fetch for the KYNG boundary editor: lon/lat bbox → GeoJSON
 * FeatureCollection of cadastral-fabric faces with their current assignment.
 * `+server.ts` endpoints don't run the (protected) layout's authGuard, so the
 * caller is validated here; get_fabric_geojson re-checks the permission token
 * in-database (jwt_can).
 */
export const GET: RequestHandler = async (event) => {
	await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);

	const { url, locals } = event;
	const minLng = Number(url.searchParams.get('minLng'));
	const minLat = Number(url.searchParams.get('minLat'));
	const maxLng = Number(url.searchParams.get('maxLng'));
	const maxLat = Number(url.searchParams.get('maxLat'));
	const simplify = Number(url.searchParams.get('simplify') ?? 0);
	if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) {
		error(400, 'minLng/minLat/maxLng/maxLat query parameters are required');
	}

	const { data, error: rpcError } = await locals.supabase.rpc('get_fabric_geojson', {
		p_min_lng: minLng,
		p_min_lat: minLat,
		p_max_lng: maxLng,
		p_max_lat: maxLat,
		p_simplify_m: Number.isFinite(simplify) ? simplify : 0
	});
	if (rpcError) {
		console.error('error get_fabric_geojson:', rpcError);
		error(400, rpcError.message);
	}

	return json(data);
};
