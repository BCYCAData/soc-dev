```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create ENUMs
CREATE TYPE geometry_type AS ENUM ('point', 'line', 'polygon');
CREATE TYPE field_type AS ENUM ('text', 'number', 'date', 'select', 'boolean', 'multiselect');
CREATE TYPE feature_category AS ENUM ('hazard', 'asset', 'operational');

-- Create tables
CREATE TABLE feature_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    geometry_type geometry_type NOT NULL,
    category feature_category NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (name, category)
);

CREATE TABLE template_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES feature_templates(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type field_type NOT NULL,
    validation_rules TEXT,
    required BOOLEAN DEFAULT false,
    default_value TEXT,
    display_order INTEGER NOT NULL,
    
    UNIQUE (template_id, field_name),
    UNIQUE (template_id, display_order)
);

-- Create trigger function to validate geometry type
CREATE OR REPLACE FUNCTION validate_geometry_type()
RETURNS TRIGGER AS $$
DECLARE
    template_geom_type geometry_type;
BEGIN
    SELECT geometry_type INTO template_geom_type
    FROM feature_templates
    WHERE id = NEW.template_id;

    IF (ST_GeometryType(NEW.geom) = 'ST_Point' AND template_geom_type != 'point') OR
       (ST_GeometryType(NEW.geom) = 'ST_LineString' AND template_geom_type != 'line') OR
       (ST_GeometryType(NEW.geom) = 'ST_Polygon' AND template_geom_type != 'polygon') THEN
        RAISE EXCEPTION 'Geometry type does not match template geometry type';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE spatial_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES property_profile(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES feature_templates(id) ON DELETE RESTRICT,
    geom GEOMETRY NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_geometry CHECK (ST_IsValid(geom)),
    CONSTRAINT valid_user_property FOREIGN KEY (user_id, property_id) 
        REFERENCES user_property_profile_join(user_id, property_id) ON DELETE CASCADE
);

-- Create trigger for geometry type validation
CREATE TRIGGER validate_geometry_type_trigger
    BEFORE INSERT OR UPDATE ON spatial_features
    FOR EACH ROW
    EXECUTE FUNCTION validate_geometry_type();

CREATE TABLE feature_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_id UUID NOT NULL REFERENCES spatial_features(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES template_fields(id) ON DELETE CASCADE,
    value TEXT,
    last_edited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (feature_id, field_id)
);

-- Create indexes
CREATE INDEX idx_user_property_profile_join_user_id ON user_property_profile_join(user_id);
CREATE INDEX idx_user_property_profile_join_property_id ON user_property_profile_join(property_id);

CREATE INDEX idx_feature_templates_category ON feature_templates(category);
CREATE INDEX idx_template_fields_template_id ON template_fields(template_id);

CREATE INDEX idx_spatial_features_user_id ON spatial_features(user_id);
CREATE INDEX idx_spatial_features_property_id ON spatial_features(property_id);
CREATE INDEX idx_spatial_features_template_id ON spatial_features(template_id);
CREATE INDEX idx_spatial_features_geom ON spatial_features USING GIST(geom);

CREATE INDEX idx_feature_attributes_feature_id ON feature_attributes(feature_id);
CREATE INDEX idx_feature_attributes_field_id ON feature_attributes(field_id);

-- Create views for easier querying
CREATE VIEW categorized_features AS
SELECT 
    sf.id,
    sf.property_id,
    sf.user_id,
    ft.category,
    ft.name as feature_type,
    ft.geometry_type,
    sf.geom,
    sf.created_at,
    sf.last_edited
FROM spatial_features sf
JOIN feature_templates ft ON sf.template_id = ft.id;

CREATE VIEW feature_details AS
SELECT 
    sf.id as feature_id,
    sf.property_id,
    sf.user_id,
    ft.category,
    ft.name as feature_type,
    ft.geometry_type,
    jsonb_object_agg(tf.field_name, fa.value) as attributes,
    sf.geom,
    sf.created_at,
    sf.last_edited
FROM spatial_features sf
JOIN feature_templates ft ON sf.template_id = ft.id
LEFT JOIN feature_attributes fa ON sf.id = fa.feature_id
LEFT JOIN template_fields tf ON fa.field_id = tf.id
GROUP BY sf.id, sf.property_id, sf.user_id, ft.category, ft.name, ft.geometry_type, sf.geom, sf.created_at, sf.last_edited;

-- Create trigger function for last_edited
CREATE OR REPLACE FUNCTION update_last_edited_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_edited = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_feature_templates_last_edited
    BEFORE UPDATE ON feature_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_last_edited_timestamp();

CREATE TRIGGER update_spatial_features_last_edited
    BEFORE UPDATE ON spatial_features
    FOR EACH ROW
    EXECUTE FUNCTION update_last_edited_timestamp();

CREATE TRIGGER update_feature_attributes_last_edited
    BEFORE UPDATE ON feature_attributes
    FOR EACH ROW
    EXECUTE FUNCTION update_last_edited_timestamp();

-- Helper functions
CREATE OR REPLACE FUNCTION get_property_features_by_category(
    property_id_param UUID,
    category_param feature_category
) RETURNS TABLE (
    feature_id UUID,
    feature_type TEXT,
    geometry GEOMETRY,
    attributes JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sf.id,
        ft.name,
        sf.geom,
        jsonb_object_agg(tf.field_name, fa.value)
    FROM spatial_features sf
    JOIN feature_templates ft ON sf.template_id = ft.id
    LEFT JOIN feature_attributes fa ON sf.id = fa.feature_id
    LEFT JOIN template_fields tf ON fa.field_id = tf.id
    WHERE sf.property_id = property_id_param
    AND ft.category = category_param
    GROUP BY sf.id, ft.name, sf.geom;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_property_profile_join ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_attributes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY users_self ON user_profile
    FOR ALL USING (auth.uid() = id);

CREATE POLICY property_profile_member ON property_profile
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_property_profile_join
            WHERE property_profile.id = property_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY user_property_join_member ON user_property_profile_join
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY spatial_features_property_member ON spatial_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_property_profile_join
            WHERE user_property_profile_join.property_id = spatial_features.property_id
            AND user_property_profile_join.user_id = auth.uid()
        )
    );

CREATE POLICY feature_attributes_feature_member ON feature_attributes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM spatial_features
            JOIN user_property_profile_join ON spatial_features.property_id = user_property_profile_join.property_id
            WHERE spatial_features.id = feature_id
            AND user_property_profile_join.user_id = auth.uid()
        )
    );

-- Example template inserts
INSERT INTO feature_templates (name, description, geometry_type, category) VALUES
    ('Water Tank', 'Water storage location', 'point', 'asset'),
    ('Fire Hydrant', 'Fire hydrant location', 'point', 'asset'),
    ('Building', 'Structure location', 'polygon', 'asset'),
    
    ('Fire Break', 'Maintained fire break area', 'line', 'operational'),
    ('Access Route', 'Vehicle access route', 'line', 'operational'),
    ('Staging Area', 'Emergency staging location', 'polygon', 'operational'),
    
    ('Vegetation Hazard', 'High fuel load area', 'polygon', 'hazard'),
    ('Slope Hazard', 'Steep slope area', 'polygon', 'hazard'),
    ('Powerline', 'Overhead powerline location', 'line', 'hazard');

-- Example template fields
INSERT INTO template_fields (template_id, field_name, field_type, required, display_order) 
SELECT 
    id,
    'name',
    'text'::field_type,
    true,
    1
FROM feature_templates;

INSERT INTO template_fields (template_id, field_name, field_type, required, display_order) 
SELECT 
    id,
    'description',
    'text'::field_type,
    false,
    2
FROM feature_templates;
```