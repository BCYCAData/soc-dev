import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	changeEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { error } = await supabase.auth.updateUser({
			email: formData.get('email') as string
		});
		if (error) {
			console.log('change email settings error:', error.message);
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
