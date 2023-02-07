import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myPlaceResourcesData, error: myPlaceResourcesError } = await locals.dbClient
		.from('property_profile')
		.select(
			'id,static_water_available,have_stortz,stortz_size,fire_fighting_resources,fire_hazard_reduction, user_profile(id), temp_user:user_profile!inner(id)'
		)
		.in('temp_user.id', [locals.session?.user.id]);

	if (myPlaceResourcesError) {
		console.log('error profileResources:', myPlaceResourcesError);
		throw error(400, `get myPlace Resources Error ${myPlaceResourcesError.message}`);
	}
	if (myPlaceResourcesData.length === 1) {
		const profileResources = myPlaceResourcesData[0];
		if (null == profileResources.static_water_available) {
			profileResources.static_water_available = [];
		}
		if (null == profileResources.fire_fighting_resources) {
			profileResources.fire_fighting_resources = [];
		}
		if (null == profileResources.fire_hazard_reduction) {
			profileResources.fire_hazard_reduction = [];
		}
		return {
			resourcesData: profileResources
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Place Resources data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myPlaceResourcesData, error: myPlaceResourcesError } = await locals.dbClient
			.from('property_profile')
			.update({
				static_water_available: formData.getAll('static_water_available'),
				have_stortz: formData.get('have_stortz'),
				stortz_size: parseInt(formData.get('stortz_size') as string) || 0,
				fire_fighting_resources: formData.getAll('fire_fighting_resources'),
				fire_hazard_reduction: formData.getAll('fire_hazard_reduction')
			})
			.eq('id', formData.get('property_key'))
			.select();
		if (myPlaceResourcesError) {
			console.log('update error profileResources:', myPlaceResourcesError);
			throw error(
				400,
				`save Profile MyPlace Resources data Error ${myPlaceResourcesError.message}`
			);
		}
		if (myPlaceResourcesData.length === 1) {
			const profileResources = myPlaceResourcesData[0];
			return {
				user: locals.session.user,
				profileMyPlaceResources: profileResources
			};
		}
		throw error(400, 'Could not POST Profile MyPlace Resources data');
	}
};
