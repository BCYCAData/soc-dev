import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasAnyPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Check if user has ANY admin.site.roles permission
	// This allows access if they have admin.site.roles.permissions, admin.site.roles.assignments, etc.
	if (!hasAnyPermission(
		parentData.permissions,
		PERMISSIONS.ADMIN_SITE_ROLES,
		PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS,
		PERMISSIONS.ADMIN_SITE_ROLES_ASSIGNMENTS
	)) {
		throw error(403, 'Insufficient permissions for roles administration');
	}

	return {
		siteAdminRolesData: {}
	};
};
