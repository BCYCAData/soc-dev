import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { supabase } = locals;
	const { kyng_area } = params;

	const parentData = await parent();
	interface KYNGArea {
		kyngAreaId: string;
	}

	const currentArea: KYNGArea | undefined = parentData.coordinatesKYNG?.find(
		(area: KYNGArea) => area.kyngAreaId === kyng_area
	);

	const { data: unRegisteredPropertiesData, error: unRegisteredPropertiesError } =
		await supabase.rpc('get_unregistered_properties_by_kyng_area', { kyngarea_id: kyng_area });

	if (unRegisteredPropertiesError) {
		console.log('error Unregistered Properties Data:', unRegisteredPropertiesError);
		throw error(400, unRegisteredPropertiesError.message);
	}

	return {
		currentArea,
		unRegisteredPropertiesData
	};
};
