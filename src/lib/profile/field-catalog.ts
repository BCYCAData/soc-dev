/**
 * Canonical catalog of answerable personal-profile-form questions.
 *
 * This is the SOURCE OF TRUTH for "what can be asked". The field set is
 * code-coupled to the multi-step form (`personal-profile-form`) and the shape
 * returned by the `get_profile_for_user` RPC, so it lives in code rather than the
 * database. The database only stores WHICH of these keys an admin has marked
 * required (see `profile_required_question` + the admin requirements UI).
 *
 * `jsonPath` walks the RAW RPC payload. Note `property_profile` arrives as an
 * ARRAY there (the form page later takes `[0]`), so property paths index `0` and
 * the agent sits under `property_profile[0].property_agent`.
 *
 * `answerType` drives the "is this answered?" test in `completion.ts`:
 * - text:    non-empty trimmed string
 * - number:  any number INCLUDING 0 (null is unanswered)
 * - boolean: any boolean INCLUDING false (null is unanswered)
 * - array / choices: a non-empty array
 *
 * When the form gains a field, add it here and (if it should be selectable) it
 * becomes available to admins automatically — no migration needed unless you want
 * it required by default.
 *
 * @module profile/field-catalog
 */

export type ProfileAnswerType = 'text' | 'number' | 'boolean' | 'array' | 'choices';

export type CommunityScope = 'bcyca' | 'tinonee' | 'mondrook' | 'external';

export interface ProfileFieldDefinition {
	/** Stable identifier; matches `profile_required_question.field_key`. */
	key: string;
	/** Path into the raw `get_profile_for_user` JSON payload. */
	jsonPath: (string | number)[];
	/** Admin-facing question label. */
	label: string;
	/** Grouping heading in the admin requirements UI. */
	section: string;
	answerType: ProfileAnswerType;
	/** When set, the question only counts for users who have that community profile. */
	communityScope?: CommunityScope;
	/** When true, the question only counts when the property is rented. */
	appliesWhenRented?: boolean;
}

const PROPERTY = (col: string): (string | number)[] => ['property_profile', 0, col];
const AGENT = (col: string): (string | number)[] => ['property_profile', 0, 'property_agent', col];

/**
 * Builds the four parallel community question rows (BCYCA/Tinonee/Mondrook/External)
 * for a given community column, so the per-community set stays in lockstep.
 */
function communityQuestions(
	col: string,
	label: string,
	answerType: ProfileAnswerType
): ProfileFieldDefinition[] {
	const scopes: { scope: CommunityScope; profileKey: string; name: string }[] = [
		{ scope: 'bcyca', profileKey: 'community_bcyca_profile', name: 'BCYCA' },
		{ scope: 'tinonee', profileKey: 'community_tinonee_profile', name: 'Tinonee' },
		{ scope: 'mondrook', profileKey: 'community_mondrook_profile', name: 'Mondrook' },
		{ scope: 'external', profileKey: 'community_external_profile', name: 'External' }
	];
	return scopes.map(({ scope, profileKey, name }) => ({
		key: `${scope}.${col}`,
		jsonPath: [profileKey, col],
		label: `${label}`,
		section: `Community — ${name}`,
		answerType,
		communityScope: scope
	}));
}

