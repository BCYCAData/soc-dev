import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myPlaceHazardsData, error: myPlaceHazardsError } = await locals.dbClient
		.from('property_profile')
		.select(
			'id,site_hazards,other_site_hazards,land_adjacent_hazard,other_hazards, user_profile(id), temp_user:user_profile!inner(id)'
		)
		.in('temp_user.id', [locals.session?.user.id]);
	if (myPlaceHazardsError) {
		console.log('error profileHazards:', myPlaceHazardsError);
		throw error(400, `get myPlace Hazards Error ${myPlaceHazardsError.message}`);
	}
	if (myPlaceHazardsData.length === 1) {
		const profileHazards = myPlaceHazardsData[0];
		if (null == profileHazards.site_hazards) {
			profileHazards.site_hazards = [];
		}
		return {
			hazardsData: profileHazards
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Place Hazards data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myPlaceHazardsData, error: myPlaceHazardsError } = await locals.dbClient
			.from('property_profile')
			.update({
				site_hazards: formData.getAll('site_hazards'),
				other_site_hazards: formData.get('other_site_hazards'),
				land_adjacent_hazard: formData.get('land_adjacent_hazard'),
				other_hazards: formData.get('other_hazards')
			})
			.eq('id', formData.get('property_key'))
			.select();
		if (myPlaceHazardsError) {
			console.log('update error profileHazards:', myPlaceHazardsError);
			throw error(400, `save Profile MyPlace Hazards data Error ${myPlaceHazardsError.message}`);
		}
		if (myPlaceHazardsData.length === 1) {
			const profileHazards = myPlaceHazardsData[0];
			return {
				user: locals.session.user,
				profileMyPlaceHazards: profileHazards
			};
		}
		throw error(400, 'Could not POST Profile MyPlace Hazards data');
	}
};
