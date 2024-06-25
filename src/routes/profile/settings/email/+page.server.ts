import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	changeEmail: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { error: changeEmailError } = await supabase.auth.updateUser({
			email: formData.get('email') as string
		});
		if (changeEmailError) {
			console.log('change email settings error:', changeEmailError.message);
			return {
				error: true,
				success: false
			};
		}
		return {
			error: false,
			success: true
		};
	}
};
