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

	const { data, error } = await supabase.rpc('health_check');

	if (error) {
		console.error('Health check failed:', error);
		return json({ success: false, error }, { status: 500 });
	}

	return json({ success: true, data });
};
