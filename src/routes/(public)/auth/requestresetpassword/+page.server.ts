import { SITE_URL } from '$lib/constants';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${SITE_URL}/auth/redirect/confirm`
		});

		if (error) {
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		return {
			success: true,
			message: 'Password reset instructions have been sent to your email'
		};
	}
};
