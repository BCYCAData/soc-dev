import { type Actions } from '@sveltejs/kit';
import { getMyPlaceFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const wasRented = formData.get('property_was_rented') as string;
		const profileMyPlaceFormData = getMyPlaceFormData(formData);
		const { error: myPlaceDataError } = await supabase
			.from('property_profile')
			.update({
				property_rented: profileMyPlaceFormData.property_rented,
				sign_posted: profileMyPlaceFormData.sign_posted,
				truck_access: profileMyPlaceFormData.truck_access,
				truck_access_other_information: profileMyPlaceFormData.truck_access_other_information,
				residents0_18: profileMyPlaceFormData.residents0_18,
				residents19_50: profileMyPlaceFormData.residents19_50,
				residents51_70: profileMyPlaceFormData.residents51_70,
				residents71_: profileMyPlaceFormData.residents71_,
				vulnerable_residents: profileMyPlaceFormData.vulnerable_residents,
				phone: profileMyPlaceFormData.phone,
				mobile_reception: profileMyPlaceFormData.mobile_reception
			})
			.eq('id', pid);
		if (myPlaceDataError) {
			console.log('error profileMyPlace update property_profile: ', myPlaceDataError);
			return {
				profileMyPlaceFormData,
				success: false,
				error: true,
				errorMessage: `${myPlaceDataError.message}`
			};
		} else {
			if (
				profileMyPlaceFormData.property_rented?.toString() != wasRented &&
				wasRented !== undefined
			) {
				if (wasRented === 'false') {
					const { error: agentUpsertError } = await supabase.from('property_agent').upsert({
						property_id: pid,
						agent_mobile: profileMyPlaceFormData.propertyAgentData?.agent_mobile,
						agent_name: profileMyPlaceFormData.propertyAgentData?.agent_name,
						agent_phone: profileMyPlaceFormData.propertyAgentData?.agent_phone
					});
					if (agentUpsertError) {
						console.log('error profileMyPlace upsertAgent:', agentUpsertError);
						return {
							profileMyPlaceFormData,
							success: false,
							error: true,
							errorMessage: `${agentUpsertError.message}`
						};
					}
				} else {
					const { error: deleteAgentError } = await supabase
						.from('property_agent')
						.delete()
						.eq('property_id', pid);
					if (deleteAgentError) {
						console.log('error profileMyPlace delete agent: ', deleteAgentError);
						return {
							profileMyPlaceFormData,
							success: false,
							error: true,
							errorMessage: `${deleteAgentError.message}`
						};
					}
				}
			}
		}
		return {
			profileMyPlaceFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
