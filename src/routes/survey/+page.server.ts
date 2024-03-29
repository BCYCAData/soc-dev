import { error, redirect, type Actions } from '@sveltejs/kit';
import { getSurveyFormData } from '$lib/server/form.utils';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

import type { Step } from '$lib/types';

import type { PageServerLoad } from './$types';
import type { QueryData } from '@supabase/supabase-js';

let steps: Step[] = [
	{ index: 1, text: '1', page: 'Step1' },
	{ index: 2, text: '2', page: 'Step2' },
	{ index: 3, text: '3', page: 'Step3' },
	{ index: 4, text: '4', page: 'Step4' },
	{ index: 5, text: '5', page: 'Step5' },
	{ index: 6, text: '6', page: 'Step6' },
	{ index: 7, text: '7', page: 'Step7' },
	{ index: 11, text: '11', page: 'Step20' },
	{ index: 12, text: '12', page: 'Step21' }
];

function insertSteps(steps: Step[], additionalValues: Step[]) {
	const filteredAdditionalValues = additionalValues.filter(
		(additionalValue) => !steps.some((step) => step.index === additionalValue.index)
	);
	const combinedSteps = [...steps, ...filteredAdditionalValues];
	const sortedSteps = combinedSteps.sort((a, b) => a.index - b.index);
	const uniqueSortedSteps = sortedSteps.filter((value, index, array) =>
		index === 0 ? true : value.index !== array[index - 1].index
	);
	return uniqueSortedSteps;
}

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		redirect(307, '/auth/signin');
	}
	console.log('SURVEY LOAD');
	const surveyQueryData = supabase
		.from('property_profile')
		.select(
			` id, property_address_street, property_address_suburb, property_address_postcode, phone,
    			mobile_reception, sign_posted, other_essential_assets, residents0_18, residents19_50,
    			residents51_70, residents71_, vulnerable_residents, number_birds, number_cats, number_dogs,
    			number_other_pets, live_stock_present, live_stock_safe_area, share_livestock_safe_area, static_water_available,
    			have_stortz, stortz_size, truck_access, truck_access_other_information, fire_fighting_resources,
    			fire_hazard_reduction, site_hazards, other_hazards, other_site_hazards, land_adjacent_hazard,
      			property_rented, 
				community_areas(community), 
				user_profile( family_name, fire_fighting_experience, fire_trauma, first_name, mobile, other_comments, 
					plan_to_leave_before_fire, plan_to_leave_before_flood, residency_profile, rfs_survival_plan, 
					stay_in_touch_choices, 
					community_bcyca_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_tinonee_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_mondrook_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_external_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					user_postal_address(postal_address_postcode, postal_address_street, postal_address_suburb) 
				), 
				property_agent(agent_mobile, agent_name, agent_phone)`
		)
		.eq('principaladdresssiteoid', session.user.app_metadata.principaladdresssiteoid)
		.eq('user_profile.id', session.user.id);
	type SurveyData = QueryData<typeof surveyQueryData>;
	const { data, error: getSurveyDataError } = await surveyQueryData;
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
		const surveyData: SurveyData = data;
		let {
			user_profile: [_userProfileData],
			property_agent,
			community_areas,
			...property_profile
		} = surveyData[0];
		const communityName = community_areas!.community!;
		let {
			id,
			property_address_street,
			property_address_suburb,
			property_address_postcode,
			...propertyProfile
		} = property_profile;
		const propertyId = id;
		const propertyAddress = {
			property_address_street: property_address_street,
			property_address_suburb: property_address_suburb,
			property_address_postcode: property_address_postcode
		};
		const propertyWasRented = propertyProfile.property_rented || false;
		let {
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile,
			...userProfile
		} = _userProfileData;
		if (!property_agent) {
			property_agent = {
				agent_mobile: '',
				agent_name: '',
				agent_phone: ''
			};
		}
		if (!user_postal_address) {
			user_postal_address = {
				postal_address_postcode: '',
				postal_address_street: '',
				postal_address_suburb: ''
			};
		}
		if (community_bcyca_profile) {
			steps = insertSteps(steps, [
				{ index: 8, text: '8', page: 'Step8' },
				{ index: 9, text: '9', page: 'Step9' },
				{ index: 10, text: '10', page: 'Step10' }
			]);
		}
		if (community_tinonee_profile) {
			console.log('community_tinonee_profile', community_tinonee_profile);
			steps = insertSteps(steps, [
				{ index: 8, text: '8', page: 'Step11' },
				{ index: 9, text: '9', page: 'Step12' },
				{ index: 10, text: '10', page: 'Step13' }
			]);
		}
		if (community_mondrook_profile) {
			console.log('community_mondrook_profile', community_mondrook_profile);
			steps = insertSteps(steps, [
				{ index: 8, text: '8', page: 'Step14' },
				{ index: 9, text: '9', page: 'Step15' },
				{ index: 10, text: '10', page: 'Step16' }
			]);
		}
		if (community_external_profile) {
			console.log('community_external_profile', community_external_profile);
			steps = insertSteps(steps, [
				{ index: 8, text: '8', page: 'Step17' },
				{ index: 9, text: '9', page: 'Step18' },
				{ index: 10, text: '10', page: 'Step19' }
			]);
		}
		return {
			steps,
			propertyId,
			propertyWasRented,
			communityName,
			propertyAddress,
			property_profile,
			property_agent,
			userProfile,
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile
		};
	}

	error(400, `GET data error Survey:  'No data found or an error occurred.'`);
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const bodyObject = getSurveyFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid
		);
		if (bodyObject.propertyProfileData.property_rented != bodyObject.propertyWasRented) {
			if (bodyObject.propertyWasRented === false) {
				console.log('Add Agent');
				const { error: agentUpsertError } = await supabase.from('property_agent').upsert({
					property_id: bodyObject.propertyId,
					agent_mobile: bodyObject.agentData.agent_mobile,
					agent_name: bodyObject.agentData.agent_name,
					agent_phone: bodyObject.agentData.agent_phone
				});
				if (agentUpsertError) {
					error(400, `upsert Agent Data Error ${agentUpsertError.message}`);
				}
			} else {
				console.log('Delete Agent');
				const { error: deleteAgentError } = await supabase
					.from('property_agent')
					.delete()
					.eq('property_id', bodyObject.propertyId);
				if (deleteAgentError) {
					console.log('error survey delete agent: ', deleteAgentError);
					error(400, `error delete delete agent: ${deleteAgentError.message}`);
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
			console.log('userProfileUpdateError', userProfileUpdateError);
			error(400, `update User Profile Data Error ${userProfileUpdateError.message}`);
		}
		if (bodyObject.userBCYCAProfileData) {
			const { error: userBCYCAProfileUpdateError } = await supabase
				.from('community_bcyca_profile')
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
				console.log('userBCYCAProfileUpdateError', userBCYCAProfileUpdateError);
				error(400, `update User BCYCA Profile Data Error ${userBCYCAProfileUpdateError.message}`);
			}
		}
		if (bodyObject.userTinoneeProfileData) {
			const { error: userTinoneeProfileUpdateError } = await supabase
				.from('community_tinonee_profile')
				.update({
					community_meeting_choices: bodyObject.userTinoneeProfileData.community_meeting_choices,
					community_workshop_choices: bodyObject.userTinoneeProfileData.community_workshop_choices,
					information_sheet_choices: bodyObject.userTinoneeProfileData.information_sheet_choices,
					other_community_meeting: bodyObject.userTinoneeProfileData.other_community_meeting,
					other_community_workshop: bodyObject.userTinoneeProfileData.other_community_workshop,
					other_information_sheet: bodyObject.userTinoneeProfileData.other_information_sheet,
					will_run_community_workshops:
						bodyObject.userTinoneeProfileData.will_run_community_workshops
				})
				.eq('user_id', session.user.id);
			if (userTinoneeProfileUpdateError) {
				console.log('userTinoneeProfileUpdateError', userTinoneeProfileUpdateError);
				error(
					400,
					`update User Tinonee Profile Data Error ${userTinoneeProfileUpdateError.message}`
				);
			}
		}
		if (bodyObject.userMondrookProfileData) {
			const { error: userMondrookProfileUpdateError } = await supabase
				.from('community_mondrook_profile')
				.update({
					community_meeting_choices: bodyObject.userMondrookProfileData.community_meeting_choices,
					community_workshop_choices: bodyObject.userMondrookProfileData.community_workshop_choices,
					information_sheet_choices: bodyObject.userMondrookProfileData.information_sheet_choices,
					other_community_meeting: bodyObject.userMondrookProfileData.other_community_meeting,
					other_community_workshop: bodyObject.userMondrookProfileData.other_community_workshop,
					other_information_sheet: bodyObject.userMondrookProfileData.other_information_sheet,
					will_run_community_workshops:
						bodyObject.userMondrookProfileData.will_run_community_workshops
				})
				.eq('user_id', session.user.id);
			if (userMondrookProfileUpdateError) {
				console.log('userMondrookProfileUpdateError', userMondrookProfileUpdateError);
				error(
					400,
					`update User Mondrook Profile Data Error ${userMondrookProfileUpdateError.message}`
				);
			}
		}
		if (bodyObject.userExternalProfileData) {
			const { error: userExternalProfileUpdateError } = await supabase
				.from('community_external_profile')
				.update({
					community_meeting_choices: bodyObject.userExternalProfileData.community_meeting_choices,
					community_workshop_choices: bodyObject.userExternalProfileData.community_workshop_choices,
					information_sheet_choices: bodyObject.userExternalProfileData.information_sheet_choices,
					other_community_meeting: bodyObject.userExternalProfileData.other_community_meeting,
					other_community_workshop: bodyObject.userExternalProfileData.other_community_workshop,
					other_information_sheet: bodyObject.userExternalProfileData.other_information_sheet,
					will_run_community_workshops:
						bodyObject.userExternalProfileData.will_run_community_workshops
				})
				.eq('user_id', session.user.id);
			if (userExternalProfileUpdateError) {
				console.log('userExternalProfileUpdateError', userExternalProfileUpdateError);
				error(
					400,
					`update User External Profile Data Error ${userExternalProfileUpdateError.message}`
				);
			}
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
			.eq('principaladdresssiteoid', session.user.app_metadata.principaladdresssiteoid);
		if (propertyProfileUpdateError) {
			console.log('propertyProfileUpdateError', propertyProfileUpdateError);
			error(400, `update Property Profile Data Error ${propertyProfileUpdateError.message}`);
		}
		redirect(303, '/profile');
	}
};
