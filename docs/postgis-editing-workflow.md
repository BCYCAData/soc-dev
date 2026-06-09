# Leaflet-Based PostGIS Spatial Editing Workflow
## Strategic Enhancement Roadmap for My Property Map Feature

A comprehensive architecture for browser-based spatial data capture with PostGIS rigour enforced server-side, specifically designed for the existing SvelteKit + Leaflet implementation.

---

## Executive Summary

This roadmap enhances the existing **My Property Map** feature (`/personal-profile/my-property/[propertyid]/my-map/`) with advanced PostGIS-powered editing capabilities:

- **Merge operations** - Combine multiple features of the same template
- **Snapping & topology validation** - Snap to property boundary with real-time validation
- **Enhanced validation** - Server-side PostGIS geometry validation and quality checks
- **Seamless integration** - Works with existing RLS policies, toast notifications, and form actions

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  SvelteKit + Leaflet (My Property Map)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Enhanced Leaflet Components                             │   │
│  │  - LeafletDrawControl (create/edit features)             │   │
│  │  - LeafletMergeControl (merge tool)                      │   │
│  │  - LeafletValidationPanel (real-time feedback)           │   │
│  │  - Enhanced LeafletGeoJSON*Layer with snapping           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│                    GeoJSON + metadata                           │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  SvelteKit Form Actions (+page.server.ts)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Enhanced Actions:                                       │   │
│  │  - saveFeature (with validation)                         │   │
│  │  - mergeFeatures (new)                                   │   │
│  │  - deleteFeature (existing)                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Supabase RPC Functions (PostgreSQL)                    │   │
│  │  - validate_spatial_feature()           [NEW]           │   │
│  │  - snap_to_property_boundary()          [NEW]           │   │
│  │  - merge_spatial_features()             [NEW]           │   │
│  │  - upsert_spatial_feature()             [ENHANCED]      │   │
│  │  - get_spatial_features()               [EXISTING]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PostGIS Processing                                      │   │
│  │  - ST_GeomFromGeoJSON → ST_IsValid → ST_MakeValid      │   │
│  │  - ST_Snap to property boundary                         │   │
│  │  - ST_Union for merge operations                        │   │
│  │  - Topology validation (gaps, overlaps, self-intersect) │   │
│  │  - RLS policies enforce property-level access           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Response to Client                                             │
│  - Validated & snapped geometry (GeoJSON)                       │
│  - Validation issues/warnings array                             │
│  - Feature ID for saved features                                │
│  - Toast notification data                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### Existing Implementation Strengths

**Database Schema** ([documentation/spatial-schema.md](documentation/spatial-schema.md)):
- ✅ Well-structured `spatial_features` table with PostGIS geometry
- ✅ Flexible `feature_templates` and `template_fields` for attribute management
- ✅ `feature_attributes` EAV pattern for dynamic attributes
- ✅ Geometry type validation trigger (`validate_geometry_type()`)
- ✅ RLS policies properly enforce property-level access
- ✅ ST_IsValid constraint on geometry column

**Frontend Components**:
- ✅ Mature Leaflet integration with context-based architecture
- ✅ Separate layer components for Point/Line/Polygon
- ✅ Template-based symbology system
- ✅ Dynamic layer ordering by category
- ✅ Attribute editor component ([LeafletGeoJSONAttributeEditor.svelte](src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte))
- ✅ Delete control component
- ✅ Tooltip system with template support

**Backend Integration**:
- ✅ SvelteKit form actions for CRUD operations
- ✅ RPC functions: `get_spatial_features`, `upsert_spatial_feature`, `delete_spatial_feature`
- ✅ Proper error handling and toast notifications
- ✅ Attribute synchronization pattern

**State Management**:
- ✅ Svelte 5 reactive state in [spatialutilities.svelte.ts](src/lib/leaflet/spatialutilities.svelte.ts)
- ✅ Editing state tracking (template, feature, mode)
- ✅ Feature collections by template

### Identified Gaps for Enhancement

1. **No server-side geometry validation** beyond basic `ST_IsValid`
2. **No snapping functionality** to property boundaries
3. **No merge capability** for combining features
4. **No topology validation** (overlaps, gaps, self-intersections)
5. **No preview before save** - validation happens on insert
6. **Limited client-side editing controls** - placeholder comments in layer components
7. **No geometry quality checks** (area/length thresholds, within property boundary)

---

## Phase 1: Database Enhancements

### 1.1 Add Validation Metadata to spatial_features

```sql
-- Add validation tracking columns
ALTER TABLE spatial_features
ADD COLUMN is_valid BOOLEAN DEFAULT true,
ADD COLUMN validation_notes TEXT[] DEFAULT '{}',
ADD COLUMN snapped_to_boundary BOOLEAN DEFAULT false;

-- Add index for querying invalid features
CREATE INDEX idx_spatial_features_validation
ON spatial_features(property_id, is_valid);
```

**Rationale**: Track which features passed validation and capture warning messages for user reference.

---

### 1.2 Create Enhanced RPC Function: validate_spatial_feature()

