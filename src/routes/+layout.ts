import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	// Simply pass through server data - no client-side Supabase needed
	// Note: optionsData may be provided by child layouts
	const dataWithOptional = data as typeof data & { optionsData?: any };

	return {
		session: data.session ?? null,
		user: data.user ?? null,
		userRole: data.userRole ?? null,
		permissions: data.permissions ?? [],
		coordinatesKYNG: data.coordinatesKYNG ?? null,
		propertyIds: data.propertyIds ?? null,
		userProfile: data.userProfile ?? null,
		...(dataWithOptional.optionsData && {
			optionsData: dataWithOptional.optionsData
		})
	};
};
