import { error, fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { hasPermission } from '$lib/server/permissions';
import { requirePermission } from '$lib/server/auth/apiGuard';
import { PERMISSIONS } from '$lib/constants/permissions';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const parentData = await parent();

	// Use hierarchical permission checking
	// This will allow admin.users OR admin.users.kits
	if (!hasPermission(parentData.permissions, PERMISSIONS.ADMIN_USERS_KITS)) {
		throw error(403, 'Insufficient permissions for kit delivery reports');
	}

	const { data: usersAwaitingKits, error: kitsError } = await supabase.rpc(
		'get_new_users_confirmed_without_kits'
	);

	if (kitsError) {
		console.error('error getting users awaiting kits:', kitsError);
		error(400, kitsError.message);
	}

	return { usersAwaitingKits: usersAwaitingKits ?? [] };
};

export const actions: Actions = {
	markDelivered: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_USERS_KITS);

		const formData = await event.request.formData();
		const ids = ((formData.get('user_ids') as string | null) ?? '')
			.split(',')
			.map((id) => id.trim())
			.filter((id) => UUID_RE.test(id));
		const kitDate = (formData.get('kit_date') as string | null) || null;

		if (ids.length === 0) {
			return fail(400, { success: false, message: 'No users selected' });
		}

		const { data: updated, error: updateError } = await event.locals.supabase.rpc(
			'set_users_kit_delivered',
			kitDate ? { p_user_ids: ids, p_kit_date: kitDate } : { p_user_ids: ids }
		);

		if (updateError) {
			console.error('error marking kits delivered:', updateError);
			return fail(400, { success: false, message: updateError.message });
		}

		return {
			success: true,
			message: `Marked ${updated} user${updated === 1 ? '' : 's'} as kit delivered`
		};
	}
};