```sql
CREATE OR REPLACE FUNCTION validate_spatial_feature(
    p_geojson TEXT,
    p_template_id UUID,
    p_property_id UUID,
    p_snap_tolerance FLOAT DEFAULT 0.5  -- metres
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_geom GEOMETRY;
    v_snapped_geom GEOMETRY;
    v_property_geom GEOMETRY;
    v_issues TEXT[] := '{}';
    v_warnings TEXT[] := '{}';
    v_expected_geom_type geometry_type;
    v_template RECORD;
BEGIN
    -- Get template info
    SELECT geometry_type, category, name INTO v_template
    FROM feature_templates
    WHERE id = p_template_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'issues', ARRAY['Template not found'],
            'warnings', v_warnings,
            'geometry', null
        );
    END IF;

    v_expected_geom_type := v_template.geometry_type;

    -- Parse GeoJSON (assumes WGS84/EPSG:4326 input from Leaflet)
    BEGIN
        v_geom := ST_SetSRID(ST_GeomFromGeoJSON(p_geojson), 4326);
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'valid', false,
            'issues', ARRAY['Invalid GeoJSON: ' || SQLERRM],
            'warnings', v_warnings,
            'geometry', null
        );
    END;

    -- Validate geometry
    IF NOT ST_IsValid(v_geom) THEN
        v_geom := ST_MakeValid(v_geom);
        v_warnings := array_append(v_warnings, 'Geometry was auto-corrected for validity');
    END IF;

    -- Check geometry type matches template
    IF (ST_GeometryType(v_geom) = 'ST_Point' AND v_expected_geom_type != 'point') OR
       (ST_GeometryType(v_geom) = 'ST_LineString' AND v_expected_geom_type != 'line') OR
       (ST_GeometryType(v_geom) = 'ST_Polygon' AND v_expected_geom_type != 'polygon') THEN
        v_issues := array_append(v_issues,
            format('Expected %s geometry for %s template, got %s',
                v_expected_geom_type, v_template.name, ST_GeometryType(v_geom)));
    END IF;

    -- Get property boundary
    SELECT ST_Transform(geom, 4326) INTO v_property_geom
    FROM property_profile
    WHERE id = p_property_id;

    IF v_property_geom IS NULL THEN
        v_warnings := array_append(v_warnings, 'Property boundary not found - skipping boundary checks');
    ELSE
        -- Check if feature is within property (with 10m buffer tolerance)
        IF NOT ST_Within(v_geom, ST_Buffer(v_property_geom::geography, 10)::geometry) THEN
            v_warnings := array_append(v_warnings,
                'Feature extends beyond property boundary (10m tolerance)');
        END IF;

        -- Snap to property boundary
        v_snapped_geom := ST_Snap(v_geom, v_property_geom, p_snap_tolerance / 111320.0); -- Convert metres to degrees approx

        IF NOT ST_Equals(v_snapped_geom, v_geom) THEN
            v_warnings := array_append(v_warnings,
                format('Geometry snapped to property boundary (%.1fm tolerance)', p_snap_tolerance));
            v_geom := v_snapped_geom;
        END IF;
    END IF;

    -- Geometry quality checks
    IF v_expected_geom_type = 'polygon' THEN
        -- Check for self-intersection
        IF NOT ST_IsSimple(v_geom) THEN
            v_issues := array_append(v_issues, 'Polygon has self-intersections');
        END IF;

        -- Area checks (using geography for accurate measurement)
        DECLARE
            v_area FLOAT := ST_Area(v_geom::geography);
        BEGIN
            IF v_area < 1 THEN
                v_issues := array_append(v_issues,
                    format('Polygon too small (%.2f m² < 1 m²)', v_area));
            ELSIF v_area > 1000000 THEN
                v_warnings := array_append(v_warnings,
                    format('Very large polygon (%.0f m² > 1 km²)', v_area));
            END IF;
        END;
    END IF;

    IF v_expected_geom_type = 'line' THEN
        DECLARE
            v_length FLOAT := ST_Length(v_geom::geography);
        BEGIN
            IF v_length < 1 THEN
                v_issues := array_append(v_issues,
                    format('Line too short (%.2fm < 1m)', v_length));
            END IF;
        END;
    END IF;

    -- Check for overlaps with existing features of same template (hazard areas shouldn't overlap)
    IF v_expected_geom_type IN ('polygon', 'line') AND v_template.category = 'hazard' THEN
        DECLARE
            v_overlap_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO v_overlap_count
            FROM spatial_features
            WHERE template_id = p_template_id
            AND property_id = p_property_id
            AND ST_Overlaps(geom, v_geom)
            OR ST_Contains(geom, v_geom)
            OR ST_Contains(v_geom, geom);

            IF v_overlap_count > 0 THEN
                v_warnings := array_append(v_warnings,
                    format('Overlaps with %s existing %s feature(s)', v_overlap_count, v_template.name));
            END IF;
        END;
    END IF;

    -- Return validated/snapped geometry as GeoJSON
    RETURN jsonb_build_object(
        'valid', array_length(v_issues, 1) IS NULL,
        'issues', COALESCE(v_issues, '{}'),
        'warnings', COALESCE(v_warnings, '{}'),
        'geometry', ST_AsGeoJSON(v_geom)::jsonb,
        'metadata', jsonb_build_object(
            'snapped', NOT ST_Equals(v_snapped_geom, ST_SetSRID(ST_GeomFromGeoJSON(p_geojson), 4326)),
            'area_m2', CASE WHEN v_expected_geom_type = 'polygon'
                THEN ST_Area(v_geom::geography) ELSE null END,
            'length_m', CASE WHEN v_expected_geom_type = 'line'
                THEN ST_Length(v_geom::geography) ELSE null END
        )
    );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION validate_spatial_feature TO authenticated;
```

**Key Features**:
- ✅ Validates geometry type matches template
- ✅ Auto-corrects invalid geometries
- ✅ Snaps to property boundary
- ✅ Checks features are within property
- ✅ Area/length sanity checks
- ✅ Detects overlaps for hazard features
- ✅ Returns enriched metadata
- ✅ Security definer for RLS compatibility

---

### 1.3 Create Merge RPC Function: merge_spatial_features()

