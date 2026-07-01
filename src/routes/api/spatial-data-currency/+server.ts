import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/auth/apiGuard';

// Currency ("as at" date) of the cached NSW Spatial Services geometry, for the map
// attribution control (CC BY 4.0 requires surfacing data currency to users). It's a single
// app-wide value that only changes on the monthly refresh, so it's cheap to share and safe to
// edge-cache. Returns null until the first successful refresh has stamped the cache.
const CURRENCY_CACHE = 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400';

export const GET: RequestHandler = async (event) => {
	await requireUser(event);
	const {
		locals: { supabase }
	} = event;

	const { data, error } = await supabase.rpc('get_spatial_data_currency');
	if (error) {
		console.error('get_spatial_data_currency error:', error.message);
		return json({ currency: null }, { headers: { 'Cache-Control': 'public, max-age=60' } });
	}

	return json({ currency: data ?? null }, { headers: { 'Cache-Control': CURRENCY_CACHE } });
};
