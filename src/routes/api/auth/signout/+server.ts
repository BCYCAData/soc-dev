import { error, redirect } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}
	const { error: err } = await supabase.auth.signOut();

	if (err) {
		throw error(500, 'Something went wrong logging you out.');
	}

	throw redirect(303, '/auth/signin');
};