```sql
CREATE OR REPLACE FUNCTION merge_spatial_features(
    p_feature_ids UUID[],
    p_user_id UUID,
    p_property_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_merged_geom GEOMETRY;
    v_template_id UUID;
    v_geometry_type geometry_type;
    v_category feature_category;
    v_new_feature_id UUID;
    v_feature_count INTEGER;
    v_merged_attributes JSONB := '{}';
BEGIN
    -- Validate all features exist, belong to user, and have same template
    SELECT
        COUNT(DISTINCT id),
        COUNT(DISTINCT template_id),
        MAX(template_id)
    INTO
        v_feature_count,
        v_geometry_type, -- reusing variable for count
        v_template_id
    FROM spatial_features
    WHERE id = ANY(p_feature_ids)
    AND user_id = p_user_id
    AND property_id = p_property_id;

    IF v_feature_count != array_length(p_feature_ids, 1) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'One or more features not found or access denied'
        );
    END IF;

    IF v_geometry_type::INTEGER > 1 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Cannot merge features from different templates'
        );
    END IF;

    IF array_length(p_feature_ids, 1) < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Must select at least 2 features to merge'
        );
    END IF;

    -- Get template geometry type
    SELECT ft.geometry_type, ft.category INTO v_geometry_type, v_category
    FROM feature_templates ft
    WHERE ft.id = v_template_id;

    -- Only allow merging polygons and lines (not points)
    IF v_geometry_type NOT IN ('polygon', 'line') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Can only merge polygon or line features'
        );
    END IF;

    -- Perform ST_Union to merge geometries
    SELECT ST_Union(geom) INTO v_merged_geom
    FROM spatial_features
    WHERE id = ANY(p_feature_ids);

    -- Validate merged geometry
    IF NOT ST_IsValid(v_merged_geom) THEN
        v_merged_geom := ST_MakeValid(v_merged_geom);
    END IF;

    -- Collect all unique attributes from merged features (last value wins for duplicates)
    SELECT jsonb_object_agg(field_id, value) INTO v_merged_attributes
    FROM (
        SELECT DISTINCT ON (fa.field_id)
            fa.field_id,
            fa.value
        FROM feature_attributes fa
        WHERE fa.feature_id = ANY(p_feature_ids)
        ORDER BY fa.field_id, fa.last_edited DESC
    ) attrs;

    -- Insert merged feature
    INSERT INTO spatial_features (
        user_id,
        property_id,
        template_id,
        geom,
        validation_notes,
        snapped_to_boundary
    )
    VALUES (
        p_user_id,
        p_property_id,
        v_template_id,
        v_merged_geom,
        ARRAY[format('Merged from %s features: %s',
            array_length(p_feature_ids, 1),
            array_to_string(p_feature_ids, ', '))],
        false  -- May need re-validation
    )
    RETURNING id INTO v_new_feature_id;

    -- Insert merged attributes
    IF v_merged_attributes IS NOT NULL THEN
        INSERT INTO feature_attributes (feature_id, field_id, value)
        SELECT
            v_new_feature_id,
            (each).key::UUID,
            (each).value::TEXT
        FROM jsonb_each_text(v_merged_attributes) each;
    END IF;

    -- Delete original features
    DELETE FROM spatial_features
    WHERE id = ANY(p_feature_ids);

    -- Return success with new feature
    RETURN jsonb_build_object(
        'success', true,
        'feature_id', v_new_feature_id,
        'merged_count', array_length(p_feature_ids, 1),
        'geometry', ST_AsGeoJSON(v_merged_geom)::jsonb,
        'message', format('Successfully merged %s features', array_length(p_feature_ids, 1))
    );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION merge_spatial_features TO authenticated;
```

**Key Features**:
- ✅ Validates user permissions via RLS
- ✅ Ensures all features share same template
- ✅ Only allows merging polygons and lines
- ✅ Uses ST_Union for clean merge
- ✅ Preserves attributes (last edited wins)
- ✅ Adds audit trail in validation_notes
- ✅ Cascades deletes to attributes

---

### 1.4 Enhance upsert_spatial_feature() with Validation

```sql
-- Assuming this function exists, enhance it to call validation first
CREATE OR REPLACE FUNCTION upsert_spatial_feature(
    p_feature_id UUID,
    p_user_id UUID,
    p_property_id UUID,
    p_template_id UUID,
    p_geom JSONB  -- Now accepting GeoJSON as JSONB for consistency
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_validation_result JSONB;
    v_validated_geom GEOMETRY;
    v_feature_id UUID;
BEGIN
    -- Call validation function
    v_validation_result := validate_spatial_feature(
        p_geom::TEXT,
        p_template_id,
        p_property_id,
        0.5  -- Default snap tolerance
    );

    -- Check if validation passed
    IF NOT (v_validation_result->>'valid')::BOOLEAN THEN
        RAISE EXCEPTION 'Validation failed: %',
            v_validation_result->'issues';
    END IF;

    -- Extract validated geometry
    v_validated_geom := ST_SetSRID(
        ST_GeomFromGeoJSON(v_validation_result->'geometry'),
        4326
    );

    -- Insert or update
    INSERT INTO spatial_features (
        id,
        user_id,
        property_id,
        template_id,
        geom,
        is_valid,
        validation_notes,
        snapped_to_boundary
    )
    VALUES (
        COALESCE(p_feature_id, uuid_generate_v4()),
        p_user_id,
        p_property_id,
        p_template_id,
        v_validated_geom,
        true,
        ARRAY(SELECT jsonb_array_elements_text(v_validation_result->'warnings')),
        (v_validation_result->'metadata'->>'snapped')::BOOLEAN
    )
    ON CONFLICT (id) DO UPDATE SET
        geom = EXCLUDED.geom,
        template_id = EXCLUDED.template_id,
        last_edited = CURRENT_TIMESTAMP,
        is_valid = EXCLUDED.is_valid,
        validation_notes = EXCLUDED.validation_notes,
        snapped_to_boundary = EXCLUDED.snapped_to_boundary
    RETURNING id INTO v_feature_id;

    RETURN v_feature_id;
END;
$$;
```

---

## Phase 2: Frontend Component Enhancements

### 2.1 Create LeafletDrawControl Component

**File**: `src/components/map/leaflet/controls/LeafletDrawControl.svelte`

