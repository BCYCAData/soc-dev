import { redirect } from '@sveltejs/kit';

export const actions = {
	changeEmail: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
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
