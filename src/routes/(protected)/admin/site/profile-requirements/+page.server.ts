import { error, fail, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';
import { PROFILE_FIELD_CATALOG, PROFILE_FIELD_BY_KEY } from '$lib/profile/field-catalog';

export const load: PageServerLoad = async ({ locals: { supabase, permissions } }) => {
	if (!hasPermission(permissions ?? [], PERMISSIONS.ADMIN_SITE_PROFILE_REQUIREMENTS)) {
		throw error(403, 'Insufficient permissions to manage profile requirements');
	}

	const { data, error: loadError } = await supabase
		.from('profile_required_question')
		.select('field_key, is_required, sort_order');

	if (loadError) {
		console.error('Failed to load profile requirements:', loadError);
		throw error(500, 'Failed to load profile requirements');
	}

	// Currently-required keys (ignore stale rows for fields no longer in the catalog).
	const requiredKeys = (data ?? [])
		.filter(
			(row: { field_key: string; is_required: boolean }) =>
				row.is_required && PROFILE_FIELD_BY_KEY.has(row.field_key)
		)
		.map((row: { field_key: string }) => row.field_key);

	return {
		catalog: PROFILE_FIELD_CATALOG,
		requiredKeys
	};
};

export const actions: Actions = {
	saveRequirements: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions ?? [], PERMISSIONS.ADMIN_SITE_PROFILE_REQUIREMENTS)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to manage profile requirements'
			});
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { success: false, message: 'Not authenticated' });
		}

		const formData = await request.formData();
		const checked = new Set(formData.getAll('required').map(String));

		// Upsert one row per catalog field with its required flag, validated and
		// ordered by the canonical catalog. A single non-destructive upsert (no
		// delete) avoids any window where the config could be left wiped.
		const now = new Date().toISOString();
		const rows = PROFILE_FIELD_CATALOG.map((field, index) => ({
			field_key: field.key,
			is_required: checked.has(field.key),
			sort_order: index,
			updated_by: user.id,
			updated_at: now
		}));

		const { error: upsertError } = await supabase
			.from('profile_required_question')
			.upsert(rows, { onConflict: 'field_key' });
		if (upsertError) {
			console.error('Failed to save profile requirements:', upsertError);
			return fail(400, { success: false, message: 'Failed to save profile requirements' });
		}

		const requiredCount = checked.size;
		return {
			success: true,
			message: `Saved — ${requiredCount} question${requiredCount === 1 ? '' : 's'} required.`
		};
	}
};
