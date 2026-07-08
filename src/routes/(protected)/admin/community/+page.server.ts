import { error, fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/auth/apiGuard';
import { PERMISSIONS } from '$lib/constants/permissions';

// Community name (lowercased) → profile-creation RPC run on approval.
const ADD_PROFILE_RPC = {
	bcyca: 'add_community_bcyca_profile',
	external: 'add_community_external_profile',
	mondrook: 'add_community_mondrook_profile',
	tinonee: 'add_community_tinonee_profile'
} as const;

type AccessRequestRow = {
	id: number;
	user_id: string;
	status: string;
	created_at: string;
	community_areas: { community: string } | null;
};

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// RLS: admin_read_all_requests (admin.community) governs visibility.
	const { data: requests, error: requestsError } = await supabase
		.from('community_access_requests')
		.select('id, user_id, status, created_at, community_areas(community)')
		.eq('status', 'pending')
		.order('created_at', { ascending: true });

	if (requestsError) {
		console.error('error getting community access requests:', requestsError);
		error(400, requestsError.message);
	}

	const requestRows = (requests ?? []) as AccessRequestRow[];

	// Requester names for display. Community-scoped admins may lack user_profile
	// read access — fall back to the bare request rows rather than failing.
	const userIds = [...new Set(requestRows.map((r) => r.user_id))];
	const nameById = new Map<string, string>();
	if (userIds.length > 0) {
		const { data: profiles } = await supabase
			.from('user_profile')
			.select('id, first_name, family_name')
			.in('id', userIds);
		for (const profile of profiles ?? []) {
			nameById.set(profile.id, [profile.first_name, profile.family_name].filter(Boolean).join(' '));
		}
	}

	return {
		accessRequests: requestRows.map((r) => ({
			id: r.id,
			user_id: r.user_id,
			name: nameById.get(r.user_id) || 'Name unavailable',
			community: r.community_areas?.community ?? 'Unknown',
			created_at: r.created_at
		}))
	};
};

async function loadRequest(
	supabase: App.Locals['supabase'],
	requestId: number
): Promise<{ id: number; user_id: string; community: string } | null> {
	const { data: request, error: requestError } = await supabase
		.from('community_access_requests')
		.select('id, user_id, status, community_areas(community)')
		.eq('id', requestId)
		.eq('status', 'pending')
		.maybeSingle();
	if (requestError || !request) {
		if (requestError) console.error('error loading community access request:', requestError);
		return null;
	}
	return {
		id: request.id,
		user_id: request.user_id,
		community: request.community_areas?.community?.toLowerCase() ?? ''
	};
}

export const actions: Actions = {
	approve: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_COMMUNITY);
		const supabase = event.locals.supabase;

		const formData = await event.request.formData();
		const requestId = Number(formData.get('request_id'));
		if (!Number.isInteger(requestId)) {
			return fail(400, { success: false, message: 'Invalid request' });
		}

		const request = await loadRequest(supabase, requestId);
		if (!request) {
			return fail(404, { success: false, message: 'Request not found or already handled' });
		}

		const rpcName = ADD_PROFILE_RPC[request.community as keyof typeof ADD_PROFILE_RPC];
		if (!rpcName) {
			return fail(400, { success: false, message: `Unknown community: ${request.community}` });
		}

		// Creates the community profile row and links it on user_profile; the
		// user's sidebar picks it up on their next page load.
		const { error: addProfileError } = await supabase.rpc(rpcName, {
			user_id_param: request.user_id
		});
		if (addProfileError) {
			console.error('error creating community profile on approval:', addProfileError);
			return fail(400, { success: false, message: addProfileError.message });
		}

		const { error: statusError } = await supabase
			.from('community_access_requests')
			.update({ status: 'approved', last_updated: new Date().toISOString() })
			.eq('id', requestId);
		if (statusError) {
			console.error('error updating request status:', statusError);
			return fail(400, { success: false, message: statusError.message });
		}

		return { success: true, message: 'Request approved' };
	},

	reject: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_COMMUNITY);
		const supabase = event.locals.supabase;

		const formData = await event.request.formData();
		const requestId = Number(formData.get('request_id'));
		if (!Number.isInteger(requestId)) {
			return fail(400, { success: false, message: 'Invalid request' });
		}

		const request = await loadRequest(supabase, requestId);
		if (!request) {
			return fail(404, { success: false, message: 'Request not found or already handled' });
		}

		const { error: statusError } = await supabase
			.from('community_access_requests')
			.update({ status: 'rejected', last_updated: new Date().toISOString() })
			.eq('id', requestId);
		if (statusError) {
			console.error('error updating request status:', statusError);
			return fail(400, { success: false, message: statusError.message });
		}

		return { success: true, message: 'Request rejected' };
	}
};
