import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { error: myPlaceError, data: myPlaceData } = await locals.dbClient
		.from('property_profile')
		.select(
			'id, property_address_street,property_address_suburb,property_address_postcode,property_rented,phone,mobile_reception,sign_posted,truck_access,truck_access_other_information,residents0_18,residents19_50,residents51_70,residents71_,vulnerable_residents, user_profile(id), temp_user:user_profile!inner(id)'
		)
		.in('temp_user.id', [locals.session?.user.id]);
	if (myPlaceError) {
		throw error(400, `get myPlace Error ${myPlaceError.message}`);
	}
	if (myPlaceData.length === 1) {
		let renting = false;
		let agent: any;
		if (myPlaceData?.[0].property_rented) {
			renting = true;
			const { error: agentError, data: agentData } = await locals.dbClient
				.from('agent')
				.select('agent_name,agent_mobile,agent_phone')
				.eq('id', [myPlaceData?.[0].property_rented]);
			if (agentError) {
				throw error(400, `get agent Error ${agentError.message}`);
			}
			agent = agentData[0];
		} else {
			agent = [{ agent_name: '', agent_mobile: '', agent_phone: '' }];
		}
		return { myPlaceData: myPlaceData[0], renting: renting, agentData: agent };
	}
	throw error(400, 'Something went wrong retrieving the Profile My Place data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		console.log(formData);
		const body = Object.fromEntries(formData);
		if (body.isRented != body.wasRented) {
			if (body.isRented == 'true') {
				const pk = body.property_key;
				const name = body.agent_name;
				const phone = body.agent_phone;
				const mobile = body.agent_mobile;
				const { error: addAgentError } = await locals.dbClient.rpc('add_agent', {
					property_uid: pk,
					var_agent_name: name,
					var_agent_phone: phone,
					var_agent_mobile: mobile
				});
				if (addAgentError) {
					console.log('update error profileMyPlace addAgent:', addAgentError);
					throw error(400, `addAgent Error ${addAgentError.message}`);
				}
			} else {
				const pk = body.property_key;
				const fk = body.property_rented;
				const { error: deleteAgentError } = await locals.dbClient.rpc('delete_agent', {
					property_uid: pk,
					agent_uid: fk
				});
				if (deleteAgentError) {
					console.log('update error profileMyPlace deleteAgent:', deleteAgentError);
					throw error(400, `deleteAgent Error ${deleteAgentError.message}`);
				}
			}
		}
		const { error: userProfileDataError, data: userProfileData } = await locals.dbClient
			.from('property_profile')
			.update({
				sign_posted: formData.get('sign_posted'),
				truck_access: parseInt(formData.get('truck_access') as string),
				truck_access_other_information: formData.get('truck_access_other_information'),
				residents0_18: parseInt(formData.get('residents0_18') as string) || 0,
				residents19_50: parseInt(formData.get('residents19_50') as string) || 0,
				residents51_70: parseInt(formData.get('residents51_70') as string) || 0,
				residents71_: parseInt(formData.get('residents71_') as string) || 0,
				vulnerable_residents: formData.get('vulnerable_residents'),
				phone: formData.get('phone'),
				mobile_reception: formData.get('mobile_reception')
			})
			.eq('id', formData.get('property_key'))
			.select();
		if (userProfileDataError) {
			console.log('update error myPlace:', userProfileDataError);
			throw error(400, `save Profile MyPlace data Error ${userProfileDataError.message}`);
		}
		if (userProfileData.length === 1) {
			const profileMyPlace = userProfileData[0];
			return {
				user: locals?.session?.user,
				profileMyPlace: profileMyPlace
			};
		}
		throw error(400, 'Could not POST Profile My Place data');
	}
};
