import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Only the project boundary is needed for this map. (The previous get_site_suburbs /
	// get_site_roads calls were unused here and made slow live NSW Spatial Services requests.)
	const { data, error: boundaryError } = await supabase.rpc('get_site_boundary');
	if (boundaryError) {
		console.error('error get Project Boundary:', boundaryError);
		error(400, boundaryError.message);
	}

	const row = Array.isArray(data) ? data[0] : data;
	return {
		boundaryGeometry: (row?.project_boundary ?? null) as GeoJSON.Geometry | null
	};
};
