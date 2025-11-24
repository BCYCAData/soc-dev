import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

const emptyOptionsData = {
	object_names: [] as { object_name: string; options: { value: string; lable: string }[] }[]
};

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch }
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch },
				cookies: {
					getAll() {
						return (data as any)?.cookies ?? [];
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!session) {
		return {
			session,
			supabase,
			user,
			userRole: null,
			permissions: null,
			coordinatesKYNG: null,
			propertyIds: null,
			userProfile: null,
			optionsData: {
				userOptionsData: emptyOptionsData,
				communityBCYCAOptionsData: emptyOptionsData,
				communityExternalOptionsData: emptyOptionsData,
				communityTinoneeOptionsData: emptyOptionsData,
				communityMondrookOptionsData: emptyOptionsData
			}
		};
	}

	return {
		session,
		supabase,
		user,
		userRole: (data as any)?.userRole ?? null,
		permissions: (data as any)?.permissions ?? null,
		coordinatesKYNG: (data as any)?.coordinatesKYNG ?? null,
		propertyIds: (data as any)?.propertyIds ?? null,
		userProfile: (data as any)?.userProfile ?? null,
		optionsData: {
			userOptionsData: (data as any)?.optionsData?.userOptionsData ?? emptyOptionsData,
			communityBCYCAOptionsData:
				(data as any)?.optionsData?.communityBCYCAOptionsData ?? emptyOptionsData,
			communityExternalOptionsData:
				(data as any)?.optionsData?.communityExternalOptionsData ?? emptyOptionsData,
			communityTinoneeOptionsData:
				(data as any)?.optionsData?.communityTinoneeOptionsData ?? emptyOptionsData,
			communityMondrookOptionsData:
				(data as any)?.optionsData?.communityMondrookOptionsData ?? emptyOptionsData
		}
	};
};
