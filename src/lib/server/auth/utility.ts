import { error } from '@sveltejs/kit';
import { CLIENT_ERROR_UNAUTHORIZED } from '$lib/constants';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserPermissions(
	supabase: SupabaseClient,
	userId: string | undefined,
	user_roles: string[]
) {
	const { data: permissionData, error: permissionError } = await supabase
		.from('role_permissions')
		.select('permission')
		.in('role', user_roles);

	if (permissionError) {
		console.error('Error fetching permission:', permissionError);
		error(CLIENT_ERROR_UNAUTHORIZED, 'Failed to fetch permissions');
	}

	const permission = Array.from(
		new Set(permissionData?.flatMap((p) => p.permission.split(',')))
	).join(',');

	return permission;
}