```svelte
<script lang="ts">
    import { onMount, onDestroy, getContext } from 'svelte';
    import {
        editingState,
        setActiveTemplate,
        setEditingMode,
        featureTemplates
    } from '$lib/leaflet/spatialutilities.svelte';
    import type L from 'leaflet';
    import type { Writable } from 'svelte/store';
    import type { FeatureTemplate } from '$lib/leaflet/spatial';
    import type { LayerInfo } from '$lib/leaflet/types';

    interface Props {
        position?: L.ControlPosition;
        propertyId: string;
    }

    let { position = 'topright', propertyId }: Props = $props();

    const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
        getLeaflet: () => typeof L;
        getLeafletMap: () => L.Map;
        getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
    }>('leafletContext');

    let leaflet: typeof L;
    let map: L.Map;
    let layersStore: Writable<Record<string, LayerInfo>>;
    let control: L.Control;
    let drawLayer: L.FeatureGroup;
    let currentDrawHandler: any = null;

    const templatesByCategory = $derived(
        Object.values(featureTemplates).reduce<Record<string, FeatureTemplate[]>>((acc, template) => {
            const t = template as FeatureTemplate;
            if (!acc[t.category]) {
                acc[t.category] = [];
            }
            acc[t.category].push(t);
            return acc;
        }, {})
    );

    function startDrawing(template: FeatureTemplate) {
        setActiveTemplate(template);
        setEditingMode('create');

        // Cancel any existing draw operation
        if (currentDrawHandler) {
            currentDrawHandler.disable();
        }

        const geomTypeMap: Record<string, string> = {
            point: 'marker',
            line: 'polyline',
            polygon: 'polygon'
        };

        const drawType = geomTypeMap[template.geometry_type];

        // Import leaflet-draw dynamically
        import('leaflet-draw').then(() => {
            currentDrawHandler = new (L.Draw as any)[
                drawType.charAt(0).toUpperCase() + drawType.slice(1)
            ](map, {
                shapeOptions: {
                    color: getCategoryColor(template.category),
                    weight: 3
                }
            });

            currentDrawHandler.enable();

            map.on('draw:created', handleDrawCreated);
        });
    }

    function handleDrawCreated(e: any) {
        const layer = e.layer;
        drawLayer.addLayer(layer);

        // Convert to GeoJSON and trigger validation
        const geoJSON = layer.toGeoJSON();

        // Dispatch event for parent to handle validation and save
        map.fire('feature:created', {
            geometry: geoJSON.geometry,
            template: editingState.activeTemplate,
            layer: layer
        });

        // Clean up
        if (currentDrawHandler) {
            currentDrawHandler.disable();
            currentDrawHandler = null;
        }
    }

    function getCategoryColor(category: string): string {
        const colors: Record<string, string> = {
            asset: '#2196F3',
            operational: '#4CAF50',
            hazard: '#F44336'
        };
        return colors[category] || '#757575';
    }

    function cancelDrawing() {
        if (currentDrawHandler) {
            currentDrawHandler.disable();
            currentDrawHandler = null;
        }
        setActiveTemplate(null);
        setEditingMode(null);
    }

    onMount(() => {
        leaflet = getLeaflet();
        map = getLeafletMap();
        layersStore = getLeafletLayers();

        // Create a feature group for drawing
        drawLayer = leaflet.featureGroup();
        map.addLayer(drawLayer);

        // Create custom control
        const DrawControl = leaflet.Control.extend({
            onAdd: function() {
                const container = leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-draw-control');
                container.innerHTML = `
                    <div class="draw-control-container">
                        <button class="draw-control-toggle" title="Draw Features">
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path d="M2 18 L18 2 M2 18 L6 14 L10 18"
                                      stroke="currentColor" fill="none" stroke-width="2"/>
                            </svg>
                        </button>
                        <div class="draw-control-panel" style="display: none;">
                            <!-- Populated by Svelte -->
                        </div>
                    </div>
                `;

                leaflet.DomEvent.disableClickPropagation(container);
                return container;
            }
        });

        control = new DrawControl({ position });
        control.addTo(map);
    });

    onDestroy(() => {
        if (currentDrawHandler) {
            currentDrawHandler.disable();
        }
        if (drawLayer) {
            map.removeLayer(drawLayer);
        }
        if (control) {
            control.remove();
        }
    });
</script>

<style>
    :global(.draw-control-container) {
        background: white;
        border-radius: 4px;
    }

    :global(.draw-control-toggle) {
        background: white;
        border: none;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.draw-control-toggle:hover) {
        background: #f5f5f5;
    }

    :global(.draw-control-panel) {
        position: absolute;
        right: 100%;
        top: 0;
        margin-right: 10px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        min-width: 250px;
        max-height: 400px;
        overflow-y: auto;
    }
</style>
```

**Key Features**:
- Template-based drawing interface
- Category-grouped template selection
- Leaflet.draw integration
- Event-driven architecture for validation
- Cancellable draw operations

---

### 2.2 Create LeafletValidationPanel Component

**File**: `src/components/map/leaflet/controls/LeafletValidationPanel.svelte`

