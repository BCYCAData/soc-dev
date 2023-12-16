import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { locals: { supabase, getSession } } = event
	const session = await getSession();
	if (!session) {
		throw error(401, { message: 'Unauthorized' });
	}
	const { error: err } = await supabase.auth.signOut();

	if (err) {
		console.log("Sign Out Error:", err)
		throw error(500, 'Something went wrong logging you out.');
	}

	throw redirect(303, '/auth/signin');
};
