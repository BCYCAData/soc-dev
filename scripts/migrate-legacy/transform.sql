-- Phase 3 data transform: legacy (old StrengthenOurCommunity prod) -> new public schema.
-- Reads from a `legacy` staging schema (old prod's public source tables, loaded separately)
-- and the already-migrated auth.users (181, UUIDs + password hashes preserved).
-- Re-runnable: truncates the target app tables it owns, then rebuilds. No PII in this file.
--
-- Community rule (validated): match profile address text to an address point, intersect the
-- point with community_areas, most-specific (smallest) area wins; unmatched -> external.
-- Decomposition decisions: stay_in_touch_choices/other_comments -> user_profile only;
-- send_rfs_survival_plan + other_access_information dropped; both user<->property link tables
-- populated; one property_profile per profile (old model is 1 user = 1 home).

begin;

-- 0) Idempotency: clear everything we own. user_profile/property_profile cascade to their FK
--    children; user_roles is listed explicitly because it FKs to auth.users (not user_profile),
--    so the cascade would otherwise miss it and re-runs would hit the (user_id,role) unique key.
truncate public.user_profile, public.property_profile, public.user_roles restart identity cascade;
truncate public.survey_responses;  -- anonymous survey data, unrelated to users

-- 1) Per-user assignment (community + matched address point) into a temp table.
create temp table _asg on commit drop as
with norm as (
  select id,
    upper(regexp_replace(trim(coalesce(property_address_street,'')),'\s+',' ','g')) as street,
    upper(trim(coalesce(property_address_suburb,'')))                              as suburb
  from legacy.profile
),
cand as (
  select n.id, ap.geom, ap.principaladdresssiteoid,
    case when upper(regexp_replace(trim(ap.address),'\s+',' ','g')) = n.street||' '||n.suburb then 1
         when upper(regexp_replace(trim(ap.address),'\s+',' ','g')) like n.street||' %'        then 2
         else 9 end as rnk
  from norm n
  join legacy.address_point_extract_wgs84 ap
    on n.street <> '' and (
         upper(regexp_replace(trim(ap.address),'\s+',' ','g')) = n.street||' '||n.suburb
      or upper(regexp_replace(trim(ap.address),'\s+',' ','g')) like n.street||' %')
),
best as (
  select distinct on (id) id, geom, principaladdresssiteoid from cand order by id, rnk
),
spatial as (
  select b.id, b.geom, b.principaladdresssiteoid,
    (select ca.community from legacy.community_areas ca
     where ca.geom is not null
       and extensions.ST_Intersects(extensions.ST_Transform(b.geom,7844), ca.geom)
     order by extensions.ST_Area(ca.geom) asc limit 1) as legacy_comm
  from best b
)
select
  p.id                          as user_id,
  s.geom                        as geom,
  -- Real GNAF id when the address resolved; otherwise a unique NEGATIVE sentinel (-1, -2, …)
  -- so the user's typed property address still gets a property_profile. Negative = clearly not
  -- a real GNAF principaladdresssiteoid; deterministic across re-runs (ordered by id).
  case when s.principaladdresssiteoid is not null then s.principaladdresssiteoid
       else (- row_number() over (partition by (s.principaladdresssiteoid is null) order by p.id))::bigint
  end                           as psaoid,
  (s.principaladdresssiteoid is not null) as addr_matched,
  coalesce(s.legacy_comm,'Extended') as legacy_comm,
  case coalesce(s.legacy_comm,'Extended')
       when 'BCYCA' then 'bcyca' when 'Mondrook' then 'mondrook'
       when 'Tinonee' then 'tinonee' else 'external' end as slug,
  gen_random_uuid()             as property_id,
  gen_random_uuid()             as community_profile_id
from legacy.profile p
left join spatial s on s.id = p.id;

-- 2) user_profile (parent; carries the per-community profile FK).
insert into public.user_profile
  (id, first_name, family_name, residency_profile, mobile, rfs_survival_plan,
   fire_fighting_experience, fire_trauma, plan_to_leave_before_fire, plan_to_leave_before_flood,
   stay_in_touch_choices, other_comments,
   bcyca_profile_id, mondrook_profile_id, tinonee_profile_id, external_profile_id)
