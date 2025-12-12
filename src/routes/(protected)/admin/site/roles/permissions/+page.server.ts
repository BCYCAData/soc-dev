import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';

interface RolePermission {
	permission: string;
	role: string;
}

interface PermissionTree {
	[key: string]: PermissionTree;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: rolePermissions, error: rpError } = await supabase
		.from('role_permissions')
		.select('*')
		.order('role');

	const { data: userRole, error: urError } = await supabase.rpc('get_user_roles');

	if (rpError || urError) {
		throw error(500, 'Failed to load roles data');
	}

	// Create permission tree for UI organization
	const permissionTree = rolePermissions.reduce(
		(acc: PermissionTree, { permission }: RolePermission) => {
			const parts = permission.split(',');
			parts.forEach((p: string) => {
				const levels = p.split('.');
				let current = acc;
				levels.forEach((level) => {
					if (!current[level]) {
						current[level] = {};
					}
					current = current[level];
				});
			});
			return acc;
		},
		{}
	);
	return {
		rolePermissions,
		userRole,
		permissionTree
	};
};

export const actions: Actions = {
	addRole: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS)) {
			throw error(403, 'Insufficient permissions to assign roles');
		}
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		const rolePermissions = formData.getAll('permissions').join(',');

		// First update the app_role enum type
		const { error: enumError } = await supabase.rpc('add_role_to_enum', {
			new_role: role
		});

		if (enumError) {
			return fail(400, {
				success: false,
				message: 'Failed to update role enum type'
			});
		}

		// Then insert into role_permissions
		const { error: insertError } = await supabase
			.from('role_permissions')
			.insert({ role, permission: rolePermissions });

		if (insertError) {
			return fail(400, {
				success: false,
				message: 'Failed to add role'
			});
		}

		return {
			success: true,
			message: 'Role added successfully'
		};
	},

	deleteRole: async ({ request, locals: { supabase, permissions } }) => {
		const formData = await request.formData();
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS)) {
			throw error(403, 'Insufficient permissions to assign roles');
		}
		const role = formData.get('role')?.toString();

		const { error: deleteError } = await supabase
			.from('role_permissions')
			.delete()
			.eq('role', role);

		if (deleteError) {
			return fail(400, {
				success: false,
				message: 'Failed to delete role'
			});
		}
		return {
			success: true,
			message: 'Role deleted successfully'
		};
	},

	updatePermissions: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS)) {
			throw error(403, 'Insufficient permissions to update permissions');
		}
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		const updatedPermissions = formData.getAll('permissions').join(',');
		const { error: updateError } = await supabase
			.from('role_permissions')
			.update({ permission: updatedPermissions })
			.eq('role', role);

		if (updateError) {
			return fail(400, {
				success: false,
				message: 'Failed to update role permissions'
			});
		}
		return {
			success: true,
			message: 'Role permissions updated successfully'
		};
	}
};
