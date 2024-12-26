import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const parentData = await parent();
	const currentArea = parentData.coordinatesKYNG?.find(
		(area) => area.kyngAreaId === params.kyng_area
	);

	return {
		currentArea
	};
};
