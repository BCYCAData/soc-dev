import type { UserPostalAddress, UserProfile, UserPropertyProfile } from '$lib/form.types';
import type {
	ProfileAboutMeFormData,
	ProfileMyPlaceFormData,
	ProfileMyPlaceAssetsFormData,
	ProfileMyPlaceHazardsFormData,
	ProfileMyPlaceResourcesFormData,
	ProfileMyCommunityFormData,
	ProfileMyCommunityBCYCAFormData,
	ProfileMyCommunityBCYCAEventsFormData,
	ProfileMyBCYCACommunityInformationFormData,
	ProfileMyCommunityBCYCAWorkshopsFormData,
	ProfileMyCommunityTinoneeFormData,
	ProfileMyCommunityTinoneeEventsFormData,
	ProfileMyCommunityTinoneeInformationFormData,
	ProfileMyCommunityTinoneeWorkshopsFormData,
	ProfileMyCommunityMondrookFormData,
	ProfileMyCommunityMondrookEventsFormData,
	ProfileMyCommunityMondrookInformationFormData,
	ProfileMyCommunityMondrookWorkshopsFormData,
	ProfileMyCommunityExternalFormData,
	ProfileMyCommunityExternalEventsFormData,
	ProfileMyCommunityExternalInformationFormData,
	ProfileMyCommunityExternalWorkshopsFormData
} from '$lib/types';

export const getAboutMeFormData = (body: FormData) => {
	const userProfileAboutMe: ProfileAboutMeFormData = {
		family_name: (body.get('family_name') as string) || null,
		fire_fighting_experience: parseInt(body.get('fire_fighting_experience') as string) || null,
		fire_trauma: (body.get('fire_trauma') as unknown as boolean) || null,
		first_name: (body.get('first_name') as string) || null,
		mobile: (body.get('mobile') as string) || null,
		plan_to_leave_before_fire: parseInt(body.get('plan_to_leave_before_fire') as string) || null,
		plan_to_leave_before_flood: parseInt(body.get('plan_to_leave_before_flood') as string) || null,
		residency_profile: parseInt(body.get('residency_profile') as string) || null,
		rfs_survival_plan: (body.get('rfs_survival_plan') as string) || null
	};
	return userProfileAboutMe;
};
export const getMyPlaceFormData = (body: FormData) => {
	const myPlaceData: ProfileMyPlaceFormData = {
		property_rented: (body.get('property_rented') as unknown as boolean) || false,
		propertyAgentData: {
			agent_mobile: (body.get('agent_mobile') as string) || null,
			agent_name: (body.get('agent_name') as string) || null,
			agent_phone: (body.get('agent_phone') as string) || null
		},
		sign_posted: (body.get('sign_posted') as unknown as boolean) || null,
		vulnerable_residents: (body.get('vulnerable_residents') as unknown as boolean) || null,
		phone: (body.get('phone') as string) || null,
		mobile_reception: parseInt(body.get('mobile_reception') as string) || null,
		truck_access: parseInt(body.get('truck_access') as string) || null,
		truck_access_other_information: (body.get('truck_access_other_information') as string) || null,
		residents0_18: parseInt(body.get('residents0_18') as string) || null,
		residents19_50: parseInt(body.get('residents19_50') as string) || null,
		residents51_70: parseInt(body.get('residents51_70') as string) || null,
		residents71_: parseInt(body.get('residents71_') as string) || null
	};
	return myPlaceData;
};

