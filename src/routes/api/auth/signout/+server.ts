import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const {
		locals: { supabase, user }
	} = event;
	if (!user) {
		error(403, { message: 'Forbidden' });
	}
	const { error: err } = await supabase.auth.signOut();

	if (err) {
		console.log('Sign Out Error:', err);
		error(500, 'Something went wrong logging you out.');
	}

	redirect(303, '/auth/signin');
};
