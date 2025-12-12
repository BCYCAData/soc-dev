import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';

interface SiteUserRole {
	id: bigint;
	user_id: string;
	role: string;
	email: string;
}

interface SiteUser {
	id: string;
	email: string;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: siteRoles, error: siteRolesError } = await supabase.rpc('get_user_roles');
	const { data: sitePermissions, error: sitePermissionsError } = await supabase
		.from('role_permissions')
		.select('*');
	if (siteRolesError || sitePermissionsError) {
		throw error(500, 'Failed to load roles data');
	}
	const siteUsers =
		siteRoles?.map(
			(role: SiteUserRole): SiteUser => ({
				id: role.user_id,
				email: role.email
			})
		) || [];

	return {
		siteRoles,
		sitePermissions,
		siteUsers: [...new Map(siteUsers.map((user: SiteUser) => [user.id, user])).values()]
	};
};

export const actions: Actions = {
	assignRole: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_ASSIGNMENTS)) {
			throw error(403, 'Insufficient permissions to assign roles');
		}
		const formData = await request.formData();
		const target_data = formData.get('target_data');
		if (!target_data) {
			return fail(400, {
				success: false,
				message: 'Target data is missing'
			});
		}
		const user_id = JSON.parse(target_data as string)[0];
		const role = formData.get('role');

		const { error: assignError } = await supabase.from('user_roles').upsert({ user_id, role });

		if (assignError) {
			console.log('assignError', assignError);
			return fail(400, {
				success: false,
				message: 'Failed to assign role',
				errors: { role: assignError.details }
			});
		}

		return {
			success: true,
			message: 'Role assigned successfully'
		};
	},
	removeRole: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_ASSIGNMENTS)) {
			throw error(403, 'Insufficient permissions to remove roles');
		}
		const formData = await request.formData();
		const roleId = formData.get('roleId');

		const { error: removeError } = await supabase.from('user_roles').delete().eq('id', roleId);

		if (removeError) {
			return fail(400, {
				success: false,
				message: 'Failed to remove role'
			});
		}

		return {
			success: true,
			message: 'Role removed successfully'
		};
	},
	updatePermissions: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS)) {
			throw error(403, 'Insufficient permissions to update role permissions');
		}
		const formData = await request.formData();

		const role = formData.get('role');
		const rolePermissions = formData.getAll('permissions').join(',');
		const { error: updateError } = await supabase
			.from('role_permissions')
			.upsert({ role, permission: rolePermissions });

		if (updateError) {
			return fail(400, {
				success: false,
				message: 'Failed to update permissions'
			});
		}

		return {
			success: true,
			message: 'Permissions updated successfully'
		};
	}
};