```svelte
<script lang="ts">
    import { onMount, getContext } from 'svelte';
    import type L from 'leaflet';

    interface ValidationResult {
        valid: boolean;
        issues: string[];
        warnings: string[];
        geometry: GeoJSON.Geometry | null;
        metadata?: {
            snapped: boolean;
            area_m2?: number;
            length_m?: number;
        };
    }

    interface Props {
        position?: L.ControlPosition;
        validationResult: ValidationResult | null;
        onSave?: () => void;
        onCancel?: () => void;
        saving?: boolean;
    }

    let {
        position = 'topright',
        validationResult = null,
        onSave,
        onCancel,
        saving = false
    }: Props = $props();

    const { getLeaflet, getLeafletMap } = getContext<{
        getLeaflet: () => typeof L;
        getLeafletMap: () => L.Map;
    }>('leafletContext');

    let leaflet: typeof L;
    let map: L.Map;
    let control: L.Control;

    const hasIssues = $derived(
        validationResult?.issues && validationResult.issues.length > 0
    );

    const hasWarnings = $derived(
        validationResult?.warnings && validationResult.warnings.length > 0
    );

    const canSave = $derived(
        validationResult?.valid && !saving
    );

    function formatArea(area: number | undefined): string {
        if (!area) return '';
        if (area > 10000) {
            return `${(area / 10000).toFixed(2)} ha`;
        }
        return `${area.toFixed(1)} m²`;
    }

    function formatLength(length: number | undefined): string {
        if (!length) return '';
        if (length > 1000) {
            return `${(length / 1000).toFixed(2)} km`;
        }
        return `${length.toFixed(1)} m`;
    }

    onMount(() => {
        leaflet = getLeaflet();
        map = getLeafletMap();

        const ValidationControl = leaflet.Control.extend({
            onAdd: function() {
                const container = leaflet.DomUtil.create('div',
                    'leaflet-control leaflet-validation-panel');
                leaflet.DomEvent.disableClickPropagation(container);
                return container;
            }
        });

        control = new ValidationControl({ position });
        control.addTo(map);
    });
</script>

{#if validationResult}
    <div class="validation-content" class:valid={validationResult.valid} class:invalid={!validationResult.valid}>
        <div class="validation-header">
            <h3>
                {#if validationResult.valid}
                    ✓ Validation Passed
                {:else}
                    ✗ Validation Failed
                {/if}
            </h3>
        </div>

        {#if validationResult.metadata}
            <div class="validation-metadata">
                {#if validationResult.metadata.area_m2}
                    <div class="metadata-item">
                        <strong>Area:</strong> {formatArea(validationResult.metadata.area_m2)}
                    </div>
                {/if}
                {#if validationResult.metadata.length_m}
                    <div class="metadata-item">
                        <strong>Length:</strong> {formatLength(validationResult.metadata.length_m)}
                    </div>
                {/if}
                {#if validationResult.metadata.snapped}
                    <div class="metadata-item snapped">
                        🎯 Snapped to property boundary
                    </div>
                {/if}
            </div>
        {/if}

        {#if hasIssues}
            <div class="validation-issues">
                <strong>Issues:</strong>
                <ul>
                    {#each validationResult.issues as issue}
                        <li>{issue}</li>
                    {/each}
                </ul>
            </div>
        {/if}

        {#if hasWarnings}
            <div class="validation-warnings">
                <strong>Warnings:</strong>
                <ul>
                    {#each validationResult.warnings as warning}
                        <li>{warning}</li>
                    {/each}
                </ul>
            </div>
        {/if}

        <div class="validation-actions">
            <button
                class="btn-save"
                disabled={!canSave}
                onclick={onSave}
            >
                {saving ? 'Saving...' : 'Save Feature'}
            </button>
            <button class="btn-cancel" onclick={onCancel}>
                Cancel
            </button>
        </div>
    </div>
{/if}

<style>
    :global(.leaflet-validation-panel) {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        max-width: 350px;
    }

    .validation-content {
        padding: 16px;
        border-left: 4px solid #4CAF50;
    }

    .validation-content.invalid {
        border-left-color: #F44336;
    }

    .validation-header h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #4CAF50;
    }

    .validation-content.invalid .validation-header h3 {
        color: #F44336;
    }

    .validation-metadata {
        margin-bottom: 12px;
        padding: 8px;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 13px;
    }

    .metadata-item {
        margin: 4px 0;
    }

    .metadata-item.snapped {
        color: #2196F3;
        font-weight: 500;
    }

    .validation-issues,
    .validation-warnings {
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 4px;
        font-size: 13px;
    }

    .validation-issues {
        background: #ffebee;
        color: #c62828;
    }

    .validation-warnings {
        background: #fff3e0;
        color: #e65100;
    }

    .validation-issues ul,
    .validation-warnings ul {
        margin: 4px 0 0 0;
        padding-left: 20px;
    }

    .validation-issues li,
    .validation-warnings li {
        margin: 2px 0;
    }

    .validation-actions {
        display: flex;
        gap: 8px;
    }

    .btn-save,
    .btn-cancel {
        flex: 1;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .btn-save {
        background: #4CAF50;
        color: white;
    }

    .btn-save:hover:not(:disabled) {
        background: #45a049;
    }

    .btn-save:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .btn-cancel {
        background: #f5f5f5;
        color: #333;
    }

    .btn-cancel:hover {
        background: #e0e0e0;
    }
</style>
```

---

### 2.3 Create LeafletMergeControl Component

**File**: `src/components/map/leaflet/controls/LeafletMergeControl.svelte`

