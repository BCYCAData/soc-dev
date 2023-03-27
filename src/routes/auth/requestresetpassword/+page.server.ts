import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	requestresetpassword: async ({ request, locals: { supabase, supabaseRedirectBase } }) => {
		const body = Object.fromEntries(await request.formData());
		let email = body.email.toString();
		const { data, error: err } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${supabaseRedirectBase}/auth/resetpassword`
		});
		if (err) {
			return fail(400, { err, incorrect: true });
		}
		return { success: true };
	}
};
