import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyPlaceHazardsFormData } from '$lib/server/form.utils';

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
		const body = getMyPlaceHazardsFormData(formData);
		const { data: myPlaceHazards, error: myPlaceHazardsError } = await supabase
			.from('property_profile')
			.update({
				site_hazards: body.site_hazards,
				other_site_hazards: body.other_site_hazards,
				land_adjacent_hazard: body.land_adjacent_hazard,
				other_hazards: body.other_hazards
			})
			.eq('id', pid)
			.select();
		if (myPlaceHazardsError) {
			console.log('error profileMyPlaceHazards update property_profile: ', myPlaceHazardsError);
			error(
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
		error(400, 'Could not POST Profile MyPlace Hazards data');
	}
};
