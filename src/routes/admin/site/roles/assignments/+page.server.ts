import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad, Actions } from './$types';

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
	setLoading(true);
	const { data: siteRoles, error: siteRolesError } = await supabase.rpc('get_user_roles');

	const { data: sitePermissions, error: sitePermissionsError } = await supabase
		.from('role_permissions')
		.select('*');
	setLoading(false);
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
	assignRole: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const target_data = formData.get('target_data');
		if (!target_data) {
			throw error(400, 'Target data is missing');
		}
		const user_id = JSON.parse(target_data as string)[0];
		const role = formData.get('role');

		const { error: assignError } = await supabase.from('user_roles').upsert({ user_id, role });

		if (assignError) {
			console.log('assignError', assignError);
			throw error(400, assignError.details);
		}

		return { success: true };
	},
	removeRole: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const roleId = formData.get('roleId');

		const { error: removeError } = await supabase.from('user_roles').delete().eq('id', roleId);

		if (removeError) {
			throw error(400, 'Failed to remove role');
		}

		return { success: true };
	},

	updatePermissions: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const role = formData.get('role');
		const permissions = formData.get('permissions');

		const { error: updateError } = await supabase
			.from('role_permissions')
			.upsert({ role, permission: permissions });

		if (updateError) {
			throw error(400, 'Failed to update permissions');
		}

		return { success: true };
	}
};
