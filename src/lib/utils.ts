import StreetSelectInput from '$components/form/inputs/StreetSelectInput.svelte';
import type {
	AgentData,
	PropertyProfileData,
	UserBCYCAProfileData,
	UserPostalAddressData,
	UserProfileData
} from '$lib/db.types';

export const formatMobile = (mobileNumber: string, digit: string) => {
	mobileNumber += digit;
	if (mobileNumber.length == 4) {
		mobileNumber += ' ';
	}
	if (mobileNumber.length == 8) {
		mobileNumber += ' ';
	}
	return mobileNumber;
};

export const formatPhone = (phoneNumber: string, digit: string) => {
	phoneNumber += digit;
	if (phoneNumber.length == 4) {
		phoneNumber += ' ';
	}
	return phoneNumber;
};

export const geometryToGeoJson = (featureType: string, geometryObject: any) => {
	let geojson = {
		featureType: featureType,
		geometry: {
			type: geometryObject.type,
			crs: geometryObject.crs,
			coordinates: geometryObject.coordinates
		}
	};
	return geojson;
};

export const getFormData = (body: FormData, uid: string, principaladdresssiteoid: number) => {
	const pid = body.get('property_key') as string;
	const agentData: AgentData = {
		agent_mobile: (body.get('agent_mobile') as string) || null,
		agent_name: (body.get('agent_name') as string) || null,
		agent_phone: (body.get('agent_phone') as string) || null,
		created_at: null,
		property_id: uid,
		last_updated: null
	};
	const propertyProfileData: PropertyProfileData = {
		created_at: null,
		principaladdresssiteoid: principaladdresssiteoid,
		fire_fighting_resources:
			body.getAll('fire_fighting_resources').toString().split(',').map(Number) || null,
		fire_hazard_reduction:
			body.getAll('fire_hazard_reduction').toString().split(',').map(Number) || null,
		have_stortz: (body.get('have_stortz') as string) || null,
		id: pid,
		land_adjacent_hazard: (body.get('land_adjacent_hazard') as string) || null,
		last_updated: null,
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
		property_address_postcode: (body.get('property_address_postcode') as string) || null,
		property_address_street: (body.get('property_address_street') as string) || null,
		property_address_suburb: (body.get('property_address_suburb') as string) || null,
		property_rented: (body.get('property_rented') as unknown as boolean) || null,
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
		truck_access_other_information: (body.get('truck_access_other_information') as string) || null,
		vulnerable_residents: (body.get('vulnerable_residents') as unknown as boolean) || null
	};
	const userBCYCAProfileData: UserBCYCAProfileData = {
		community_meeting_choices:
			body.getAll('community_meeting_choices').toString().split(',').map(Number) || null,
		community_workshop_choices:
			body.getAll('community_workshop_choices').toString().split(',').map(Number) || null,
		created_at: null,
		information_sheet_choices:
			body.getAll('information_sheet_choices').toString().split(',').map(Number) || null,
		last_updated: null,
		other_community_meeting: (body.get('other_community_meeting') as string) || null,
		other_community_workshop: (body.get('other_community_workshop') as string) || null,
		other_information_sheet: (body.get('other_information_sheet') as string) || null,
		user_id: uid,
		will_run_community_workshops: (body.get('will_run_community_workshops') as string) || null
	};
	const userPostalAddressData: UserPostalAddressData = {
		created_at: null,
		last_updated: null,
		postal_address_postcode: (body.get('postal_address_postcode') as string) || null,
		postal_address_street: (body.get('postal_address_street') as string) || null,
		postal_address_suburb: (body.get('postal_address_suburb') as string) || null,
		user_id: uid
	};
	const userProfileData: UserProfileData = {
		created_at: null,
		family_name: (body.get('family_name') as string) || null,
		fire_fighting_experience: parseInt(body.get('fire_fighting_experience') as string) || null,
		fire_trauma: (body.get('fire_trauma') as unknown as boolean) || null,
		first_name: (body.get('first_name') as string) || null,
		id: uid,
		last_updated: null,
		mobile: (body.get('mobile') as string) || null,
		other_comments: (body.get('other_comments') as string) || null,
		plan_to_leave_before_fire: parseInt(body.get('plan_to_leave_before_fire') as string) || null,
		plan_to_leave_before_flood: parseInt(body.get('plan_to_leave_before_flood') as string) || null,
		residency_profile: parseInt(body.get('residency_profile') as string) || null,
		rfs_survival_plan: (body.get('rfs_survival_plan') as string) || null,
		send_rfs_survival_plan: (body.get('send_rfs_survival_plan') as unknown as boolean) || null,
		sent_rfs_survival_plan: null,
		stay_in_touch_choices:
			body.getAll('stay_in_touch_choices').toString().split(',').map(Number) || null
	};
	return {
		agentData,
		propertyProfileData,
		userBCYCAProfileData,
		userPostalAddressData,
		userProfileData
	};
};

export const splitStreetAddress = (streetAddress: string) => {
	let bits = streetAddress.split(' ');
	let result = [bits[0], streetAddress.replace(bits[0], '').trim()];
	return result;
};

export const splitFullAddress = (fullAddress: string) => {
	let bits = fullAddress.split(' ');
	let more = bits[bits.length - 1];
	let result = [bits[0], fullAddress.replace(bits[0], '').replace(more, '').trim(), more];
	return result;
};

// function setNumberArray(value: FormDataEntryValue[]) {
// 	if (value == null) {
// 		return null;
// 	} else if (Array.isArray(value)) {
// 		if (value.length == 0) {
// 			return [] as Number[];
// 		} else {
// 			let result: number[] = new Array();
// 			for (let i = 0; i < value.length; i++) {
// 				result[1] = parseInt(value[i] as string);
// 			}
// 			return result;
// 		}
// 	}
// }

export const toTitleCase = (text: string) => {
	return text
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
};
