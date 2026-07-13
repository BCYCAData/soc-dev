import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/auth/apiGuard';
import { PERMISSIONS } from '$lib/constants/permissions';

/**
 * KYNG boundary editor (design: docs/design/kyng-boundary-editor.md).
 * Current boundaries + any resumable edit session; the fabric itself is
 * fetched by viewport from ./fabric. Every RPC re-checks the
 * admin.site.data.kyng-boundaries token in-database (jwt_can).
 */
export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [boundariesRes, sessionRes] = await Promise.all([
		supabase.rpc('get_kyng_boundaries_geojson'),
		supabase.rpc('get_active_kyng_edit_session')
	]);

	if (boundariesRes.error) {
		console.error('error get_kyng_boundaries_geojson:', boundariesRes.error);
		error(400, boundariesRes.error.message);
	}
	if (sessionRes.error) {
		console.error('error get_active_kyng_edit_session:', sessionRes.error);
		error(400, sessionRes.error.message);
	}

	return {
		boundaries: (boundariesRes.data ?? null) as GeoJSON.FeatureCollection | null,
		activeSession: sessionRes.data ?? null
	};
};

export const actions: Actions = {
	startSession: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);
		const form = await event.request.formData();
		const kyngIds = String(form.get('kyngIds') ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		if (!kyngIds.length) {
			return fail(400, { message: 'Select at least one KYNG area' });
		}
		const { data, error: rpcError } = await event.locals.supabase.rpc('start_kyng_edit_session', {
			p_kyng_ids: kyngIds
		});
		if (rpcError) return fail(400, { message: rpcError.message });
		return { session: data };
	},

	propose: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);
		const form = await event.request.formData();
		const sessionId = String(form.get('sessionId') ?? '');
		const controlLinesRaw = String(form.get('controlLines') ?? '');
		const regionAssignmentsRaw = String(form.get('regionAssignments') ?? '');
		if (!sessionId || !controlLinesRaw) {
			return fail(400, { message: 'Draw at least one control line first' });
		}
		let controlLines: unknown;
		let regionAssignments: unknown = null;
		try {
			controlLines = JSON.parse(controlLinesRaw);
			if (regionAssignmentsRaw) regionAssignments = JSON.parse(regionAssignmentsRaw);
		} catch {
			return fail(400, { message: 'Malformed control line payload' });
		}
		const { data, error: rpcError } = await event.locals.supabase.rpc('propose_kyng_boundary', {
			p_session_id: sessionId,
			p_control_lines: controlLines,
			p_region_assignments: regionAssignments
		});
		if (rpcError) return fail(400, { message: rpcError.message });
		return { proposal: data };
	},

	validate: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);
		const form = await event.request.formData();
		const sessionId = String(form.get('sessionId') ?? '');
		if (!sessionId) return fail(400, { message: 'No session' });
		const { data, error: rpcError } = await event.locals.supabase.rpc(
			'validate_kyng_edit_session',
			{ p_session_id: sessionId }
		);
		if (rpcError) return fail(400, { message: rpcError.message });
		return { validation: data };
	},

	promote: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);
		const form = await event.request.formData();
		const sessionId = String(form.get('sessionId') ?? '');
		if (!sessionId) return fail(400, { message: 'No session' });
		const { data, error: rpcError } = await event.locals.supabase.rpc('promote_kyng_edit_session', {
			p_session_id: sessionId
		});
		if (rpcError) return fail(400, { message: rpcError.message });
		return { promoted: data };
	},

	discard: async (event) => {
		await requirePermission(event, PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES);
		const form = await event.request.formData();
		const sessionId = String(form.get('sessionId') ?? '');
		if (!sessionId) return fail(400, { message: 'No session' });
		const { data, error: rpcError } = await event.locals.supabase.rpc('discard_kyng_edit_session', {
			p_session_id: sessionId
		});
		if (rpcError) return fail(400, { message: rpcError.message });
		return { discarded: data };
	}
};
