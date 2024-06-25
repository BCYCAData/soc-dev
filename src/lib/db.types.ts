export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      community_access_requests: {
        Row: {
          created_at: string
          id: number
          last_updated: string
          requested_community_id: string
          status: Database["public"]["Enums"]["community_request_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          last_updated?: string
          requested_community_id: string
          status?: Database["public"]["Enums"]["community_request_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          last_updated?: string
          requested_community_id?: string
          status?: Database["public"]["Enums"]["community_request_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_requests_requested_community_id_fkey"
            columns: ["requested_community_id"]
            isOneToOne: false
            referencedRelation: "community_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_areas: {
        Row: {
          added_to_project: string | null
          community: string
          community_key: string
          coordinator: string | null
          email: string | null
          geom: unknown
          id: string
          last_updated: string | null
          phone: string | null
        }
        Insert: {
          added_to_project?: string | null
          community: string
          community_key: string
          coordinator?: string | null
          email?: string | null
          geom: unknown
          id?: string
          last_updated?: string | null
          phone?: string | null
        }
        Update: {
          added_to_project?: string | null
          community?: string
          community_key?: string
          coordinator?: string | null
          email?: string | null
          geom?: unknown
          id?: string
          last_updated?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      community_bcyca_profile: {
        Row: {
          bcyca_profile_id: string
          community_meeting_choices: number[] | null
          community_workshop_choices: number[] | null
          created_at: string | null
          information_sheet_choices: number[] | null
          last_updated: string | null
          other_comments: string | null
          other_community_meeting: string | null
          other_community_workshop: string | null
          other_information_sheet: string | null
          stay_in_touch_choices: number[] | null
          will_run_community_workshops: string | null
        }
        Insert: {
          bcyca_profile_id: string
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Update: {
          bcyca_profile_id?: string
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_bcyca_profile_bcyca_profile_id_fkey"
            columns: ["bcyca_profile_id"]
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["bcyca_profile_id"]
          },
        ]
      }
      community_external_profile: {
        Row: {
          community_meeting_choices: number[] | null
          community_workshop_choices: number[] | null
          created_at: string | null
          external_profile_id: string
          information_sheet_choices: number[] | null
          last_updated: string | null
          other_comments: string | null
          other_community_meeting: string | null
          other_community_workshop: string | null
          other_information_sheet: string | null
          stay_in_touch_choices: number[] | null
          will_run_community_workshops: string | null
        }
        Insert: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          external_profile_id: string
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Update: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          external_profile_id?: string
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_external_profile_external_profile_id_fkey"
            columns: ["external_profile_id"]
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["external_profile_id"]
          },
        ]
      }
      community_mondrook_profile: {
        Row: {
          community_meeting_choices: number[] | null
          community_workshop_choices: number[] | null
          created_at: string | null
          information_sheet_choices: number[] | null
          last_updated: string | null
          mondrook_profile_id: string
          other_comments: string | null
          other_community_meeting: string | null
          other_community_workshop: string | null
          other_information_sheet: string | null
          stay_in_touch_choices: number[] | null
          will_run_community_workshops: string | null
        }
        Insert: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          mondrook_profile_id?: string
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Update: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          mondrook_profile_id?: string
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          will_run_community_workshops?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_mondrook_profile_mondrook_profile_id_fkey"
            columns: ["mondrook_profile_id"]
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["mondrook_profile_id"]
          },
        ]
      }
      community_request_options_concordance: {
        Row: {
          created_at: string
          field_name: string
          id: number
          last_updated: string
          object_name: string
          table_name: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: number
          last_updated?: string
          object_name: string
          table_name: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: number
          last_updated?: string
          object_name?: string
          table_name?: string
        }
        Relationships: []
      }
      community_request_options_lut: {
        Row: {
          concordance: number
          created_at: string
          id: number
          index_value: number
          lable: string
          last_updated: string
        }
        Insert: {
          concordance: number
          created_at?: string
          id?: number
          index_value: number
          lable: string
          last_updated?: string
        }
        Update: {
          concordance?: number
          created_at?: string
          id?: number
          index_value?: number
          lable?: string
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_community_request_options_lut_concordance_fkey"
            columns: ["concordance"]
            isOneToOne: false
            referencedRelation: "community_request_options_concordance"
            referencedColumns: ["id"]
          },
        ]
      }
      community_tinonee_profile: {
        Row: {
          community_meeting_choices: number[] | null
          community_workshop_choices: number[] | null
          created_at: string | null
          information_sheet_choices: number[] | null
          last_updated: string | null
          other_comments: string | null
          other_community_meeting: string | null
          other_community_workshop: string | null
          other_information_sheet: string | null
          stay_in_touch_choices: number[] | null
          tinonee_profile_id: string
          will_run_community_workshops: string | null
        }
        Insert: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          tinonee_profile_id: string
          will_run_community_workshops?: string | null
        }
        Update: {
          community_meeting_choices?: number[] | null
          community_workshop_choices?: number[] | null
          created_at?: string | null
          information_sheet_choices?: number[] | null
          last_updated?: string | null
          other_comments?: string | null
          other_community_meeting?: string | null
          other_community_workshop?: string | null
          other_information_sheet?: string | null
          stay_in_touch_choices?: number[] | null
          tinonee_profile_id?: string
          will_run_community_workshops?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_tinonee_profile_tinonee_profile_id_fkey"
            columns: ["tinonee_profile_id"]
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["tinonee_profile_id"]
          },
        ]
      }
      custom_address: {
        Row: {
          address: string
          addresspoint_geom: unknown | null
          community: string | null
          createdby: string | null
          enddate: string | null
          id: number
          kyng: string | null
          last_updated: string | null
          postcode: string | null
          principaladdresssiteoid: number | null
          startdate: string | null
          suburb: string | null
        }
        Insert: {
          address: string
          addresspoint_geom?: unknown | null
          community?: string | null
          createdby?: string | null
          enddate?: string | null
          id?: number
          kyng?: string | null
          last_updated?: string | null
          postcode?: string | null
          principaladdresssiteoid?: number | null
          startdate?: string | null
          suburb?: string | null
        }
        Update: {
          address?: string
          addresspoint_geom?: unknown | null
          community?: string | null
          createdby?: string | null
          enddate?: string | null
          id?: number
          kyng?: string | null
          last_updated?: string | null
          postcode?: string | null
          principaladdresssiteoid?: number | null
          startdate?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      geojson: {
        Row: {
          jsonb_agg: Json | null
        }
        Insert: {
          jsonb_agg?: Json | null
        }
        Update: {
          jsonb_agg?: Json | null
        }
        Relationships: []
      }
      kyng_area_users_join: {
        Row: {
          id: string
          kyng_area_id: string
          phone_number: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          id?: string
          kyng_area_id: string
          phone_number?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          id?: string
          kyng_area_id?: string
          phone_number?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_kyng_area_users_kyng_area_id"
            columns: ["kyng_area_id"]
            isOneToOne: false
            referencedRelation: "kyng_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_kyng_area_users_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyng_areas: {
        Row: {
          added_to_project: string | null
          community: string | null
          geom: unknown | null
          id: string
          kyng: string
          last_updated: string | null
        }
        Insert: {
          added_to_project?: string | null
          community?: string | null
          geom?: unknown | null
          id?: string
          kyng: string
          last_updated?: string | null
        }
        Update: {
          added_to_project?: string | null
          community?: string | null
          geom?: unknown | null
          id?: string
          kyng?: string
          last_updated?: string | null
        }
        Relationships: []
      }
      project_addresspoints: {
        Row: {
          address: string | null
          addressconfidence: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringoid: number | null
          addressstringtype: string | null
          addresstype: string | null
          buildingname: string | null
          containment: string | null
          contributoralignment: string | null
          contributorid: string | null
          contributororigin: string | null
          council: string | null
          deliverypointid: number | null
          enddate: string | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          gurasid: number | null
          housenumber: string | null
          id: number
          lastupdate: string | null
          locationdescription: string | null
          officialaddressstringoid: number | null
          postcode: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          propid: number | null
          refresh_date: string | null
          roadname: string | null
          roadside: string | null
          roadsuffix: string | null
          roadtype: string | null
          routeoid: number | null
          ruraladdress: string | null
          sppropid: number | null
          startdate: string | null
          state: string | null
          suburbname: string | null
        }
        Insert: {
          address?: string | null
          addressconfidence?: string | null
          addresspointoid?: number | null
          addresspointtype?: string | null
          addresssitename?: string | null
          addressstringoid?: number | null
          addressstringtype?: string | null
          addresstype?: string | null
          buildingname?: string | null
          containment?: string | null
          contributoralignment?: string | null
          contributorid?: string | null
          contributororigin?: string | null
          council?: string | null
          deliverypointid?: number | null
          enddate?: string | null
          geom?: unknown | null
          gnafprimarysiteid?: number | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          locationdescription?: string | null
          officialaddressstringoid?: number | null
          postcode?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          propid?: number | null
          refresh_date?: string | null
          roadname?: string | null
          roadside?: string | null
          roadsuffix?: string | null
          roadtype?: string | null
          routeoid?: number | null
          ruraladdress?: string | null
          sppropid?: number | null
          startdate?: string | null
          state?: string | null
          suburbname?: string | null
        }
        Update: {
          address?: string | null
          addressconfidence?: string | null
          addresspointoid?: number | null
          addresspointtype?: string | null
          addresssitename?: string | null
          addressstringoid?: number | null
          addressstringtype?: string | null
          addresstype?: string | null
          buildingname?: string | null
          containment?: string | null
          contributoralignment?: string | null
          contributorid?: string | null
          contributororigin?: string | null
          council?: string | null
          deliverypointid?: number | null
          enddate?: string | null
          geom?: unknown | null
          gnafprimarysiteid?: number | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          locationdescription?: string | null
          officialaddressstringoid?: number | null
          postcode?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          propid?: number | null
          refresh_date?: string | null
          roadname?: string | null
          roadside?: string | null
          roadsuffix?: string | null
          roadtype?: string | null
          routeoid?: number | null
          ruraladdress?: string | null
          sppropid?: number | null
          startdate?: string | null
          state?: string | null
          suburbname?: string | null
        }
        Relationships: []
      }
      project_area: {
        Row: {
          last_updated: string | null
          ogc_fid: number
          wkb_geometry: unknown | null
        }
        Insert: {
          last_updated?: string | null
          ogc_fid?: number
          wkb_geometry?: unknown | null
        }
        Update: {
          last_updated?: string | null
          ogc_fid?: number
          wkb_geometry?: unknown | null
        }
        Relationships: []
      }
      project_properties: {
        Row: {
          address: string | null
          addressstringoid: number | null
          dissolveparcelcount: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          propertyoid: number | null
          propertytype: string | null
          propid: number | null
          refresh_date: string | null
          startdate: string | null
          superlot: string | null
          valnetlotcount: number | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Insert: {
          address?: string | null
          addressstringoid?: number | null
          dissolveparcelcount?: number | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          propertyoid?: number | null
          propertytype?: string | null
          propid?: number | null
          refresh_date?: string | null
          startdate?: string | null
          superlot?: string | null
          valnetlotcount?: number | null
          valnetpropertystatus?: string | null
          valnetpropertytype?: string | null
        }
        Update: {
          address?: string | null
          addressstringoid?: number | null
          dissolveparcelcount?: number | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          propertyoid?: number | null
          propertytype?: string | null
          propid?: number | null
          refresh_date?: string | null
          startdate?: string | null
          superlot?: string | null
          valnetlotcount?: number | null
          valnetpropertystatus?: string | null
          valnetpropertytype?: string | null
        }
        Relationships: []
      }
      project_proways: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          startdate: string | null
          waypointoid: number | null
        }
        Insert: {
          addresspointoid?: number | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          prowayoid?: number | null
          refresh_date?: string | null
          roadside?: string | null
          startdate?: string | null
          waypointoid?: number | null
        }
        Update: {
          addresspointoid?: number | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          prowayoid?: number | null
          refresh_date?: string | null
          roadside?: string | null
          startdate?: string | null
          waypointoid?: number | null
        }
        Relationships: []
      }
      project_waypoints: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Insert: {
          address?: string | null
          addresspointoid?: number | null
          addressstringoid?: number | null
          contributorid?: string | null
          contributororigin?: string | null
          derivedby?: string | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          refresh_date?: string | null
          roadnameextentoid?: number | null
          startdate?: string | null
          waypointoid?: number | null
        }
        Update: {
          address?: string | null
          addresspointoid?: number | null
          addressstringoid?: number | null
          contributorid?: string | null
          contributororigin?: string | null
          derivedby?: string | null
          enddate?: string | null
          geom?: unknown | null
          gurasid?: number | null
          housenumber?: string | null
          id?: number
          lastupdate?: string | null
          principaladdresssiteoid?: number | null
          principaladdresstype?: string | null
          refresh_date?: string | null
          roadnameextentoid?: number | null
          startdate?: string | null
          waypointoid?: number | null
        }
        Relationships: []
      }
      property_agent: {
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
            foreignKeyName: "property_agent_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      property_geometry: {
        Row: {
          address_point: unknown
          created_at: string
          id: string
          last_updated: string
          principaladdresssiteoid: number
          property: unknown
          way_point: unknown
        }
        Insert: {
          address_point: unknown
          created_at?: string
          id: string
          last_updated?: string
          principaladdresssiteoid: number
          property: unknown
          way_point: unknown
        }
        Update: {
          address_point?: unknown
          created_at?: string
          id?: string
          last_updated?: string
          principaladdresssiteoid?: number
          property?: unknown
          way_point?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "property_geometry_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      property_profile: {
        Row: {
          community: string | null
          created_at: string | null
          fire_fighting_resources: number[] | null
          fire_hazard_reduction: number[] | null
          have_stortz: string | null
          id: string
          kyng: string | null
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
          property_address_postcode: string
          property_address_street: string
          property_address_suburb: string
          property_rented: boolean
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
          community?: string | null
          created_at?: string | null
          fire_fighting_resources?: number[] | null
          fire_hazard_reduction?: number[] | null
          have_stortz?: string | null
          id: string
          kyng?: string | null
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
          property_address_postcode: string
          property_address_street: string
          property_address_suburb: string
          property_rented?: boolean
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
          community?: string | null
          created_at?: string | null
          fire_fighting_resources?: number[] | null
          fire_hazard_reduction?: number[] | null
          have_stortz?: string | null
          id?: string
          kyng?: string | null
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
          property_address_postcode?: string
          property_address_street?: string
          property_address_suburb?: string
          property_rented?: boolean
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
        Relationships: [
          {
            foreignKeyName: "property_profile_community_fkey"
            columns: ["community"]
            isOneToOne: false
            referencedRelation: "community_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_profile_kyng_fkey"
            columns: ["kyng"]
            isOneToOne: false
            referencedRelation: "kyng_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      property_result: {
        Row: {
          jsonb_agg: Json | null
        }
        Insert: {
          jsonb_agg?: Json | null
        }
        Update: {
          jsonb_agg?: Json | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission?: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: string | null
          role?: Database["public"]["Enums"]["app_role"]
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
      street_type_aliases: {
        Row: {
          abbreviation: string
          created_at: string | null
          id: number
          street_type: string
        }
        Insert: {
          abbreviation: string
          created_at?: string | null
          id?: number
          street_type: string
        }
        Update: {
          abbreviation?: string
          created_at?: string | null
          id?: number
          street_type?: string
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
            isOneToOne: true
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          bcyca_profile_id: string | null
          created_at: string | null
          external_profile_id: string | null
          family_name: string | null
          fire_fighting_experience: number | null
          fire_trauma: boolean | null
          first_name: string | null
          id: string
          last_updated: string | null
          mobile: string | null
          mondrook_profile_id: string | null
          other_comments: string | null
          plan_to_leave_before_fire: number | null
          plan_to_leave_before_flood: number | null
          residency_profile: number | null
          rfs_survival_plan: string | null
          stay_in_touch_choices: number[] | null
          tinonee_profile_id: string | null
        }
        Insert: {
          bcyca_profile_id?: string | null
          created_at?: string | null
          external_profile_id?: string | null
          family_name?: string | null
          fire_fighting_experience?: number | null
          fire_trauma?: boolean | null
          first_name?: string | null
          id: string
          last_updated?: string | null
          mobile?: string | null
          mondrook_profile_id?: string | null
          other_comments?: string | null
          plan_to_leave_before_fire?: number | null
          plan_to_leave_before_flood?: number | null
          residency_profile?: number | null
          rfs_survival_plan?: string | null
          stay_in_touch_choices?: number[] | null
          tinonee_profile_id?: string | null
        }
        Update: {
          bcyca_profile_id?: string | null
          created_at?: string | null
          external_profile_id?: string | null
          family_name?: string | null
          fire_fighting_experience?: number | null
          fire_trauma?: boolean | null
          first_name?: string | null
          id?: string
          last_updated?: string | null
          mobile?: string | null
          mondrook_profile_id?: string | null
          other_comments?: string | null
          plan_to_leave_before_fire?: number | null
          plan_to_leave_before_flood?: number | null
          residency_profile?: number | null
          rfs_survival_plan?: string | null
          stay_in_touch_choices?: number[] | null
          tinonee_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_property_profile_join: {
        Row: {
          created_at: string | null
          last_updated: string | null
          property_id: string
          rel_id: string
          search_address_street: string | null
          search_address_suburb: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          last_updated?: string | null
          property_id: string
          rel_id?: string
          search_address_street?: string | null
          search_address_suburb?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          last_updated?: string | null
          property_id?: string
          rel_id?: string
          search_address_street?: string | null
          search_address_suburb?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_property_profile_join_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_property_profile_join_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      kyng_abbots_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_abbots_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_abbots_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_abbots_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_beaully_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_beaully_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_beaully_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_beaully_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_dam_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_dam_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bootawa_dam_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_dam_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_north_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_north_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bootawa_road_north_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_north_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_south_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_south_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bootawa_road_south_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bootawa_road_south_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_east_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_east_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bucketts_way_east_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_east_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_south_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_south_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bucketts_way_south_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bucketts_way_south_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bull_hill_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_bull_hill_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_bull_hill_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_bull_hill_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_south_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_south_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_careys_road_south_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_south_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_wills_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_wills_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_careys_road_wills_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_careys_road_wills_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_clarkes_road_bunyarra_place_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_clarkes_road_bunyarra_place_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_clarkes_road_bunyarra_place_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_clarkes_road_bunyarra_place_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_gloucester_road_riverford_road_bo_bo_creek_road_addresspoi: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_gloucester_road_riverford_road_bo_bo_creek_road_property_v: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_gloucester_road_riverford_road_bo_bo_creek_road_proway_vie: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_gloucester_road_riverford_road_bo_bo_creek_road_waypoint_v: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_marylands_close_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_marylands_close_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_hillville_road_marylands_close_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_marylands_close_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_sunshine_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_sunshine_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_hillville_road_sunshine_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_hillville_road_sunshine_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_pine_tree_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_pine_tree_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_pine_tree_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_pine_tree_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_somerset_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_somerset_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_somerset_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_kimbriki_road_somerset_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_mondrook_lane_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_mondrook_lane_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_mondrook_lane_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_mondrook_lane_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_moores_road_west_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_moores_road_west_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_moores_road_west_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_moores_road_west_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_mulligans_lane_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_mulligans_lane_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_mulligans_lane_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_mulligans_lane_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_red_gully_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_red_gully_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_red_gully_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_red_gully_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_saxbys_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_saxbys_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_saxbys_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_saxbys_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_stony_creek_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_stony_creek_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_stony_creek_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_stony_creek_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_the_bight_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_the_bight_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_the_bight_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_the_bight_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_alpine_drive_ridge_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_alpine_drive_ridge_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_tinonee_road_alpine_drive_ridge_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_alpine_drive_ridge_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_bishops_lane_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_bishops_lane_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_tinonee_road_bishops_lane_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_tinonee_road_bishops_lane_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_urray_road_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_urray_road_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_urray_road_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_urray_road_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_view_place_addresspoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addresspointtype: string | null
          addresssitename: string | null
          addressstringtype: string | null
          addresstype: string | null
          contributoralignment: string | null
          contributororigin: string | null
          deliverypointid: number | null
          geom: unknown | null
          gnafprimarysiteid: number | null
          housenumber: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          roadside: string | null
          rowid: number | null
        }
        Relationships: []
      }
      kyng_view_place_property_view: {
        Row: {
          address: string | null
          address_count: number | null
          alternate_addresses: string | null
          geom: unknown | null
          gurasid: number | null
          principaladdresstype: string | null
          rowid: number | null
          secondary_addresses: string | null
          valnetpropertystatus: string | null
          valnetpropertytype: string | null
        }
        Relationships: []
      }
      kyng_view_place_proway_view: {
        Row: {
          addresspointoid: number | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          prowayoid: number | null
          refresh_date: string | null
          roadside: string | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
      kyng_view_place_waypoint_view: {
        Row: {
          address: string | null
          addresspointoid: number | null
          addressstringoid: number | null
          contributorid: string | null
          contributororigin: string | null
          derivedby: string | null
          enddate: string | null
          geom: unknown | null
          gurasid: number | null
          housenumber: string | null
          id: number | null
          lastupdate: string | null
          principaladdresssiteoid: number | null
          principaladdresstype: string | null
          refresh_date: string | null
          roadnameextentoid: number | null
          rowid: number | null
          startdate: string | null
          waypointoid: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_community_bcyca_profile: {
        Args: {
          user_id_param: string
        }
        Returns: undefined
      }
      add_community_external_profile: {
        Args: {
          user_id_param: string
        }
        Returns: undefined
      }
      add_community_mondrook_profile: {
        Args: {
          user_id_param: string
        }
        Returns: undefined
      }
      add_community_tinonee_profile: {
        Args: {
          user_id_param: string
        }
        Returns: undefined
      }
      check_address_match: {
        Args: {
          delimited_string: string
        }
        Returns: {
          id: number
          address: string
          community: string
          principaladdresssiteoid: number
          startdate: string
          enddate: string
          lastupdate: string
          createdby: string
        }[]
      }
      create_kyngs_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
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
      dev_process_kyng_areas: {
        Args: Record<PropertyKey, never>
        Returns: {
          principaladdresssiteoid: number
          addressstringoid: number
          gurasid: number
          addresspointtype: string
          containment: string
          urbanity: string
          lastupdate: string
          enddate: string
          address: string
          housenumber: string
          geom: unknown
        }[]
      }
      extract_addresspoints: {
        Args: {
          rings_geometry: string
        }
        Returns: undefined
      }
      extract_properties: {
        Args: {
          rings_geometry: string
        }
        Returns: undefined
      }
      extract_proways: {
        Args: {
          rings_geometry: string
        }
        Returns: undefined
      }
      extract_waypoints: {
        Args: {
          rings_geometry: string
        }
        Returns: undefined
      }
      find_functions_with_string: {
        Args: {
          search_string: string
        }
        Returns: string[]
      }
      first_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_custom_geojson_features: {
        Args: {
          input_id: string
          addresspointfeaturestyle: string
          waypointfeaturestyle: string
          propertyfeaturestyle: string
        }
        Returns: Json
      }
      get_address_point_extract: {
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
          out_srid_value: number
          api_key: string
        }
        Returns: {
          status: number
          searchaddressstreet: string
          searchaddresssuburb: string
          validaddressstreet: string
          validaddresssuburb: string
          validaddresspostcode: string
          principaladdresssiteoid: number
          community: string
          kyng: string
        }[]
      }
      get_addresspoints_by_area:
        | {
            Args: {
              kyng_area_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              kyng_area_id: string
            }
            Returns: Json
          }
      get_addresspoints_geojson: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      get_geojson: {
        Args: {
          uuid: string
        }
        Returns: Json
      }
      get_geometry_info_html: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_kyng_coordinator_messages_for_user: {
        Args: {
          id_input: string
        }
        Returns: {
          id: number
          message: string
          created_at: string
        }[]
      }
      get_kyngs_geojson: {
        Args: {
          uuid: string
        }
        Returns: Json
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
      get_new_users_confirmed_without_address: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          email_confirmed_at: string
          last_sign_in_at: string
          principaladdresssiteoid: number
          address: string
        }[]
      }
      get_new_users_confirmed_without_kits: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          first_name: string
          family_name: string
          property_address_street: string
          property_address_suburb: string
          email_confirmed_at: string
          landline: string
          mobile: string
          unanswered: string
        }[]
      }
      get_new_users_unconfirmed: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          applied_at: string
          address: string
        }[]
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
      get_user_external_events_data: {
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
      get_user_external_information_data: {
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
      get_user_external_workshops_data: {
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
      get_user_mondrook_events_data: {
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
      get_user_mondrook_information_data: {
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
      get_user_mondrook_workshops_data: {
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
      get_user_tinonee_events_data: {
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
      get_user_tinonee_information_data: {
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
      get_user_tinonee_workshops_data: {
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
        Returns: number[]
      }
      make_kyng_address_points: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      new_custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      process_downloads: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_kyng_areas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      read_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
      revoke_app_messages: {
        Args: {
          revoked_ids: string[]
        }
        Returns: number
      }
      save_first_function: {
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
      validate_street_address: {
        Args: {
          input_address: string
        }
        Returns: string
      }
      x_get_addresspoint_from_address: {
        Args: {
          address_text: string
          given_suburb: string
          valid_address_postcode: string
          out_srid_value: number
          api_key: string
        }
        Returns: {
          status: number
          searchaddressstreet: string
          searchaddresssuburb: string
          validaddressstreet: string
          validaddresssuburb: string
          validaddresspostcode: string
          principaladdresssiteoid: number
          community: string
          kyng: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "admin_site"
        | "admin_site_messages"
        | "admin_site_roles"
        | "admin_users"
        | "admin_users_newusers"
        | "admin_users_kits"
        | "admin_emergency"
        | "admin_emergency_reports"
        | "admin_emergency_ servicemap"
        | "admin_communities"
        | "admin_bcyca"
        | "admin_bcyca_events"
        | "admin_bcyca_information"
        | "admin_bcyca_workshops"
        | "admin_mondrook"
        | "admin_mondrook_events"
        | "admin_mondrook_information"
        | "admin_mondrook_workshops"
        | "admin_tinonee"
        | "admin_tinonee_events"
        | "admin_tinonee_information"
        | "admin_tinonee_workshops"
        | "admin_external"
        | "admin_external_events"
        | "admin_external_information"
        | "admin_external_workshops"
        | "kyng"
      community_request_status: "pending" | "approved" | "rejected"
      message_context: "users" | "admins" | "both" | "kyngs"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