export const getMyPlaceAssetsFormData = (body: FormData) => {
	const myPlaceAssets: ProfileMyPlaceAssetsFormData = {
		live_stock_present: (body.get('live_stock_present') as unknown as boolean) || null,
		live_stock_safe_area: (body.get('live_stock_safe_area') as string) || null,
		share_livestock_safe_area: (body.get('share_livestock_safe_area') as string) || null,
		number_birds: parseInt(body.get('number_birds') as string) || null,
		number_cats: parseInt(body.get('number_cats') as string) || null,
		number_dogs: parseInt(body.get('number_dogs') as string) || null,
		number_other_pets: parseInt(body.get('number_other_pets') as string) || null,
		other_essential_assets: (body.get('other_essential_assets') as string) || null
	};
	return myPlaceAssets;
};
export const getMyPlaceHazardsFormData = (body: FormData) => {
	const myPlaceHazards: ProfileMyPlaceHazardsFormData = {
		site_hazards: body.getAll('site_hazards').toString().split(',').map(Number) || null,
		other_site_hazards: (body.get('other_site_hazards') as string) || null,
		land_adjacent_hazard: (body.get('land_adjacent_hazard') as string) || null,
		other_hazards: (body.get('other_hazards') as string) || null
	};
	return myPlaceHazards;
};
export const getMyPlaceResourcesFormData = (body: FormData) => {
	const myPlaceResources: ProfileMyPlaceResourcesFormData = {
		fire_fighting_resources:
			body.getAll('fire_fighting_resources').toString().split(',').map(Number) || null,
		fire_hazard_reduction:
			body.getAll('fire_hazard_reduction').toString().split(',').map(Number) || null,
		have_stortz: (body.get('have_stortz') as string) || null,

		static_water_available:
			body.getAll('static_water_available').toString().split(',').map(Number) || null,
		stortz_size: parseInt(body.get('stortz_size') as string) || null
	};
	return myPlaceResources;
};
export const getMyCommunityFormData = (body: FormData) => {
	const myCommunityData: ProfileMyCommunityFormData = {
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		userPostalAddressData: {
			postal_address_street: (body.get('postal_address_street') as string) || null,
			postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
			postal_address_postcode: (body.get('postal_address_postcode') as string) || null
		},
		hadUserPostalAddress: body.get('had_user_postal_address') === 'true',
		other_comments: (body.get('other_comments') as string) || null
	};
	return myCommunityData;
};
export const getMyCommunityBCYCAFormData = (body: FormData) => {
	const myCommunityBCYCAData: ProfileMyCommunityBCYCAFormData = {
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		userPostalAddressData: {
			postal_address_street: (body.get('postal_address_street') as string) || null,
			postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
			postal_address_postcode: (body.get('postal_address_postcode') as string) || null
		},
		hadUserPostalAddress: body.get('had_user_postal_address') === 'true',
		other_comments: (body.get('other_comments') as string) || null
	};
	return myCommunityBCYCAData;
};
export const getMyCommunityBCYCAEventsFormData = (body: FormData) => {
	const bcycaCommunityEventsData: ProfileMyCommunityBCYCAEventsFormData = {
		community_meeting_choices:
			body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
		other_community_meeting: (body.get('other_community_meeting') as string) || null
	};
	return bcycaCommunityEventsData;
};
export const getMyCommunityBCYCAInformationFormData = (body: FormData) => {
	const bcycaCommunityInformationData: ProfileMyBCYCACommunityInformationFormData = {
		information_sheet_choices:
			body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
		other_information_sheet: (body.get('other_information_sheet') as string) || null
	};
	return bcycaCommunityInformationData;
};
export const getMyCommunityBCYCAWorkshopsFormData = (body: FormData) => {
	const bcycaCommunityEventsData: ProfileMyCommunityBCYCAWorkshopsFormData = {
		community_workshop_choices:
			body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
		other_community_workshop: (body.get('other_community_workshop') as string) || null,
		will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null
	};
	return bcycaCommunityEventsData;
};
export const getMyCommunityTinoneeFormData = (body: FormData) => {
	const myCommunityTinoneeData: ProfileMyCommunityTinoneeFormData = {
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		userPostalAddressData: {
			postal_address_street: (body.get('postal_address_street') as string) || null,
			postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
			postal_address_postcode: (body.get('postal_address_postcode') as string) || null
		},
		hadUserPostalAddress: body.get('had_user_postal_address') === 'true',
		other_comments: (body.get('other_comments') as string) || null
	};
	return myCommunityTinoneeData;
};
export const getMyCommunityTinoneeEventsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityTinoneeEventsFormData = {
		community_meeting_choices:
			body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
		other_community_meeting: (body.get('other_community_meeting') as string) || null
	};
	return formData;
};
export const getMyCommunityTinoneeInformationFormData = (body: FormData) => {
	const formData: ProfileMyCommunityTinoneeInformationFormData = {
		information_sheet_choices:
			body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
		other_information_sheet: (body.get('other_information_sheet') as string) || null
	};
	return formData;
};
export const getMyCommunityTinoneeWorkshopsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityTinoneeWorkshopsFormData = {
		community_workshop_choices:
			body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
		other_community_workshop: (body.get('other_community_workshop') as string) || null,
		will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null
	};
	return formData;
};
export const getMyCommunityMondrookFormData = (body: FormData) => {
	const myCommunityMondrookData: ProfileMyCommunityMondrookFormData = {
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		userPostalAddressData: {
			postal_address_street: (body.get('postal_address_street') as string) || null,
			postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
			postal_address_postcode: (body.get('postal_address_postcode') as string) || null
		},
		hadUserPostalAddress: body.get('had_user_postal_address') === 'true',
		other_comments: (body.get('other_comments') as string) || null
	};
	return myCommunityMondrookData;
};

export const getMyCommunityMondrookEventsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityMondrookEventsFormData = {
		community_meeting_choices:
			body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
		other_community_meeting: (body.get('other_community_meeting') as string) || null
	};
	return formData;
};
export const getMyCommunityMondrookInformationFormData = (body: FormData) => {
	const formData: ProfileMyCommunityMondrookInformationFormData = {
		information_sheet_choices:
			body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
		other_information_sheet: (body.get('other_information_sheet') as string) || null
	};
	return formData;
};
export const getMyCommunityMondrookWorkshopsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityMondrookWorkshopsFormData = {
		community_workshop_choices:
			body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
		other_community_workshop: (body.get('other_community_workshop') as string) || null,
		will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null
	};
	return formData;
};
export const getMyCommunityExternalFormData = (body: FormData) => {
	const myCommunityExternalData: ProfileMyCommunityExternalFormData = {
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		userPostalAddressData: {
			postal_address_street: (body.get('postal_address_street') as string) || null,
			postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
			postal_address_postcode: (body.get('postal_address_postcode') as string) || null
		},
		hadUserPostalAddress: body.get('had_user_postal_address') === 'true',
		other_comments: (body.get('other_comments') as string) || null
	};
	return myCommunityExternalData;
};
export const getMyCommunityExternalEventsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityExternalEventsFormData = {
		community_meeting_choices:
			body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
		other_community_meeting: (body.get('other_community_meeting') as string) || null
	};
	return formData;
};
export const getMyCommunityExternalInformationFormData = (body: FormData) => {
	const formData: ProfileMyCommunityExternalInformationFormData = {
		information_sheet_choices:
			body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
		other_information_sheet: (body.get('other_information_sheet') as string) || null
	};
	return formData;
};
export const getMyCommunityExternalWorkshopsFormData = (body: FormData) => {
	const formData: ProfileMyCommunityExternalWorkshopsFormData = {
		community_workshop_choices:
			body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
		other_community_workshop: (body.get('other_community_workshop') as string) || null,
		will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null
	};
	return formData;
};

