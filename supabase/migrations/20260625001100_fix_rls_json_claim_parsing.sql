-- Repoint every RLS policy that parsed JSON-array JWT claims as Postgres array
-- literals onto the helper functions added in 20260625001000. Without this,
-- enabling custom_access_token_hook (which populates property_ids / permissions
-- / coordinates_kyng) makes each such policy throw 22P02 "malformed array
-- literal" on every read/write of the affected tables.

-- ===== property_profile =====
ALTER POLICY user_read_own_properties ON public.property_profile
  USING (id = ANY(public.jwt_property_ids()));
ALTER POLICY user_update_own_properties ON public.property_profile
  USING (id = ANY(public.jwt_property_ids()))
  WITH CHECK (id = ANY(public.jwt_property_ids()));
ALTER POLICY admin_read_all_properties ON public.property_profile
  USING (public.jwt_can('admin.users'));
ALTER POLICY admin_manage_properties ON public.property_profile
  USING (public.jwt_can('admin.users'));
ALTER POLICY kyng_read_area_properties ON public.property_profile
  USING ((auth.jwt() ->> 'user_role') = 'kyng_coordinator' AND kyng = ANY(public.jwt_kyng_area_ids()));

-- ===== permissions (admin) policies: jwt_can('<perm>') =====
ALTER POLICY admin_read_all_errors ON public.address_validation_errors USING (public.jwt_can('admin.site.data.addresses'));
ALTER POLICY admin_manage_messages ON public.app_message USING (public.jwt_can('admin.site.messages'));
ALTER POLICY admin_manage_requests ON public.community_access_requests USING (public.jwt_can('admin.community'));
ALTER POLICY admin_read_all_requests ON public.community_access_requests USING (public.jwt_can('admin.community'));
ALTER POLICY admin_manage_communities ON public.community_areas USING (public.jwt_can('admin.site.data.spatial'));
ALTER POLICY admin_manage_bcyca_profiles ON public.community_bcyca_profile USING (public.jwt_can('admin.community.bcyca'));
ALTER POLICY admin_read_bcyca_profiles ON public.community_bcyca_profile USING (public.jwt_can('admin.community.bcyca'));
ALTER POLICY admin_manage_external_profiles ON public.community_external_profile USING (public.jwt_can('admin.community.external'));
ALTER POLICY admin_read_external_profiles ON public.community_external_profile USING (public.jwt_can('admin.community.external'));
ALTER POLICY admin_manage_mondrook_profiles ON public.community_mondrook_profile USING (public.jwt_can('admin.community.mondrook'));
ALTER POLICY admin_read_mondrook_profiles ON public.community_mondrook_profile USING (public.jwt_can('admin.community.mondrook'));
ALTER POLICY admin_manage_concordance ON public.community_request_options_concordance USING (public.jwt_can('admin.site.data'));
ALTER POLICY admin_manage_options ON public.community_request_options_lut USING (public.jwt_can('admin.site.data'));
ALTER POLICY admin_manage_tinonee_profiles ON public.community_tinonee_profile USING (public.jwt_can('admin.community.tinonee'));
ALTER POLICY admin_read_tinonee_profiles ON public.community_tinonee_profile USING (public.jwt_can('admin.community.tinonee'));
ALTER POLICY admin_manage_attributes ON public.feature_attributes USING (public.jwt_can('admin.emergency'));
ALTER POLICY admin_read_attributes ON public.feature_attributes USING (public.jwt_can('admin.emergency'));
ALTER POLICY admin_manage_templates ON public.feature_templates USING (public.jwt_can('admin.site.data.spatial'));
ALTER POLICY admin_read_all_templates ON public.feature_templates USING (public.jwt_can('admin.site.data.spatial'));
ALTER POLICY admin_manage_kyng_assignments ON public.kyng_area_users_join USING (public.jwt_can('admin.users.kyng-coordinators'));
ALTER POLICY admin_read_kyng_assignments ON public.kyng_area_users_join USING (public.jwt_can('admin.users.kyng-coordinators'));
ALTER POLICY admin_manage_kyng_areas ON public.kyng_areas USING (public.jwt_can('admin.site.data.kyng-boundaries'));
ALTER POLICY admin_manage_features ON public.spatial_features USING (public.jwt_can('admin.emergency'));
ALTER POLICY admin_read_all_features ON public.spatial_features USING (public.jwt_can('admin.emergency'));
ALTER POLICY admin_manage_template_fields ON public.template_fields USING (public.jwt_can('admin.site.data.spatial'));
ALTER POLICY admin_manage_profiles ON public.user_profile USING (public.jwt_can('admin.users'));
ALTER POLICY admin_read_all_profiles ON public.user_profile USING (public.jwt_can('admin.users'));
ALTER POLICY admin_manage_property_joins ON public.user_property_profile_join USING (public.jwt_can('admin.users'));
ALTER POLICY admin_read_property_joins ON public.user_property_profile_join USING (public.jwt_can('admin.users'));

-- ===== property_ids (user) policies: = ANY(public.jwt_property_ids()) =====
ALTER POLICY user_read_own_attributes ON public.feature_attributes
  USING (feature_id IN (SELECT id FROM public.spatial_features WHERE property_id = ANY(public.jwt_property_ids())));
ALTER POLICY user_delete_attributes ON public.feature_attributes
  USING (feature_id IN (SELECT id FROM public.spatial_features WHERE property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid()));
ALTER POLICY user_update_attributes ON public.feature_attributes
  USING (feature_id IN (SELECT id FROM public.spatial_features WHERE property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid()));
ALTER POLICY user_insert_attributes ON public.feature_attributes
  WITH CHECK (feature_id IN (SELECT id FROM public.spatial_features WHERE property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid()));

ALTER POLICY user_read_own_features ON public.spatial_features
  USING (property_id = ANY(public.jwt_property_ids()));
ALTER POLICY user_delete_own_features ON public.spatial_features
  USING (property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid());
ALTER POLICY user_update_own_features ON public.spatial_features
  USING (property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid())
  WITH CHECK (property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid());
ALTER POLICY user_insert_features ON public.spatial_features
  WITH CHECK (property_id = ANY(public.jwt_property_ids()) AND user_id = auth.uid());

ALTER POLICY user_read_own_property_joins ON public.user_property_profile_join
  USING (user_id = auth.uid() OR property_id = ANY(public.jwt_property_ids()));

-- ===== coordinates_kyng (kyng coordinator) policies =====
ALTER POLICY kyng_read_area_users ON public.kyng_area_users_join
  USING ((auth.jwt() ->> 'user_role') = 'kyng_coordinator' AND kyng_area_id = ANY(public.jwt_kyng_area_ids()));
ALTER POLICY kyng_read_area_features ON public.spatial_features
  USING ((auth.jwt() ->> 'user_role') = 'kyng_coordinator'
         AND property_id IN (SELECT id FROM public.property_profile WHERE kyng = ANY(public.jwt_kyng_area_ids())));
