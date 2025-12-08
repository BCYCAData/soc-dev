export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      address_response: {
        Row: {
          content: Json | null
        }
        Insert: {
          content?: Json | null
        }
        Update: {
          content?: Json | null
        }
        Relationships: []
      }
      address_validation_errors: {
        Row: {
          client_ip: unknown
          created_at: string | null
          error_details: Json | null
          error_message: string
          error_type: string | null
          id: number
          metadata: Json | null
          request_id: string | null
          search_address_street: string
          search_address_suburb: string
          user_agent: string | null
          user_id: string | null
          validation_status: number | null
        }
        Insert: {
          client_ip?: unknown
          created_at?: string | null
          error_details?: Json | null
          error_message: string
          error_type?: string | null
          id?: number
          metadata?: Json | null
          request_id?: string | null
          search_address_street: string
          search_address_suburb: string
          user_agent?: string | null
          user_id?: string | null
          validation_status?: number | null
        }
        Update: {
          client_ip?: unknown
          created_at?: string | null
          error_details?: Json | null
          error_message?: string
          error_type?: string | null
          id?: number
          metadata?: Json | null
          request_id?: string | null
          search_address_street?: string
          search_address_suburb?: string
          user_agent?: string | null
          user_id?: string | null
          validation_status?: number | null
        }
        Relationships: []
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
          option_id: number | null
          table_name: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: number
          last_updated?: string
          object_name: string
          option_id?: number | null
          table_name: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: number
          last_updated?: string
          object_name?: string
          option_id?: number | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_request_options_concordance_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "community_request_options_lut"
            referencedColumns: ["id"]
          },
        ]
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
      coordinates_kyng: {
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
      custom_address: {
        Row: {
          address: string
          addresspoint_geom: unknown
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
          addresspoint_geom?: unknown
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
          addresspoint_geom?: unknown
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
      failed_login_attempts: {
        Row: {
          attempted_at: string | null
          auth_user_id: string | null
          auth_user_role: string | null
          email: string
          error_message: string | null
          error_type: string | null
          id: number
          ip_address: unknown
        }
        Insert: {
          attempted_at?: string | null
          auth_user_id?: string | null
          auth_user_role?: string | null
          email: string
          error_message?: string | null
          error_type?: string | null
          id?: number
          ip_address?: unknown
        }
        Update: {
          attempted_at?: string | null
          auth_user_id?: string | null
          auth_user_role?: string | null
          email?: string
          error_message?: string | null
          error_type?: string | null
          id?: number
          ip_address?: unknown
        }
        Relationships: []
      }
      feature_attributes: {
        Row: {
          feature_id: string
          field_id: string
          id: string
          last_edited: string | null
          value: string | null
        }
        Insert: {
          feature_id: string
          field_id: string
          id?: string
          last_edited?: string | null
          value?: string | null
        }
        Update: {
          feature_id?: string
          field_id?: string
          id?: string
          last_edited?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_attributes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "categorized_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_attributes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_details"
            referencedColumns: ["feature_id"]
          },
          {
            foreignKeyName: "feature_attributes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "spatial_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_attributes_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "template_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_templates: {
        Row: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at: string | null
          description: string | null
          geometry_type: Database["public"]["Enums"]["geometry_type"]
          id: string
          is_active: boolean | null
          last_edited: string | null
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          geometry_type: Database["public"]["Enums"]["geometry_type"]
          id?: string
          is_active?: boolean | null
          last_edited?: string | null
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          geometry_type?: Database["public"]["Enums"]["geometry_type"]
          id?: string
          is_active?: boolean | null
          last_edited?: string | null
          name?: string
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
      health_status: {
        Row: {
          id: number
          last_check: string | null
        }
        Insert: {
          id?: number
          last_check?: string | null
        }
        Update: {
          id?: number
          last_check?: string | null
        }
        Relationships: []
      }
      kyng_area_users_join: {
        Row: {
          admin_user_id: string
          end_date: string | null
          id: string
          kyng_area_id: string
          phone_number: string | null
          start_date: string
          updated_at: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          admin_user_id: string
          end_date?: string | null
          id?: string
          kyng_area_id: string
          phone_number?: string | null
          start_date?: string
          updated_at?: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          admin_user_id?: string
          end_date?: string | null
          id?: string
          kyng_area_id?: string
          phone_number?: string | null
          start_date?: string
          updated_at?: string
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
        ]
      }
      kyng_areas: {
        Row: {
          added_to_project: string | null
          community: string | null
          geom: unknown
          id: string
          kyng: string
          last_updated: string | null
        }
        Insert: {
          added_to_project?: string | null
          community?: string | null
          geom?: unknown
          id?: string
          kyng: string
          last_updated?: string | null
        }
        Update: {
          added_to_project?: string | null
          community?: string | null
          geom?: unknown
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
          geom: unknown
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
          geom?: unknown
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
          geom?: unknown
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
          area_sqkm: number | null
          geom: unknown
          id: number
          kyng_count: number
          last_generated: string | null
          rings_text: string
        }
        Insert: {
          area_sqkm?: number | null
          geom: unknown
          id?: number
          kyng_count: number
          last_generated?: string | null
          rings_text: string
        }
        Update: {
          area_sqkm?: number | null
          geom?: unknown
          id?: number
          kyng_count?: number
          last_generated?: string | null
          rings_text?: string
        }
        Relationships: []
      }
      project_area_log: {
        Row: {
          area_sqkm: number | null
          error: string | null
          error_detail: string | null
          generated_at: string | null
          id: number
          kyng_areas_count: number | null
          rings_geometry: string | null
          success: boolean
        }
        Insert: {
          area_sqkm?: number | null
          error?: string | null
          error_detail?: string | null
          generated_at?: string | null
          id?: number
          kyng_areas_count?: number | null
          rings_geometry?: string | null
          success: boolean
        }
        Update: {
          area_sqkm?: number | null
          error?: string | null
          error_detail?: string | null
          generated_at?: string | null
          id?: number
          kyng_areas_count?: number | null
          rings_geometry?: string | null
          success?: boolean
        }
        Relationships: []
      }
      project_properties: {
        Row: {
          address: string | null
          addressstringoid: number | null
          dissolveparcelcount: number | null
          enddate: string | null
          geom: unknown
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
          geom?: unknown
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
          geom?: unknown
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
          geom: unknown
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
          geom?: unknown
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
          geom?: unknown
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
          geom: unknown
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
          geom?: unknown
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
          geom?: unknown
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
      signin_errors: {
        Row: {
          client_ip: unknown
          created_at: string | null
          email: string
          error_details: Json | null
          error_message: string
          error_type: string
          http_status: number
          id: number
          metadata: Json | null
          request_id: string | null
          user_agent: string | null
        }
        Insert: {
          client_ip?: unknown
          created_at?: string | null
          email: string
          error_details?: Json | null
          error_message: string
          error_type: string
          http_status: number
          id?: number
          metadata?: Json | null
          request_id?: string | null
          user_agent?: string | null
        }
        Update: {
          client_ip?: unknown
          created_at?: string | null
          email?: string
          error_details?: Json | null
          error_message?: string
          error_type?: string
          http_status?: number
          id?: number
          metadata?: Json | null
          request_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      signup_errors: {
        Row: {
          client_ip: unknown
          created_at: string | null
          email: string
          error_details: Json | null
          error_message: string
          error_type: string
          http_status: number
          id: number
          metadata: Json | null
          request_id: string | null
          user_agent: string | null
        }
        Insert: {
          client_ip?: unknown
          created_at?: string | null
          email: string
          error_details?: Json | null
          error_message: string
          error_type: string
          http_status: number
          id?: number
          metadata?: Json | null
          request_id?: string | null
          user_agent?: string | null
        }
        Update: {
          client_ip?: unknown
          created_at?: string | null
          email?: string
          error_details?: Json | null
          error_message?: string
          error_type?: string
          http_status?: number
          id?: number
          metadata?: Json | null
          request_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      spatial_data_audit: {
        Row: {
          application_name: string | null
          changed_at: string
          client_ip: unknown
          db_user: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          application_name?: string | null
          changed_at?: string
          client_ip?: unknown
          db_user?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          application_name?: string | null
          changed_at?: string
          client_ip?: unknown
          db_user?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      spatial_features: {
        Row: {
          created_at: string | null
          geom: unknown
          id: string
          last_edited: string | null
          property_id: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          geom: unknown
          id?: string
          last_edited?: string | null
          property_id: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          geom?: unknown
          id?: string
          last_edited?: string | null
          property_id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spatial_features_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spatial_features_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "feature_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spatial_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valid_user_property"
            columns: ["user_id", "property_id"]
            isOneToOne: false
            referencedRelation: "user_property_profile_join"
            referencedColumns: ["user_id", "property_id"]
          },
        ]
      }
      spatial_refresh_log: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          error_message: string | null
          id: number
          record_counts: Json | null
          result: Json | null
          started_at: string
          success: boolean | null
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: number
          record_counts?: Json | null
          result?: Json | null
          started_at?: string
          success?: boolean | null
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: number
          record_counts?: Json | null
          result?: Json | null
          started_at?: string
          success?: boolean | null
          triggered_by?: string | null
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
      template_fields: {
        Row: {
          default_value: string | null
          display_order: number
          field_name: string
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          required: boolean | null
          template_id: string
          validation_rules: string | null
        }
        Insert: {
          default_value?: string | null
          display_order: number
          field_name: string
          field_type: Database["public"]["Enums"]["field_type"]
          id?: string
          required?: boolean | null
          template_id: string
          validation_rules?: string | null
        }
        Update: {
          default_value?: string | null
          display_order?: number
          field_name?: string
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          required?: boolean | null
          template_id?: string
          validation_rules?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "feature_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_communities: {
        Row: {
          community_slug: string
          created_at: string
          user_id: string
        }
        Insert: {
          community_slug: string
          created_at?: string
          user_id: string
        }
        Update: {
          community_slug?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_communities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          permission: string
          user_id: string
        }
        Insert: {
          permission: string
          user_id: string
        }
        Update: {
          permission?: string
          user_id?: string
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
        Relationships: []
      }
      user_properties: {
        Row: {
          created_at: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
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
      user_role: {
        Row: {
          role: string | null
        }
        Insert: {
          role?: string | null
        }
        Update: {
          role?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      user_roles_primary: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      x_project_area: {
        Row: {
          last_updated: string | null
          ogc_fid: number
          wkb_geometry: unknown
        }
        Insert: {
          last_updated?: string | null
          ogc_fid?: number
          wkb_geometry?: unknown
        }
        Update: {
          last_updated?: string | null
          ogc_fid?: number
          wkb_geometry?: unknown
        }
        Relationships: []
      }
    }
    Views: {
      categorized_features: {
        Row: {
          category: Database["public"]["Enums"]["feature_category"] | null
          created_at: string | null
          feature_type: string | null
          geom: unknown
          geometry_type: Database["public"]["Enums"]["geometry_type"] | null
          id: string | null
          last_edited: string | null
          property_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spatial_features_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spatial_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valid_user_property"
            columns: ["user_id", "property_id"]
            isOneToOne: false
            referencedRelation: "user_property_profile_join"
            referencedColumns: ["user_id", "property_id"]
          },
        ]
      }
      feature_details: {
        Row: {
          attributes: Json | null
          category: Database["public"]["Enums"]["feature_category"] | null
          created_at: string | null
          feature_id: string | null
          feature_type: string | null
          geom: unknown
          geometry_type: Database["public"]["Enums"]["geometry_type"] | null
          last_edited: string | null
          property_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spatial_features_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spatial_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valid_user_property"
            columns: ["user_id", "property_id"]
            isOneToOne: false
            referencedRelation: "user_property_profile_join"
            referencedColumns: ["user_id", "property_id"]
          },
        ]
      }
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
          geom: unknown
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
        Args: { user_id_param: string }
        Returns: undefined
      }
      add_community_external_profile: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      add_community_mondrook_profile: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      add_community_tinonee_profile: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      add_kyng_area_user:
        | {
            Args: {
              p_admin_user_id: string
              p_kyng_area_id: string
              p_phone_number: string
              p_user_id: string
              p_user_name: string
            }
            Returns: string
          }
        | {
            Args: {
              p_kyng_area_id: string
              p_phone_number?: string
              p_user_id: string
              p_user_name?: string
            }
            Returns: string
          }
      add_role_to_enum: { Args: { new_role: string }; Returns: undefined }
      build_parcel_polygon: {
        Args: { input_text: string; max_features?: number }
        Returns: Json
      }
      check_address_match: {
        Args: { delimited_string: string }
        Returns: {
          address: string
          community: string
          createdby: string
          enddate: string
          id: number
          lastupdate: string
          principaladdresssiteoid: number
          startdate: string
        }[]
      }
      check_admin_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      check_gnaf_address_match: {
        Args: {
          api_key: string
          input_locality: string
          input_number: string
          input_street: string
          input_street_type: string
        }
        Returns: Json
      }
      cleanup_orphaned_attributes: { Args: never; Returns: number }
      cleanup_orphaned_spatial_features: { Args: never; Returns: number }
      create_kyngs_views: { Args: never; Returns: undefined }
      create_property_for_user: {
        Args: {
          user_id: string
          var_principaladdresssiteoid: number
          var_search_address_street: string
          var_search_address_suburb: string
          var_valid_address_postcode: string
          var_valid_address_street: string
          var_valid_address_suburb: string
        }
        Returns: undefined
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      debug_jwt_claims: { Args: never; Returns: Json }
      debug_user_access: { Args: never; Returns: Json }
      delete_claim_for_email_array: {
        Args: { claim: string; emails: string[] }
        Returns: string
      }
      delete_email_claim: {
        Args: { claim: string; email_input: string }
        Returns: string
      }
      delete_spatial_feature: {
        Args: { p_feature_id: string; p_property_id: string; p_user_id: string }
        Returns: boolean
      }
      dev_process_downloads: { Args: never; Returns: undefined }
      dev_process_kyng_areas: {
        Args: never
        Returns: {
          address: string
          addresspointtype: string
          addressstringoid: number
          containment: string
          enddate: string
          geom: unknown
          gurasid: number
          housenumber: string
          lastupdate: string
          principaladdresssiteoid: number
          urbanity: string
        }[]
      }
      end_kyng_area_user: {
        Args: { p_kyng_area_id: string; p_user_id: string }
        Returns: string
      }
      extract_addresspoints: {
        Args: {
          initial_backoff?: number
          max_retries?: number
          rings_geometry: string
        }
        Returns: number
      }
      extract_addresspoints_wgs1984: { Args: never; Returns: undefined }
      extract_properties: {
        Args: {
          initial_backoff?: number
          max_retries?: number
          rings_geometry: string
        }
        Returns: number
      }
      extract_proways: {
        Args: {
          initial_backoff?: number
          max_retries?: number
          rings_geometry: string
        }
        Returns: number
      }
      extract_waypoints: {
        Args: {
          initial_backoff?: number
          max_retries?: number
          rings_geometry: string
        }
        Returns: number
      }
      find_functions_with_string: {
        Args: { search_string: string }
        Returns: string[]
      }
      find_orphaned_attributes: {
        Args: never
        Returns: {
          attribute_id: string
          feature_id: string
          field_id: string
        }[]
      }
      find_orphaned_spatial_features: {
        Args: never
        Returns: {
          feature_id: string
          property_id: string
          template_id: string
          user_id: string
        }[]
      }
      first_function: { Args: never; Returns: undefined }
      generate_custom_geojson_features: {
        Args: {
          addresspointfeaturestyle: string
          input_id: string
          propertyfeaturestyle: string
          waypointfeaturestyle: string
        }
        Returns: Json
      }
      get_address_point_extract: {
        Args: never
        Returns: {
          addresspointtype: string
          geom: unknown
        }[]
      }
      get_address_status: {
        Args: {
          address_text: string
          api_key: string
          given_suburb: string
          out_srid_value: number
        }
        Returns: Record<string, unknown>
      }
      get_addresspoint_from_address: {
        Args: {
          address_text: string
          api_key: string
          given_suburb: string
          out_srid_value: number
        }
        Returns: {
          community: string
          kyng: string
          principaladdresssiteoid: number
          searchaddressstreet: string
          searchaddresssuburb: string
          status: number
          validaddresspostcode: string
          validaddressstreet: string
          validaddresssuburb: string
        }[]
      }
      get_addresspoint_from_principaladdresssiteoid: {
        Args: { principal_address_site_oid: number }
        Returns: Json
      }
      get_addresspoints_by_area:
        | {
            Args: { kyng_area_id: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.get_addresspoints_by_area(kyng_area_id => text), public.get_addresspoints_by_area(kyng_area_id => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { kyng_area_id: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.get_addresspoints_by_area(kyng_area_id => text), public.get_addresspoints_by_area(kyng_area_id => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      get_addresspoints_geojson: { Args: never; Returns: Json }
      get_admin_messages_for_user: {
        Args: { id_input: string }
        Returns: {
          created_at: string
          id: number
          message: string
        }[]
      }
      get_app_messages: {
        Args: never
        Returns: {
          context: string
          created_at: string
          id: number
          message: string
          revoked: string
          scope: Json
        }[]
      }
      get_community_data: { Args: { community_name: string }; Returns: Json }
      get_enum_values: { Args: { enum_names: string[] }; Returns: Json }
      get_geojson: { Args: { uuid: string }; Returns: Json }
      get_geometry_info_html: { Args: never; Returns: string }
      get_kyng_coordinator_messages_for_user: {
        Args: { id_input: string }
        Returns: {
          created_at: string
          id: number
          message: string
        }[]
      }
      get_kyngs_geojson: { Args: { uuid: string }; Returns: Json }
      get_lists: { Args: never; Returns: Json }
      get_members: {
        Args: { api_key: string; list_id: string }
        Returns: Json[]
      }
      get_new_users_confirmed_without_address: {
        Args: never
        Returns: {
          address: string
          email: string
          email_confirmed_at: string
          id: string
          last_sign_in_at: string
          principaladdresssiteoid: number
        }[]
      }
      get_new_users_confirmed_without_kits: {
        Args: never
        Returns: {
          email: string
          email_confirmed_at: string
          family_name: string
          first_name: string
          landline: string
          mobile: string
          property_address_street: string
          property_address_suburb: string
          unanswered: string
        }[]
      }
      get_new_users_unconfirmed: {
        Args: never
        Returns: {
          address: string
          applied_at: string
          email: string
        }[]
      }
      get_points_geometry: { Args: never; Returns: string }
      get_principaladdresssiteoid_from_cadastralidentifier: {
        Args: { cadastral_identifier: string }
        Returns: number
      }
      get_profile_for_user: { Args: { id_input: string }; Returns: Json }
      get_profile_messages_for_user: {
        Args: { id_input: string }
        Returns: {
          created_at: string
          id: number
          message: string
        }[]
      }
      get_property_address_list: { Args: never; Returns: Json }
      get_property_data: {
        Args: { out_srid_value: number; principaladdresssiteoid: number }
        Returns: {
          gurasid: number
          property: unknown
          waypoint: unknown
        }[]
      }
      get_property_features_by_category: {
        Args: {
          category_param: Database["public"]["Enums"]["feature_category"]
          property_id_param: string
        }
        Returns: {
          attributes: Json
          feature_id: string
          feature_type: string
          geometry: unknown
        }[]
      }
      get_property_for_user: {
        Args: { id_input: string }
        Returns: {
          created_at: string
          fire_fighting_resources: number[]
          fire_hazard_reduction: number[]
          have_stortz: string
          id: string
          land_adjacent_hazard: string
          last_updated: string
          live_stock_present: boolean
          live_stock_safe_area: string
          mobile_reception: number
          number_birds: number
          number_cats: number
          number_dogs: number
          number_other_pets: number
          other_essential_assets: string
          other_hazards: string
          other_site_hazards: string
          phone: string
          property_address_postcode: string
          property_address_street: string
          property_address_suburb: string
          property_rented: boolean
          residents0_18: number
          residents19_50: number
          residents51_70: number
          residents71_: number
          share_livestock_safe_area: string
          sign_posted: boolean
          site_hazards: number[]
          static_water_available: number[]
          stortz_size: number
          truck_access: number
          truck_access_other_information: string
          vulnerable_residents: boolean
        }[]
      }
      get_property_geometries:
        | { Args: never; Returns: Json[] }
        | { Args: { p_id: string }; Returns: Json[] }
      get_property_geometry: { Args: { id_input: string }; Returns: Json[] }
      get_property_geometry_for_user: {
        Args: { id_input: string }
        Returns: {
          address_point: unknown
          created_at: string
          id: string
          last_updated: string
          principaladdresssiteoid: number
          property: unknown
          way_point: unknown
        }[]
      }
      get_query_address: {
        Args: { address_text: string; given_suburb: string }
        Returns: string
      }
      get_registered_addresspoints: {
        Args: never
        Returns: {
          addresspointtype: string
          geom: unknown
        }[]
      }
      get_registered_properties_by_kyng_area: {
        Args: { kyngarea_id: string }
        Returns: Json
      }
      get_rfs_property_data_for_street: {
        Args: { street_input: string }
        Returns: {
          address: string
          agentinformation: Json
          fire_fighting_assets: Json
          onsite_hazards: Json
          other_local_hazards: Json
          phone: string
          property: Json
          property_id: string
          residents: Json[]
          site_animals: Json
        }[]
      }
      get_rfs_user_data_for_porperties: {
        Args: { property_ids: string[] }
        Returns: {
          address: string
          agentinformation: Json
          fire_fighting_assets: Json
          onsite_hazards: Json
          other_local_hazards: Json
          phone: string
          property: Json
          property_id: string
          residents: Json[]
          site_animals: Json
        }[]
      }
      get_rfs_user_map_data_for_porperties: {
        Args: { property_ids: string[] }
        Returns: {
          address: string
          agentinformation: Json
          feature_layers: Json
          fire_fighting_assets: Json
          onsite_hazards: Json
          other_local_hazards: Json
          phone: string
          property: Json
          property_geojson: Json
          property_id: string
          residents: Json[]
          site_animals: Json
        }[]
      }
      get_site_boundary: {
        Args: never
        Returns: {
          project_boundary: Json
          project_geom: unknown
        }[]
      }
      get_site_roads: {
        Args: never
        Returns: {
          roadname: string
        }[]
      }
      get_site_roads_in_suburb: {
        Args: { suburb: string }
        Returns: {
          roadname: string
        }[]
      }
      get_site_suburbs: {
        Args: never
        Returns: {
          suburbname: string
        }[]
      }
      get_spatial_feature_attributes:
        | { Args: { p_property_id: string }; Returns: Json }
        | { Args: { p_property_id: string; p_user_id: string }; Returns: Json }
      get_spatial_feature_templates: { Args: never; Returns: Json }
      get_spatial_features:
        | { Args: { p_property_id: string }; Returns: Json }
        | { Args: { p_property_id: string; p_user_id: string }; Returns: Json }
      get_street_list: {
        Args: never
        Returns: {
          streets: string
        }[]
      }
      get_suburb_polygon: { Args: never; Returns: unknown }
      get_suburbs_geometry: { Args: never; Returns: unknown }
      get_template_fields: {
        Args: { p_template_id: string }
        Returns: {
          field_id: string
        }[]
      }
      get_tester_messages_for_user: {
        Args: { id_input: string }
        Returns: {
          created_at: string
          id: number
          message: string
        }[]
      }
      get_unregistered_properties_by_kyng_area: {
        Args: { kyngarea_id: string }
        Returns: Json
      }
      get_user_bcyca_events_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          event_choices: number[]
          name: string
          other_event: string
        }[]
      }
      get_user_bcyca_information_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          informatiion_choices: number[]
          name: string
          other_information: string
        }[]
      }
      get_user_bcyca_workshops_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          name: string
          other_wokshop: string
          will_run_wokshop: string
          workshop_choices: number[]
        }[]
      }
      get_user_communities: { Args: never; Returns: string[] }
      get_user_external_events_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          event_choices: number[]
          name: string
          other_event: string
        }[]
      }
      get_user_external_information_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          informatiion_choices: number[]
          name: string
          other_information: string
        }[]
      }
      get_user_external_workshops_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          name: string
          other_wokshop: string
          will_run_wokshop: string
          workshop_choices: number[]
        }[]
      }
      get_user_kyng_area: { Args: never; Returns: string }
      get_user_mondrook_events_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          event_choices: number[]
          name: string
          other_event: string
        }[]
      }
      get_user_mondrook_information_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          informatiion_choices: number[]
          name: string
          other_information: string
        }[]
      }
      get_user_mondrook_workshops_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          name: string
          other_wokshop: string
          will_run_wokshop: string
          workshop_choices: number[]
        }[]
      }
      get_user_property_ids: { Args: never; Returns: string[] }
      get_user_role: { Args: never; Returns: string }
      get_user_roles: {
        Args: never
        Returns: {
          email: string
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      get_user_sendrfsplan_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          name: string
        }[]
      }
      get_user_tinonee_events_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          event_choices: number[]
          name: string
          other_event: string
        }[]
      }
      get_user_tinonee_information_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          informatiion_choices: number[]
          name: string
          other_information: string
        }[]
      }
      get_user_tinonee_workshops_data: {
        Args: never
        Returns: {
          address: string
          created_at: string
          email: string
          name: string
          other_wokshop: string
          will_run_wokshop: string
          workshop_choices: number[]
        }[]
      }
      get_user_vetting_data: {
        Args: never
        Returns: {
          email: string
          landline: string
          mobile: string
          name: string
          property_address: string
          unanswered: string
        }[]
      }
      get_users_with_kyng_status: {
        Args: never
        Returns: {
          admin_email: string
          admin_user_id: string
          email: string
          end_date: string
          kyng: string
          kyng_area_id: string
          phone_number: string
          start_date: string
          updated_at: string
          user_id: string
          user_name: string
        }[]
      }
      get_validated_addresspoint_from_address: {
        Args: {
          address_text: string
          api_key: string
          given_suburb: string
          out_srid_value: number
        }
        Returns: {
          community: string
          found_in_custom: boolean
          found_in_project: boolean
          geocoder_result: Json
          geojson: Json
          kyng: string
          matchcodes: Json
          principaladdresssiteoid: number
          searchaddressstreet: string
          searchaddresssuburb: string
          status: number
          validaddresspostcode: string
          validaddressstreet: string
          validaddresssuburb: string
        }[]
      }
      has_all_permissions: { Args: { permissions: string[] }; Returns: boolean }
      has_any_permission: { Args: { permissions: string[] }; Returns: boolean }
      has_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      health_check: { Args: never; Returns: Json }
      insert_message: {
        Args: {
          context_text: Database["public"]["Enums"]["message_context"]
          ids?: string
          message_text: string
        }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
      is_kyng_coordinator: { Args: never; Returns: boolean }
      jsonb_array_to_smallint_array: { Args: { _js: Json }; Returns: number[] }
      log_auth_failure:
        | {
            Args: {
              p_email: string
              p_error_message: string
              p_error_type: string
              p_ip_address: string
              p_user_agent: string
            }
            Returns: number
          }
        | {
            Args: {
              p_email: string
              p_error_message: string
              p_error_type: string
              p_ip_address: string
            }
            Returns: number
          }
      make_kyng_address_points: { Args: never; Returns: undefined }
      new_custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      pgnet_process_geoscape_geocoder_response: {
        Args: { address_string: string; api_key: string }
        Returns: Json
      }
      process_downloads: { Args: never; Returns: undefined }
      process_geoscape_geocoder_response: {
        Args: { address_string: string; api_key: string }
        Returns: Json
      }
      process_kyng_areas: { Args: never; Returns: undefined }
      property_in_kyng_area: {
        Args: { property_kyng_area: string }
        Returns: boolean
      }
      raise_log: { Args: { message: string }; Returns: undefined }
      read_secret: { Args: { secret_name: string }; Returns: string }
      refresh_spatial_data: {
        Args: {
          initial_backoff?: number
          max_retries?: number
          p_regenerate_area?: boolean
        }
        Returns: Json
      }
      regenerate_project_area: { Args: never; Returns: Json }
      revoke_app_messages: { Args: { revoked_ids: string[] }; Returns: number }
      save_first_function: { Args: never; Returns: undefined }
      trim_address_suburb: { Args: { given_suburb: string }; Returns: string }
      update_kyng_area_user:
        | {
            Args: {
              p_kyng_area_id: string
              p_phone_number: string
              p_user_id: string
              p_user_name: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_phone_number: string
              p_user_id: string
              p_user_name: string
            }
            Returns: undefined
          }
      update_mailchimp_tags: {
        Args: { email_address: string }
        Returns: undefined
      }
      upsert_feature_attributes: {
        Args: { p_attributes: Json[] }
        Returns: string[]
      }
      upsert_spatial_feature: {
        Args: {
          p_feature_id: string
          p_geom: unknown
          p_property_id: string
          p_template_id: string
          p_user_id: string
        }
        Returns: string
      }
      user_in_community: { Args: { community_slug: string }; Returns: boolean }
      user_owns_property: { Args: { property_id: string }; Returns: boolean }
      validate_street_address: {
        Args: { input_address: string }
        Returns: string
      }
      x_get_addresspoint_from_address: {
        Args: {
          address_text: string
          api_key: string
          given_suburb: string
          out_srid_value: number
        }
        Returns: {
          community: string
          geojson: Json
          kyng: string
          principaladdresssiteoid: number
          searchaddressstreet: string
          searchaddresssuburb: string
          status: number
          validaddresspostcode: string
          validaddressstreet: string
          validaddresssuburb: string
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
        | "app_data"
        | "user"
        | "bc"
        | "admin_kyng_coordinators"
        | "admin_site_data"
        | "admin_site_data_spatial"
        | "admin_site_data_addresses"
        | "admin_bcyca_map"
        | "admin_mondrook_map"
        | "admin_tinonee_map"
        | "admin_external_map"
      community_request_status: "pending" | "approved" | "rejected"
      feature_category: "hazard" | "asset" | "operational"
      field_type:
        | "text"
        | "number"
        | "date"
        | "select"
        | "boolean"
        | "multiselect"
      geometry_type: "point" | "line" | "polygon"
      message_context: "users" | "admins" | "both" | "kyngs"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "admin_site",
        "admin_site_messages",
        "admin_site_roles",
        "admin_users",
        "admin_users_newusers",
        "admin_users_kits",
        "admin_emergency",
        "admin_emergency_reports",
        "admin_emergency_ servicemap",
        "admin_communities",
        "admin_bcyca",
        "admin_bcyca_events",
        "admin_bcyca_information",
        "admin_bcyca_workshops",
        "admin_mondrook",
        "admin_mondrook_events",
        "admin_mondrook_information",
        "admin_mondrook_workshops",
        "admin_tinonee",
        "admin_tinonee_events",
        "admin_tinonee_information",
        "admin_tinonee_workshops",
        "admin_external",
        "admin_external_events",
        "admin_external_information",
        "admin_external_workshops",
        "kyng",
        "app_data",
        "user",
        "bc",
        "admin_kyng_coordinators",
        "admin_site_data",
        "admin_site_data_spatial",
        "admin_site_data_addresses",
        "admin_bcyca_map",
        "admin_mondrook_map",
        "admin_tinonee_map",
        "admin_external_map",
      ],
      community_request_status: ["pending", "approved", "rejected"],
      feature_category: ["hazard", "asset", "operational"],
      field_type: [
        "text",
        "number",
        "date",
        "select",
        "boolean",
        "multiselect",
      ],
      geometry_type: ["point", "line", "polygon"],
      message_context: ["users", "admins", "both", "kyngs"],
    },
  },
} as const
