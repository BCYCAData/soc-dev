import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyPlaceResourcesFormData } from '$lib/server/form.utils';

import type { PropertyProfileData } from '$lib/custom.types';

let propertyProfileData: PropertyProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const body = getMyPlaceResourcesFormData(formData);
		const { data: myPlaceResources, error: myPlaceResourcesError } = await supabase
			.from('property_profile')
			.update({
				static_water_available: body.static_water_available,
				have_stortz: body.have_stortz,
				stortz_size: body.stortz_size,
				fire_fighting_resources: body.fire_fighting_resources,
				fire_hazard_reduction: body.fire_hazard_reduction
			})
			.eq('id', pid)
			.select();
		if (myPlaceResourcesError) {
			console.log('error profileMyPlaceResources update property_profile: ', myPlaceResourcesError);
			error(
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
		error(400, 'Could not POST Profile MyPlace Resources data');
	}
};
