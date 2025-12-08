import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	changeEmail: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const { error } = await supabase.auth.updateUser({
			email: email
		});

		if (error) {
			return fail(400, {
				error: true,
				message: error.message
			});
		}

		return {
			success: true
		};
	}
};
