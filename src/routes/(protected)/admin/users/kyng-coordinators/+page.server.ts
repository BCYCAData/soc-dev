import { error, fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: kyngCoordinators, error: kyngCoordinatorsError } = await supabase.rpc(
		'get_users_with_kyng_status'
	);

	if (kyngCoordinatorsError) {
		throw error(500, kyngCoordinatorsError.message);
	}

	const { data: kyngAreas, error: kyngAreasError } = await supabase.from('kyng_areas').select(`
            kyng_area_id:id,
            kyng_area_name:kyng
        `);

	if (kyngAreasError) {
		throw error(500, kyngAreasError.message);
	}

	return { kyngCoordinators, kyngAreas };
};

export const actions: Actions = {
	revokeCoordinator: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to revoke KYNG coordinator role'
			});
		}
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const kyngAreaId = formData.get('kyngAreaId') as string;

		const { error: revokeError } = await supabase.rpc('end_kyng_area_user', {
			p_user_id: userId,
			p_kyng_area_id: kyngAreaId
		});

		if (revokeError) {
			console.log('revokeError', revokeError);

			return fail(500, {
				success: false,
				message: 'Failed to remove KYNG coordinator role'
			});
		}

		return {
			success: true,
			message: 'KYNG coordinator role revoked successfully'
		};
	},
	assignCoordinator: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to assign KYNG coordinator role'
			});
		}
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const kyngAreaId = formData.get('kyngAreaId') as string;

		const { error: rpcError } = await supabase.rpc('add_kyng_area_user', {
			p_user_id: userId,
			p_kyng_area_id: kyngAreaId
		});

		if (rpcError) {
			console.log('assignKYNGCoordinatorError', rpcError);
			return fail(400, {
				success: false,
				message: 'Failed to assign KYNG coordinator role'
			});
		}
		console.log('assignKYNGCoordinatorSuccess', { userId, kyngAreaId });
		return {
			success: true,
			message: 'KYNG Coordinator assigned successfully'
		};
	},
	updateCoordinator: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to change KYNG coordinator role'
			});
		}
		const formData = await request.formData();
		const userId = formData.get('user_id') as string;
		const kyngAreaId = formData.get('kyng_area_id') as string;
		const userName = formData.get('user_name') as string;
		const phoneNumber = formData.get('phone_number') as string;

		const { error: updateKYNGCoordinatorError } = await supabase.rpc('update_kyng_area_user', {
			p_user_id: userId,
			p_kyng_area_id: kyngAreaId,
			p_user_name: userName,
			p_phone_number: phoneNumber
		});

		if (updateKYNGCoordinatorError) {
			console.log('updateKYNGCoordinatorError', updateKYNGCoordinatorError);
			return fail(400, {
				success: false,
				message: 'Failed to change KYNG coordinator role'
			});
		}

		return {
			success: true,
			message: 'KYNG coordinator role updated successfully'
		};
	}
};
