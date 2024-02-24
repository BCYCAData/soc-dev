import type { Database, Tables } from './db.types.ts';

//---------Tables-----------------
export type AgentData = Tables<'property_agent'>;
export type PropertyProfileData = Tables<'property_profile'>;
export type UserBCYCAProfileData = Tables<'community_bcyca_profile'>;
export type UserTinoneeProfileData = Tables<'community_tinonee_profile'>;
export type UserMondrookProfileData = Tables<'community_mondrook_profile'>;
export type UserExternalProfileData = Tables<'community_external_profile'>;
export type UserPostalAddressData = Tables<'user_postal_address'>;
export type UserProfileData = Tables<'user_profile'>;
export type PropertyGeometryData = Tables<'property_geometry'>;

//----------Unions-----------------
export type PropertyUserProfile = PropertyProfileData | UserBCYCAProfileData;

//---------Functions-----------------
export type AppMessageFunctionData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
export type ProfileMessageData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
