import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

import type {
	AgentData,
	PropertyProfileData,
	UserBCYCAProfileData,
	UserTinoneeProfileData,
	UserMondrookProfileData,
	UserExternalProfileData,
	UserPostalAddressData,
	UserProfileData,
	PropertyGeometryData
} from '$lib/custom.types';

import type { PageServerLoad } from './$types';

let propertyProfileData: PropertyProfileData;
let propertyAgentData: AgentData;
let propertyGeometryData: PropertyGeometryData;
let userProfileData: UserProfileData;
let userPostalAddressData: UserPostalAddressData;
let communityBCYCAProfileData: UserBCYCAProfileData;
let communityTinoneeProfileData: UserTinoneeProfileData;
let communityMondrookProfileData: UserMondrookProfileData;
let communityExternalProfileData: UserExternalProfileData;

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		redirect(307, '/auth/signin');
	}
	const { data, error: getSurveyDataError } = await supabase
		.from('property_profile')
		.select(
			` * , property_geometry(*), user_profile( *, community_bcyca_profile(*), 
				community_tinonee_profile(*), community_mondrook_profile(*), community_external_profile(*), 
				user_postal_address(*) ), property_agent(*)`
		)
		.eq('principaladdresssiteoid', session.user.app_metadata.principaladdresssiteoid)
		.eq('user_profile.id', session.user.id);
	if (getSurveyDataError) {
		console.log('GET data error Survey:', getSurveyDataError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Survey.`,
			user: `User:: ${session.user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, getSurveyDataError);
		error(400, `GET data error Survey:  Error ${getSurveyDataError.message}`);
	}
	if (data && data.length > 0) {
		const surveyData = data[0];
		const {
			user_profile: [_userProfileData],
			property_geometry,
			property_agent,
			...property_profile
		} = data[0];
		const {
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile,
			...userProfile
		} = _userProfileData;
		propertyProfileData = property_profile;
		if (property_agent) {
			propertyAgentData = property_agent;
		} else {
			propertyAgentData = {
				agent_mobile: '',
				agent_name: '',
				agent_phone: '',
				created_at: '',
				last_updated: '',
				property_id: ''
			};
		}
		if (property_geometry) {
			propertyGeometryData = property_geometry;
		} else {
			propertyGeometryData = {
				address_point: null,
				created_at: '',
				id: '',
				last_updated: '',
				principaladdresssiteoid: -1,
				property: null,
				way_point: null
			};
		}
		userProfileData = userProfile;
		if (user_postal_address) {
			userPostalAddressData = user_postal_address;
		} else {
			userPostalAddressData = {
				created_at: '',
				last_updated: '',
				postal_address_postcode: '',
				postal_address_street: '',
				postal_address_suburb: '',
				user_id: ''
			};
		}
		if (community_bcyca_profile) {
			communityBCYCAProfileData = community_bcyca_profile;
		} else {
			communityBCYCAProfileData = {
				bcyca_profile_id: '',
				community_meeting_choices: [],
				community_workshop_choices: [],
				created_at: '',
				information_sheet_choices: [],
				last_updated: '',
				other_community_meeting: '',
				other_community_workshop: '',
				other_information_sheet: '',
				stay_in_touch_choices: [],
				will_run_community_workshops: ''
			};
		}
		if (community_tinonee_profile) {
			communityTinoneeProfileData = community_tinonee_profile;
		} else {
			communityTinoneeProfileData = {
				tinonee_profile_id: '',
				community_meeting_choices: [],
				community_workshop_choices: [],
				created_at: '',
				information_sheet_choices: [],
				last_updated: '',
				other_community_meeting: '',
				other_community_workshop: '',
				other_information_sheet: '',
				stay_in_touch_choices: [],
				will_run_community_workshops: ''
			};
		}
		if (community_mondrook_profile) {
			communityMondrookProfileData = community_mondrook_profile;
		} else {
			communityMondrookProfileData = {
				mondrook_profile_id: '',
				community_meeting_choices: [],
				community_workshop_choices: [],
				created_at: '',
				information_sheet_choices: [],
				last_updated: '',
				other_community_meeting: '',
				other_community_workshop: '',
				other_information_sheet: '',
				stay_in_touch_choices: [],
				will_run_community_workshops: ''
			};
		}
		if (community_external_profile) {
			communityExternalProfileData = community_external_profile;
		} else {
			communityExternalProfileData = {
				external_profile_id: '',
				community_meeting_choices: [],
				community_workshop_choices: [],
				created_at: '',
				information_sheet_choices: [],
				last_updated: '',
				other_community_meeting: '',
				other_community_workshop: '',
				other_information_sheet: '',
				stay_in_touch_choices: [],
				will_run_community_workshops: ''
			};
		}
	} else {
		// Handle the case when data is null or empty
		console.error('No data found or an error occurred.');
	}

	return {
		propertyProfileData,
		propertyAgentData,
		propertyGeometryData,
		userProfileData,
		userPostalAddressData,
		communityBCYCAProfileData,
		communityTinoneeProfileData,
		communityMondrookProfileData,
		communityExternalProfileData
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const bodyObject = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid,
			session.user.app_metadata.community,
			session.user.app_metadata.kyng
		);
		const wasRented = formData.get('property_was_rented') as string;
		if (bodyObject.propertyProfileData?.property_rented?.toString() != wasRented) {
			if (wasRented === 'false') {
				const { error: agentUpsertError } = await supabase.from('agent').upsert({
					property_id: session.user.app_metadata.property_id,
					agent_mobile: bodyObject.agentData.agent_mobile,
					agent_name: bodyObject.agentData.agent_name,
					agent_phone: bodyObject.agentData.agent_phone
				});
				if (agentUpsertError) {
					error(400, `upsert Agent Data Error ${agentUpsertError.message}`);
				}
			} else {
				const { error: deleteAgentError } = await supabase
					.from('agent')
					.delete()
					.eq('property_id', session.user.app_metadata.property_id);
				if (deleteAgentError) {
					console.log('error profileMyPlace delete agent: ', deleteAgentError);
					error(400, `error profileMyPlace delete agent: ${deleteAgentError.message}`);
				}
			}
		}
		if (bodyObject.userProfileData.stay_in_touch_choices?.includes(5)) {
			const { error: userPostalAddressUpsertError } = await supabase
				.from('user_postal_address')
				.upsert({
					user_id: session.user.id,
					postal_address_street: bodyObject.userPostalAddressData.postal_address_street,
					postal_address_suburb: bodyObject.userPostalAddressData.postal_address_suburb,
					postal_address_postcode: bodyObject.userPostalAddressData.postal_address_postcode
				});
			if (userPostalAddressUpsertError) {
				console.log(
					'error Survey upsert User Postal Address Data Error: ',
					userPostalAddressUpsertError
				);
				error(
					400,
					`error Survey upsert User Postal Address Data Error: ${userPostalAddressUpsertError.message}`
				);
			}
		}
		const { error: userProfileUpdateError } = await supabase
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
				residency_profile: bodyObject.userProfileData.residency_profile,
				stay_in_touch_choices: bodyObject.userProfileData.stay_in_touch_choices
			})
			.eq('id', session.user.id);
		if (userProfileUpdateError) {
			error(400, `update User Profile Data Error ${userProfileUpdateError.message}`);
		}
		const { error: userBCYCAProfileUpdateError } = await supabase
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
			.eq('user_id', session.user.id);
		if (userBCYCAProfileUpdateError) {
			error(400, `update User BCYCA Profile Data Error ${userBCYCAProfileUpdateError.message}`);
		}
		const { error: propertyProfileUpdateError } = await supabase
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
			error(400, `update Property Profile Data Error ${propertyProfileUpdateError.message}`);
		}
		redirect(303, '/profile');
	}
};
