export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address_point_extract_wgs84: {
        Row: {
          address: string | null
          addresspointtype: string | null
          addressstringoid: number | null
          containment: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
        }
        Insert: {
          address?: string | null
          addresspointtype?: string | null
          addressstringoid?: number | null
          containment?: string | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
        }
        Update: {
          address?: string | null
          addresspointtype?: string | null
          addressstringoid?: number | null
          containment?: string | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
        }
        Relationships: []
      }
      agent: {
        Row: {
          agent_mobile: string | null
          agent_name: string | null
          agent_phone: string | null
          created_at: string | null
          last_updated: string | null
          property_id: string
        }
        Insert: {
          agent_mobile?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          created_at?: string | null
          last_updated?: string | null
          property_id: string
        }
        Update: {
          agent_mobile?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          created_at?: string | null
          last_updated?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      app_message: {
        Row: {
          context: Database["public"]["Enums"]["message_context"]
          created_at: string
          id: number
          message: string
          revoked: string | null
          scope: string
        }
        Insert: {
          context?: Database["public"]["Enums"]["message_context"]
          created_at?: string
          id?: number
          message: string
          revoked?: string | null
          scope?: string
        }
        Update: {
          context?: Database["public"]["Enums"]["message_context"]
          created_at?: string
          id?: number
          message?: string
          revoked?: string | null
          scope?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          added_to_project: string | null
          community: string
          created_at: string | null
          geom: unknown | null
          id: string
          streets: string[] | null
          suburbs: string[] | null
        }
        Insert: {
          added_to_project?: string | null
          community: string
          created_at?: string | null
          geom?: unknown | null
          id?: string
          streets?: string[] | null
          suburbs?: string[] | null
        }
        Update: {
          added_to_project?: string | null
          community?: string
          created_at?: string | null
          geom?: unknown | null
          id?: string
          streets?: string[] | null
          suburbs?: string[] | null
        }
        Relationships: []
      }
      kyng_areas: {
        Row: {
          geom: unknown | null
          kyng: string | null
          pkuid: number
        }
        Insert: {
          geom?: unknown | null
          kyng?: string | null
          pkuid: number
        }
        Update: {
          geom?: unknown | null
          kyng?: string | null
          pkuid?: number
        }
        Relationships: []
      }
      property_geometry: {
        Row: {
          address_point: unknown | null
          created_at: string | null
          id: string
          last_updated: string | null
          principaladdresssiteoid: number | null
          property: unknown | null
          way_point: unknown | null
        }
        Insert: {
          address_point?: unknown | null
          created_at?: string | null
          id: string
          last_updated?: string | null
          principaladdresssiteoid?: number | null
          property?: unknown | null
          way_point?: unknown | null
        }
        Update: {
          address_point?: unknown | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          principaladdresssiteoid?: number | null
          property?: unknown | null
          way_point?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "property_geometry_id_fkey"
            columns: ["id"]
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      property_profile: {
        Row: {
          created_at: string | null
          fire_fighting_resources: number[] | null
          fire_hazard_reduction: number[] | null
          have_stortz: string | null
          id: string
          land_adjacent_hazard: string | null
          last_updated: string | null
          live_stock_present: boolean | null
          live_stock_safe_area: string | null
          mobile_reception: number | null
          number_birds: number | null
          number_cats: number | null
          number_dogs: number | null
          number_other_pets: number | null
          other_essential_assets: string | null
          other_hazards: string | null
          other_site_hazards: string | null
          phone: string | null
          principaladdresssiteoid: number
          property_address_postcode: string | null
          property_address_street: string | null
          property_address_suburb: string | null
          property_rented: boolean | null
          residents0_18: number | null
          residents19_50: number | null
          residents51_70: number | null
          residents71_: number | null
          share_livestock_safe_area: string | null
          sign_posted: boolean | null
          site_hazards: number[] | null
          static_water_available: number[] | null
          stortz_size: number | null
          truck_access: number | null
          truck_access_other_information: string | null
          vulnerable_residents: boolean | null
        }
        Insert: {
          created_at?: string | null
          fire_fighting_resources?: number[] | null
          fire_hazard_reduction?: number[] | null
          have_stortz?: string | null
          id?: string
          land_adjacent_hazard?: string | null
          last_updated?: string | null
          live_stock_present?: boolean | null
          live_stock_safe_area?: string | null
          mobile_reception?: number | null
          number_birds?: number | null
          number_cats?: number | null
          number_dogs?: number | null
          number_other_pets?: number | null
          other_essential_assets?: string | null
          other_hazards?: string | null
          other_site_hazards?: string | null
          phone?: string | null
          principaladdresssiteoid: number
          property_address_postcode?: string | null
          property_address_street?: string | null
          property_address_suburb?: string | null
          property_rented?: boolean | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          share_livestock_safe_area?: string | null
          sign_posted?: boolean | null
          site_hazards?: number[] | null
          static_water_available?: number[] | null
          stortz_size?: number | null
          truck_access?: number | null
          truck_access_other_information?: string | null
          vulnerable_residents?: boolean | null
        }
        Update: {
          created_at?: string | null
          fire_fighting_resources?: number[] | null
          fire_hazard_reduction?: number[] | null
          have_stortz?: string | null
          id?: string
          land_adjacent_hazard?: string | null
          last_updated?: string | null
          live_stock_present?: boolean | null
          live_stock_safe_area?: string | null
          mobile_reception?: number | null
          number_birds?: number | null
          number_cats?: number | null
          number_dogs?: number | null
          number_other_pets?: number | null
          other_essential_assets?: string | null
          other_hazards?: string | null
          other_site_hazards?: string | null
          phone?: string | null
          principaladdresssiteoid?: number
          property_address_postcode?: string | null
          property_address_street?: string | null
          property_address_suburb?: string | null
          property_rented?: boolean | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          share_livestock_safe_area?: string | null
          sign_posted?: boolean | null
          site_hazards?: number[] | null
          static_water_available?: number[] | null
          stortz_size?: number | null
          truck_access?: number | null
          truck_access_other_information?: string | null
          vulnerable_residents?: boolean | null
        }
        Relationships: []
      }
      street_list: {
        Row: {
          json_agg: Json | null
        }
        Insert: {
          json_agg?: Json | null
        }
        Update: {
          json_agg?: Json | null
        }
        Relationships: []
      }
      suburb_aliases: {
        Row: {
          aliases: string[]
          created_at: string | null
          id: number
          suburb_name: string
        }
        Insert: {
          aliases: string[]
          created_at?: string | null
          id?: number
          suburb_name: string
        }
        Update: {
          aliases?: string[]
          created_at?: string | null
          id?: number
          suburb_name?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          communityMeeting: string | null
          communityMeetingChoices: Json | null
          communityWorkshopChoices: Json | null
          email_address: string | null
          explosiveHazards: Json | null
          fireFightingExperience: number | null
          fireFightingResources: Json | null
          fireHazardReduction: Json | null
          haveStortz: string | null
          informationSheetChoices: Json | null
          invited: string | null
          landAdjacentHazard: string | null
          liveStockPresent: boolean | null
          liveStockSafeArea: string | null
          mobile: string | null
          mobileReception: number | null
          numberBirds: string | null
          numberCats: string | null
          numberDogs: string | null
          numberOtherPets: string | null
          otherComments: string | null
          otherCommunityWorkshop: string | null
          otherHazards: string | null
          otherInformationSheet: string | null
          otherSiteHazards: string | null
          phone: string | null
          planToLeaveBeforeFire: number | null
          planToLeaveBeforeFlood: number | null
          property_address: string | null
          residencyProfile: number | null
          residents0_18: number | null
          residents19_50: number | null
          residents51_70: number | null
          residents71_: number | null
          rfsSurvivalPlan: string | null
          shareLiveStockSafeArea: string | null
          signPosted: boolean | null
          staticWaterAvailable: Json | null
          stayInTouchChoices: Json | null
          stortzSize: number | null
          suburb: string | null
          survey_id: number
          timestamp: string | null
          truckAccess: number | null
          truckAccessOther: string | null
          vulnerableResidents: string | null
          willRunCommunityWorkshops: string | null
        }
        Insert: {
          communityMeeting?: string | null
          communityMeetingChoices?: Json | null
          communityWorkshopChoices?: Json | null
          email_address?: string | null
          explosiveHazards?: Json | null
          fireFightingExperience?: number | null
          fireFightingResources?: Json | null
          fireHazardReduction?: Json | null
          haveStortz?: string | null
          informationSheetChoices?: Json | null
          invited?: string | null
          landAdjacentHazard?: string | null
          liveStockPresent?: boolean | null
          liveStockSafeArea?: string | null
          mobile?: string | null
          mobileReception?: number | null
          numberBirds?: string | null
          numberCats?: string | null
          numberDogs?: string | null
          numberOtherPets?: string | null
          otherComments?: string | null
          otherCommunityWorkshop?: string | null
          otherHazards?: string | null
          otherInformationSheet?: string | null
          otherSiteHazards?: string | null
          phone?: string | null
          planToLeaveBeforeFire?: number | null
          planToLeaveBeforeFlood?: number | null
          property_address?: string | null
          residencyProfile?: number | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          rfsSurvivalPlan?: string | null
          shareLiveStockSafeArea?: string | null
          signPosted?: boolean | null
          staticWaterAvailable?: Json | null
          stayInTouchChoices?: Json | null
          stortzSize?: number | null
          suburb?: string | null
          survey_id?: number
          timestamp?: string | null
          truckAccess?: number | null
          truckAccessOther?: string | null
          vulnerableResidents?: string | null
          willRunCommunityWorkshops?: string | null
        }
        Update: {
          communityMeeting?: string | null
          communityMeetingChoices?: Json | null
          communityWorkshopChoices?: Json | null
          email_address?: string | null
          explosiveHazards?: Json | null
          fireFightingExperience?: number | null
          fireFightingResources?: Json | null
          fireHazardReduction?: Json | null
          haveStortz?: string | null
          informationSheetChoices?: Json | null
          invited?: string | null
          landAdjacentHazard?: string | null
          liveStockPresent?: boolean | null
          liveStockSafeArea?: string | null
          mobile?: string | null
          mobileReception?: number | null
          numberBirds?: string | null
          numberCats?: string | null
          numberDogs?: string | null
          numberOtherPets?: string | null
          otherComments?: string | null
          otherCommunityWorkshop?: string | null
          otherHazards?: string | null
          otherInformationSheet?: string | null
          otherSiteHazards?: string | null
          phone?: string | null
          planToLeaveBeforeFire?: number | null
          planToLeaveBeforeFlood?: number | null
          property_address?: string | null
          residencyProfile?: number | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          rfsSurvivalPlan?: string | null
          shareLiveStockSafeArea?: string | null
          signPosted?: boolean | null
          staticWaterAvailable?: Json | null
          stayInTouchChoices?: Json | null
          stortzSize?: number | null
          suburb?: string | null
          survey_id?: number
          timestamp?: string | null
          truckAccess?: number | null
          truckAccessOther?: string | null
          vulnerableResidents?: string | null
          willRunCommunityWorkshops?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string | null
          id: number
          willitwork: number[]
        }
        Insert: {
          created_at?: string | null
          id?: number
          willitwork?: number[]
        }
        Update: {
          created_at?: string | null
          id?: number
          willitwork?: number[]
        }
        Relationships: []
      }
      user_bcyca_profile: {
        Row: {
          community_meeting_choices: number[] | null
          community_workshop_choices: number[] | null
          created_at: string | null
          information_sheet_choices: number[] | null
          last_updated: string | null
          other_community_meeting: string | null
          other_community_workshop: string | null
          other_information_sheet: string | null
          user_id: string
          will_run_community_workshops: string | null
        }
        Insert: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          user_id: string
          will_run_community_workshops?: string | null
        }
        Update: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          user_id?: string
          will_run_community_workshops?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bcyca_profile_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_postal_address: {
        Row: {
          created_at: string | null
          last_updated: string | null
          postal_address_postcode: string | null
          postal_address_street: string | null
          postal_address_suburb: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          last_updated?: string | null
          postal_address_postcode?: string | null
          postal_address_street?: string | null
          postal_address_suburb?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          last_updated?: string | null
          postal_address_postcode?: string | null
          postal_address_street?: string | null
          postal_address_suburb?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_postal_address_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profile: {
        Row: {
          created_at: string | null
          family_name: string | null
          fire_fighting_experience: number | null
          fire_trauma: boolean | null
          first_name: string | null
          id: string
          last_updated: string | null
          mobile: string | null
          other_comments: string | null
          plan_to_leave_before_fire: number | null
          plan_to_leave_before_flood: number | null
          residency_profile: number | null
          rfs_survival_plan: string | null
          send_rfs_survival_plan: boolean | null
          sent_rfs_survival_plan: string | null
          stay_in_touch_choices: number[] | null
        }
        Insert: {
          created_at?: string | null
          family_name?: string | null
          fire_fighting_experience?: number | null
          fire_trauma?: boolean | null
          first_name?: string | null
          id: string
          last_updated?: string | null
          mobile?: string | null
          other_comments?: string | null
          plan_to_leave_before_fire?: number | null
          plan_to_leave_before_flood?: number | null
          residency_profile?: number | null
          rfs_survival_plan?: string | null
          send_rfs_survival_plan?: boolean | null
          sent_rfs_survival_plan?: string | null
          stay_in_touch_choices?: number[] | null
        }
        Update: {
          created_at?: string | null
          family_name?: string | null
          fire_fighting_experience?: number | null
          fire_trauma?: boolean | null
          first_name?: string | null
          id?: string
          last_updated?: string | null
          mobile?: string | null
          other_comments?: string | null
          plan_to_leave_before_fire?: number | null
          plan_to_leave_before_flood?: number | null
          residency_profile?: number | null
          rfs_survival_plan?: string | null
          send_rfs_survival_plan?: boolean | null
          sent_rfs_survival_plan?: string | null
          stay_in_touch_choices?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_property_profile_join: {
        Row: {
          created_at: string | null
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_property_profile_join_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_property_profile_join_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      view_survey_as_user_profile: {
        Row: {
          communityMeeting: string | null
          communityMeetingChoices: Json | null
          communityWorkshopChoices: Json | null
          email_address: string | null
          explosiveHazards: Json | null
          fireFightingExperience: number | null
          fireFightingResources: Json | null
          fireHazardReduction: Json | null
          haveStortz: string | null
          informationSheetChoices: Json | null
          invited: string | null
          landAdjacentHazard: string | null
          liveStockPresent: boolean | null
          liveStockSafeArea: string | null
          mobile: string | null
          mobileReception: number | null
          numberBirds: string | null
          numberCats: string | null
          numberDogs: string | null
          numberOtherPets: string | null
          otherComments: string | null
          otherCommunityWorkshop: string | null
          otherHazards: string | null
          otherInformationSheet: string | null
          otherSiteHazards: string | null
          phone: string | null
          planToLeaveBeforeFire: number | null
          planToLeaveBeforeFlood: number | null
          property_address: string | null
          residencyProfile: number | null
          residents0_18: number | null
          residents19_50: number | null
          residents51_70: number | null
          residents71_: number | null
          rfsSurvivalPlan: string | null
          shareLiveStockSafeArea: string | null
          signPosted: boolean | null
          staticWaterAvailable: Json | null
          stayInTouchChoices: Json | null
          stortzSize: number | null
          suburb: string | null
          survey_id: number | null
          timestamp: string | null
          truckAccess: number | null
          truckAccessOther: string | null
          vulnerableResidents: string | null
          willRunCommunityWorkshops: string | null
        }
        Insert: {
          communityMeeting?: string | null
          communityMeetingChoices?: Json | null
          communityWorkshopChoices?: Json | null
          email_address?: string | null
          explosiveHazards?: Json | null
          fireFightingExperience?: number | null
          fireFightingResources?: Json | null
          fireHazardReduction?: Json | null
          haveStortz?: string | null
          informationSheetChoices?: Json | null
          invited?: string | null
          landAdjacentHazard?: string | null
          liveStockPresent?: boolean | null
          liveStockSafeArea?: string | null
          mobile?: string | null
          mobileReception?: number | null
          numberBirds?: string | null
          numberCats?: string | null
          numberDogs?: string | null
          numberOtherPets?: string | null
          otherComments?: string | null
          otherCommunityWorkshop?: string | null
          otherHazards?: string | null
          otherInformationSheet?: string | null
          otherSiteHazards?: string | null
          phone?: string | null
          planToLeaveBeforeFire?: number | null
          planToLeaveBeforeFlood?: number | null
          property_address?: string | null
          residencyProfile?: number | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          rfsSurvivalPlan?: string | null
          shareLiveStockSafeArea?: string | null
          signPosted?: boolean | null
          staticWaterAvailable?: Json | null
          stayInTouchChoices?: Json | null
          stortzSize?: number | null
          suburb?: string | null
          survey_id?: number | null
          timestamp?: string | null
          truckAccess?: number | null
          truckAccessOther?: string | null
          vulnerableResidents?: string | null
          willRunCommunityWorkshops?: string | null
        }
        Update: {
          communityMeeting?: string | null
          communityMeetingChoices?: Json | null
          communityWorkshopChoices?: Json | null
          email_address?: string | null
          explosiveHazards?: Json | null
          fireFightingExperience?: number | null
          fireFightingResources?: Json | null
          fireHazardReduction?: Json | null
          haveStortz?: string | null
          informationSheetChoices?: Json | null
          invited?: string | null
          landAdjacentHazard?: string | null
          liveStockPresent?: boolean | null
          liveStockSafeArea?: string | null
          mobile?: string | null
          mobileReception?: number | null
          numberBirds?: string | null
          numberCats?: string | null
          numberDogs?: string | null
          numberOtherPets?: string | null
          otherComments?: string | null
          otherCommunityWorkshop?: string | null
          otherHazards?: string | null
          otherInformationSheet?: string | null
          otherSiteHazards?: string | null
          phone?: string | null
          planToLeaveBeforeFire?: number | null
          planToLeaveBeforeFlood?: number | null
          property_address?: string | null
          residencyProfile?: number | null
          residents0_18?: number | null
          residents19_50?: number | null
          residents51_70?: number | null
          residents71_?: number | null
          rfsSurvivalPlan?: string | null
          shareLiveStockSafeArea?: string | null
          signPosted?: boolean | null
          staticWaterAvailable?: Json | null
          stayInTouchChoices?: Json | null
          stortzSize?: number | null
          suburb?: string | null
          survey_id?: number | null
          timestamp?: string | null
          truckAccess?: number | null
          truckAccessOther?: string | null
          vulnerableResidents?: string | null
          willRunCommunityWorkshops?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_claim_for_email_array: {
        Args: {
          emails: string[]
          claim: string
        }
        Returns: string
      }
      delete_email_claim: {
        Args: {
          email_input: string
          claim: string
        }
        Returns: string
      }
      extract_addresspoints_wgs1984: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_address_point_extract_wgs84: {
        Args: Record<PropertyKey, never>
        Returns: {
          addresspointtype: string
          geom: unknown
        }[]
      }
      get_addresspoint_from_address: {
        Args: {
          address_text: string
          given_suburb: string
          in_srid_value: number
          out_srid_value: number
        }
        Returns: {
          return_status: number
          valid_address: string
          principaladdresssiteoid: number
          gurasid: number
          addresspoint_geom: unknown
          community: string
          message: string
          housenumber: string
          suburb: string
          postcode: string
        }[]
      }
      get_admin_messages_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: number
          message: string
          created_at: string
        }[]
      }
      get_app_messages: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          context: string
          scope: string
          message: string
          created_at: string
          revoked: string
        }[]
      }
      get_lists: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_members: {
        Args: {
          api_key: string
          list_id: string
        }
        Returns: Json[]
      }
      get_points_geometry: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profile_messages_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: number
          message: string
          created_at: string
        }[]
      }
      get_property_data: {
        Args: {
          principaladdresssiteoid: number
          out_srid_value: number
        }
        Returns: {
          gurasid: number
          waypoint: unknown
          property: unknown
        }[]
      }
      get_property_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: string
          property_address_street: string
          property_address_suburb: string
          property_address_postcode: string
          property_rented: boolean
          phone: string
          mobile_reception: number
          sign_posted: boolean
          other_essential_assets: string
          residents0_18: number
          residents19_50: number
          residents51_70: number
          residents71_: number
          vulnerable_residents: boolean
          number_birds: number
          number_cats: number
          number_dogs: number
          number_other_pets: number
          live_stock_present: boolean
          live_stock_safe_area: string
          share_livestock_safe_area: string
          static_water_available: number[]
          have_stortz: string
          stortz_size: number
          truck_access: number
          truck_access_other_information: string
          fire_fighting_resources: number[]
          fire_hazard_reduction: number[]
          site_hazards: number[]
          other_hazards: string
          other_site_hazards: string
          land_adjacent_hazard: string
          created_at: string
          last_updated: string
        }[]
      }
      get_property_geometry_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: string
          principaladdresssiteoid: number
          address_point: unknown
          way_point: unknown
          property: unknown
          created_at: string
          last_updated: string
        }[]
      }
      get_query_address: {
        Args: {
          address_text: string
          given_suburb: string
        }
        Returns: string
      }
      get_registered_addresspoints: {
        Args: Record<PropertyKey, never>
        Returns: {
          addresspointtype: string
          geom: unknown
        }[]
      }
      get_rfs_property_data_for_street: {
        Args: {
          street_input: string
        }
        Returns: {
          property_id: string
          phone: string
          address: string
          agentinformation: Json
          property: Json
          onsite_hazards: Json
          other_local_hazards: Json
          fire_fighting_assets: Json
          site_animals: Json
          residents: Json[]
        }[]
      }
      get_rfs_user_data_for_porperties: {
        Args: {
          property_ids: string[]
        }
        Returns: {
          user_id: string
          property_id: string
          residents: Json
        }[]
      }
      get_street_list: {
        Args: Record<PropertyKey, never>
        Returns: {
          streets: string
        }[]
      }
      get_suburb_polygon: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_suburbs_geometry: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_tester_messages_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: number
          message: string
          created_at: string
        }[]
      }
      get_user_bcyca_events_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          address: string
          event_choices: number[]
          other_event: string
          created_at: string
        }[]
      }
      get_user_bcyca_information_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          address: string
          informatiion_choices: number[]
          other_information: string
          created_at: string
        }[]
      }
      get_user_bcyca_workshops_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          address: string
          workshop_choices: number[]
          other_wokshop: string
          will_run_wokshop: string
          created_at: string
        }[]
      }
      get_user_sendrfsplan_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          address: string
          created_at: string
        }[]
      }
      get_user_vetting_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          property_address: string
          landline: string
          mobile: string
          unanswered: string
        }[]
      }
      insert_message: {
        Args: {
          message_text: string
          context_text: Database["public"]["Enums"]["message_context"]
          ids?: string
        }
        Returns: number
      }
      jsonb_array_to_smallint_array: {
        Args: {
          _js: Json
        }
        Returns: unknown
      }
      make_kyng_address_points: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      revoke_app_messages: {
        Args: {
          revoked_ids: string[]
        }
        Returns: number
      }
      saveextractedaddresspoints: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      temp: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      temp2: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      temp4: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          geom: unknown
          enddate: string
          gurasid: number
          urbanity: string
          startdate: string
          containment: number
          housenumber: string
          addresspointtype: number
          addressstringoid: number
          principaladdresssiteoid: number
        }[]
      }
      trim_address_suburb: {
        Args: {
          given_suburb: string
        }
        Returns: string
      }
      update_mailchimp_tags: {
        Args: {
          email_address: string
        }
        Returns: undefined
      }
    }
    Enums: {
      message_context: "users" | "admins" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
