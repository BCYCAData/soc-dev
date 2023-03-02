import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { PageServerLoad, Actions } from './$types';
import type {
	AgentData,
	PropertyProfileData,
	UserBCYCAProfileData,
	UserPostalAddressData,
	UserProfileData
} from '$lib/db.types';

let agentData: AgentData;
let userPostalAddressData: UserPostalAddressData;
let userProfileData: UserProfileData;
let userBCYCAData: UserBCYCAProfileData;
let propertyProfileData: PropertyProfileData;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { error: agentError, data: agent } = await locals.dbClient
		.from('agent')
		.select('*')
		.eq('user_id', locals.session.user.id);
	if (agentError) {
		console.log('error get Agent for User:', agentError);
		throw error(400, agentError.message);
	}
	if (agent?.length === 1) {
		agentData = agent[0];
	} else {
		agentData = {
			user_id: locals.session.user.id,
			agent_name: null,
			agent_mobile: null,
			agent_phone: null,
			created_at: null,
			last_updated: null
		};
	}
	const { error: userPostalAddressError, data: userPostalAddressSelectData } = await locals.dbClient
		.from('user_postal_address')
		.select('*')
		.eq('user_id', locals.session?.user.id);
	if (userPostalAddressError) {
		console.log('error get Postal Address Data for User:', userPostalAddressError);
		throw error(400, userPostalAddressError.message);
	}
	if (userPostalAddressSelectData?.length === 1) {
		userPostalAddressData = userPostalAddressSelectData[0];
	} else {
		userPostalAddressData = {
			user_id: locals.session.user.id,
			postal_address_street: null,
			postal_address_suburb: null,
			postal_address_postcode: null,
			created_at: null,
			last_updated: null
		};
	}
	const { error: userProfileError, data: getUserProfileData } = await locals.dbClient
		.from('user_profile')
		.select('*')
		.eq('id', locals.session.user.id);
	if (userProfileError) {
		console.log('error Get Profile Data for User:', userProfileError);
		throw error(400, userProfileError.message);
	}
	userProfileData = getUserProfileData[0];
	const { error: userBCYCAError, data: getUserBCYCAData } = await locals.dbClient
		.from('user_bcyca_profile')
		.select('*')
		.eq('user_id', locals.session?.user.id);
	if (userBCYCAError) {
		console.log('error get BCYCA Data for User:', userBCYCAError);
		throw error(400, userBCYCAError.message);
	}
	userBCYCAData = getUserBCYCAData[0];
	const { error: propertyProfileError, data: getPropertyProfileData } = await locals.dbClient
		.from('property_profile')
		.select('*, user_profile(id), temp_user:user_profile!inner(id)')
		.in('temp_user.id', [locals.session?.user.id]);
	if (propertyProfileError) {
		console.log('error get Property Profile Data for User:', propertyProfileError);
		throw error(400, propertyProfileError.message);
	}
	propertyProfileData = getPropertyProfileData[0];

	return {
		agentData,
		userProfileData,
		userPostalAddressData,
		userBCYCAData,
		propertyProfileData
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const bodyObject = getFormData(formData, locals.session.user.id);
		const wasRented = formData.get('property_was_rented') as string;
		if (bodyObject.propertyProfileData?.property_rented?.toString() != wasRented) {
			if (wasRented === 'false') {
				console.log('Add agent');
				const { error: agentUpsertError } = await locals.dbClient.from('agent').upsert({
					user_id: locals.session.user.id,
					agent_mobile: bodyObject.agentData.agent_mobile,
					agent_name: bodyObject.agentData.agent_name,
					agent_phone: bodyObject.agentData.agent_phone
				});
				if (agentUpsertError) {
					throw error(400, `upsert Agent Data Error ${agentUpsertError.message}`);
				}
			} else {
				console.log('Delete agent');
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
		if (bodyObject.userProfileData.stay_in_touch_choices?.includes(5)) {
			const { error: userPostalAddressUpsertError } = await locals.dbClient
				.from('user_postal_address')
				.upsert({
					user_id: locals.session.user.id,
					postal_address_street: bodyObject.userPostalAddressData.postal_address_street,
					postal_address_suburb: bodyObject.userPostalAddressData.postal_address_suburb,
					postal_address_postcode: bodyObject.userPostalAddressData.postal_address_postcode
				});
			if (userPostalAddressUpsertError) {
				console.log(
					'error Survey upsert User Postal Address Data Error: ',
					userPostalAddressUpsertError
				);
				throw error(
					400,
					`error Survey upsert User Postal Address Data Error: ${userPostalAddressUpsertError.message}`
				);
			}
		}
		const { error: userProfileUpdateError } = await locals.dbClient
			.from('user_profile')
			.update({
				family_name: bodyObject.userProfileData.family_name,
				fire_fighting_experience: bodyObject.userProfileData.fire_fighting_experience,
				fire_trauma: bodyObject.userProfileData.fire_trauma,
				first_name: bodyObject.userProfileData.first_name,
				mobile: bodyObject.userProfileData.mobile,
				other_comments: bodyObject.userProfileData.other_comments,
				plan_to_leave_before_fire: bodyObject.userProfileData.plan_to_leave_before_fire,
				plan_to_leave_before_flood: bodyObject.userProfileData.plan_to_leave_before_flood,
				rfs_survival_plan: bodyObject.userProfileData.rfs_survival_plan,
				send_rfs_survival_plan: bodyObject.userProfileData.send_rfs_survival_plan,
				sent_rfs_survival_plan: bodyObject.userProfileData.sent_rfs_survival_plan,
				stay_in_touch_choices: bodyObject.userProfileData.stay_in_touch_choices
			})
			.eq('id', locals.session.user.id);
		if (userProfileUpdateError) {
			throw error(400, `update User Profile Data Error ${userProfileUpdateError.message}`);
		}
		const { error: userBCYCAProfileUpdateError } = await locals.dbClient
			.from('user_bcyca_profile')
			.update({
				community_meeting_choices: bodyObject.userBCYCAProfileData.community_meeting_choices,
				community_workshop_choices: bodyObject.userBCYCAProfileData.community_workshop_choices,
				information_sheet_choices: bodyObject.userBCYCAProfileData.information_sheet_choices,
				other_community_meeting: bodyObject.userBCYCAProfileData.other_community_meeting,
				other_community_workshop: bodyObject.userBCYCAProfileData.other_community_workshop,
				other_information_sheet: bodyObject.userBCYCAProfileData.other_information_sheet,
				will_run_community_workshops: bodyObject.userBCYCAProfileData.will_run_community_workshops
			})
			.eq('user_id', locals.session.user.id);
		if (userBCYCAProfileUpdateError) {
			throw error(
				400,
				`update User BCYCA Profile Data Error ${userBCYCAProfileUpdateError.message}`
			);
		}
		const { error: propertyProfileUpdateError } = await locals.dbClient
			.from('property_profile')
			.update({
				fire_fighting_resources: bodyObject.propertyProfileData.fire_fighting_resources,
				fire_hazard_reduction: bodyObject.propertyProfileData.fire_hazard_reduction,
				have_stortz: bodyObject.propertyProfileData.have_stortz,
				land_adjacent_hazard: bodyObject.propertyProfileData.land_adjacent_hazard,
				live_stock_present: bodyObject.propertyProfileData.live_stock_present,
				live_stock_safe_area: bodyObject.propertyProfileData.live_stock_safe_area,
				mobile_reception: bodyObject.propertyProfileData.mobile_reception,
				number_birds: bodyObject.propertyProfileData.number_birds,
				number_cats: bodyObject.propertyProfileData.number_cats,
				number_dogs: bodyObject.propertyProfileData.number_dogs,
				number_other_pets: bodyObject.propertyProfileData.number_other_pets,
				other_essential_assets: bodyObject.propertyProfileData.other_essential_assets,
				other_hazards: bodyObject.propertyProfileData.other_hazards,
				other_site_hazards: bodyObject.propertyProfileData.other_site_hazards,
				phone: bodyObject.propertyProfileData.phone,
				property_rented: bodyObject.propertyProfileData.property_rented,
				residents0_18: bodyObject.propertyProfileData.residents0_18,
				residents19_50: bodyObject.propertyProfileData.residents19_50,
				residents51_70: bodyObject.propertyProfileData.residents51_70,
				residents71_: bodyObject.propertyProfileData.residents71_,
				share_livestock_safe_area: bodyObject.propertyProfileData.share_livestock_safe_area,
				sign_posted: bodyObject.propertyProfileData.sign_posted,
				site_hazards: bodyObject.propertyProfileData.site_hazards,
				static_water_available: bodyObject.propertyProfileData.static_water_available,
				stortz_size: bodyObject.propertyProfileData.stortz_size,
				truck_access: bodyObject.propertyProfileData.truck_access,
				truck_access_other_information:
					bodyObject.propertyProfileData.truck_access_other_information,
				vulnerable_residents: bodyObject.propertyProfileData.vulnerable_residents
			})
			.eq('id', pid);
		if (propertyProfileUpdateError) {
			throw error(400, `update Property Profile Data Error ${propertyProfileUpdateError.message}`);
		}
	}
};
