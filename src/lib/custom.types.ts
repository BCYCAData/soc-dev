import type { Database } from './db.types';

//---------Tables-----------------
export type AgentData = Database['public']['Tables']['agent']['Row'];
export type ProfileMessageData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
export type PropertyProfileData = Database['public']['Tables']['property_profile']['Row'];
export type UserBCYCAProfileData = Database['public']['Tables']['user_bcyca_profile']['Row'];
export type UserPostalAddressData = Database['public']['Tables']['user_postal_address']['Row'];
export type UserProfileData = Database['public']['Tables']['user_profile']['Row'];

//---------Functions-----------------
export type AppMessageFunctionData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
