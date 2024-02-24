import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const {
		locals: { supabase, getSession }
	} = event;
	const session = await getSession();
	if (!session) {
		error(401, { message: 'Unauthorized' });
	}
	const { error: err } = await supabase.auth.signOut();

	if (err) {
		console.log('Sign Out Error:', err);
		error(500, 'Something went wrong logging you out.');
	}

	redirect(303, '/auth/signin');
};
