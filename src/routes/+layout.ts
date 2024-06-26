import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import { getCommunityOptions, type CommunityRequestOption } from '$lib/profileOptions';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.user);
				}
				const cookie = parse(document.cookie);
				return cookie[key];
			}
		}
	});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const communityRequestOptions = getCommunityOptions(
		(data.communityRequestOptionsData as CommunityRequestOption[] | undefined)?.filter(
			(item) => item.community_request_options_concordance !== null
		) as CommunityRequestOption[]
	);
	const optionsData = {
		userOptionsData: communityRequestOptions.find((item) => item.table_name === 'user_profile'),
		communityBCYCAOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_bcyca_profile'
		),
		communityExternalOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_external_profile'
		),
		communityMondrookOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_mondrook_profile'
		),
		communityTinoneeOptionsData: communityRequestOptions.find(
			(item) => item.table_name === 'community_tinonee_profile'
		)
	};

	return {
		supabase,
		session,
		user: session?.user,
		role: data.role,
		permissions: data.permissionsData,
		coordinatorKyngs: data.coordinatorData,
		optionsData
	};
};
