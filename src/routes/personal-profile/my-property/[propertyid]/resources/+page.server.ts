import { type Actions } from '@sveltejs/kit';
import { getMyPlaceResourcesFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const profileMyPlaceResourcesFormData = getMyPlaceResourcesFormData(formData);

		const { error: myPlaceResourcesError } = await supabase
			.from('property_profile')
			.update({
				static_water_available: profileMyPlaceResourcesFormData.static_water_available,
				have_stortz: profileMyPlaceResourcesFormData.have_stortz,
				stortz_size: profileMyPlaceResourcesFormData.stortz_size,
				fire_fighting_resources: profileMyPlaceResourcesFormData.fire_fighting_resources,
				fire_hazard_reduction: profileMyPlaceResourcesFormData.fire_hazard_reduction
			})
			.eq('id', pid);
		if (myPlaceResourcesError) {
			console.log('error profileMyPlaceResources update property_profile: ', myPlaceResourcesError);
			return {
				profileMyPlaceResourcesFormData,
				success: false,
				error: true,
				errorMessage: `${myPlaceResourcesError.message}`
			};
		}
		return {
			profileMyPlaceResourcesFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
