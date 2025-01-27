export interface RfsReportData {
	property_id: string;
	phone: string;
	address: string;
	agentinformation?: {
		agentname: string;
		agentmobile: string;
		agentphone: string;
	};
	property: {
		identification: string;
		truck_access: string;
		critical_assets: string;
		vulnerable: string;
		age_profile: {
			age0_18: string;
			age19_50: string;
			age51_70: string;
			age71_: string;
		};
	};
	onsite_hazards: {
		on_site_hazards: {
			Solar_batteries: string;
			Fuel_stores: string;
			Chemical_stores: string;
			Bottled_gas: string;
		};
		other_site_hazards: string;
	};
	other_local_hazards: {
		land_adjacent_hazard: string;
		other_local_hazards: string;
	};
	fire_fighting_assets: {
		static_water: string;
		stortz_fitting: string;
		equipment: string;
		firebreaks: string;
		slashed_apz_s: string;
		backup_pump: string;
		driveway_overhead_clearance: string;
		truck_access_around_property: string;
	};
	site_animals: {
		pets: {
			dogs: string;
			cats: string;
			birds: string;
			other_pets: string;
		};
		livestock: string;
		safe_area?: {
			status: string;
			availability?: string;
		};
	};
	residents: Array<{
		name: string;
		mobile: string;
		resident: string;
		survival_plan: string;
		plan_to_leave: string;
	}>;
}
