import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, parent }) => {
	if (!user) {
		throw redirect(303, '/auth/signin');
	}
	const parentData = await parent();
	if (!parentData.permissions?.includes('admin.users.kits')) {
		console.error('Forbidden attempt on /admin/users/kits:', user);
		throw redirect(303, '/personal-profile');
	}
	return {
		usersAdminKitsData: {}
	};
};
