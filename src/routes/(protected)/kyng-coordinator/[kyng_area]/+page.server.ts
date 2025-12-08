import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { kyng_area } = params;

	const parentData = await parent();
	interface KyngArea {
		kyngAreaId: string;
	}

	interface ParentData {
		coordinatesKYNG?: KyngArea[];
	}

	const currentArea: KyngArea | undefined = (parentData as ParentData).coordinatesKYNG?.find(
		(area: KyngArea) => area.kyngAreaId === kyng_area
	);

	return {
		currentArea
	};
};
