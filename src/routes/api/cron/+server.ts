import { json } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const GET: RequestHandler = async ({ request }) => {
	const cronSecret = env.CRON_SECRET;
	if (!cronSecret) {
		console.error('CRON_SECRET is not configured');
		return new Response('Server misconfigured', { status: 500 });
	}

	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${cronSecret}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Create the service-role client lazily inside the handler so it is not
	// instantiated at import/build-analysis time.
	const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_KEY);

	// Call refresh_spatial_data to update NSW spatial data
	const { data, error } = await supabase.rpc('refresh_spatial_data', {
		p_regenerate_area: true
	});

	if (error) {
		console.error('Spatial data refresh failed:', error);
		return json({ success: false, error }, { status: 500 });
	}

	// Log success
	console.log('Spatial data refresh completed:', data);

	return json({ success: true, data });
};
