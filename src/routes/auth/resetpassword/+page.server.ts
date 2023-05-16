import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	resetpassword: async ({ request, locals: { supabase, getSession } }) => {
		const body = Object.fromEntries(await request.formData());
		const password = body.password as string;
		const { data, error: err } = await supabase.auth.updateUser({ password });
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
