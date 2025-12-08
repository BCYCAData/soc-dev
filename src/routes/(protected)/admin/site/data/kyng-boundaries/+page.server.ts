import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: siteSuburbsData, error: siteSuburbsError } = await supabase.rpc('get_site_suburbs');
	if (siteSuburbsError) {
		console.log('error get Project Suburbs list:', siteSuburbsError);
		error(400, siteSuburbsError.message);
	}
	const { data: siteRoadsData, error: siteRoadsError } = await supabase.rpc('get_site_roads');
	if (siteRoadsError) {
		console.log('error get Project Roads list:', siteRoadsError);
		error(400, siteRoadsError.message);
	}
	const { data: siteBoundaryData, error: siteBoundaryError } =
		await supabase.rpc('get_site_boundary');
	if (siteRoadsError) {
		console.log('error get Project Boundary:', siteBoundaryError);
		error(400, siteBoundaryError.message);
	}

	return {
		siteSuburbsData: siteSuburbsData,
		siteRoadsData: siteRoadsData,
		siteBoundaryData: siteBoundaryData
	};
};
