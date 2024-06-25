import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	resetPassword: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { error } = await supabase.auth.updateUser({
			password: formData.get('password') as string
		});
		if (error) {
			console.log('update password settings error:', error.message);
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