export const getPersonalProfileFormData = (body: FormData) => {
	const propertyId = body.get('propertyId') as string;
	const communityName = body.get('communityName') as string;
	const communityProfileId = body.get('communityProfileId') as string;
	let propertyWasRented: boolean;
	if ((body.get('propertyWasRented') as string) == 'false') {
		propertyWasRented = false;
	} else {
		propertyWasRented = true;
	}
	const agentData = {
		agent_mobile: (body.get('agent_mobile') as string) || null,
		agent_name: (body.get('agent_name') as string) || null,
		agent_phone: (body.get('agent_phone') as string) || null
	};
	const propertyProfileData: UserPropertyProfile = {
		type: 'single',
		profile: {
			id: (body.get('property_id') as string) || '',
			kyng_areas: [{ kyng: (body.get('kyng_area') as string) || '' }],
			community_areas: [{ community: (body.get('community_area') as string) || '' }],
			property_address_postcode: (body.get('property_address_postcode') as string) || '',
			property_address_street: (body.get('property_address_street') as string) || '',
			property_address_suburb: (body.get('property_address_suburb') as string) || '',
			property_agent: {
				agent_mobile: (body.get('agent_mobile') as string) || null,
				agent_name: (body.get('agent_name') as string) || null,
				agent_phone: (body.get('agent_phone') as string) || null
			},
			property_rented: (body.get('property_rented') as unknown as boolean) || false,
			fire_fighting_resources:
				body.getAll('fire_fighting_resources').toString().split(',').map(Number) || null,
			fire_hazard_reduction:
				body.getAll('fire_hazard_reduction').toString().split(',').map(Number) || null,
			have_stortz: (body.get('have_stortz') as string) || null,
			land_adjacent_hazard: (body.get('land_adjacent_hazard') as string) || null,
			live_stock_present: (body.get('live_stock_present') as unknown as boolean) || null,
			live_stock_safe_area: (body.get('live_stock_safe_area') as string) || null,
			mobile_reception: parseInt(body.get('mobile_reception') as string) || null,
			number_birds: parseInt(body.get('number_birds') as string) || null,
			number_cats: parseInt(body.get('number_cats') as string) || null,
			number_dogs: parseInt(body.get('number_dogs') as string) || null,
			number_other_pets: parseInt(body.get('number_other_pets') as string) || null,
			other_essential_assets: (body.get('other_essential_assets') as string) || null,
			other_hazards: (body.get('other_hazards') as string) || null,
			other_site_hazards: (body.get('other_site_hazards') as string) || null,
			phone: (body.get('phone') as string) || null,
			residents0_18: parseInt(body.get('residents0_18') as string) || null,
			residents19_50: parseInt(body.get('residents19_50') as string) || null,
			residents51_70: parseInt(body.get('residents51_70') as string) || null,
			residents71_: parseInt(body.get('residents71_') as string) || null,
			share_livestock_safe_area: (body.get('share_livestock_safe_area') as string) || null,
			sign_posted: (body.get('sign_posted') as unknown as boolean) || null,
			site_hazards: body.getAll('site_hazards').toString().split(',').map(Number) || null,
			static_water_available:
				body.getAll('static_water_available').toString().split(',').map(Number) || null,
			stortz_size: parseInt(body.get('stortz_size') as string) || null,
			truck_access: parseInt(body.get('truck_access') as string) || null,
			truck_access_other_information:
				(body.get('truck_access_other_information') as string) || null,
			vulnerable_residents: (body.get('vulnerable_residents') as unknown as boolean) || null
		}
	};

	let userBCYCAProfileData = null;
	let userTinoneeProfileData = null;
	let userMondrookProfileData = null;
	let userExternalProfileData = null;

	switch (communityName) {
		case 'BCYCA':
			userBCYCAProfileData = {
				bcyca_profile_id: communityProfileId || '',
				community_meeting_choices:
					body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
				community_workshop_choices:
					body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
				information_sheet_choices:
					body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
				stay_in_touch_choices:
					body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
				other_community_meeting: (body.get('other_community_meeting') as string) || null,
				other_community_workshop: (body.get('other_community_workshop') as string) || null,
				other_information_sheet: (body.get('other_information_sheet') as string) || null,
				will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null,
				other_comments: (body.get('other_comments') as string) || null
			};
			break;
		case 'Tinonee':
			userTinoneeProfileData = {
				tinonee_profile_id: communityProfileId || '',
				community_meeting_choices:
					body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
				community_workshop_choices:
					body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
				information_sheet_choices:
					body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
				stay_in_touch_choices:
					body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
				other_community_meeting: (body.get('other_community_meeting') as string) || null,
				other_community_workshop: (body.get('other_community_workshop') as string) || null,
				other_information_sheet: (body.get('other_information_sheet') as string) || null,
				will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null,
				other_comments: (body.get('other_comments') as string) || null
			};

			break;
		case 'Mondrook':
			userMondrookProfileData = {
				mondrook_profile_id: communityProfileId || '',
				community_meeting_choices:
					body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
				community_workshop_choices:
					body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
				information_sheet_choices:
					body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
				stay_in_touch_choices:
					body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
				other_community_meeting: (body.get('other_community_meeting') as string) || null,
				other_community_workshop: (body.get('other_community_workshop') as string) || null,
				other_information_sheet: (body.get('other_information_sheet') as string) || null,
				will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null,
				other_comments: (body.get('other_comments') as string) || null
			};
			break;
		case 'External':
			userExternalProfileData = {
				external_profile_id: communityProfileId || '',
				community_meeting_choices:
					body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
				community_workshop_choices:
					body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
				information_sheet_choices:
					body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
				stay_in_touch_choices:
					body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
				other_community_meeting: (body.get('other_community_meeting') as string) || null,
				other_community_workshop: (body.get('other_community_workshop') as string) || null,
				other_information_sheet: (body.get('other_information_sheet') as string) || null,
				will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null,
				other_comments: (body.get('other_comments') as string) || null
			};
			break;
		default:
			break;
	}
	const userPostalAddressData: UserPostalAddress = {
		postal_address_postcode: (body.get('postal_address_postcode') as string) || null,
		postal_address_street: body.get('postal_address_street') as string,
		postal_address_suburb: body.get('postal_address_suburb') as string
	};
	const userProfileData: UserProfile = {
		family_name: (body.get('family_name') as string) || null,
		fire_fighting_experience: parseInt(body.get('fire_fighting_experience') as string) || null,
		fire_trauma: (body.get('fire_trauma') as unknown as boolean) || null,
		first_name: (body.get('first_name') as string) || null,
		mobile: (body.get('mobile') as string) || null,
		plan_to_leave_before_fire: parseInt(body.get('plan_to_leave_before_fire') as string) || null,
		plan_to_leave_before_flood: parseInt(body.get('plan_to_leave_before_flood') as string) || null,
		residency_profile: parseInt(body.get('residency_profile') as string) || null,
		rfs_survival_plan: (body.get('rfs_survival_plan') as string) || null,
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null,
		other_comments: (body.get('other_comments') as string) || null,
		user_postal_address: userPostalAddressData,
		property_profile: propertyProfileData,
		community_bcyca_profile: userBCYCAProfileData,
		community_tinonee_profile: userTinoneeProfileData,
		community_mondrook_profile: userMondrookProfileData,
		community_external_profile: userExternalProfileData
	};

	return {
		propertyId,
		communityName,
		communityProfileId,
		propertyWasRented,
		agentData,
		propertyProfileData,
		userBCYCAProfileData,
		userTinoneeProfileData,
		userMondrookProfileData,
		userExternalProfileData,
		userPostalAddressData,
		userProfileData
	};
};