select a.user_id, p.first_name, p.family_name, p.residency_profile, p.mobile, p.rfs_survival_plan,
   p.fire_fighting_experience, p.fire_trauma, p.plan_to_leave_before_fire, p.plan_to_leave_before_flood,
   p.stay_in_touch_choices, p.other_comments,
   case when a.slug='bcyca'    then a.community_profile_id end,
   case when a.slug='mondrook' then a.community_profile_id end,
   case when a.slug='tinonee'  then a.community_profile_id end,
   case when a.slug='external' then a.community_profile_id end
from _asg a join legacy.profile p on p.id = a.user_id;

-- 3) Per-community profile rows (community engagement choices).
insert into public.community_bcyca_profile
  (bcyca_profile_id, community_workshop_choices, other_community_workshop, will_run_community_workshops,
   information_sheet_choices, other_information_sheet, community_meeting_choices, other_community_meeting)
select a.community_profile_id, p.community_workshop_choices, p.other_community_workshop, p.will_run_community_workshops,
   p.information_sheet_choices, p.other_information_sheet, p.community_meeting_choices, p.other_community_meeting
from _asg a join legacy.profile p on p.id = a.user_id where a.slug='bcyca';

insert into public.community_mondrook_profile
  (mondrook_profile_id, community_workshop_choices, other_community_workshop, will_run_community_workshops,
   information_sheet_choices, other_information_sheet, community_meeting_choices, other_community_meeting)
select a.community_profile_id, p.community_workshop_choices, p.other_community_workshop, p.will_run_community_workshops,
   p.information_sheet_choices, p.other_information_sheet, p.community_meeting_choices, p.other_community_meeting
from _asg a join legacy.profile p on p.id = a.user_id where a.slug='mondrook';

insert into public.community_tinonee_profile
  (tinonee_profile_id, community_workshop_choices, other_community_workshop, will_run_community_workshops,
   information_sheet_choices, other_information_sheet, community_meeting_choices, other_community_meeting)
select a.community_profile_id, p.community_workshop_choices, p.other_community_workshop, p.will_run_community_workshops,
   p.information_sheet_choices, p.other_information_sheet, p.community_meeting_choices, p.other_community_meeting
from _asg a join legacy.profile p on p.id = a.user_id where a.slug='tinonee';

insert into public.community_external_profile
  (external_profile_id, community_workshop_choices, other_community_workshop, will_run_community_workshops,
   information_sheet_choices, other_information_sheet, community_meeting_choices, other_community_meeting)
select a.community_profile_id, p.community_workshop_choices, p.other_community_workshop, p.will_run_community_workshops,
   p.information_sheet_choices, p.other_information_sheet, p.community_meeting_choices, p.other_community_meeting
from _asg a join legacy.profile p on p.id = a.user_id where a.slug='external';

-- 4) user_postal_address (only where a postal address exists).
insert into public.user_postal_address (user_id, postal_address_street, postal_address_suburb, postal_address_postcode)
select p.id, p.postal_address_street, p.postal_address_suburb, p.postal_address_postcode
from legacy.profile p
where coalesce(p.postal_address_street,p.postal_address_suburb,p.postal_address_postcode) is not null;

-- 5) user_communities (assigned slug).
insert into public.user_communities (user_id, community_slug)
select a.user_id, a.slug from _asg a;

-- 6) property_profile — one per profile (all 181). Matched users carry their real GNAF
--    principaladdresssiteoid; the 44 unmatched carry a unique negative sentinel so their typed
--    address still survives. Address fields are NOT NULL in the target, so coalesce to ''.
--    community/kyng left null until the new spatial reference data is loaded.
insert into public.property_profile
  (id, property_address_street, property_address_suburb, property_address_postcode, phone, mobile_reception,
   sign_posted, other_essential_assets, residents0_18, residents19_50, residents51_70, residents71_,
   vulnerable_residents, number_birds, number_cats, number_dogs, number_other_pets,
   live_stock_present, live_stock_safe_area, share_livestock_safe_area, static_water_available,
   have_stortz, stortz_size, truck_access, truck_access_other_information,
   fire_fighting_resources, fire_hazard_reduction, site_hazards, other_hazards, other_site_hazards,
   land_adjacent_hazard, property_rented, principaladdresssiteoid)
