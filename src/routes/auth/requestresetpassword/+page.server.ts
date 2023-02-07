// import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	requestresetpassword: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		let email = body.email.toString();
		const { data, error: err } = await locals.dbClient.auth.resetPasswordForEmail(email, {
			redirectTo: `${locals.supabaseRedirectBase}/auth/resetpassword`
		});
		if (err) {
			return fail(400, { err, incorrect: true });
		}
		return { success: true };
	}
};
