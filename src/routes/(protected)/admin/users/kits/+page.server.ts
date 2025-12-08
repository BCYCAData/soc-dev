import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Use hierarchical permission checking
	// This will allow admin.users OR admin.users.kits
	if (!hasPermission(parentData.permissions, PERMISSIONS.ADMIN_USERS_KITS)) {
		throw error(403, 'Insufficient permissions for kit delivery reports');
	}

	return {
		usersAdminKitsData: {}
	};
};
