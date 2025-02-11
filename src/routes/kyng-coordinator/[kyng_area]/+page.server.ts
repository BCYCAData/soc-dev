import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { kyng_area } = params;

	const parentData = await parent();
	const currentArea = parentData.coordinatesKYNG?.find((area) => area.kyngAreaId === kyng_area);

	return {
		currentArea
	};
};
