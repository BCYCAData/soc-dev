import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { supabase } = locals;
	const { kyng_area } = params;

	const parentData = await parent();
	interface KyngArea {
		kyngAreaId: string;
		// Add other properties as needed
	}

	interface ParentData {
		coordinatesKYNG?: KyngArea[];
		// Add other properties as needed
	}

	const currentArea: KyngArea | undefined = (parentData as ParentData).coordinatesKYNG?.find(
		(area: KyngArea) => area.kyngAreaId === kyng_area
	);

	const { data: registeredPropertiesData, error: registeredPropertiesError } = await supabase.rpc(
		'get_registered_properties_by_kyng_area',
		{ kyngarea_id: currentArea?.kyngAreaId || '' }
	);

	if (registeredPropertiesError) {
		console.log('error registered Properties Data:', registeredPropertiesError);
		throw error(400, registeredPropertiesError.message);
	}

	return {
		currentArea,
		registeredPropertiesData
	};
};