export const PROFILE_FIELD_CATALOG: ProfileFieldDefinition[] = [
	// --- Personal details ---
	{
		key: 'first_name',
		jsonPath: ['first_name'],
		label: 'First name',
		section: 'Personal Details',
		answerType: 'text'
	},
	{
		key: 'family_name',
		jsonPath: ['family_name'],
		label: 'Family name',
		section: 'Personal Details',
		answerType: 'text'
	},
	{
		key: 'mobile',
		jsonPath: ['mobile'],
		label: 'Mobile number',
		section: 'Personal Details',
		answerType: 'text'
	},
	{
		key: 'residency_profile',
		jsonPath: ['residency_profile'],
		label: 'Residency status',
		section: 'Personal Details',
		answerType: 'number'
	},

	// --- Survival planning ---
	{
		key: 'fire_fighting_experience',
		jsonPath: ['fire_fighting_experience'],
		label: 'Fire-fighting experience',
		section: 'Survival Planning',
		answerType: 'number'
	},
	{
		key: 'fire_trauma',
		jsonPath: ['fire_trauma'],
		label: 'Previous fire trauma',
		section: 'Survival Planning',
		answerType: 'boolean'
	},
	{
		key: 'plan_to_leave_before_fire',
		jsonPath: ['plan_to_leave_before_fire'],
		label: 'Plan to leave before fire',
		section: 'Survival Planning',
		answerType: 'number'
	},
	{
		key: 'plan_to_leave_before_flood',
		jsonPath: ['plan_to_leave_before_flood'],
		label: 'Plan to leave before flood',
		section: 'Survival Planning',
		answerType: 'number'
	},
	{
		key: 'rfs_survival_plan',
		jsonPath: ['rfs_survival_plan'],
		label: 'RFS survival plan',
		section: 'Survival Planning',
		answerType: 'text'
	},

	// --- Staying in touch ---
	{
		key: 'stay_in_touch_choices',
		jsonPath: ['stay_in_touch_choices'],
		label: 'Stay-in-touch preferences',
		section: 'Staying in Touch',
		answerType: 'choices'
	},

	// --- Property: people ---
	{
		key: 'property_rented',
		jsonPath: PROPERTY('property_rented'),
		label: 'Is the property rented?',
		section: 'Property — People',
		answerType: 'boolean'
	},
	{
		key: 'residents0_18',
		jsonPath: PROPERTY('residents0_18'),
		label: 'Residents aged 0–18',
		section: 'Property — People',
		answerType: 'number'
	},
	{
		key: 'residents19_50',
		jsonPath: PROPERTY('residents19_50'),
		label: 'Residents aged 19–50',
		section: 'Property — People',
		answerType: 'number'
	},
	{
		key: 'residents51_70',
		jsonPath: PROPERTY('residents51_70'),
		label: 'Residents aged 51–70',
		section: 'Property — People',
		answerType: 'number'
	},
	{
		key: 'residents71_',
		jsonPath: PROPERTY('residents71_'),
		label: 'Residents aged 71+',
		section: 'Property — People',
		answerType: 'number'
	},
	{
		key: 'vulnerable_residents',
		jsonPath: PROPERTY('vulnerable_residents'),
		label: 'Vulnerable residents present',
		section: 'Property — People',
		answerType: 'boolean'
	},

	// --- Property: animals ---
	{
		key: 'number_dogs',
		jsonPath: PROPERTY('number_dogs'),
		label: 'Number of dogs',
		section: 'Property — Animals',
		answerType: 'number'
	},
	{
		key: 'number_cats',
		jsonPath: PROPERTY('number_cats'),
		label: 'Number of cats',
		section: 'Property — Animals',
		answerType: 'number'
	},
	{
		key: 'number_birds',
		jsonPath: PROPERTY('number_birds'),
		label: 'Number of birds',
		section: 'Property — Animals',
		answerType: 'number'
	},
	{
		key: 'number_other_pets',
		jsonPath: PROPERTY('number_other_pets'),
		label: 'Number of other pets',
		section: 'Property — Animals',
		answerType: 'number'
	},
	{
		key: 'live_stock_present',
		jsonPath: PROPERTY('live_stock_present'),
		label: 'Livestock present',
		section: 'Property — Animals',
		answerType: 'boolean'
	},
	{
		key: 'live_stock_safe_area',
		jsonPath: PROPERTY('live_stock_safe_area'),
		label: 'Livestock safe area',
		section: 'Property — Animals',
		answerType: 'text'
	},
	{
		key: 'share_livestock_safe_area',
		jsonPath: PROPERTY('share_livestock_safe_area'),
		label: 'Willing to share livestock safe area',
		section: 'Property — Animals',
		answerType: 'text'
	},

	// --- Property: hazards & resources ---
	{
		key: 'fire_fighting_resources',
		jsonPath: PROPERTY('fire_fighting_resources'),
		label: 'Fire-fighting resources',
		section: 'Property — Hazards & Resources',
		answerType: 'array'
	},
	{
		key: 'fire_hazard_reduction',
		jsonPath: PROPERTY('fire_hazard_reduction'),
		label: 'Fire hazard reduction',
		section: 'Property — Hazards & Resources',
		answerType: 'array'
	},
	{
		key: 'site_hazards',
		jsonPath: PROPERTY('site_hazards'),
		label: 'Site hazards',
		section: 'Property — Hazards & Resources',
		answerType: 'array'
	},
	{
		key: 'static_water_available',
		jsonPath: PROPERTY('static_water_available'),
		label: 'Static water available',
		section: 'Property — Hazards & Resources',
		answerType: 'array'
	},
	{
		key: 'have_stortz',
		jsonPath: PROPERTY('have_stortz'),
		label: 'Storz fitting available',
		section: 'Property — Hazards & Resources',
		answerType: 'text'
	},
	{
		key: 'stortz_size',
		jsonPath: PROPERTY('stortz_size'),
		label: 'Storz size',
		section: 'Property — Hazards & Resources',
		answerType: 'number'
	},
	{
		key: 'land_adjacent_hazard',
		jsonPath: PROPERTY('land_adjacent_hazard'),
		label: 'Adjacent land hazard',
		section: 'Property — Hazards & Resources',
		answerType: 'text'
	},
	{
		key: 'other_hazards',
		jsonPath: PROPERTY('other_hazards'),
		label: 'Other hazards',
		section: 'Property — Hazards & Resources',
		answerType: 'text'
	},
	{
		key: 'other_site_hazards',
		jsonPath: PROPERTY('other_site_hazards'),
		label: 'Other site hazards',
		section: 'Property — Hazards & Resources',
		answerType: 'text'
	},
	{
		key: 'other_essential_assets',
		jsonPath: PROPERTY('other_essential_assets'),
		label: 'Other essential assets',
		section: 'Property — Hazards & Resources',
		answerType: 'text'
	},

	// --- Property: access & contact ---
	{
		key: 'phone',
		jsonPath: PROPERTY('phone'),
		label: 'Property phone',
		section: 'Property — Access & Contact',
		answerType: 'text'
	},
	{
		key: 'mobile_reception',
		jsonPath: PROPERTY('mobile_reception'),
		label: 'Mobile reception quality',
		section: 'Property — Access & Contact',
		answerType: 'number'
	},
	{
		key: 'sign_posted',
		jsonPath: PROPERTY('sign_posted'),
		label: 'Property sign-posted',
		section: 'Property — Access & Contact',
		answerType: 'boolean'
	},
	{
		key: 'truck_access',
		jsonPath: PROPERTY('truck_access'),
		label: 'Truck access',
		section: 'Property — Access & Contact',
		answerType: 'number'
	},
	{
		key: 'truck_access_other_information',
		jsonPath: PROPERTY('truck_access_other_information'),
		label: 'Truck access — other information',
		section: 'Property — Access & Contact',
		answerType: 'text'
	},

	// --- Rental / agent (only when property is rented) ---
	{
		key: 'agent_name',
		jsonPath: AGENT('agent_name'),
		label: 'Managing agent name',
		section: 'Rental / Agent',
		answerType: 'text',
		appliesWhenRented: true
	},
	{
		key: 'agent_mobile',
		jsonPath: AGENT('agent_mobile'),
		label: 'Managing agent mobile',
		section: 'Rental / Agent',
		answerType: 'text',
		appliesWhenRented: true
	},
	{
		key: 'agent_phone',
		jsonPath: AGENT('agent_phone'),
		label: 'Managing agent phone',
		section: 'Rental / Agent',
		answerType: 'text',
		appliesWhenRented: true
	},

	// --- Community questions (per-community, only count when in that community) ---
	...communityQuestions('community_meeting_choices', 'Community meeting preferences', 'choices'),
	...communityQuestions('community_workshop_choices', 'Community workshop preferences', 'choices'),
	...communityQuestions('information_sheet_choices', 'Information sheet preferences', 'choices'),
	...communityQuestions(
		'will_run_community_workshops',
		'Willing to run community workshops',
		'text'
	)
];

/** Fast lookup by key. */
export const PROFILE_FIELD_BY_KEY: ReadonlyMap<string, ProfileFieldDefinition> = new Map(
	PROFILE_FIELD_CATALOG.map((f) => [f.key, f])
);

/**
 * Keys required out of the box, mirroring the previous hardcoded heuristic so
 * behaviour is preserved until an admin changes the configuration. Also used to
 * seed `profile_required_question` in the accompanying migration.
 */
export const DEFAULT_REQUIRED_KEYS: readonly string[] = ['first_name', 'family_name', 'mobile'];
