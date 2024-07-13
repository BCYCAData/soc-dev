import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	locals: { supabase, user },
	params: { kyng_area }
}) => {
	if (!user) {
		redirect(307, '/auth/signin');
	}
	let { data: kyngGeoJsonData, error: errorKyngGeoJson } = await supabase.rpc('get_kyngs_geojson', {
		uuid: kyng_area
	});
	if (errorKyngGeoJson) {
		console.log(`error get KYNG GeoJSON for ${kyng_area}:`, errorKyngGeoJson);
		error(400, errorKyngGeoJson);
	}
	return {
		kyngGeoJsonData
	};
};
