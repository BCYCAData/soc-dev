import type {
	ProfileMessageData,
	ProfileAboutMeFormData,
	ProfileMyPlaceAssetsFormData,
	ProfileMyPlaceFormData,
	ProfileMyPlaceHazardsFormData,
	ProfileMyPlaceResourcesFormData,
	ProfileMyCommunityFormData,
	ProfileMyCommunityBCYCAFormData,
	ProfileMyCommunityBCYCAEventsFormData,
	ProfileMyCommunityBCYCAInformationFormData,
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
	ProfileMyCommunityExternalWorkshopsFormData,
	PropertyAgentData
} from '$lib/custom.types';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../admin/$types';
import type { QueryData } from '@supabase/supabase-js';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

let profileMessagesData: ProfileMessageData;
export const load: LayoutServerLoad = async ({ locals: { supabase, getUser } }) => {
	const { user } = await getUser();
	if (!user) {
		redirect(307, '/auth/signin');
	}
	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{
			id_input: user.id
		}
	);
	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}
	profileMessagesData = profileMessages;
	const profileQueryData = supabase
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
				kyng_areas(kyng),
				user_profile( family_name, fire_fighting_experience, fire_trauma, first_name, mobile, other_comments, 
					plan_to_leave_before_fire, plan_to_leave_before_flood, residency_profile, rfs_survival_plan, 
					stay_in_touch_choices, 
					community_bcyca_profile(bcyca_profile_id, community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
						other_comments
					), 
					community_tinonee_profile(tinonee_profile_id, community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
						other_comments
					), 
					community_mondrook_profile(mondrook_profile_id, community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
						other_comments
					), 
					community_external_profile(external_profile_id, community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops,
						other_comments
					), 
					user_postal_address(postal_address_postcode, postal_address_street, postal_address_suburb) 
				), 
				property_agent(agent_mobile, agent_name, agent_phone)`
		)
		.eq('principaladdresssiteoid', user.app_metadata.principaladdresssiteoid)
		.eq('user_profile.id', user.id);
	type ProfileData = QueryData<typeof profileQueryData>;
	const { data, error: getProfileDataError } = await profileQueryData;
	if (getProfileDataError) {
		console.log('GET data error Profile:', getProfileDataError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Profile.`,
			user: `User:: $user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, getProfileDataError);
		error(400, `GET data error Survey:  Error ${getProfileDataError.message}`);
	}
	if (data && data.length > 0) {
		const profileData: ProfileData = data;
		let {
			user_profile: [_userProfileData],
			property_agent,
			community_areas,
			kyng_areas,
			...property_profile
		} = profileData[0];
		const communityName = community_areas!.community!;
		const kyngName = kyng_areas!.kyng!;
		let {
			id,
			property_address_street,
			property_address_suburb,
			property_address_postcode,
			...propertyProfile
		} = property_profile;
		let {
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile,
			...userProfile
		} = _userProfileData;
		let hadUserPostalAddress = true;
		if (!user_postal_address) {
			user_postal_address = {
				postal_address_postcode: '',
				postal_address_street: '',
				postal_address_suburb: ''
			};
			hadUserPostalAddress = false;
		}
		const profileAboutMeFormData: ProfileAboutMeFormData = {
			family_name: userProfile.family_name || null,
			fire_fighting_experience: userProfile.fire_fighting_experience || null,
			fire_trauma: userProfile.fire_trauma || null,
			first_name: userProfile.first_name || null,
			mobile: userProfile.mobile || null,
			plan_to_leave_before_fire: userProfile.plan_to_leave_before_fire || null,
			plan_to_leave_before_flood: userProfile.plan_to_leave_before_flood || null,
			residency_profile: userProfile.residency_profile || null,
			rfs_survival_plan: userProfile.rfs_survival_plan || null
		};
		const propertyId = id;
		const propertyAddress = {
			property_address_street: property_address_street,
			property_address_suburb: property_address_suburb,
			property_address_postcode: property_address_postcode
		};
		const propertyWasRented = propertyProfile.property_rented || false;
		if (!property_agent) {
			property_agent = {
				agent_mobile: '',
				agent_name: '',
				agent_phone: ''
			};
		}
		const propertyAgentData: PropertyAgentData = {
			agent_mobile: property_agent.agent_mobile || null,
			agent_name: property_agent.agent_name || null,
			agent_phone: property_agent.agent_phone || null
		};
		const profileMyPlaceFormData: ProfileMyPlaceFormData = {
			property_rented: propertyProfile.property_rented || false,
			propertyAgentData,
			sign_posted: propertyProfile.sign_posted || null,
			vulnerable_residents: propertyProfile.vulnerable_residents || null,
			phone: propertyProfile.phone || null,
			mobile_reception: propertyProfile.mobile_reception || null,
			truck_access: propertyProfile.truck_access || null,
			truck_access_other_information: propertyProfile.truck_access_other_information || null,
			residents0_18: propertyProfile.residents0_18 || null,
			residents19_50: propertyProfile.residents19_50 || null,
			residents51_70: propertyProfile.residents51_70 || null,
			residents71_: propertyProfile.residents71_ || null
		};
		const profileMyPlaceAssetsFormData: ProfileMyPlaceAssetsFormData = {
			live_stock_present: propertyProfile.live_stock_present || null,
			live_stock_safe_area: propertyProfile.live_stock_safe_area || null,
			share_livestock_safe_area: propertyProfile.share_livestock_safe_area || null,
			number_birds: propertyProfile.number_birds || null,
			number_cats: propertyProfile.number_cats || null,
			number_dogs: propertyProfile.number_dogs || null,
			number_other_pets: propertyProfile.number_other_pets || null,
			other_essential_assets: propertyProfile.other_essential_assets || null
		};
		const profileMyPlaceHazardsFormData: ProfileMyPlaceHazardsFormData = {
			other_hazards: propertyProfile.other_hazards || null,
			other_site_hazards: propertyProfile.other_site_hazards || null,
			site_hazards: propertyProfile.site_hazards || null,
			land_adjacent_hazard: propertyProfile.land_adjacent_hazard || null
		};
		const profileMyPlaceResourcesFormData: ProfileMyPlaceResourcesFormData = {
			fire_fighting_resources: propertyProfile.fire_fighting_resources || null,
			fire_hazard_reduction: propertyProfile.fire_hazard_reduction || null,
			have_stortz: propertyProfile.have_stortz || null,
			stortz_size: propertyProfile.stortz_size || null,
			static_water_available: propertyProfile.static_water_available || null
		};
		const profileMyCommunityFormData: ProfileMyCommunityFormData = {
			stay_in_touch_choices: userProfile.stay_in_touch_choices || null,
			userPostalAddressData:
				{
					postal_address_postcode: user_postal_address.postal_address_postcode || null,
					postal_address_street: user_postal_address.postal_address_street || null,
					postal_address_suburb: user_postal_address.postal_address_suburb || null
				} || null,
			hadUserPostalAddress: hadUserPostalAddress,
			other_comments: userProfile.other_comments || null
		};
		// if (community_bcyca_profile) {
		const profileMyCommunityBCYCAFormData: ProfileMyCommunityBCYCAFormData | null =
			community_bcyca_profile
				? {
						stay_in_touch_choices: community_bcyca_profile.stay_in_touch_choices || null,
						userPostalAddressData:
							{
								postal_address_postcode: user_postal_address?.postal_address_postcode || null,
								postal_address_street: user_postal_address?.postal_address_street || null,
								postal_address_suburb: user_postal_address?.postal_address_suburb || null
							} || null,
						hadUserPostalAddress: hadUserPostalAddress,
						other_comments: community_bcyca_profile.other_comments || null
					}
				: null;
		const profileMyCommunityBCYCAEventsFormData: ProfileMyCommunityBCYCAEventsFormData | null =
			community_bcyca_profile
				? {
						community_meeting_choices: community_bcyca_profile.community_meeting_choices || null,
						other_community_meeting: community_bcyca_profile.other_community_meeting || null
					}
				: null;
		const profileMyCommunityBCYCAInformationFormData: ProfileMyCommunityBCYCAInformationFormData | null =
			community_bcyca_profile
				? {
						information_sheet_choices: community_bcyca_profile.information_sheet_choices || null,
						other_information_sheet: community_bcyca_profile.other_information_sheet || null
					}
				: null;
		const profileMyCommunityBCYCAWorkshopsFormData: ProfileMyCommunityBCYCAWorkshopsFormData | null =
			community_bcyca_profile
				? {
						community_workshop_choices: community_bcyca_profile.community_workshop_choices || null,
						other_community_workshop: community_bcyca_profile.other_community_workshop || null,
						will_run_community_workshops:
							community_bcyca_profile.will_run_community_workshops || null
					}
				: null;
		// if (community_tinonee_profile) {
		const profileMyCommunityTinoneeFormData: ProfileMyCommunityTinoneeFormData | null =
			community_tinonee_profile
				? {
						stay_in_touch_choices: community_tinonee_profile.stay_in_touch_choices || null,
						userPostalAddressData:
							{
								postal_address_postcode: user_postal_address?.postal_address_postcode || null,
								postal_address_street: user_postal_address?.postal_address_street || null,
								postal_address_suburb: user_postal_address?.postal_address_suburb || null
							} || null,
						hadUserPostalAddress: hadUserPostalAddress,
						other_comments: community_tinonee_profile.other_comments || null
					}
				: null;
		const profileMyCommunityTinoneeEventsFormData: ProfileMyCommunityTinoneeEventsFormData | null =
			community_tinonee_profile
				? {
						community_meeting_choices: community_tinonee_profile.community_meeting_choices || null,
						other_community_meeting: community_tinonee_profile.other_community_meeting || null
					}
				: null;
		const profileMyCommunityTinoneeInformationFormData: ProfileMyCommunityTinoneeInformationFormData | null =
			community_tinonee_profile
				? {
						information_sheet_choices: community_tinonee_profile.information_sheet_choices || null,
						other_information_sheet: community_tinonee_profile.other_information_sheet || null
					}
				: null;
		const profileMyCommunityTinoneeWorkshopsFormData: ProfileMyCommunityTinoneeWorkshopsFormData | null =
			community_tinonee_profile
				? {
						community_workshop_choices:
							community_tinonee_profile.community_workshop_choices || null,
						other_community_workshop: community_tinonee_profile.other_community_workshop || null,
						will_run_community_workshops:
							community_tinonee_profile.will_run_community_workshops || null
					}
				: null;
		// if (community_mondrook_profile) {
		const profileMyCommunityMondrookFormData: ProfileMyCommunityMondrookFormData | null =
			community_mondrook_profile
				? {
						stay_in_touch_choices: community_mondrook_profile.stay_in_touch_choices || null,
						userPostalAddressData:
							{
								postal_address_postcode: user_postal_address?.postal_address_postcode || null,
								postal_address_street: user_postal_address?.postal_address_street || null,
								postal_address_suburb: user_postal_address?.postal_address_suburb || null
							} || null,
						hadUserPostalAddress: hadUserPostalAddress,
						other_comments: community_mondrook_profile.other_comments || null
					}
				: null;
		const profileMyCommunityMondrookEventsFormData: ProfileMyCommunityMondrookEventsFormData | null =
			community_mondrook_profile
				? {
						community_meeting_choices: community_mondrook_profile.community_meeting_choices || null,
						other_community_meeting: community_mondrook_profile.other_community_meeting || null
					}
				: null;
		const profileMyCommunityMondrookInformationFormData: ProfileMyCommunityMondrookInformationFormData | null =
			community_mondrook_profile
				? {
						information_sheet_choices: community_mondrook_profile.information_sheet_choices || null,
						other_information_sheet: community_mondrook_profile.other_information_sheet || null
					}
				: null;
		const profileMyCommunityMondrookWorkshopsFormData: ProfileMyCommunityMondrookWorkshopsFormData | null =
			community_mondrook_profile
				? {
						community_workshop_choices:
							community_mondrook_profile.community_workshop_choices || null,
						other_community_workshop: community_mondrook_profile.other_community_workshop || null,
						will_run_community_workshops:
							community_mondrook_profile.will_run_community_workshops || null
					}
				: null;
		// if (community_external_profile) {
		const profileMyCommunityExternalFormData: ProfileMyCommunityExternalFormData | null =
			community_external_profile
				? {
						stay_in_touch_choices: community_external_profile.stay_in_touch_choices || null,
						userPostalAddressData:
							{
								postal_address_postcode: user_postal_address?.postal_address_postcode || null,
								postal_address_street: user_postal_address?.postal_address_street || null,
								postal_address_suburb: user_postal_address?.postal_address_suburb || null
							} || null,
						hadUserPostalAddress: hadUserPostalAddress,
						other_comments: community_external_profile.other_comments || null
					}
				: null;
		const profileMyCommunityExternalEventsFormData: ProfileMyCommunityExternalEventsFormData | null =
			community_external_profile
				? {
						community_meeting_choices: community_external_profile.community_meeting_choices || null,
						other_community_meeting: community_external_profile.other_community_meeting || null
					}
				: null;
		const profileMyCommunityExternalInformationFormData: ProfileMyCommunityExternalInformationFormData | null =
			community_external_profile
				? {
						information_sheet_choices: community_external_profile.information_sheet_choices || null,
						other_information_sheet: community_external_profile.other_information_sheet || null
					}
				: null;
		const profileMyCommunityExternalWorkshopsFormData: ProfileMyCommunityExternalWorkshopsFormData | null =
			community_external_profile
				? {
						community_workshop_choices:
							community_external_profile.community_workshop_choices || null,
						other_community_workshop: community_external_profile.other_community_workshop || null,
						will_run_community_workshops:
							community_external_profile.will_run_community_workshops || null
					}
				: null;
		const communityProfiles: Record<string, string | null> = {
			community_bcyca_profile_id: community_bcyca_profile?.bcyca_profile_id || null,
			community_tinonee_profile_id: community_tinonee_profile?.tinonee_profile_id || null,
			community_mondrook_profile_id: community_mondrook_profile?.mondrook_profile_id || null,
			community_external_profile_id: community_external_profile?.external_profile_id || null
		};
		return {
			profileMessagesData,
			propertyId,
			propertyWasRented,
			communityName,
			kyngName,
			propertyAddress,
			propertyProfile,
			profileAboutMeFormData,
			profileMyPlaceFormData,
			profileMyPlaceAssetsFormData,
			profileMyPlaceHazardsFormData,
			profileMyPlaceResourcesFormData,
			profileMyCommunityFormData,
			profileMyCommunityBCYCAFormData,
			profileMyCommunityBCYCAEventsFormData,
			profileMyCommunityBCYCAInformationFormData,
			profileMyCommunityBCYCAWorkshopsFormData,
			profileMyCommunityTinoneeFormData,
			profileMyCommunityTinoneeEventsFormData,
			profileMyCommunityTinoneeInformationFormData,
			profileMyCommunityTinoneeWorkshopsFormData,
			profileMyCommunityMondrookFormData,
			profileMyCommunityMondrookEventsFormData,
			profileMyCommunityMondrookInformationFormData,
			profileMyCommunityMondrookWorkshopsFormData,
			profileMyCommunityExternalFormData,
			profileMyCommunityExternalEventsFormData,
			profileMyCommunityExternalInformationFormData,
			profileMyCommunityExternalWorkshopsFormData,
			user_postal_address,
			communityProfiles
		};
	}
};
