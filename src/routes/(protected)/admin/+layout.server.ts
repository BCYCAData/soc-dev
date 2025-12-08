import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';

export const load: LayoutServerLoad = async ({ parent, locals }) => {
	const parentData = await parent();
	const rawPermissions = parentData.permissions || [];
	const flatPermissions = rawPermissions
		.flatMap((p: string) => p.split(','))
		.map((p: string) => p.trim())
		.filter(Boolean);
	// Parent layout (protected) already validated user
	// Now check admin-specific permission
	if (!hasPermission(parentData.permissions, PERMISSIONS.ADMIN)) {
		throw error(403, 'Admin access required');
	}

	const { data: adminMessagesData, error: adminMessagesError } = await locals.supabase.rpc(
		'get_admin_messages_for_user',
		{
			id_input: parentData.user?.id
		}
	);

	if (adminMessagesError) {
		console.error('Error getting admin messages:', adminMessagesError);
		throw error(400, adminMessagesError.message);
	}

	return {
		...parentData,
		permissions: flatPermissions,
		messages: adminMessagesData
	};
};
