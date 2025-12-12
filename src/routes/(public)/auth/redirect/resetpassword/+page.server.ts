import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	resetpassword: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		throw redirect(303, '/personal-profile');
	}
};
