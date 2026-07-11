-- Two RFS report data-correctness fixes.
--
-- 1. Street report (get_rfs_property_data_for_street): the 'equipment' field
--    was built from static_water_available — the water-sources column — with
--    fire-equipment labels, so the report showed a relabelled copy of the
--    static water sources instead of the property's firefighting equipment.
--    It now reads fire_fighting_resources (1=Fire trailer, 2=Fire fighting
--    pump, 3=Fire hose, 4=Trailer with spray equipment, 5=Generator, matching
--    fireFightingResourceOptions in src/lib/profile-options.ts). Also fixes a
--    quoting typo in the safe_area CASE: the final branch compared against the
--    literal string 'N or live_stock_safe_area is null', so properties with
--    no safe area and no sharing answer got a JSON null instead of the
--    intended "No livestock safe area identified" status.
--    The function body is otherwise identical to
--    20260711000000_fix_rfs_street_report_trailing_whitespace.sql.

CREATE OR REPLACE FUNCTION public.get_rfs_property_data_for_street(street_input text)
RETURNS TABLE(
	property_id uuid,
	phone text,
	address text,
	agentinformation json,
	property json,
	onsite_hazards json,
	other_local_hazards json,
	fire_fighting_assets json,
	site_animals json,
	residents json[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO '$user', 'public', 'auth', 'extensions'
AS $function$

begin
	return query select
	pp.id as property_id, pp.phone as phone,
	rtrim(ltrim(pp.property_address_street)) || ', ' || rtrim(ltrim(pp.property_address_suburb)) as address,
	case when pp.property_rented = true then
		json_build_object(
			'agentname',
				coalesce(trim(a.agent_name), 'Not Supplied'),
			'agentmobile',
				coalesce(trim(a.agent_mobile), 'Not Supplied'),
			'agentphone',
				coalesce(trim(a.agent_phone), 'Not Supplied')
		)
	end as agentinformation,
	json_build_object(
			'identification',
				case when sign_posted = true then 'Property is well sign-posted and numbered clearly from the road.'
					 else 'Property may be difficult to identify from the road.'
				end,
			'truck_access',
				case when truck_access = 1 then 'All gates are more than 2.5 metres wide.'
					 when truck_access = 2 then 'Most gates are more than 2.5 metres wide.'
					 when truck_access = 3 then 'Restricted by gate width.'
					 when truck_access = 4 then truck_access_other_information
					 else 'Access could be difficult - no information.'
				end,
			'critical_assets',
				case
					when other_essential_assets is null or trim(other_essential_assets) = '' then 'No additional critical assets noted.'
				else
					other_essential_assets
				end,
			'vulnerable',
				case
					when vulnerable_residents = true then 'Vulnerable resident(s) may be present.'
					when vulnerable_residents = false then 'No vulnerable residents flagged.'
					else  'No Information provided'
				end,
			'age_profile', json_build_object(
					'age0_18', residents0_18::text,
					'age19_50', residents19_50::text ,
					'age51_70', residents51_70::text,
					'age71_', residents71_::text
					)
	) as property,
	json_build_object(
			'on_site_hazards',
			json_build_object(
				'Solar_batteries',
				case when site_hazards @> ARRAY[1::smallint] then
						'Present'
					else
						'Not Reported'
					end,
				'Fuel_stores',
				case when site_hazards @> ARRAY[2::smallint] then
						'Present'
					else
						'Not Reported'
					end,
				'Chemical_stores',
				case when site_hazards @> ARRAY[3::smallint] then
						'Present'
					else
						'Not Reported'
					end,
				'Bottled_gas',
				case when site_hazards @> ARRAY[4::smallint] then
						'Present'
					else
						'Not Reported'
					end
			),
			'other_site_hazards',
				case
					when other_site_hazards = '' or other_site_hazards is null then 'None reported'
				else
					other_site_hazards
				end
	) as onsite_hazards,
	json_build_object(
			'land_adjacent_hazard',
				case
					when land_adjacent_hazard = 'Y' then 'Reported Yes'
					when land_adjacent_hazard = 'M' then 'Reported Maybe'
				else
					'Not Reported'
				end,
			'other_local_hazards',
				case
					when other_hazards = '' or other_hazards is null then 'None Reported'
				else
					other_hazards
				end
		) as other_local_hazards,
		json_build_object(
			'static_water',
				case
					when static_water_available  @> ARRAY[5::smallint] then 'None'
				else
					replace(replace(replace(replace(replace(replace(static_water_available::text,'{',''),'}',''),'1','Tank(s)'),'2','Swimming Pool(s)'),'3','Dam(s)'),'4','Creek(s)')
				end,
				'stortz_fitting',
				case
					when have_stortz = 'N' or have_stortz is null then 'None'
					when have_stortz = 'M' then 'Not sure if present on tank(s)'
					when have_stortz = 'Y' then 'Tank has ' || stortz_size::text || ' mm Stortz fitting attached.'
				end,
			'equipment',
				replace(replace(replace(replace(replace(replace(replace(fire_fighting_resources::text,'{',''),'}',''),'1','Fire trailer(s)'),'2','Fire fighting pump(s)'),'3','Fire hose(s)'),'4','Trailer(s) with spray equipment'),'5','Generator'),
			'firebreaks',
				case when fire_hazard_reduction  @> ARRAY[1::smallint] then
						'Present'
					else
						'Not Present'
					end,
			'slashed_apz_s',
				case when fire_hazard_reduction  @> ARRAY[2::smallint] then
						'Present'
					else
						'Not Present'
					end,
			'backup_pump',
				case when fire_hazard_reduction  @> ARRAY[3::smallint] then
						'Present'
					else
						'Not Present'
					end,
			'driveway_overhead_clearance',
				case when fire_hazard_reduction  @> ARRAY[4::smallint] then
						'Present'
					else
						'Not Present'
					end,
			'truck_access_around_property',
				case when fire_hazard_reduction  @> ARRAY[5::smallint] then
						'Available'
					else
						'Not Available'
					end
		) as fire_fighting_assets,
	json_build_object(
			'pets',json_build_object(
				'dogs',
					case when number_dogs > 5 then 'More than 5'
						 else number_dogs::text
					end,
				'cats',
					case when number_cats > 5 then 'More than 5'
						 else number_cats::text
					end,
				'birds',
					case when number_birds > 5 then 'More than 5'
						 else number_birds::text
					end,
				'other_pets',
					case when number_other_pets > 5 then 'More than 5'
						 else number_other_pets::text
					end
			),
			'livestock',
				case
					when live_stock_present = true then
						'Livestock present on property.'
					else 'No livestock reported.'
				end,
			'safe_area',
				case
					when live_stock_safe_area  = 'Y' and share_livestock_safe_area = 'Y' then
					json_build_object(
					 	'status', 'Livestock safe area reported on property.',
					 	'availability', 'Would allow other people to leave their stock in safe area, for a short period in an emergency.'
					)
					when live_stock_safe_area  = 'Y' and share_livestock_safe_area = 'M' then
					json_build_object(
					 	'status', 'Livestock safe area reported on property.',
					 	'availability', 'May allow other people to leave their stock in safe area, for a short period in an emergency.'
					)
					when live_stock_safe_area  = 'Y' and (share_livestock_safe_area = 'N' or share_livestock_safe_area is null) then
					json_build_object(
					 	'status', 'Livestock safe area reported on property.'
					)
					when live_stock_safe_area  = 'M' and share_livestock_safe_area = 'Y' then
					json_build_object(
					 	'status', 'Livestock safe area may exist on property.',
					 	'availability', 'Would allow other people to leave their stock in safe area, for a short period in an emergency.'
					)
					when live_stock_safe_area  = 'M' and share_livestock_safe_area = 'M' then
					json_build_object(
					 	'status', 'Livestock safe area may exist on property.',
					 	'availability', 'May allow other people to leave their stock in safe area, for a short period in an emergency.'
					)
					when live_stock_safe_area  = 'M' and (share_livestock_safe_area = 'N' or share_livestock_safe_area is null) then
					json_build_object(
					 	'status', 'Livestock safe area may exist on property.'
					)
					when (live_stock_safe_area  = 'N' or live_stock_safe_area is null) and share_livestock_safe_area = 'Y' then
					json_build_object(
					 	'status', 'No livestock safe area identified on property.',
					 	'availability', 'If safe area identified, would allow other people to leave their stock in safe area, for a short period in /nan emergency.'
					)
					when (live_stock_safe_area  = 'N' or live_stock_safe_area is null) and share_livestock_safe_area = 'M' then
					json_build_object(
					 	'status', 'No livestock safe area identified on property.',
					 	'availability', 'If safe area identified, may allow other people to leave their stock in safe area, for a short period in /nan emergency.'
					)
					when (live_stock_safe_area  = 'N' or live_stock_safe_area is null) and (share_livestock_safe_area = 'N' or share_livestock_safe_area is null) then
					json_build_object(
					 	'status', 'No livestock safe area identified on property.'
					)
				end
		) as site_animals, r.residents
from public.property_profile pp
left join property_agent a on pp.id = a.property_id
left join
	(
		SELECT uppj.property_id AS id,
		array_agg(
			json_build_object(
				'name',
				case
					when nullif(trim(first_name),'') is null and nullif(trim(family_name),'') is null
						then 'Not Supplied'
					when nullif(trim(first_name),'') is not null and nullif(trim(family_name),'') is not null
						then trim(first_name) || ' ' || trim(family_name)
					else trim(coalesce(trim(first_name),'') || ' ' || coalesce(trim(family_name), ''))
				end,
				'mobile',coalesce(trim(mobile),'Not Supplied'),
				'resident',
				case
					when residency_profile = 1 then 'Resident at the property fulltime'
					when residency_profile = 2 then 'Present large proportion of time'
					when residency_profile = 3 then 'Occasional short periods away'
					when residency_profile = 4 then 'At the property at least every month'
					when residency_profile = 5 then 'At the property occasionally'
					when residency_profile = 6 then 'Resident fulltime with long absences'
					when residency_profile = 7 then 'Not very often at the property'
					else 'No Information Supplied'
				end,
				'survival_plan',
				case
					when rfs_survival_plan  = 'Y' then 'RFS Survival Plan in place'
					when rfs_survival_plan  = 'N' then 'No RFS Survival Plan'
					else 'No Information Supplied'
				end,
				'plan_to_leave',
				case
					when plan_to_leave_before_fire  = 1 then 'Planning on staying'
					when plan_to_leave_before_fire  = 2 then 'Leaving as early as possible'
					when plan_to_leave_before_fire  = 3 then 'Will stay or leave depending on severity'
					else  'No Information Supplied'
				end
			)
		) AS residents
		FROM   user_property_profile_join uppj
		JOIN   user_profile up ON up.id = uppj.user_id
		GROUP  BY uppj.property_id
	) r USING (id)
where upper(rtrim(pp.property_address_street)) like '%' || upper(rtrim(street_input));
end;
$function$;

-- 2. The RFS property report function (get_rfs_user_data_for_porperties —
--    the name typo is historical) has the same equipment bug. Its stored
--    definition differs from the street function only in formatting, so
--    rather than re-stating 13 KB of SQL, swap the column reference inside
--    the equipment replace() chain surgically. Every step is guarded: any
--    unexpected shape aborts the migration instead of corrupting the
--    function, and a re-run detects the fix and skips.
DO $do$
DECLARE
	src     text;
	anchor  int;
	col_end int;
	between text;
	fixed   text;
BEGIN
	SELECT pg_get_functiondef(p.oid) INTO STRICT src
	FROM pg_proc p
	JOIN pg_namespace n ON n.oid = p.pronamespace
	WHERE n.nspname = 'public' AND p.proname = 'get_rfs_user_data_for_porperties';

	anchor := position('''Fire trailer(s)''' in src);
	IF anchor = 0 THEN
		RAISE EXCEPTION 'get_rfs_user_data_for_porperties: equipment label anchor not found';
	END IF;

	-- End position of the last static_water_available occurrence before the
	-- fire-equipment labels (POSIX regexes are greedy and . spans newlines,
	-- so the match runs up to the final occurrence).
	col_end := length(substring(left(src, anchor) from '^.*static_water_available'));
	IF col_end IS NULL THEN
		RAISE EXCEPTION 'get_rfs_user_data_for_porperties: no static_water_available before equipment labels';
	END IF;

	between := substr(src, col_end + 1, anchor - col_end);
	IF between LIKE '%fire_fighting_resources%' THEN
		RAISE NOTICE 'get_rfs_user_data_for_porperties: equipment already reads fire_fighting_resources, skipping';
		RETURN;
	END IF;
	IF between LIKE '%Tank(s)%' THEN
		-- The nearest preceding static_water_available belongs to the
		-- static_water field, not the equipment chain: unexpected shape.
		RAISE EXCEPTION 'get_rfs_user_data_for_porperties: unexpected equipment expression shape';
	END IF;

	fixed := overlay(src placing 'fire_fighting_resources'
	                 from col_end - length('static_water_available') + 1
	                 for length('static_water_available'));

	-- Exactly one occurrence must have been replaced.
	IF (length(src)   - length(replace(src,   'static_water_available', ''))) / length('static_water_available')
	 - (length(fixed) - length(replace(fixed, 'static_water_available', ''))) / length('static_water_available') <> 1 THEN
		RAISE EXCEPTION 'get_rfs_user_data_for_porperties: patch did not replace exactly one occurrence';
	END IF;

	EXECUTE fixed;
END
$do$;
