import type { LayoutLoad } from './$types';
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
injectAnalytics({ mode: dev ? 'development' : 'production' });

export const load: LayoutLoad = async ({ data }) => {
	// Simply pass through server data - no client-side Supabase needed
	// Note: optionsData may be provided by child layouts
	// optionsData is injected by child layouts with varying shapes; keep it loose.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
