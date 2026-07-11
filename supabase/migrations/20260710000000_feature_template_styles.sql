-- Feature-template style overrides: optional admin-set jsonb, a constrained
-- subset of the v2 map-engine PointStyle/LineStyle/PolygonStyle keyed by the
-- template's geometry_type, e.g. {"line":{"color":"#F44336","dashArray":"8 6"}}.
-- Deep-merged over the code default derived from (category, geometry_type) in
-- src/lib/map/capture/template-styles.ts, which also owns whitelist validation;
-- the DB only guards the top-level shape.

ALTER TABLE public.feature_templates ADD COLUMN IF NOT EXISTS style jsonb;

ALTER TABLE public.feature_templates
  ADD CONSTRAINT feature_templates_style_is_object
  CHECK (style IS NULL OR jsonb_typeof(style) = 'object');

COMMENT ON COLUMN public.feature_templates.style IS
  'Optional per-template style override; deep-merged over the code default derived from (category, geometry_type). Shape: {point?:{...}} | {line?:{...}} | {polygon?:{...}}. Validated in app layer (template-styles.ts).';

-- Include style in the templates RPC. Posture matches the original (LANGUAGE
-- plpgsql, SECURITY INVOKER); the SET search_path clause restates the pin from
-- 20260707223000_pin_function_search_paths.sql because CREATE OR REPLACE
-- resets proconfig. Grants survive (identical signature) — no re-grant needed.
CREATE OR REPLACE FUNCTION "public"."get_spatial_feature_templates"() RETURNS json
    LANGUAGE "plpgsql"
    SET search_path = public, extensions
    AS $$
BEGIN
    RETURN (
        SELECT json_object_agg(ft.id, template_data)
        FROM (
            SELECT
                ft.id,
                json_build_object(
                    'id', ft.id,
                    'name', ft.name,
                    'category', ft.category,
                    'geometry_type', ft.geometry_type,
                    'style', ft.style,
                    'attributes', (
                        SELECT json_agg(
                            json_build_object(
                                'id', tf.id,
                                'name', tf.field_name,
                                'type', tf.field_type,
                                'required', tf.required,
                                'default', tf.default_value,
                                'validation', tf.validation_rules
                            )
                            ORDER BY tf.display_order
                        )
                        FROM template_fields tf
                        WHERE tf.template_id = ft.id
                    )
                ) AS template_data
            FROM feature_templates ft
            WHERE ft.is_active = true
        ) ft
    );
END;
$$;