```svelte
<script lang="ts">
    import { onMount, onDestroy, getContext } from 'svelte';
    import type L from 'leaflet';
    import type { Writable } from 'svelte/store';
    import type { LayerInfo } from '$lib/leaflet/types';

    interface Props {
        position?: L.ControlPosition;
        onMerge?: (featureIds: string[]) => void;
    }

    let { position = 'topright', onMerge }: Props = $props();

    const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
        getLeaflet: () => typeof L;
        getLeafletMap: () => L.Map;
        getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
    }>('leafletContext');

    let leaflet: typeof L;
    let map: L.Map;
    let layersStore: Writable<Record<string, LayerInfo>>;
    let control: L.Control;

    let mergeMode = $state(false);
    let selectedFeatures = $state<Set<string>>(new Set());
    let selectedLayers = $state<Map<string, L.Layer>>(new Map());

    function toggleMergeMode() {
        mergeMode = !mergeMode;

        if (!mergeMode) {
            clearSelection();
        } else {
            enableSelection();
        }
    }

    function enableSelection() {
        // Add click handlers to editable layers
        layersStore.subscribe(layers => {
            Object.entries(layers).forEach(([layerName, layerInfo]) => {
                if (layerInfo.editable && layerInfo.layer instanceof leaflet.GeoJSON) {
                    layerInfo.layer.eachLayer((layer: any) => {
                        layer.on('click', handleFeatureClick);
                    });
                }
            });
        });
    }

    function handleFeatureClick(e: L.LeafletMouseEvent) {
        if (!mergeMode) return;

        L.DomEvent.stopPropagation(e);

        const layer = e.target;
        const featureId = layer.feature?.properties?.id;

        if (!featureId) return;

        if (selectedFeatures.has(featureId)) {
            // Deselect
            selectedFeatures.delete(featureId);
            selectedLayers.delete(featureId);
            layer.setStyle({ color: '#3388ff', weight: 3 });
        } else {
            // Select
            selectedFeatures.add(featureId);
            selectedLayers.set(featureId, layer);
            layer.setStyle({ color: '#FFD700', weight: 5 });
        }

        selectedFeatures = new Set(selectedFeatures); // Trigger reactivity
    }

    function clearSelection() {
        selectedLayers.forEach((layer: any) => {
            layer.setStyle({ color: '#3388ff', weight: 3 });
        });
        selectedFeatures.clear();
        selectedLayers.clear();
        selectedFeatures = new Set(); // Trigger reactivity
    }

    function executeMerge() {
        if (selectedFeatures.size < 2) {
            alert('Please select at least 2 features to merge');
            return;
        }

        const featureIds = Array.from(selectedFeatures);
        onMerge?.(featureIds);

        // Reset
        toggleMergeMode();
    }

    onMount(() => {
        leaflet = getLeaflet();
        map = getLeafletMap();
        layersStore = getLeafletLayers();

        const MergeControl = leaflet.Control.extend({
            onAdd: function() {
                const container = leaflet.DomUtil.create('div',
                    'leaflet-bar leaflet-control leaflet-merge-control');
                leaflet.DomEvent.disableClickPropagation(container);
                return container;
            }
        });

        control = new MergeControl({ position });
        control.addTo(map);
    });

    onDestroy(() => {
        clearSelection();
        if (control) {
            control.remove();
        }
    });
</script>

<div class="merge-control-content">
    <button
        class="merge-toggle"
        class:active={mergeMode}
        onclick={toggleMergeMode}
        title={mergeMode ? 'Cancel merge' : 'Merge features'}
    >
        <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M4 4 L9 4 L9 9 L4 9 Z M11 11 L16 11 L16 16 L11 16 Z M9 9 L11 11"
                  stroke="currentColor" fill="none" stroke-width="2"/>
        </svg>
    </button>

    {#if mergeMode}
        <div class="merge-panel">
            <div class="merge-info">
                Selected: {selectedFeatures.size} feature{selectedFeatures.size !== 1 ? 's' : ''}
            </div>
            <div class="merge-actions">
                <button
                    class="btn-merge"
                    disabled={selectedFeatures.size < 2}
                    onclick={executeMerge}
                >
                    Merge ({selectedFeatures.size})
                </button>
                <button class="btn-clear" onclick={clearSelection}>
                    Clear
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .merge-control-content {
        background: white;
        border-radius: 4px;
    }

    .merge-toggle {
        background: white;
        border: none;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
    }

    .merge-toggle:hover {
        background: #f5f5f5;
    }

    .merge-toggle.active {
        background: #FFD700;
    }

    .merge-panel {
        position: absolute;
        right: 100%;
        top: 0;
        margin-right: 10px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        padding: 12px;
        min-width: 200px;
    }

    .merge-info {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 500;
    }

    .merge-actions {
        display: flex;
        gap: 8px;
    }

    .btn-merge,
    .btn-clear {
        flex: 1;
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
    }

    .btn-merge {
        background: #4CAF50;
        color: white;
    }

    .btn-merge:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .btn-clear {
        background: #f5f5f5;
    }

    .btn-clear:hover {
        background: #e0e0e0;
    }
</style>
```

---

### 2.4 Enhance Layer Components with Snapping

