import { error, fail } from '@sveltejs/kit';
import { dev } from '$app/environment';

import type { PageServerLoad, Actions } from './$types';
import type { PostgrestError } from '@supabase/supabase-js';
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

// In dev, append the underlying Postgres error to the toast message so failures
// are visible without digging through Supabase logs. Prod stays generic.
const withDevDetail = (message: string, err: PostgrestError): string =>
	dev ? `${message}: ${err.message}${err.code ? ` (${err.code})` : ''}` : message;

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
		const user_id = formData.get('userId')?.toString();
		const role = formData.get('role')?.toString();
		if (!user_id || !role) {
			return fail(400, {
				success: false,
				message: 'Both a user and a role are required'
			});
		}

		// UNIQUE(user_id, role): re-assigning an existing role is a no-op, not an error.
		// The user_roles_materialize trigger rebuilds user_permissions/user_roles_primary.
		const { error: assignError } = await supabase
			.from('user_roles')
			.upsert({ user_id, role }, { onConflict: 'user_id,role', ignoreDuplicates: true });

		if (assignError) {
			console.error('assignError', assignError);
			return fail(400, {
				success: false,
				message: withDevDetail('Failed to assign role', assignError),
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
			console.error('removeError', removeError);
			return fail(400, {
				success: false,
				message: withDevDetail('Failed to remove role', removeError)
			});
		}

		return {
			success: true,
			message: 'Role removed successfully'
		};
	}
};
