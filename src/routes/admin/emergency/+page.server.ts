import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();
	if (!session) {
		redirect(307, '/auth/signin');
	} else if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		error(401, { message: 'Unauthorized' });
	}
	return {
		session,
		emergencyAdminData: {}
	};
};
