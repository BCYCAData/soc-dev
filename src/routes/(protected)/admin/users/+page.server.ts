import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasAnyPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Check if user has ANY admin.users permission
	// This allows access if they have admin.users.kits, admin.users.newusers, etc.
	if (!hasAnyPermission(
		parentData.permissions,
		PERMISSIONS.ADMIN_USERS,
		PERMISSIONS.ADMIN_USERS_KITS,
		PERMISSIONS.ADMIN_USERS_NEWUSERS,
		PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS
	)) {
		throw error(403, 'Insufficient permissions for users administration');
	}

	return {
		usersAdminData: {}
	};
};
