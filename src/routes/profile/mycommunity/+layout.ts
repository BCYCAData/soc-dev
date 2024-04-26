import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	// console.log('profile/mycommunity +layout.ts data:', data);
	return {
		woohoo: 'woohoo!'
	};
};
