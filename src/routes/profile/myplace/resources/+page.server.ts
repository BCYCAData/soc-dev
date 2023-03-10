import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { Actions } from './$types';
import type { PropertyProfileData } from '$lib/db.types';

let propertyProfileData: PropertyProfileData;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const body = getFormData(formData, locals.session.user.id);
		const { data: myPlaceResources, error: myPlaceResourcesError } = await locals.dbClient
			.from('property_profile')
			.update({
				static_water_available: body.propertyProfileData.static_water_available,
				have_stortz: body.propertyProfileData.have_stortz,
				stortz_size: body.propertyProfileData.stortz_size,
				fire_fighting_resources: body.propertyProfileData.fire_fighting_resources,
				fire_hazard_reduction: body.propertyProfileData.fire_hazard_reduction
			})
			.eq('id', pid)
			.select();
		if (myPlaceResourcesError) {
			console.log('error profileMyPlaceResources update property_profile: ', myPlaceResourcesError);
			throw error(
				400,
				`error profileMyPlaceResources update property_profile: ${myPlaceResourcesError.message}`
			);
		}
		if (myPlaceResources.length === 1) {
			propertyProfileData = myPlaceResources[0];
			return {
				propertyProfileData
			};
		}
		throw error(400, 'Could not POST Profile MyPlace Resources data');
	}
};
