import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	console.log('survey +layout.ts data:', data);
	return {};
};
