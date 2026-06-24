/**
 * Server-side glue between the admin-configured required-question set
 * (`profile_required_question`) and the pure completion engine
 * (`$lib/profile/completion`).
 *
 * Both helpers fail OPEN: on any data error they report the profile as complete so
 * a transient DB problem never traps a user behind the completion nag.
 *
 * @module server/profile-requirements
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/db.types';
import { computeProfileCompletion, type ProfileCompletion } from '$lib/profile/completion';

const COMPLETE_FALLBACK: ProfileCompletion = {
	total: 0,
	answered: 0,
	percent: 100,
	isComplete: true,
	missing: []
};

/** Field keys an admin has marked required, in display order. */
export async function getRequiredFieldKeys(
	supabase: SupabaseClient<Database>
): Promise<string[]> {
	const { data, error } = await supabase
		.from('profile_required_question')
		.select('field_key')
		.eq('is_required', true)
		.order('sort_order');

	if (error) {
		console.error('Failed to load profile required questions:', error);
		return [];
	}
	return data.map((row) => row.field_key);
}

/**
 * Computes profile completion for a user against the configured required set.
 * Loads the user's profile via the existing `get_profile_for_user` RPC (whose raw
 * payload has `property_profile` as an array — exactly what the engine expects).
 */
export async function getProfileCompletion(
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<ProfileCompletion> {
	const requiredKeys = await getRequiredFieldKeys(supabase);
	if (requiredKeys.length === 0) {
		return COMPLETE_FALLBACK;
	}

	const { data: profile, error } = await supabase.rpc('get_profile_for_user', {
		id_input: userId
	});

	if (error || !profile) {
		console.error('Failed to load profile for completion check:', error);
		return COMPLETE_FALLBACK;
	}

	return computeProfileCompletion(profile as Record<string, unknown>, requiredKeys);
}