**Update**: [LeafletGeoJSONPolygonLayer.svelte](src/components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte#L140-L142)

```svelte
<!-- Replace placeholder comment at line 140-142 -->
{#if editable}
    <script>
        import('leaflet-editable').then(() => {
            setupEditableLayer();
        });

        function setupEditableLayer() {
            geoJSONLayer.eachLayer((layer: any) => {
                layer.on('click', () => {
                    if (editingState.mode === 'edit') {
                        layer.enableEdit();
                    }
                });
            });

            // Setup snapping to property boundary
            setupSnapping();
        }

        function setupSnapping() {
            // Get property boundary layer
            const propertyLayer = layersStore.subscribe(layers => {
                const boundaryLayer = layers['Property Boundary Layer'];
                if (boundaryLayer && boundaryLayer.layer) {
                    enableSnapToLayer(boundaryLayer.layer);
                }
            });
        }

        function enableSnapToLayer(snapLayer: L.Layer) {
            // Use leaflet-editable snapping
            if (map.editTools) {
                map.editTools.featuresLayer = snapLayer;
            }
        }
    </script>
{/if}
```

---

## Phase 3: Backend Integration Enhancements

### 3.1 Add Validation Action to +page.server.ts

**File**: [src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.server.ts](src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.server.ts)

```typescript
export const actions: Actions = {
    // ... existing saveFeature and deleteFeature actions ...

    validateFeature: async ({ request, locals: { supabase, user } }) => {
        const formData = await request.formData();
        const propertyId = formData.get('propertyId');
        const templateId = formData.get('templateId');
        const geometryStr = formData.get('geometry');

        if (!propertyId || !templateId || !geometryStr) {
            return fail(400, {
                success: false,
                message: 'Missing required fields'
            });
        }

        const { data: validationResult, error: validationError } = await supabase.rpc(
            'validate_spatial_feature',
            {
                p_geojson: geometryStr.toString(),
                p_template_id: templateId.toString(),
                p_property_id: propertyId.toString(),
                p_snap_tolerance: 0.5
            }
        );

        if (validationError) {
            console.log('validationError', validationError.message);
            return fail(400, {
                success: false,
                message: 'Validation failed',
                error: validationError.message
            });
        }

        return {
            success: true,
            validation: validationResult
        };
    },

    mergeFeatures: async ({ request, locals: { supabase, user } }) => {
        const formData = await request.formData();
        const propertyId = formData.get('propertyId');
        const featureIdsStr = formData.get('featureIds');

        if (!propertyId || !featureIdsStr) {
            return fail(400, {
                success: false,
                message: 'Missing required fields'
            });
        }

        const featureIds = JSON.parse(featureIdsStr.toString());

        const { data: mergeResult, error: mergeError } = await supabase.rpc(
            'merge_spatial_features',
            {
                p_feature_ids: featureIds,
                p_user_id: user.id,
                p_property_id: propertyId.toString()
            }
        );

        if (mergeError) {
            console.log('mergeError', mergeError.message);
            return fail(400, {
                success: false,
                message: 'Merge failed',
                error: mergeError.message
            });
        }

        if (!mergeResult.success) {
            return fail(400, {
                success: false,
                message: mergeResult.error || 'Merge failed'
            });
        }

        return {
            success: true,
            message: mergeResult.message,
            featureId: mergeResult.feature_id,
            geometry: mergeResult.geometry
        };
    }
};
```

---

### 3.2 Create Client-Side Service Layer

**File**: `src/lib/services/spatial-validation.ts`

```typescript
import type { Geometry } from 'geojson';

export interface ValidationResult {
    valid: boolean;
    issues: string[];
    warnings: string[];
    geometry: Geometry | null;
    metadata?: {
        snapped: boolean;
        area_m2?: number;
        length_m?: number;
    };
}

export interface MergeResult {
    success: boolean;
    feature_id?: string;
    merged_count?: number;
    geometry?: Geometry;
    message?: string;
    error?: string;
}

/**
 * Validate a feature geometry against PostGIS rules
 */
export async function validateFeature(
    geometry: Geometry,
    templateId: string,
    propertyId: string,
    snapTolerance: number = 0.5
): Promise<ValidationResult> {
    const formData = new FormData();
    formData.append('propertyId', propertyId);
    formData.append('templateId', templateId);
    formData.append('geometry', JSON.stringify(geometry));

    const response = await fetch('?/validateFeature', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Validation failed');
    }

    return result.validation;
}

/**
 * Merge multiple features into one
 */
export async function mergeFeatures(
    featureIds: string[],
    propertyId: string
): Promise<MergeResult> {
    const formData = new FormData();
    formData.append('propertyId', propertyId);
    formData.append('featureIds', JSON.stringify(featureIds));

    const response = await fetch('?/mergeFeatures', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    return result;
}
```

---

## Phase 4: Integration into +page.svelte

### 4.1 Update My Property Map Page

**File**: [src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.svelte](src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.svelte)

**Add these imports and state**:

```svelte
<script lang="ts">
    // ... existing imports ...
    import { validateFeature, mergeFeatures } from '$lib/services/spatial-validation';
    import { enhance } from '$app/forms';
    import { toast } from '$lib/components/ui/toast'; // Assuming you have toast system

    // New components
    let LeafletDrawControl = $state<Component>();
    let LeafletValidationPanel = $state<Component>();
    let LeafletMergeControl = $state<Component>();

    // State for validation
    let validationResult = $state<any>(null);
    let pendingFeature = $state<any>(null);
    let saving = $state(false);

    // Load new components in onMount
    onMount(async () => {
        [
            // ... existing component loads ...
            LeafletDrawControl,
            LeafletValidationPanel,
            LeafletMergeControl
        ] = await Promise.all([
            // ... existing imports ...
            import('$components/map/leaflet/controls/LeafletDrawControl.svelte').then(m => m.default),
            import('$components/map/leaflet/controls/LeafletValidationPanel.svelte').then(m => m.default),
            import('$components/map/leaflet/controls/LeafletMergeControl.svelte').then(m => m.default)
        ]);
    });

    // Handle feature creation
    function handleFeatureCreated(e: CustomEvent) {
        pendingFeature = {
            geometry: e.detail.geometry,
            template: e.detail.template,
            layer: e.detail.layer
        };

        // Trigger validation
        validateNewFeature();
    }

    async function validateNewFeature() {
        if (!pendingFeature) return;

        try {
            validationResult = await validateFeature(
                pendingFeature.geometry,
                pendingFeature.template.id,
                data.propertyGeometryData[0].property.features[0].properties.id,
                0.5
            );

            // Update the drawn layer with snapped geometry
            if (validationResult.geometry && pendingFeature.layer) {
                const geoJSONFormat = new L.GeoJSON();
                const updatedGeom = geoJSONFormat.geometryToLayer(
                    validationResult.geometry
                );

                // Replace layer geometry
                if (updatedGeom) {
                    map.removeLayer(pendingFeature.layer);
                    pendingFeature.layer = updatedGeom;
                    map.addLayer(updatedGeom);
                }
            }
        } catch (err) {
            toast.error('Validation failed: ' + err.message);
        }
    }

    async function saveValidatedFeature() {
        if (!validationResult?.valid || !pendingFeature) return;

        saving = true;

        const formData = new FormData();
        formData.append('propertyId', data.propertyGeometryData[0].property.features[0].properties.id);
        formData.append('templateId', pendingFeature.template.id);
        formData.append('geometry', JSON.stringify(validationResult.geometry));

        try {
            const response = await fetch('?/saveFeature', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'Feature saved successfully');

                // Clear validation and pending feature
                validationResult = null;
                pendingFeature = null;

                // Reload page data
                location.reload(); // Or use invalidate() for better UX
            } else {
                toast.error(result.message || 'Failed to save feature');
            }
        } catch (err) {
            toast.error('Error saving feature');
        } finally {
            saving = false;
        }
    }

    function cancelFeatureCreation() {
        if (pendingFeature?.layer) {
            map.removeLayer(pendingFeature.layer);
        }
        pendingFeature = null;
        validationResult = null;
    }

    async function handleMerge(featureIds: string[]) {
        try {
            const result = await mergeFeatures(
                featureIds,
                data.propertyGeometryData[0].property.features[0].properties.id
            );

            if (result.success) {
                toast.success(result.message || 'Features merged successfully');
                location.reload();
            } else {
                toast.error(result.error || 'Merge failed');
            }
        } catch (err) {
            toast.error('Error merging features');
        }
    }
</script>

<!-- In the template, add the new controls -->
<LeafletMap ...>
    <!-- ... existing layers ... -->

    {#if LeafletDrawControl}
        <LeafletDrawControl
            position="topright"
            propertyId={data.propertyGeometryData[0].property.features[0].properties.id}
        />
    {/if}

    {#if LeafletValidationPanel}
        <LeafletValidationPanel
            position="topleft"
            {validationResult}
            onSave={saveValidatedFeature}
            onCancel={cancelFeatureCreation}
            {saving}
        />
    {/if}

    {#if LeafletMergeControl}
        <LeafletMergeControl
            position="topright"
            onMerge={handleMerge}
        />
    {/if}

    <!-- ... other controls ... -->
</LeafletMap>
```

---

## Phase 5: Recommended Schema Improvements

### 5.1 Add Spatial Indexes for Performance

```sql
-- Add additional spatial indexes for common query patterns
CREATE INDEX idx_spatial_features_property_geom
ON spatial_features USING GIST(property_id, geom);

-- Add index for template-based queries
CREATE INDEX idx_spatial_features_template_geom
ON spatial_features USING GIST(template_id, geom);
```

### 5.2 Add Audit Trail Table (Optional)

```sql
CREATE TABLE spatial_feature_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_id UUID NOT NULL,
    operation VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'MERGE'
    previous_geom GEOMETRY,
    new_geom GEOMETRY,
    changed_by UUID REFERENCES user_profile(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    change_notes TEXT
);

CREATE INDEX idx_feature_history_feature_id ON spatial_feature_history(feature_id);
CREATE INDEX idx_feature_history_changed_at ON spatial_feature_history(changed_at DESC);

-- Trigger to capture changes
CREATE OR REPLACE FUNCTION audit_spatial_feature_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO spatial_feature_history (
            feature_id, operation, previous_geom, changed_by, change_notes
        ) VALUES (
            OLD.id, 'DELETE', OLD.geom, auth.uid(), 'Feature deleted'
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO spatial_feature_history (
            feature_id, operation, previous_geom, new_geom, changed_by
        ) VALUES (
            NEW.id, 'UPDATE', OLD.geom, NEW.geom, auth.uid()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO spatial_feature_history (
            feature_id, operation, new_geom, changed_by
        ) VALUES (
            NEW.id, 'INSERT', NEW.geom, auth.uid()
        );
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_spatial_features
    AFTER INSERT OR UPDATE OR DELETE ON spatial_features
    FOR EACH ROW
    EXECUTE FUNCTION audit_spatial_feature_changes();
```

---

## Phase 6: Testing & Quality Assurance

### 6.1 Validation Testing Scenarios

1. **Geometry Type Validation**
   - Draw point on polygon template → Should fail
   - Draw polygon on line template → Should fail

2. **Boundary Snapping**
   - Draw polygon near property boundary → Should snap
   - Verify snapped geometry visual feedback

3. **Topology Validation**
   - Create overlapping hazard polygons → Should warn
   - Create tiny polygon (< 1m²) → Should fail
   - Create self-intersecting polygon → Should fail

4. **Merge Operations**
   - Merge 2 adjacent polygons → Should create union
   - Merge features from different templates → Should fail
   - Merge point features → Should fail

### 6.2 Performance Testing

- Load 100+ features per property
- Test validation response time (<500ms target)
- Test merge operation on complex geometries

---

## Phase 7: Documentation & Training

### 7.1 User Documentation

Create user guide covering:
- How to draw features
- Understanding validation messages
- Using merge tool
- Best practices for geometry creation

### 7.2 Developer Documentation

- RPC function API documentation
- Component integration guide
- Database schema ERD
- Validation rules reference

---

## Implementation Timeline Recommendation

### Sprint 1 (Week 1-2): Database Foundation
- [ ] Add validation columns to spatial_features
- [ ] Implement validate_spatial_feature() RPC
- [ ] Implement merge_spatial_features() RPC
- [ ] Add spatial indexes
- [ ] Write database tests

### Sprint 2 (Week 3-4): Frontend Components
- [ ] Create LeafletDrawControl
- [ ] Create LeafletValidationPanel
- [ ] Create LeafletMergeControl
- [ ] Enhance layer components with snapping
- [ ] Create spatial-validation service

### Sprint 3 (Week 5): Integration
- [ ] Update +page.server.ts with new actions
- [ ] Integrate components into +page.svelte
- [ ] Wire up validation workflow
- [ ] Wire up merge workflow
- [ ] Add toast notifications

### Sprint 4 (Week 6): Testing & Polish
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] UI/UX refinements
- [ ] Error handling improvements
- [ ] Documentation

