import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data: propertyGeometryData, error: propertyGeometryError } = await supabase.rpc(
		'get_property_geometry',
		{ id_input: params.propertyid }
	);
	if (propertyGeometryError) {
		console.log('error get Property Geometry:', propertyGeometryError);
		error(400, propertyGeometryError);
	}
	return { propertyGeometryData };
};
