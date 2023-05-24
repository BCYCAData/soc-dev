import type { Database } from './db.types';

export type AddressPointExtractWGS84Data =
	Database['public']['Tables']['address_point_extract_wgs84']['Row'];
export type AgentData = Database['public']['Tables']['agent']['Row'];
export type AppMessageData = Database['public']['Tables']['app_message']['Row'];
export type ProfileMessageData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
export type CommunitiesData = Database['public']['Tables']['communities']['Row'];
export type PropertyGeometryData = Database['public']['Tables']['property_geometry']['Row'];
export type PropertyProfileData = Database['public']['Tables']['property_profile']['Row'];
export type SuburbAliasesData = Database['public']['Tables']['suburb_aliases']['Row'];
export type SurveyResponsesData = Database['public']['Tables']['survey_responses']['Row'];
export type UserBCYCAProfileData = Database['public']['Tables']['user_bcyca_profile']['Row'];
export type UserPostalAddressData = Database['public']['Tables']['user_postal_address']['Row'];
export type UserProfileData = Database['public']['Tables']['user_profile']['Row'];
export type AppMessageFunctionData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