select a.property_id,
   coalesce(p.property_address_street,''), coalesce(p.property_address_suburb,''), coalesce(p.property_address_postcode,''),
   p.phone, p.mobile_reception,
   p.sign_posted, p.other_essential_assets, p.residents0_18, p.residents19_50, p.residents51_70, p.residents71_,
   p.vulnerable_residents, p.number_birds, p.number_cats, p.number_dogs, p.number_other_pets,
   p.live_stock_present, p.live_stock_safe_area, p.share_livestock_safe_area, p.static_water_available,
   p.have_stortz, p.stortz_size, p.truck_access, p.truck_access_other_information,
   p.fire_fighting_resources, p.fire_hazard_reduction, p.site_hazards, p.other_hazards, p.other_site_hazards,
   p.land_adjacent_hazard, coalesce(p.property_rented,false), a.psaoid
from _asg a join legacy.profile p on p.id = a.user_id;

-- 7) property_agent (any user with agent data).
insert into public.property_agent (property_id, agent_name, agent_mobile, agent_phone)
select a.property_id, p.agent_name, p.agent_mobile, p.agent_phone
from _asg a join legacy.profile p on p.id = a.user_id
where coalesce(p.agent_name,p.agent_mobile,p.agent_phone) is not null;

-- 8) property_geometry intentionally NOT populated: it requires way_point + property geometries
--    (both NOT NULL) that legacy data does not have. Populated later from the new spatial tables.

-- 9) Both user<->property link tables (all users; every profile now has a property).
insert into public.user_properties (user_id, property_id)
select a.user_id, a.property_id from _asg a;

insert into public.user_property_profile_join (user_id, property_id, search_address_street, search_address_suburb)
select a.user_id, a.property_id, p.property_address_street, p.property_address_suburb
from _asg a join legacy.profile p on p.id = a.user_id;

-- 10) Default application role.
insert into public.user_roles (user_id, role)
select a.user_id, 'user'::public.app_role from _asg a;

-- 11) Anonymous survey responses (old prod -> new). Identical columns; survey_id bigint->integer
--     is an implicit assignment cast. Not user-linked (keyed by survey_id / invited uuid).
insert into public.survey_responses (
  "timestamp", email_address, property_address, suburb, mobile, phone, "mobileReception",
  "residencyProfile", "signPosted", "truckAccess", "truckAccessOther", residents0_18, residents19_50,
  residents51_70, residents71_, "vulnerableResidents", "numberDogs", "numberCats", "numberBirds",
  "numberOtherPets", "liveStockPresent", "liveStockSafeArea", "shareLiveStockSafeArea",
  "staticWaterAvailable", "fireFightingResources", "haveStortz", "stortzSize", "explosiveHazards",
  "otherSiteHazards", "fireHazardReduction", "landAdjacentHazard", "otherHazards", "rfsSurvivalPlan",
  "planToLeaveBeforeFire", "planToLeaveBeforeFlood", "fireFightingExperience", "communityWorkshopChoices",
  "otherCommunityWorkshop", "willRunCommunityWorkshops", "communityMeetingChoices", "communityMeeting",
  "informationSheetChoices", "otherInformationSheet", "stayInTouchChoices", "otherComments", survey_id, invited)
select
  "timestamp", email_address, property_address, suburb, mobile, phone, "mobileReception",
  "residencyProfile", "signPosted", "truckAccess", "truckAccessOther", residents0_18, residents19_50,
  residents51_70, residents71_, "vulnerableResidents", "numberDogs", "numberCats", "numberBirds",
  "numberOtherPets", "liveStockPresent", "liveStockSafeArea", "shareLiveStockSafeArea",
  "staticWaterAvailable", "fireFightingResources", "haveStortz", "stortzSize", "explosiveHazards",
  "otherSiteHazards", "fireHazardReduction", "landAdjacentHazard", "otherHazards", "rfsSurvivalPlan",
  "planToLeaveBeforeFire", "planToLeaveBeforeFlood", "fireFightingExperience", "communityWorkshopChoices",
  "otherCommunityWorkshop", "willRunCommunityWorkshops", "communityMeetingChoices", "communityMeeting",
  "informationSheetChoices", "otherInformationSheet", "stayInTouchChoices", "otherComments", survey_id, invited
from legacy.survey_responses;

commit;
