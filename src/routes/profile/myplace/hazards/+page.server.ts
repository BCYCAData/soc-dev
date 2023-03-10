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
		const { data: myPlaceHazards, error: myPlaceHazardsError } = await locals.dbClient
			.from('property_profile')
			.update({
				site_hazards: body.propertyProfileData.site_hazards,
				other_site_hazards: body.propertyProfileData.other_site_hazards,
				land_adjacent_hazard: body.propertyProfileData.land_adjacent_hazard,
				other_hazards: body.propertyProfileData.other_hazards
			})
			.eq('id', pid)
			.select();
		if (myPlaceHazardsError) {
			console.log('error profileMyPlaceHazards update property_profile: ', myPlaceHazardsError);
			throw error(
				400,
				`error profileMyPlaceHazards update property_profile: ${myPlaceHazardsError.message}`
			);
		}
		if (myPlaceHazards.length === 1) {
			propertyProfileData = myPlaceHazards[0];
			return {
				propertyProfileData
			};
		}
		throw error(400, 'Could not POST Profile MyPlace Hazards data');
	}
};
