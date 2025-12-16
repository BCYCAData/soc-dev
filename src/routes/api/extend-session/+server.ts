import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	try {
		// Refresh the Supabase session
		const { data, error } = await supabase.auth.refreshSession();

		if (error) {
			console.error('Session refresh error:', error);
			return json({ success: false, error: 'Failed to refresh session' }, { status: 401 });
		}

		if (data.session) {
			// Return new expiry time (in milliseconds for JavaScript Date)
			const expiresAt = data.session.expires_at ? data.session.expires_at * 1000 : 0;

			return json({
				success: true,
				expiresAt,
				message: 'Session refreshed successfully'
			});
		}

		return json({ success: false, error: 'No active session' }, { status: 401 });
	} catch (error) {
		console.error('Session refresh failed:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred'
			},
			{ status: 500 }
		);
	}
};
