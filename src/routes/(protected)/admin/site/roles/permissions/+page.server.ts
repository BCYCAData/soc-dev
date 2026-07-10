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

/**
 * Normalise submitted permission form values into a single comma-joined bundle:
 * split any comma-joined values, trim, drop blanks, de-dupe, and sort. Robust to the
 * checkbox group being submitted as individual `permissions` entries.
 */
function mergePermissions(values: FormDataEntryValue[]): string {
	const tokens = new Set<string>();
	for (const value of values) {
		for (const token of value.toString().split(',')) {
			const trimmed = token.trim();
			if (trimmed) tokens.add(trimmed);
		}
	}
	return [...tokens].sort().join(',');
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: rawRolePermissions, error: rpError } = await supabase
		.from('role_permissions')
		.select('*')
		.order('role');

	const { data: userRole, error: urError } = await supabase.rpc('get_user_roles');

	if (rpError || urError) {
		throw error(500, 'Failed to load roles data');
	}

	// role_permissions has UNIQUE(permission) but NOT UNIQUE(role), so a role can be split
	// across multiple rows (e.g. admin_site). Consolidate to one entry per role — union the
	// comma-joined bundles, de-dupe and drop empty tokens — so the keyed {#each} over roles
	// has unique keys and each role shows its full permission set.
	const tokensByRole = new Map<string, Set<string>>();
	for (const { role, permission } of rawRolePermissions ?? []) {
		const tokens = tokensByRole.get(role) ?? new Set<string>();
		for (const token of (permission ?? '').split(',')) {
			const trimmed = token.trim();
			if (trimmed) tokens.add(trimmed);
		}
		tokensByRole.set(role, tokens);
	}
	const rolePermissions: RolePermission[] = [...tokensByRole].map(([role, tokens]) => ({
		role,
		permission: [...tokens].join(',')
	}));

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
		const role = formData.get('role')?.toString().trim();
		const permission = mergePermissions(formData.getAll('permissions'));

		if (!role) {
			return fail(400, { success: false, message: 'A role name is required' });
		}
		if (!permission) {
			return fail(400, { success: false, message: 'Select at least one permission' });
		}

		// Grow the app_role enum. add_role_to_enum is SECURITY DEFINER and self-guards on the
		// caller (auth.uid) holding admin.site.roles, so it runs on the authenticated client.
		// ALTER TYPE ADD VALUE commits here, before the separate insert below can use it.
		const { error: enumError } = await supabase.rpc('add_role_to_enum', { new_role: role });
		if (enumError) {
			return fail(400, { success: false, message: 'Failed to register the new role name' });
		}

		const { error: insertError } = await supabase
			.from('role_permissions')
			.insert({ role, permission });
		if (insertError) {
			return fail(400, {
				success: false,
				message:
					insertError.code === '23505' ? `Role '${role}' already exists` : 'Failed to add role'
			});
		}

		return {
			success: true,
			message: 'Role added successfully'
		};
	},

	deleteRole: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS)) {
			throw error(403, 'Insufficient permissions to assign roles');
		}
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		if (!role) {
			return fail(400, { success: false, message: 'Role is required' });
		}

		// user_roles has no FK to role_permissions, so deleting a role that users still hold
		// would orphan those assignments (a role mapping to no permissions, re-materialising
		// only on the user's next role change). Block it with a clear message instead.
		const { count, error: countError } = await supabase
			.from('user_roles')
			.select('id', { count: 'exact', head: true })
			.eq('role', role);
		if (countError) {
			return fail(400, { success: false, message: 'Failed to check role assignments' });
		}
		if (count && count > 0) {
			return fail(400, {
				success: false,
				message: `Cannot delete '${role}': still assigned to ${count} user${count === 1 ? '' : 's'}. Remove those assignments first.`
			});
		}

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
		const permission = mergePermissions(formData.getAll('permissions'));
		if (!role) {
			return fail(400, { success: false, message: 'Role is required' });
		}
		const { error: updateError } = await supabase
			.from('role_permissions')
			.update({ permission })
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
