import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyPlaceHazardsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const profileMyPlaceHazardsFormData = getMyPlaceHazardsFormData(formData);
		const { error: myPlaceHazardsError } = await supabase
			.from('property_profile')
			.update({
				site_hazards: profileMyPlaceHazardsFormData.site_hazards,
				other_site_hazards: profileMyPlaceHazardsFormData.other_site_hazards,
				land_adjacent_hazard: profileMyPlaceHazardsFormData.land_adjacent_hazard,
				other_hazards: profileMyPlaceHazardsFormData.other_hazards
			})
			.eq('id', pid);
		if (myPlaceHazardsError) {
			console.log('error profileMyPlaceHazards update property_profile: ', myPlaceHazardsError);
			error(
				400,
				`error profileMyPlaceHazards update property_profile: ${myPlaceHazardsError.message}`
			);
		}
		return {
			profileMyPlaceHazardsFormData
		};
	}
};
