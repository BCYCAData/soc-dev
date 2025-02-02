import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad, Actions } from './$types';

interface RolePermission {
	permission: string;
	role: string;
}

interface PermissionTree {
	[key: string]: PermissionTree;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	setLoading(true);
	const { data: rolePermissions, error: rpError } = await supabase
		.from('role_permissions')
		.select('*')
		.order('role');

	const { data: userRoles, error: urError } = await supabase.rpc('get_user_roles');
	setLoading(false);
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
		userRoles,
		permissionTree
	};
};

export const actions: Actions = {
	addRole: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		const permissions = formData.get('permissions')?.toString();

		// First update the app_role enum type
		const { error: enumError } = await supabase.rpc('add_role_to_enum', {
			new_role: role
		});

		if (enumError) {
			throw error(400, 'Failed to update role enum type');
		}

		// Then insert into role_permissions
		const { error: insertError } = await supabase
			.from('role_permissions')
			.insert({ role, permission: permissions });

		if (insertError) {
			throw error(400, 'Failed to add role');
		}

		return { success: true };
	},

	deleteRole: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const role = formData.get('role')?.toString();

		const { error: deleteError } = await supabase
			.from('role_permissions')
			.delete()
			.eq('role', role);

		if (deleteError) {
			throw error(400, 'Failed to delete role');
		}
		return { success: true };
	},

	updatePermissions: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		const permissions = formData.getAll('permissions').join(',');
		console.log('permissions', permissions);
		const { error: updateError } = await supabase
			.from('role_permissions')
			.update({ permission: permissions })
			.eq('role', role);

		if (updateError) {
			throw error(400, 'Failed to update permissions');
		}
		return { success: true };
	}
};
