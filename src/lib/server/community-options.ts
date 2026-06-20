import type { SupabaseClient } from '@supabase/supabase-js';
import { getCommunityOptions } from '$lib/profile-options';
import type { Database } from '$lib/db.types';
import type { TransformedOptionsData } from '$lib/types';

/**
 * Fetches the community request options lookup data and transforms it into the
 * grouped `{ table_name, object_names }` structure used by the profile forms.
 *
 * This replaces the previously-expected `locals.getCommunityRequestOptions()`
 * helper that was removed from `hooks.server.ts` but still referenced by the
 * personal profile form load.
 */
export async function getCommunityRequestOptions(
	supabase: SupabaseClient<Database>
): Promise<TransformedOptionsData[]> {
	const { data, error } = await supabase.from('community_request_options_lut').select(`
                index_value,
                lable,
                community_request_options_concordance!public_community_request_options_lut_concordance_fkey (
                    table_name,
                    object_name,
                    field_name
                )
            `);

	if (error) {
		throw new Error(`Failed to fetch community request options: ${error.message}`);
	}

	return getCommunityOptions(data ?? []);
}
