import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	requestresetpassword: async ({ request, locals: { supabase, supabaseRedirectBase } }) => {
		const body = Object.fromEntries(await request.formData());
		const email = body.email.toString();
		const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${supabaseRedirectBase}/auth/redirect/resetpassword`
		});
		if (err) {
			return fail(400, { err, incorrect: true });
		}
		return { success: true };
	}
};
