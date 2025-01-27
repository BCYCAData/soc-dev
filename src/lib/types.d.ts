export type FullAutoFill =
	| 'street-address'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'address-level1'
	| 'address-level2'
	| 'address-level3'
	| 'address-level4'
	| 'country'
	| 'country-name'
	| 'postal-code'
	| 'email'
	| 'username'
	| 'new-password'
	| 'current-password'
	| 'one-time-code'
	| 'organization'
	| 'organization-title'
	| 'name'
	| 'given-name'
	| 'additional-name'
	| 'family-name';

export interface PropertyAddress {
	lut_text: string;
	property_id: string[];
}

export interface AddressValidationResponse {
	principaladdresssiteoid: string;
	validaddressstreet: string;
	validaddresssuburb: string;
	validaddresspostcode: string;
	searchaddressstreet: string;
	searchaddresssuburb: string;
	community: string;
	status: number;
}

interface ValidateAddressSuccessResponse {
	apiData: AddressValidationResponse;
	error: false;
	success: true;
}

interface ValidateAddressErrorResponse {
	error: true;
	message: string;
	success: false;
	formInputs: {
		streetaddress: string;
		suburb: string;
	};
}

interface SignupSuccessResponse {
	apiData: AddressValidationResponse;
	error: false;
	success: true;
	redirect: string;
}

interface SignupErrorResponse {
	error: true;
	message: string;
	success: false;
	apiData: AddressValidationResponse;
}

export type SignupActionResponse = SignupSuccessResponse | SignupErrorResponse;

export type ValidateActionResponse = ValidateSuccessResponse | ValidateErrorResponse;

export interface TabulatorProps {
	columns: any[];
	data: any[];
	layout: 'fitDataFill' | 'fitData' | 'fitColumns' | 'fitDataStretch' | 'fitDataTable' | undefined;
	responsiveLayout?: boolean | 'collapse' | 'hide';
	pagination?: boolean;
	paginationSize?: number;
	paginationSizeSelector?: any[];
	movableColumns?: boolean;
	paginationCounter?:
		| 'rows'
		| 'pages'
		| ((
				pageSize: number,
				currentRow: number,
				currentPage: number,
				totalRows: number,
				totalPages: number
		  ) => string | HTMLElement)
		| undefined;
}

export type ComparisonOption = {
	value: string;
	lable: string;
};

export interface BCYCAInformationItem {
	other_information?: string;
	email: string;
	name: string;
	property_address: string;
	created_at: string;
}
interface ExternalInformationItem {
	other_information?: string;
	email: string;
	name: string;
	property_address: string;
	created_at: string;
}
interface MondrookInformationItem {
	other_information?: string;
	email: string;
	name: string;
	property_address: string;
	created_at: string;
}
interface TinoneeInformationItem {
	other_information?: string;
	email: string;
	name: string;
	property_address: string;
	created_at: string;
}

interface TabItem {
	label: string;
	value: number;
	component: ConstructorOfATypedSvelteComponent;
	props?: Record<string, any>;
}

interface KYNGArea {
	kyngAreaId: string;
	kyngName: string;
}

export interface TransformedOptionsData {
	table_name: string;
	object_names: {
		object_name: string;
		options: {
			value: string; // Assuming this is the index_value
			lable: string;
		}[];
	}[];
}

interface CommunityRequestOption {
	index_value: number;
	lable: string;
	community_request_options_concordance: {
		table_name: string;
		object_name: string;
		field_name: string;
	};
}

interface SupabaseResponse {
	index_value: number;
	lable: string;
	community_request_options_concordance: {
		table_name: string;
		object_name: string;
		field_name: string;
	};
}

export interface APIData {
	status: number;
	searchaddressstreet: string;
	searchaddresssuburb: string;
	validaddressstreet: string;
	validaddresssuburb: string;
	validaddresspostcode: string;
	principaladdresssiteoid: number;
	community: string;
	kyng?: string;
}

interface PasswordValidation {
	description: string;
	test: (password: string, confirmPassword?: string) => boolean;
}

interface EmailValidation {
	isValid: boolean;
	message?: string;
}

export type MenuIcon = {
	icon?: typeof User | typeof TextIcon;
	letter?: string;
};

interface MenuItem {
	id: string;
	name: string;
	link: string;
	icon: MenuIcon;
	permission: string;
	initialOpen?: boolean;
	subItems?: MenuItem[];
}

//---------User Profile Forms-----------------
export type ProfileAboutMeFormData = {
	family_name: string | null;
	fire_fighting_experience: number | null;
	fire_trauma: boolean | null;
	first_name: string | null;
	mobile: string | null;
	plan_to_leave_before_fire: number | null;
	plan_to_leave_before_flood: number | null;
	residency_profile: number | null;
	rfs_survival_plan: string | null;
};
export type ProfileMyPlaceFormData = {
	property_rented: boolean;
	propertyAgentData: PropertyAgent;
	sign_posted: boolean | null;
	vulnerable_residents: boolean | null;
	phone: string | null;
	mobile_reception: number | null;
	truck_access: number | null;
	truck_access_other_information: string | null;
	residents0_18: number | null;
	residents19_50: number | null;
	residents51_70: number | null;
	residents71_: number | null;
};

export type ProfileMyPlaceAssetsFormData = {
	live_stock_present: boolean | null;
	live_stock_safe_area: string | null;
	share_livestock_safe_area: string | null;
	number_birds: number | null;
	number_cats: number | null;
	number_dogs: number | null;
	number_other_pets: number | null;
	other_essential_assets: string | null;
};

export type ProfileMyPlaceHazardsFormData = {
	site_hazards: number[] | null;
	land_adjacent_hazard: string | null;
	other_hazards: string | null;
	other_site_hazards: string | null;
};
export type ProfileMyPlaceResourcesFormData = {
	fire_fighting_resources: number[] | null;
	fire_hazard_reduction: number[] | null;
	have_stortz: string | null;
	static_water_available: number[] | null;
	stortz_size: number | null;
};
export type ProfileMyCommunityFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityBCYCAFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityBCYCAEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyBCYCACommunityInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityBCYCAWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityTinoneeFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityTinoneeEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityTinoneeInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityTinoneeWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityMondrookFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityMondrookEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityMondrookInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityMondrookWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
export type ProfileMyCommunityExternalFormData = {
	stay_in_touch_choices: number[] | null;
	userPostalAddressData: UserPostalAddressData | null;
	other_comments: string | null;
	hadUserPostalAddress: boolean;
};
export type ProfileMyCommunityExternalEventsFormData = {
	community_meeting_choices: number[] | null;
	other_community_meeting: string | null;
};
export type ProfileMyCommunityExternalInformationFormData = {
	information_sheet_choices: number[] | null;
	other_information_sheet: string | null;
};
export type ProfileMyCommunityExternalWorkshopsFormData = {
	community_workshop_choices: number[] | null;
	other_community_workshop: string | null;
	will_run_community_workshops: string | null;
};
//---------Functions-----------------
export type AppMessageFunctionData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
export type ProfileMessageData =
	Database['public']['Functions']['get_profile_messages_for_user']['Returns'];
