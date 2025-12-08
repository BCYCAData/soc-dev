import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasAnyPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Check if user has ANY admin.site permission
	// This allows access if they have admin.site.messages, admin.site.roles, admin.site.data, etc.
	if (!hasAnyPermission(
		parentData.permissions,
		PERMISSIONS.ADMIN_SITE,
		PERMISSIONS.ADMIN_SITE_MESSAGES,
		PERMISSIONS.ADMIN_SITE_ROLES,
		PERMISSIONS.ADMIN_SITE_DATA
	)) {
		throw error(403, 'Insufficient permissions for site administration');
	}

	return {
		siteAdminData: {}
	};
};
