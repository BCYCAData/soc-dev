import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	resetpassword: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		const password = body.password as string;
		const { data, error: err } = await locals.dbClient.auth.updateUser({ password });
		if (err) {
			let status = 500;
			let message = 'Server error. Please try again later.';
			if (err.status) {
				status = err.status;
			}
			if (err.message) {
				message = err.message;
			}
			return fail(status, {
				message: message
			});
		}
		throw redirect(303, '/profile');
	}
};