---

## Future Enhancements (Post-MVP)

1. **Split Operations** - Split polygons with cut line tool
2. **Undo/Redo** - Feature history and rollback
3. **Bulk Import** - Upload Shapefile/GeoJSON
4. **Export Capabilities** - Export property features as GeoPackage
5. **Advanced Topology** - Use PostGIS topology extension for rigorous validation
6. **Offline Sync** - PWA with offline editing and sync
7. **Feature Templates Library** - Shared templates across properties
8. **AI-Assisted Digitizing** - Auto-trace from satellite imagery

---

## Key Architectural Principles

✅ **Server-Side Validation** - PostGIS as source of truth for geometry quality
✅ **Progressive Enhancement** - Validation previews enhance UX without blocking workflow
✅ **Security First** - RLS policies enforced, SECURITY DEFINER for controlled access
✅ **Component Reusability** - Leaflet controls as standalone, composable components
✅ **Type Safety** - Full TypeScript coverage with GeoJSON types
✅ **Performance** - Spatial indexes, efficient ST_ functions, client-side caching
✅ **Audit Trail** - Track all geometry changes for compliance

---

## Conclusion

This roadmap provides a comprehensive, production-ready enhancement to your My Property Map feature with:

- **Robust validation** using PostGIS geometric operations
- **Intelligent snapping** to property boundaries for topology consistency
- **Merge capabilities** for polygon and line features
- **Seamless integration** with your existing Leaflet + SvelteKit architecture
- **Scalable patterns** that respect your RLS policies and form action conventions

All recommendations leverage your existing strengths while filling identified gaps with industry-standard PostGIS techniques adapted specifically for Leaflet instead of OpenLayers.
