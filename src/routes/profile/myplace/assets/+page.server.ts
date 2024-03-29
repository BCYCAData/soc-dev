import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

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
		const body: { propertyProfileData: PropertyProfileData } = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid,
			session.user.app_metadata.community,
			session.user.app_metadata.kyng
		);
		const { data: myPlaceAssets, error: myPlaceAssetsError } = await supabase
			.from('property_profile')
			.update({
				...body.propertyProfileData
			})
			.eq('id', pid)
			.select();
		if (myPlaceAssetsError) {
			console.log('error profileMyPlaceAssets update property_profile: ', myPlaceAssetsError);
			error(
				400,
				`error profileMyPlaceAssets update property_profile: ${myPlaceAssetsError.message}`
			);
		}
		if (myPlaceAssets.length === 1) {
			propertyProfileData = myPlaceAssets[0];
			return {
				propertyProfileData
			};
		}
		error(400, 'Could not POST Profile MyPlace Assets data');
	}
};
