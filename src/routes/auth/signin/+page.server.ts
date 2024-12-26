import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSessionAndUser();
	if (session.user) {
		redirect(303, '/');
	}
	return {
		session: session,
		user: null,
		userRoles: null,
		permissions: null,
		coordinatesKYNG: null,
		propertyIds: null,
		userProfile: null,
		optionsData: {
			userOptionsData: { object_names: [] },
			communityBCYCAOptionsData: { object_names: [] },
			communityExternalOptionsData: { object_names: [] },
			communityTinoneeOptionsData: { object_names: [] },
			communityMondrookOptionsData: { object_names: [] }
		}
	};
};

export const actions: Actions = {
	signin: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		const body = Object.fromEntries(await request.formData());
		const email = body.email as string;

		const { data, error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password: body.password as string
		});
		// TODO: Add signin error logging
		if (signInError) {
			return fail(400, {
				error: 'Invalid credentials'
			});
		}

		if (data.session) {
			throw redirect(303, '/personal-profile');
		}

		return fail(500, {
			message: 'Session not established'
		});
	}
};
