import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params: { kyng_area } }) => {
	setLoading(true);
	let { data: kyngGeoJsonData, error: errorKyngGeoJson } = await supabase.rpc('get_kyngs_geojson', {
		uuid: kyng_area
	});
	setLoading(false);
	if (errorKyngGeoJson) {
		console.log(`error get KYNG GeoJSON for ${kyng_area}:`, errorKyngGeoJson);
		error(400, errorKyngGeoJson);
	}

	return {
		kyngGeoJsonData
	};
};
