import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const wasRented = formData.get('property_was_rented') as string;
		const body = getFormData(formData, locals.session.user.id);
		if (body.propertyProfileData?.property_rented?.toString() != wasRented) {
			if (wasRented === 'false') {
				const { data: agentReturnData, error: agentUpsertError } = await locals.dbClient
					.from('agent')
					.upsert({
						user_id: locals.session.user.id,
						agent_mobile: body.agentData.agent_mobile,
						agent_name: body.agentData.agent_name,
						agent_phone: body.agentData.agent_phone
					})
					.select();
				if (agentUpsertError) {
					console.log('error profileMyPlace upsertAgent:', agentUpsertError);
					throw error(400, `error profileMyPlace upsertAgent ${agentUpsertError.message}`);
				}
			} else {
				const { error: deleteAgentError } = await locals.dbClient
					.from('agent')
					.delete()
					.eq('user_id', locals.session.user.id);
				if (deleteAgentError) {
					console.log('error profileMyPlace delete agent: ', deleteAgentError);
					throw error(400, `error profileMyPlace delete agent: ${deleteAgentError.message}`);
				}
			}
		}
		const { error: profileMyPlaceDataError, data: profileMyPlace } = await locals.dbClient
			.from('property_profile')
			.update({
				property_rented: (formData.get('property_rented') as unknown as boolean) || null,
				sign_posted: (formData.get('sign_posted') as unknown as boolean) || null,
				truck_access: parseInt(formData.get('truck_access') as string),
				truck_access_other_information:
					(formData.get('truck_access_other_information') as string) || null,
				residents0_18: parseInt(formData.get('residents0_18') as string) || 0,
				residents19_50: parseInt(formData.get('residents19_50') as string) || 0,
				residents51_70: parseInt(formData.get('residents51_70') as string) || 0,
				residents71_: parseInt(formData.get('residents71_') as string) || 0,
				vulnerable_residents: (formData.get('vulnerable_residents') as unknown as boolean) || null,
				phone: formData.get('phone') as string,
				mobile_reception: parseInt(formData.get('mobile_reception') as string) || null
			})
			.eq('id', pid)
			.select();
		if (profileMyPlaceDataError) {
			console.log('error profileMyPlace update property_profile: ', profileMyPlaceDataError);
			throw error(
				400,
				`error profileMyPlace update property_profile: ${profileMyPlaceDataError.message}`
			);
		}
	}
};
