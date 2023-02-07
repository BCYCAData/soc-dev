declare global {
	// need this declaration if in a module
	interface Object {
		hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, string>;
	}
}

export type Crumb = {
	label: string;
	href: string;
};

export type MapDataJSON = {
	jsonLayers: any;
};

export type AddressPointData = {
	status: number;
	communityname?: string | null;
	validaddress: string;
	searchstreet: string;
	searchsuburb: string;
	postcode: string;
	principaladdresssiteoid?: number | null;
	addresspoint?: any | null;
	message?: string | null;
	returnstatus: number;
	apistatus?: number | null;
	apistatustext?: string | null;
	error: PostgrestError | null;
};

export type MapObject = {
	divId: string;
	centre: number[]; //-31.955814913,152.300883592
	zoomControl: boolean;
	doubleClickZoom: boolean;
	scrollWheelZoom: boolean;
	zoomSnap: number;
	zoom: number;
	minZoom: number;
	maxZoom: number;
	maxBounds?: undefined;
	dragging: boolean;
	mapTiler: boolean;
};

export type MapTileLayerObject = {
	url: string;
	layerOptions: TileLayerOptions;
};

export type UserProfileData = {
	family_name: string | null;
	fire_fighting_experience: number | null;
	fire_trauma: boolean | null;
	first_name: string | null;
	mobile: string | null;
	other_comments: string | null;
	plan_to_leave_before_fire: number | null;
	plan_to_leave_before_flood: number | null;
	postal_address_postcode: string | null;
	postal_address_street: string | null;
	postal_address_suburb: string | null;
	residency_profile: number | null;
	rfs_survival_plan: string | null;
	send_rfs_survival_plan: boolean | null;
	sent_rfs_survival_plan: string | null;
	stay_in_touch_choices: number[] | null;
};

export type UserBCYCAProfileData = {
	community_meeting_choices: number[] | null;
	community_workshop_choices: number[] | null;
	information_sheet_choices: number[] | null;
	other_community_meeting: string | null;
	other_community_workshop: string | null;
	other_information_sheet: string | null;
	will_run_community_workshops: string | null;
};

export type AgentData = {
	agent_mobile: string | null;
	agent_name: string | null;
	agent_phone: string | null;
	id: string;
};

export type PropertyProfileData = {
	fire_fighting_resources: number[] | null;
	fire_hazard_reduction: number[] | null;
	have_stortz: string | null;
	land_adjacent_hazard: string | null;
	live_stock_present: boolean | null;
	live_stock_safe_area: string | null;
	mobile_reception: number | null;
	number_birds: number | null;
	number_cats: number | null;
	number_dogs: number | null;
	number_other_pets: number | null;
	other_essential_assets: string | null;
	other_hazards: string | null;
	other_site_hazards: string | null;
	phone: string | null;
	property_address_postcode: string | null;
	property_address_street: string | null;
	property_address_suburb: string | null;
	property_rented: string | null;
	residents0_18: number | null;
	residents19_50: number | null;
	residents51_70: number | null;
	residents71_: number | null;
	share_livestock_safe_area: string | null;
	sign_posted: boolean | null;
	site_hazards: number[] | null;
	static_water_available: number[] | null;
	stortz_size: number | null;
	truck_access: number | null;
	truck_access_other_information: string | null;
	vulnerable_residents: boolean | null;
};
