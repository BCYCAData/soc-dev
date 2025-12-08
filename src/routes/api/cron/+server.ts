import { json } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_KEY);

// Make sure to export the GET handler
export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	console.log('Cron job running at:', new Date().toISOString());
	console.log('authHeader:', authHeader);
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log('auth failed');
		return new Response('Unauthorized', { status: 401 });
	}

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
