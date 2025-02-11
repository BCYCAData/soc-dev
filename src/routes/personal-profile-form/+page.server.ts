import { error, redirect, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type {
	PersonalProfileFormData,
	PropertyProfile,
	UserPropertyProfile
} from '$lib/form.types';
import { getPersonalProfileFormData } from '$lib/server/form.utilities';

function getPropertyValue<T>(propertyData: UserPropertyProfile, key: keyof PropertyProfile): T {
	return propertyData.type === 'single'
		? (propertyData.profile[key] as T)
		: (propertyData.profiles[0][key] as T);
}

export const load = (async ({
	locals: { supabase, getSessionAndUser, getCommunityRequestOptions }
}) => {
	const { user } = await getSessionAndUser();
	if (!user) {
		throw redirect(303, '/auth/signin');
	}

	let { data: user_profile, error: userProfileError } = await supabase.rpc('get_profile_for_user', {
		id_input: user.id
	});
	if (userProfileError) {
		console.log('GET data error Personal Profile:', userProfileError);
		error(400, `GET data error Personal Profile:  Error ${userProfileError.message}`);
	}

	if (!user_profile) {
		error(404, 'Personal profile data not found');
	}

	const personalProfileFormData = {
		...user_profile,
		property_profile: user_profile.property_profile[0] // Take first item from array
	} as PersonalProfileFormData;

	const userOptionsData = await getCommunityRequestOptions();

	let steps: { index: number; text: string; page: string }[] = [
		{ index: 1, text: '1', page: 'Step1' },
		{ index: 2, text: '2', page: 'Step2' },
		{ index: 3, text: '3', page: 'Step3' },
		{ index: 4, text: '4', page: 'Step4' },
		{ index: 5, text: '5', page: 'Step5' },
		{ index: 6, text: '6', page: 'Step6' },
		{ index: 7, text: '7', page: 'Step7' }
	];

	let nextIndex = 8;

	// BCYCA steps
	if (personalProfileFormData.community_bcyca_profile) {
		steps = [
			...steps,
			{ index: nextIndex, text: String(nextIndex), page: 'Step8' },
			{ index: nextIndex + 1, text: String(nextIndex + 1), page: 'Step9' },
			{ index: nextIndex + 2, text: String(nextIndex + 2), page: 'Step10' }
		];
		nextIndex += 3;
	}

	// Tinonee steps
	if (personalProfileFormData.community_tinonee_profile) {
		steps = [
			...steps,
			{ index: nextIndex, text: String(nextIndex), page: 'Step11' },
			{ index: nextIndex + 1, text: String(nextIndex + 1), page: 'Step12' },
			{ index: nextIndex + 2, text: String(nextIndex + 2), page: 'Step13' }
		];
		nextIndex += 3;
	}

	// Mondrook steps
	if (personalProfileFormData.community_mondrook_profile) {
		steps = [
			...steps,
			{ index: nextIndex, text: String(nextIndex), page: 'Step14' },
			{ index: nextIndex + 1, text: String(nextIndex + 1), page: 'Step15' },
			{ index: nextIndex + 2, text: String(nextIndex + 2), page: 'Step16' }
		];
		nextIndex += 3;
	}

	// External steps
	if (personalProfileFormData.community_external_profile) {
		steps = [
			...steps,
			{ index: nextIndex, text: String(nextIndex), page: 'Step17' },
			{ index: nextIndex + 1, text: String(nextIndex + 1), page: 'Step18' },
			{ index: nextIndex + 2, text: String(nextIndex + 2), page: 'Step19' }
		];
		nextIndex += 3;
	}

	// Final steps
	steps = [
		...steps,
		{ index: nextIndex, text: String(nextIndex), page: 'Step20' },
		{ index: nextIndex + 1, text: String(nextIndex + 1), page: 'Step21' }
	];

	const optionsData = {
		userOptionsData: {
			table_name: 'user_profile',
			object_names:
				userOptionsData.find((opt) => opt.table_name === 'user_profile')?.object_names || []
		},
		communityBCYCAOptionsData: {
			table_name: 'community_bcyca_profile',
			object_names:
				userOptionsData.find((opt) => opt.table_name === 'community_bcyca_profile')?.object_names ||
				[]
		},
		communityExternalOptionsData: {
			table_name: 'community_external_profile',
			object_names:
				userOptionsData.find((opt) => opt.table_name === 'community_external_profile')
					?.object_names || []
		},
		communityMondrookOptionsData: {
			table_name: 'community_mondrook_profile',
			object_names:
				userOptionsData.find((opt) => opt.table_name === 'community_mondrook_profile')
					?.object_names || []
		},
		communityTinoneeOptionsData: {
			table_name: 'community_tinonee_profile',
			object_names:
				userOptionsData.find((opt) => opt.table_name === 'community_tinonee_profile')
					?.object_names || []
		}
	};

	return {
		steps,
		optionsData,
		propertyIds: [],
		userProfile: personalProfileFormData
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	saveData: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		if (!user) {
			throw redirect(303, '/auth/signin');
		}
		const formData = await request.formData();
		const isFinalSubmission = formData.get('currentStep') === formData.get('totalSteps');
		const bodyObject = getPersonalProfileFormData(formData);
		if (
			getPropertyValue(bodyObject.propertyProfileData, 'property_rented') !==
			bodyObject.propertyWasRented
		) {
			if (bodyObject.propertyWasRented === false) {
				const { error: agentUpsertError } = await supabase.from('property_agent').upsert({
					property_id: bodyObject.propertyId,
					agent_mobile: bodyObject.agentData?.agent_mobile,
					agent_name: bodyObject.agentData?.agent_name,
					agent_phone: bodyObject.agentData?.agent_phone
				});
				if (agentUpsertError) {
					error(400, `upsert Agent Data Error ${agentUpsertError.message}`);
				}
			} else {
				const { error: deleteAgentError } = await supabase
					.from('property_agent')
					.delete()
					.eq('property_id', bodyObject.propertyId);
				if (deleteAgentError) {
					console.log('error Personal Profile Form delete agent: ', deleteAgentError);
					error(400, `error delete delete agent: ${deleteAgentError.message}`);
				}
			}
		}
		if (bodyObject.userProfileData.stay_in_touch_choices?.includes(5)) {
			const { error: userPostalAddressUpsertError } = await supabase
				.from('user_postal_address')
				.upsert({
					user_id: user.id,
					postal_address_street: bodyObject.userPostalAddressData.postal_address_street,
					postal_address_suburb: bodyObject.userPostalAddressData.postal_address_suburb,
					postal_address_postcode: bodyObject.userPostalAddressData.postal_address_postcode
				});
			if (userPostalAddressUpsertError) {
				console.log(
					'error Personal Profile Form upsert User Postal Address Data Error: ',
					userPostalAddressUpsertError
				);
				error(
					400,
					`error Personal Profile Form upsert User Postal Address Data Error: ${userPostalAddressUpsertError.message}`
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
			.eq('id', user.id);
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
				.eq('bcyca_profile_id', bodyObject.communityProfileId);
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
				.eq('tinonee_profile_id', bodyObject.communityProfileId);
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
				.eq('mondrook_profile_id', bodyObject.communityProfileId);
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
				.eq('external_profile_id', bodyObject.communityProfileId);
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
				fire_fighting_resources: getPropertyValue<number[]>(
					bodyObject.propertyProfileData,
					'fire_fighting_resources'
				),
				fire_hazard_reduction: getPropertyValue<number[]>(
					bodyObject.propertyProfileData,
					'fire_hazard_reduction'
				),
				have_stortz: getPropertyValue<string | null>(bodyObject.propertyProfileData, 'have_stortz'),
				land_adjacent_hazard: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'land_adjacent_hazard'
				),
				live_stock_present: getPropertyValue<boolean | null>(
					bodyObject.propertyProfileData,
					'live_stock_present'
				),
				live_stock_safe_area: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'live_stock_safe_area'
				),
				mobile_reception: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'mobile_reception'
				),
				number_birds: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'number_birds'
				),
				number_cats: getPropertyValue<number | null>(bodyObject.propertyProfileData, 'number_cats'),
				number_dogs: getPropertyValue<number | null>(bodyObject.propertyProfileData, 'number_dogs'),
				number_other_pets: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'number_other_pets'
				),
				other_essential_assets: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'other_essential_assets'
				),
				other_hazards: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'other_hazards'
				),
				other_site_hazards: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'other_site_hazards'
				),
				phone: getPropertyValue<string | null>(bodyObject.propertyProfileData, 'phone'),
				property_rented: getPropertyValue<boolean>(
					bodyObject.propertyProfileData,
					'property_rented'
				),
				residents0_18: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'residents0_18'
				),
				residents19_50: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'residents19_50'
				),
				residents51_70: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'residents51_70'
				),
				residents71_: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'residents71_'
				),
				share_livestock_safe_area: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'share_livestock_safe_area'
				),
				sign_posted: getPropertyValue<boolean | null>(
					bodyObject.propertyProfileData,
					'sign_posted'
				),
				site_hazards: getPropertyValue<number[]>(bodyObject.propertyProfileData, 'site_hazards'),
				static_water_available: getPropertyValue<number[]>(
					bodyObject.propertyProfileData,
					'static_water_available'
				),
				stortz_size: getPropertyValue<number | null>(bodyObject.propertyProfileData, 'stortz_size'),
				truck_access: getPropertyValue<number | null>(
					bodyObject.propertyProfileData,
					'truck_access'
				),
				truck_access_other_information: getPropertyValue<string | null>(
					bodyObject.propertyProfileData,
					'truck_access_other_information'
				),
				vulnerable_residents: getPropertyValue<boolean | null>(
					bodyObject.propertyProfileData,
					'vulnerable_residents'
				)
			})
			.eq('principaladdresssiteoid', user.app_metadata.principaladdresssiteoid);

		if (propertyProfileUpdateError) {
			console.log('propertyProfileUpdateError', propertyProfileUpdateError);
			error(400, `update Property Profile Data Error ${propertyProfileUpdateError.message}`);
		}
		if (!isFinalSubmission) {
			return {
				success: true,
				message: 'Data saved successfully'
			};
		}
		throw redirect(303, '/personal-profile');
	}
};
