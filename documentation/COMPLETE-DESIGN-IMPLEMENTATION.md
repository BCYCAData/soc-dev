# Supabase Vector Layers - Complete Design & Implementation Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Framework:** SvelteKit 2.x + Leaflet + Supabase

---

## Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Core Design Principles](#core-design-principles)
3. [Directory Structure](#directory-structure)
4. [Type System](#type-system)
5. [Configuration System](#configuration-system)
6. [Data Layer](#data-layer)
7. [Styling System](#styling-system)
8. [Interaction System](#interaction-system)
9. [Editing System](#editing-system)
10. [Component Architecture](#component-architecture)
11. [Implementation Roadmap](#implementation-roadmap)
12. [Complete Examples](#complete-examples)
13. [Best Practices](#best-practices)

---

## Overview & Architecture

### System Goals

This architecture provides a complete solution for managing **vector map layers** (points, lines, polygons) with data sourced from **Supabase PostGIS**, integrated into a **SvelteKit + Leaflet** application. The system supports:

- ✅ Multiple independent layers with thousands of features
- ✅ Static, dynamic, and user-configurable styling
- ✅ Popups, tooltips, and side panel interactions
- ✅ Query/filter capabilities
- ✅ Hover highlighting and feature selection
- ✅ Full CRUD operations with undo support
- ✅ SSR-friendly with progressive enhancement

### Architectural Decisions

**1. File-Based Configuration (Not Database)**
- All layer configs are TypeScript files in the project
- Benefits: Version control, type safety, no DB migrations for config changes
- Trade-off: Requires deployment to change configs (appropriate for dev-managed layers)

**2. SvelteKit Load Functions + Form Actions (Not Pure Client)**
- Load functions handle data fetching (SSR + caching)
- Form actions handle updates (progressive enhancement)
- Benefits: Better performance, SEO, automatic state management

**3. Three-Manager Pattern**
- Separate managers for data, styling, and interactions
- Benefits: Separation of concerns, testability, reusability

**4. Leaflet + GeoJSON (Not Vector Tiles)**
- Direct GeoJSON rendering via Leaflet
- Suitable for datasets with hundreds to low thousands of features
- For larger datasets: Use viewport-based loading and clustering

---

## Core Design Principles

### 1. Type Safety First
- All configurations are strongly typed
- Generate types from schemas
- Compile-time error checking

### 2. Progressive Enhancement
- Works without JavaScript (where possible)
- Form actions for CRUD operations
- Server-side rendering for initial load

### 3. Separation of Concerns
- Data loading (server)
- Style calculation (client/server)
- User interaction (client)
- Edit operations (form actions)

### 4. Performance Optimization
- Server-side caching with invalidation
- Viewport-based data loading for large datasets
- Clustering for point layers
- Efficient re-rendering strategies

### 5. Developer Experience
- Declarative configuration
- Reusable components and utilities
- Clear error messages
- Comprehensive examples

---

## Directory Structure

```
src/
├── lib/
│   ├── layers/
│   │   ├── configs/
│   │   │   ├── index.ts                    # Layer registry
│   │   │   ├── parcels.config.ts           # Parcel layer
│   │   │   ├── roads.config.ts             # Roads layer
│   │   │   ├── buildings.config.ts         # Buildings layer
│   │   │   └── poi.config.ts               # Points of interest
│   │   ├── schemas/
│   │   │   ├── layer-config.types.ts       # Core type definitions
│   │   │   └── feature-schemas.ts          # Property schemas
│   │   ├── styles/
│   │   │   ├── index.ts                    # Style presets & utilities
│   │   │   ├── choropleth.ts               # Numeric data styling
│   │   │   └── categorized.ts              # Categorical data styling
│   │   └── templates/
│   │       ├── popup-templates.ts          # Popup HTML templates
│   │       └── tooltip-templates.ts        # Tooltip templates
│   ├── server/
│   │   ├── supabase.ts                     # Supabase client
│   │   └── layers/
│   │       ├── loader.ts                   # Data loading logic
│   │       └── operations.ts               # CRUD operations
│   ├── map/
│   │   ├── components/
│   │   │   ├── VectorLayer.svelte          # Layer renderer
│   │   │   ├── FeaturePopup.svelte         # Popup component
│   │   │   ├── FeaturePanel.svelte         # Side panel
│   │   │   ├── LayerControl.svelte         # Layer visibility control
│   │   │   └── QueryControl.svelte         # Filter/query UI
│   │   ├── stores/
│   │   │   ├── layer-state.ts              # Layer state management
│   │   │   ├── selection.ts                # Feature selection
│   │   │   └── editing.ts                  # Edit session state
│   │   ├── utils/
│   │   │   ├── style-manager.ts            # Style calculation
│   │   │   └── interaction.ts              # Event handling
│   │   ├── NewMap.svelte                   # Map container
│   │   ├── BaseLayerGroup.svelte           # Base layers
│   │   └── OverlayLayerGroup.svelte        # Overlay layers
│   └── utils/
│       └── formatters.ts                   # Value formatting
└── routes/
    └── map/
        ├── +layout.server.ts               # Layer catalog load
        ├── +page.svelte                    # Main map page
        └── +page.server.ts                 # Data load + actions
```

---

## Type System

### Core Types

```typescript
// src/lib/layers/schemas/layer-config.types.ts

export type GeometryType = 
  | 'Point' 
  | 'LineString' 
  | 'Polygon' 
  | 'MultiPoint' 
  | 'MultiLineString' 
  | 'MultiPolygon';

export type StyleMode = 
  | 'static' 
  | 'dynamic' 
  | 'categorized' 
  | 'choropleth';

/**
 * Complete layer configuration
 */
export interface LayerConfig {
  // Identification
  id: string;
  name: string;
  description?: string;
  geometryType: GeometryType;
  category?: string;
  
  // Data source
  source: {
    rpcFunction: string;              // Supabase RPC function name
    params?: Record<string, any>;     // Default parameters
    cacheKey?: string;                // Cache identifier
    cacheDuration?: number;           // Cache TTL in ms
  };
  
  // Styling
  styling: StyleConfig;
  
  // Interaction
  interaction: InteractionConfig;
  
  // Query/Filter
  query?: QueryConfig;
  
  // Editing
  editing?: EditConfig;
  
  // Display options
  display?: {
    defaultVisible?: boolean;
    minZoom?: number;
    maxZoom?: number;
    pane?: string;
    zIndex?: number;
  };
  
  // Property schema (for forms & validation)
  properties?: PropertySchema[];
}

/**
 * Style configuration
 */
export interface StyleConfig {
  mode: StyleMode;
  
  // Base styles
  base?: {
    point?: PointStyle;
    line?: LineStyle;
    polygon?: PolygonStyle;
  };
  
  // Dynamic styling function
  styleFn?: (feature: GeoJSON.Feature) => any;
  
  // Categorized styling
  categorized?: {
    property: string;
    categories: Record<string, CategoryStyle>;
    default?: CategoryStyle;
  };
  
  // Choropleth styling
  choropleth?: {
    property: string;
    breaks: number[];
    colors: string[];
    method?: 'quantile' | 'equal-interval' | 'natural-breaks';
  };
  
  // Hover & selection styles
  hover?: {
    point?: Partial<PointStyle>;
    line?: Partial<LineStyle>;
    polygon?: Partial<PolygonStyle>;
  };
  
  selection?: {
    point?: Partial<PointStyle>;
    line?: Partial<LineStyle>;
    polygon?: Partial<PolygonStyle>;
  };
}

/**
 * Interaction configuration
 */
export interface InteractionConfig {
  popup?: {
    enabled: boolean;
    template?: string | ((feature: GeoJSON.Feature) => string);
    fields?: string[];
    maxWidth?: number;
  };
  
  tooltip?: {
    enabled: boolean;
    template?: string | ((feature: GeoJSON.Feature) => string);
    property?: string;
  };
  
  sidePanel?: {
    enabled: boolean;
  };
  
  click?: {
    enabled: boolean;
    selectMode?: 'single' | 'multiple' | 'none';
  };
  
  hover?: {
    enabled: boolean;
    highlight: boolean;
  };
}

/**
 * Query/filter configuration
 */
export interface QueryConfig {
  enabled: boolean;
  filters?: FilterDefinition[];
  allowCustomFilters?: boolean;
}

export interface FilterDefinition {
  id: string;
  label: string;
  field: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  operators?: FilterOperator[];
  options?: { value: any; label: string }[];
  default?: any;
}

export type FilterOperator = 
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' 
  | 'in' | 'like' | 'ilike' | 'between';

/**
 * Edit configuration
 */
export interface EditConfig {
  enabled: boolean;
  allowCreate?: boolean;
  allowUpdate?: boolean;
  allowDelete?: boolean;
  
  geometry?: {
    editable: boolean;
    snapping?: boolean;
    snapLayers?: string[];
  };
  
  properties?: {
    editable: boolean;
    validation?: Record<string, ValidationRule>;
  };
  
  operations?: {
    create?: string;    // RPC function name
    update?: string;
    delete?: string;
  };
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any, feature: GeoJSON.Feature) => string | null;
}

/**
 * Property schema for forms
 */
export interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required?: boolean;
  readonly?: boolean;
  default?: any;
  options?: { value: any; label: string }[];
  validation?: ValidationRule;
  help?: string;
  group?: string;
  order?: number;
}

/**
 * Style definitions
 */
export interface PointStyle {
  radius?: number;
  fillColor?: string;
  fillOpacity?: number;
  color?: string;
  weight?: number;
  opacity?: number;
}

export interface LineStyle {
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

export interface PolygonStyle {
  fillColor?: string;
  fillOpacity?: number;
  color?: string;
  weight?: number;
  opacity?: number;
}

export interface CategoryStyle {
  point?: PointStyle;
  line?: LineStyle;
  polygon?: PolygonStyle;
  label?: string;
}

/**
 * Layer registry
 */
export type LayerRegistry = Record<string, LayerConfig>;
```

---

## Configuration System

### Layer Registry

```typescript
// src/lib/layers/configs/index.ts

import type { LayerRegistry } from '../schemas/layer-config.types';
import { parcelsLayer } from './parcels.config';
import { roadsLayer } from './roads.config';
import { poiLayer } from './poi.config';
import { buildingsLayer } from './buildings.config';

/**
 * Central registry of all layer configurations
 */
export const layerRegistry: LayerRegistry = {
  parcels: parcelsLayer,
  roads: roadsLayer,
  poi: poiLayer,
  buildings: buildingsLayer
};

/**
 * Get a layer config by ID
 */
export function getLayerConfig(layerId: string): LayerConfig {
  const config = layerRegistry[layerId];
  if (!config) {
    throw new Error(`Layer config not found: ${layerId}`);
  }
  return config;
}

/**
 * Get all layer configs
 */
export function getAllLayerConfigs(): LayerConfig[] {
  return Object.values(layerRegistry);
}

/**
 * Get layers by category
 */
export function getLayersByCategory(category: string): LayerConfig[] {
  return Object.values(layerRegistry).filter(
    layer => layer.category === category
  );
}

/**
 * Get editable layers
 */
export function getEditableLayers(): LayerConfig[] {
  return Object.values(layerRegistry).filter(
    layer => layer.editing?.enabled
  );
}

/**
 * Get default visible layers
 */
export function getDefaultVisibleLayers(): string[] {
  return Object.values(layerRegistry)
    .filter(layer => layer.display?.defaultVisible)
    .map(layer => layer.id);
}
```

### Example Layer Configuration

```typescript
// src/lib/layers/configs/parcels.config.ts

import type { LayerConfig } from '../schemas/layer-config.types';
import { parcelFeatureSchema } from '../schemas/feature-schemas';
import { parcelPopupTemplate } from '../templates/popup-templates';
import { parcelTooltip } from '../templates/tooltip-templates';
import choropleth from '../styles/choropleth';

export const parcelsLayer: LayerConfig = {
  // Basic metadata
  id: 'parcels',
  name: 'Property Parcels',
  description: 'Property boundaries and ownership information',
  geometryType: 'Polygon',
  category: 'Land Management',
  
  // Data source
  source: {
    rpcFunction: 'get_parcels_geojson',
    params: {},
    cacheKey: 'parcels',
    cacheDuration: 5 * 60 * 1000 // 5 minutes
  },
  
  // Styling - choropleth by area
  styling: {
    mode: 'choropleth',
    
    base: {
      polygon: {
        fillOpacity: 0.4,
        color: '#2563eb',
        weight: 2,
        opacity: 0.8
      }
    },
    
    choropleth: {
      property: 'area',
      breaks: [1000, 5000, 10000, 50000],
      colors: ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1d4ed8'],
      method: 'quantile'
    },
    
    hover: {
      polygon: {
        fillOpacity: 0.6,
        weight: 3
      }
    },
    
    selection: {
      polygon: {
        fillColor: '#f59e0b',
        fillOpacity: 0.7,
        color: '#f59e0b',
        weight: 3
      }
    }
  },
  
  // Interaction
  interaction: {
    popup: {
      enabled: true,
      template: parcelPopupTemplate,
      maxWidth: 400
    },
    
    tooltip: {
      enabled: true,
      template: parcelTooltip
    },
    
    sidePanel: {
      enabled: true
    },
    
    click: {
      enabled: true,
      selectMode: 'single'
    },
    
    hover: {
      enabled: true,
      highlight: true
    }
  },
  
  // Query/filter
  query: {
    enabled: true,
    filters: [
      {
        id: 'area',
        label: 'Area',
        field: 'area',
        type: 'number',
        operators: ['gt', 'lt', 'between']
      },
      {
        id: 'zoning',
        label: 'Zoning',
        field: 'zoning',
        type: 'select',
        operators: ['eq', 'in'],
        options: [
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'industrial', label: 'Industrial' },
          { value: 'agricultural', label: 'Agricultural' }
        ]
      },
      {
        id: 'owner',
        label: 'Owner',
        field: 'owner_name',
        type: 'text',
        operators: ['like', 'ilike']
      }
    ],
    allowCustomFilters: true
  },
  
  // Editing
  editing: {
    enabled: true,
    allowCreate: false,
    allowUpdate: true,
    allowDelete: false,
    
    geometry: {
      editable: true,
      snapping: true,
      snapLayers: ['parcels']
    },
    
    properties: {
      editable: true,
      validation: {
        area: { required: true, min: 0 },
        owner_name: { required: true },
        zoning: { required: true }
      }
    },
    
    operations: {
      update: 'update_parcel',
      delete: 'delete_parcel'
    }
  },
  
  // Property schema
  properties: parcelFeatureSchema,
  
  // Display options
  display: {
    defaultVisible: true,
    minZoom: 12,
    pane: 'overlayPane',
    zIndex: 400
  }
};
```

---

## Data Layer

### Supabase Client Setup

```typescript
// src/lib/server/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/database.types';

/**
 * Server-side Supabase client with service role key
 */
export const supabaseAdmin = createClient<Database>(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Create user-scoped client from request locals
 */
export function createUserSupabaseClient(locals: App.Locals) {
  return createClient<Database>(
    PUBLIC_SUPABASE_URL,
    locals.supabaseAccessToken,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${locals.supabaseAccessToken}`
        }
      }
    }
  );
}
```

### Data Loader

```typescript
// src/lib/server/layers/loader.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';
import type { PropertyFilter } from '$lib/layers/schemas/layer-config.types';

export interface LoadLayerOptions {
  layerId: string;
  rpcFunction: string;
  params?: Record<string, any>;
}

export class VectorLayerDataLoader {
  private cache: Map<string, { data: any; timestamp: number }>;
  
  constructor(
    private supabase: SupabaseClient<Database>,
    private cacheExpiry: number = 5 * 60 * 1000
  ) {
    this.cache = new Map();
  }

  /**
   * Load layer data as GeoJSON from Supabase RPC
   */
  async loadLayer(options: LoadLayerOptions): Promise<GeoJSON.FeatureCollection> {
    const { layerId, rpcFunction, params = {} } = options;
    
    // Generate cache key
    const cacheKey = this.getCacheKey(layerId, params);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Call RPC function
    const { data, error } = await this.supabase.rpc(rpcFunction, params);

    if (error) {
      console.error(`Error loading layer ${layerId}:`, error);
      throw error;
    }

    const geojson = this.validateGeoJSON(data);
    
    // Cache result
    this.cache.set(cacheKey, {
      data: geojson,
      timestamp: Date.now()
    });

    return geojson;
  }

  /**
   * Apply client-side filters
   */
  applyFilters(
    features: GeoJSON.FeatureCollection,
    filters: PropertyFilter[]
  ): GeoJSON.FeatureCollection {
    const filtered = features.features.filter(feature => {
      return filters.every(filter => {
        const value = feature.properties?.[filter.field];
        return this.evaluateFilter(value, filter.operator, filter.value);
      });
    });

    return {
      type: 'FeatureCollection',
      features: filtered
    };
  }

  private getCacheKey(layerId: string, params: Record<string, any>): string {
    return `${layerId}:${JSON.stringify(params)}`;
  }

  private validateGeoJSON(data: any): GeoJSON.FeatureCollection {
    if (!data || data.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: Expected FeatureCollection');
    }
    return data;
  }

  private evaluateFilter(
    value: any, 
    operator: PropertyFilter['operator'], 
    filterValue: any
  ): boolean {
    switch (operator) {
      case 'eq': return value === filterValue;
      case 'neq': return value !== filterValue;
      case 'gt': return value > filterValue;
      case 'gte': return value >= filterValue;
      case 'lt': return value < filterValue;
      case 'lte': return value <= filterValue;
      case 'in': return Array.isArray(filterValue) && filterValue.includes(value);
      case 'like': return String(value).includes(String(filterValue));
      case 'ilike': 
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      default: return true;
    }
  }

  /**
   * Clear cache for a specific layer
   */
  clearCache(layerId?: string): void {
    if (layerId) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${layerId}:`)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
```

### Page Load Function

```typescript
// src/routes/map/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createUserSupabaseClient } from '$lib/server/supabase';
import { VectorLayerDataLoader } from '$lib/server/layers/loader';
import { getLayerConfig, getDefaultVisibleLayers } from '$lib/layers/configs';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
  const supabase = createUserSupabaseClient(locals);
  const loader = new VectorLayerDataLoader(supabase);

  // Get active layers from URL or defaults
  const activeLayerIds = url.searchParams.getAll('layer').length > 0
    ? url.searchParams.getAll('layer')
    : getDefaultVisibleLayers();

  // Parse filters from URL
  const filters: Record<string, any[]> = {};
  activeLayerIds.forEach(layerId => {
    const layerFilters = url.searchParams.get(`${layerId}_filters`);
    if (layerFilters) {
      try {
        filters[layerId] = JSON.parse(layerFilters);
      } catch (e) {
        console.error(`Invalid filters for ${layerId}`);
      }
    }
  });

  // Parse bbox from URL
  const bboxParam = url.searchParams.get('bbox');
  const bbox = bboxParam 
    ? bboxParam.split(',').map(Number) as [number, number, number, number]
    : undefined;

  // Load all layers in parallel
  try {
    const layerDataPromises = activeLayerIds.map(async (layerId) => {
      const config = getLayerConfig(layerId);
      
      const data = await loader.loadLayer({
        layerId,
        rpcFunction: config.source.rpcFunction,
        params: {
          ...config.source.params,
          filters: filters[layerId],
          bbox
        }
      });
      
      return { layerId, data };
    });

    const layers = await Promise.all(layerDataPromises);
    
    const layerData: Record<string, GeoJSON.FeatureCollection> = {};
    layers.forEach(({ layerId, data }) => {
      layerData[layerId] = data;
    });

    return {
      layers: layerData,
      configs: activeLayerIds.map(id => getLayerConfig(id)),
      activeLayerIds,
      filters,
      bbox
    };
  } catch (err) {
    console.error('Error loading map data:', err);
    throw error(500, 'Failed to load map data');
  }
};

// Form actions for CRUD operations
export const actions: Actions = {
  /**
   * Update feature properties
   */
  updateFeatureProperties: async ({ request, locals }) => {
    const supabase = createUserSupabaseClient(locals);
    const formData = await request.formData();

    const layerId = formData.get('layerId') as string;
    const featureId = formData.get('featureId') as string;
    const properties = JSON.parse(formData.get('properties') as string);

    if (!layerId || !featureId) {
      return fail(400, { error: 'Missing layerId or featureId' });
    }

    try {
      const config = getLayerConfig(layerId);
      const { error } = await supabase.rpc(
        config.editing!.operations!.update!,
        {
          feature_id: featureId,
          new_properties: properties
        }
      );

      if (error) throw error;

      return { success: true, featureId };
    } catch (err: any) {
      console.error('Update failed:', err);
      return fail(500, { 
        error: err.message || 'Failed to update feature',
        featureId 
      });
    }
  },

  /**
   * Update feature geometry
   */
  updateFeatureGeometry: async ({ request, locals }) => {
    const supabase = createUserSupabaseClient(locals);
    const formData = await request.formData();

    const layerId = formData.get('layerId') as string;
    const featureId = formData.get('featureId') as string;
    const geometry = JSON.parse(formData.get('geometry') as string);

    try {
      const config = getLayerConfig(layerId);
      const { error } = await supabase.rpc(
        config.editing!.operations!.update!,
        {
          feature_id: featureId,
          new_geometry: geometry
        }
      );

      if (error) throw error;
      return { success: true, featureId };
    } catch (err: any) {
      return fail(500, { error: err.message });
    }
  },

  /**
   * Delete feature
   */
  deleteFeature: async ({ request, locals }) => {
    const supabase = createUserSupabaseClient(locals);
    const formData = await request.formData();

    const layerId = formData.get('layerId') as string;
    const featureId = formData.get('featureId') as string;

    try {
      const config = getLayerConfig(layerId);
      const { error } = await supabase.rpc(
        config.editing!.operations!.delete!,
        {
          feature_id: featureId
        }
      );

      if (error) throw error;
      return { success: true, featureId };
    } catch (err: any) {
      return fail(500, { error: err.message });
    }
  }
};
```

### Example Supabase RPC Functions

```sql
-- Get parcels as GeoJSON with optional filters
CREATE OR REPLACE FUNCTION get_parcels_geojson(
  filters jsonb DEFAULT NULL,
  bbox float[] DEFAULT NULL
)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', COALESCE(json_agg(feature), '[]'::json)
    )
    FROM (
      SELECT json_build_object(
        'type', 'Feature',
        'id', id,
        'geometry', ST_AsGeoJSON(geom)::json,
        'properties', json_build_object(
          'parcel_id', parcel_id,
          'owner_name', owner_name,
          'area', area,
          'zoning', zoning
        )
      ) AS feature
      FROM parcels
      WHERE (bbox IS NULL OR ST_Intersects(
        geom,
        ST_MakeEnvelope(bbox[1], bbox[2], bbox[3], bbox[4], 4326)
      ))
      -- Add filter conditions here based on filters jsonb
    ) features
  );
END;
$$ LANGUAGE plpgsql;

-- Update parcel feature
CREATE OR REPLACE FUNCTION update_parcel(
  feature_id int,
  new_properties jsonb DEFAULT NULL,
  new_geometry json DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE parcels
  SET
    geom = COALESCE(
      ST_SetSRID(ST_GeomFromGeoJSON(new_geometry::text), 4326),
      geom
    ),
    owner_name = COALESCE(new_properties->>'owner_name', owner_name),
    area = COALESCE((new_properties->>'area')::float, area),
    zoning = COALESCE(new_properties->>'zoning', zoning),
    updated_at = NOW()
  WHERE id = feature_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Styling System

The styling system provides three approaches:

1. **Static styles** - Fixed colors and styles
2. **Categorized styles** - Different styles per category (zoning, road type, etc.)
3. **Choropleth styles** - Color gradients based on numeric values (area, population, etc.)

### Using Choropleth Styles

```typescript
// In layer config
import choropleth from '$lib/layers/styles/choropleth';

styling: {
  mode: 'choropleth',
  choropleth: {
    property: 'area',
    breaks: [1000, 5000, 10000, 50000],
    colors: choropleth.colorSchemes.Blues,
    method: 'quantile'
  }
}

// Or use auto-generation
styling: {
  mode: 'dynamic',
  styleFn: choropleth.autoGenerateChoroplethStyle(
    features,
    'area',
    {
      numClasses: 5,
      method: 'quantile',
      colorScheme: 'Blues'
    }
  )
}
```

### Using Categorized Styles

```typescript
// In layer config
import categorized from '$lib/layers/styles/categorized';

styling: {
  mode: 'categorized',
  categorized: {
    property: 'road_type',
    categories: {
      highway: {
        line: { color: '#dc2626', weight: 5 }
      },
      main: {
        line: { color: '#f97316', weight: 4 }
      },
      local: {
        line: { color: '#64748b', weight: 2 }
      }
    }
  }
}

// Or use presets
import { roadTypeCategoryStyles } from '$lib/layers/styles/categorized';

styling: {
  mode: 'categorized',
  styleFn: roadTypeCategoryStyles
}
```

---

## Interaction System

### Client-Side Style Manager

```typescript
// src/lib/map/utils/style-manager.ts

import type { StyleConfig } from '$lib/layers/schemas/layer-config.types';
import choropleth from '$lib/layers/styles/choropleth';
import categorized from '$lib/layers/styles/categorized';

export class VectorStyleManager {
  private userStyles: Map<string, Partial<StyleConfig>>;
  
  constructor() {
    this.userStyles = new Map();
  }

  /**
   * Get style for a feature
   */
  getFeatureStyle(
    feature: GeoJSON.Feature,
    config: StyleConfig,
    layerId: string,
    state: 'normal' | 'hover' | 'selected' = 'normal'
  ): any {
    // Get base style based on mode
    let baseStyle: any = {};
    
    if (config.styleFn) {
      baseStyle = config.styleFn(feature);
    } else {
      const geometryType = feature.geometry.type;
      
      if (geometryType.includes('Point')) {
        baseStyle = config.base?.point || {};
      } else if (geometryType.includes('Line')) {
        baseStyle = config.base?.line || {};
      } else if (geometryType.includes('Polygon')) {
        baseStyle = config.base?.polygon || {};
      }
    }
    
    // Apply state styles
    if (state === 'hover' && config.hover) {
      return { ...baseStyle, ...this.getStateStyle(config.hover, baseStyle) };
    }
    
    if (state === 'selected' && config.selection) {
      return { ...baseStyle, ...this.getStateStyle(config.selection, baseStyle) };
    }
    
    return baseStyle;
  }

  private getStateStyle(stateConfig: any, baseStyle: any): any {
    const geometryType = baseStyle.radius !== undefined ? 'point' : 
                        baseStyle.fillColor !== undefined ? 'polygon' : 'line';
    
    return stateConfig[geometryType] || {};
  }
}

export const styleManager = new VectorStyleManager();
```

### Client-Side Interaction Handler

```typescript
// src/lib/map/utils/interaction.ts

import type { InteractionConfig, StyleConfig } from '$lib/layers/schemas/layer-config.types';
import { styleManager } from './style-manager';

export function setupInteractions(
  geoJsonLayer: L.GeoJSON,
  layerId: string,
  config: InteractionConfig,
  styleConfig: StyleConfig,
  onFeatureSelect?: (feature: any) => void
) {
  geoJsonLayer.eachLayer((layer) => {
    const feature = (layer as any).feature;
    if (!feature) return;

    // Click handler
    if (config.click?.enabled) {
      layer.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        
        // Show popup
        if (config.popup?.enabled) {
          const content = typeof config.popup.template === 'function'
            ? config.popup.template(feature)
            : generateDefaultPopup(feature, config.popup.fields);
          
          (layer as any).bindPopup(content, {
            maxWidth: config.popup.maxWidth || 400
          }).openPopup();
        }
        
        // Trigger selection
        if (onFeatureSelect) {
          onFeatureSelect(feature);
        }
        
        // Apply selection style
        const selectionStyle = styleManager.getFeatureStyle(
          feature,
          styleConfig,
          layerId,
          'selected'
        );
        
        if (layer instanceof L.CircleMarker || layer instanceof L.Path) {
          layer.setStyle(selectionStyle);
        }
      });
    }

    // Hover handlers
    if (config.hover?.enabled) {
      layer.on('mouseover', (e: L.LeafletMouseEvent) => {
        if (config.hover?.highlight) {
          const hoverStyle = styleManager.getFeatureStyle(
            feature,
            styleConfig,
            layerId,
            'hover'
          );
          
          if (layer instanceof L.CircleMarker || layer instanceof L.Path) {
            layer.setStyle(hoverStyle);
          }
        }
        
        // Show tooltip
        if (config.tooltip?.enabled) {
          const content = typeof config.tooltip.template === 'function'
            ? config.tooltip.template(feature)
            : feature.properties?.[config.tooltip.property || 'name'];
          
          (layer as any).bindTooltip(content, {
            sticky: true
          }).openTooltip(e.latlng);
        }
      });
      
      layer.on('mouseout', () => {
        const normalStyle = styleManager.getFeatureStyle(
          feature,
          styleConfig,
          layerId,
          'normal'
        );
        
        if (layer instanceof L.CircleMarker || layer instanceof L.Path) {
          layer.setStyle(normalStyle);
        }
        
        if ((layer as any).closeTooltip) {
          (layer as any).closeTooltip();
        }
      });
    }
  });
}

function generateDefaultPopup(feature: any, fields?: string[]): string {
  const props = feature.properties || {};
  const displayFields = fields || Object.keys(props);
  
  const rows = displayFields
    .map(field => {
      const label = field.replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      const value = props[field] || 'N/A';
      
      return `
        <tr>
          <td class="font-semibold pr-2">${label}:</td>
          <td>${value}</td>
        </tr>
      `;
    })
    .join('');
  
  return `
    <div class="popup-content">
      <table class="text-sm">${rows}</table>
    </div>
  `;
}
```

---

## Editing System

### Edit Session Store

```typescript
// src/lib/map/stores/editing.ts

import { writable } from 'svelte/store';

interface EditSession {
  layerId: string;
  feature: any;
  originalFeature: any;
  changes: EditChange[];
  isDirty: boolean;
}

interface EditChange {
  type: 'geometry' | 'property';
  field?: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

function createEditSession() {
  const { subscribe, set, update } = writable<EditSession | null>(null);

  return {
    subscribe,
    
    start(layerId: string, feature: any) {
      set({
        layerId,
        feature: { ...feature },
        originalFeature: JSON.parse(JSON.stringify(feature)),
        changes: [],
        isDirty: false
      });
    },
    
    updateProperty(field: string, newValue: any) {
      update(session => {
        if (!session) return session;
        
        const oldValue = session.feature.properties[field];
        session.feature.properties[field] = newValue;
        
        session.changes.push({
          type: 'property',
          field,
          oldValue,
          newValue,
          timestamp: new Date()
        });
        
        return { ...session, isDirty: true };
      });
    },
    
    updateGeometry(newGeometry: any) {
      update(session => {
        if (!session) return session;
        
        const oldValue = session.feature.geometry;
        session.feature.geometry = newGeometry;
        
        session.changes.push({
          type: 'geometry',
          oldValue,
          newValue: newGeometry,
          timestamp: new Date()
        });
        
        return { ...session, isDirty: true };
      });
    },
    
    undo() {
      update(session => {
        if (!session || session.changes.length === 0) return session;
        
        const lastChange = session.changes.pop()!;
        
        if (lastChange.type === 'property' && lastChange.field) {
          session.feature.properties[lastChange.field] = lastChange.oldValue;
        } else if (lastChange.type === 'geometry') {
          session.feature.geometry = lastChange.oldValue;
        }
        
        return { 
          ...session, 
          isDirty: session.changes.length > 0 
        };
      });
    },
    
    cancel() {
      set(null);
    },
    
    clear() {
      set(null);
    }
  };
}

export const editSession = createEditSession();
```

---

## Component Architecture

### VectorLayer Component

```svelte
<!-- src/lib/map/components/VectorLayer.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getMapContext } from '$lib/map/map-types';
  import { getLeaflet } from '$lib/map/layer-factory';
  import { styleManager } from '$lib/map/utils/style-manager';
  import { setupInteractions } from '$lib/map/utils/interaction';
  import type { LayerConfig } from '$lib/layers/schemas/layer-config.types';

  let {
    config,
    data,
    visible = false,
    onFeatureSelect
  }: {
    config: LayerConfig;
    data: GeoJSON.FeatureCollection;
    visible: boolean;
    onFeatureSelect?: (feature: any) => void;
  } = $props();

  const { getMap, registerLayer, unregisterLayer, setLayerInstance } = getMapContext();

  let geoJsonLayer: L.GeoJSON | null = $state(null);
  let isLoading = $state(false);

  // Register layer
  $effect(() => {
    registerLayer({
      id: config.id,
      label: config.name,
      type: 'overlay',
      visible,
      pane: config.display?.pane
    });

    return () => unregisterLayer(config.id);
  });

  // Create layer when data or map is ready
  $effect(() => {
    const map = getMap();
    if (!map || !data) return;

    createLayer();

    return () => {
      if (geoJsonLayer && map) {
        map.removeLayer(geoJsonLayer);
      }
    };
  });

  // Handle visibility
  $effect(() => {
    const map = getMap();
    if (!map || !geoJsonLayer) return;

    if (visible) {
      geoJsonLayer.addTo(map);
    } else {
      map.removeLayer(geoJsonLayer);
    }
  });

  async function createLayer() {
    const map = getMap();
    if (!map) return;

    try {
      isLoading = true;
      const L = await getLeaflet();

      // Create GeoJSON layer with styling
      geoJsonLayer = L.geoJSON(data, {
        pane: config.display?.pane,
        pointToLayer: (feature, latlng) => {
          const style = styleManager.getFeatureStyle(
            feature,
            config.styling,
            config.id
          );
          return L.circleMarker(latlng, style);
        },
        style: (feature) => {
          if (!feature) return {};
          return styleManager.getFeatureStyle(
            feature,
            config.styling,
            config.id
          );
        },
        onEachFeature: (feature, layer) => {
          (layer as any).feature = feature;
        }
      });

      // Setup interactions
      setupInteractions(
        geoJsonLayer,
        config.id,
        config.interaction,
        config.styling,
        onFeatureSelect
      );

      // Add to map if visible
      if (visible) {
        geoJsonLayer.addTo(map);
      }

      setLayerInstance(config.id, geoJsonLayer);
    } catch (err) {
      console.error(`Failed to create layer ${config.id}:`, err);
    } finally {
      isLoading = false;
    }
  }
</script>
```

### Main Map Page

```svelte
<!-- src/routes/map/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import NewMap from '$lib/map/NewMap.svelte';
  import BaseLayerGroup from '$lib/map/BaseLayerGroup.svelte';
  import OverlayLayerGroup from '$lib/map/OverlayLayerGroup.svelte';
  import VectorLayer from '$lib/map/components/VectorLayer.svelte';
  import FeaturePanel from '$lib/map/components/FeaturePanel.svelte';
  import LayerControl from '$lib/map/components/LayerControl.svelte';
  import { editSession } from '$lib/map/stores/editing';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let selectedFeature = $state<any>(null);
  let isEditMode = $state(false);

  function handleFeatureSelect(layerId: string, feature: any) {
    selectedFeature = { ...feature, layerId };
  }

  function handleEditFeature(feature: any) {
    isEditMode = true;
    editSession.start(feature.layerId, feature);
  }

  function toggleLayer(layerId: string, visible: boolean) {
    const currentLayers = new Set(data.activeLayerIds);
    
    if (visible) {
      currentLayers.add(layerId);
    } else {
      currentLayers.delete(layerId);
    }
    
    const params = new URLSearchParams($page.url.searchParams);
    params.delete('layer');
    Array.from(currentLayers).forEach(id => params.append('layer', id));
    
    goto(`?${params.toString()}`, { 
      keepFocus: true,
      noScroll: true
    });
  }
</script>

<div class="map-container">
  <NewMap center={[-35.5, 148.2]} zoom={12}>
    <BaseLayerGroup>
      <!-- Base layers -->
    </BaseLayerGroup>

    <OverlayLayerGroup>
      {#each data.configs as config (config.id)}
        {#if data.layers[config.id]}
          <VectorLayer
            {config}
            data={data.layers[config.id]}
            visible={data.activeLayerIds.includes(config.id)}
            onFeatureSelect={(f) => handleFeatureSelect(config.id, f)}
          />
        {/if}
      {/each}
    </OverlayLayerGroup>

    <LayerControl
      availableLayers={data.configs}
      activeLayers={data.activeLayerIds}
      onToggleLayer={toggleLayer}
    />
  </NewMap>

  {#if selectedFeature && !isEditMode}
    <FeaturePanel
      feature={selectedFeature}
      onClose={() => { selectedFeature = null; }}
      onEdit={() => handleEditFeature(selectedFeature)}
    />
  {/if}

  {#if isEditMode && $editSession}
    <div class="edit-modal">
      <form 
        method="POST" 
        action="?/updateFeatureProperties"
        use:enhance
      >
        <input type="hidden" name="layerId" value={$editSession.layerId} />
        <input type="hidden" name="featureId" value={$editSession.feature.id} />
        
        <h3>Edit Feature</h3>
        
        {#each Object.entries($editSession.feature.properties) as [key, value]}
          <label>
            <span>{key}:</span>
            <input type="text" name="properties[{key}]" value={value} />
          </label>
        {/each}

        <div class="actions">
          <button type="submit">Save</button>
          <button type="button" onclick={() => { isEditMode = false; editSession.cancel(); }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .map-container {
    width: 100%;
    height: 100vh;
    position: relative;
  }
</style>
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Setup type definitions (`layer-config.types.ts`)
- [ ] Create layer registry and first config (`parcels.config.ts`)
- [ ] Implement `VectorLayerDataLoader`
- [ ] Setup Supabase client and RPC functions
- [ ] Create basic page load function
- [ ] Test with one layer

### Phase 2: Rendering (Week 2-3)
- [ ] Implement `VectorStyleManager`
- [ ] Create `VectorLayer.svelte` component
- [ ] Setup basic interaction handlers
- [ ] Add static styling support
- [ ] Test rendering with multiple layers

### Phase 3: Styling (Week 3-4)
- [ ] Implement choropleth styling (`styles/choropleth.ts`)
- [ ] Implement categorized styling (`styles/categorized.ts`)
- [ ] Create style presets (`styles/index.ts`)
- [ ] Add hover and selection styles
- [ ] Test with different style modes

### Phase 4: Interaction (Week 4-5)
- [ ] Create popup templates (`templates/popup-templates.ts`)
- [ ] Create tooltip templates (`templates/tooltip-templates.ts`)
- [ ] Implement full interaction system
- [ ] Create `FeaturePanel.svelte`
- [ ] Add feature selection support

### Phase 5: Query/Filter (Week 5-6)
- [ ] Create `QueryControl.svelte`
- [ ] Implement client-side filtering
- [ ] Add URL-based filter state
- [ ] Test with complex queries

### Phase 6: Editing (Week 6-8)
- [ ] Create edit session store
- [ ] Implement form actions for CRUD
- [ ] Add geometry editing (integrate Leaflet.PM)
- [ ] Create edit modal/form
- [ ] Add undo/redo support
- [ ] Test full edit workflow

### Phase 7: Polish (Week 8-10)
- [ ] Add loading states and error handling
- [ ] Optimize performance (clustering, viewport loading)
- [ ] Create comprehensive documentation
- [ ] Add unit tests
- [ ] User acceptance testing

---

## Complete Examples

### Example 1: Roads Layer with Categorized Styling

```typescript
// src/lib/layers/configs/roads.config.ts

import type { LayerConfig } from '../schemas/layer-config.types';
import { roadFeatureSchema } from '../schemas/feature-schemas';
import { roadTooltipWithType } from '../templates/tooltip-templates';
import { roadTypeCategoryStyles } from '../styles/categorized';

export const roadsLayer: LayerConfig = {
  id: 'roads',
  name: 'Roads',
  description: 'Road network with classification',
  geometryType: 'LineString',
  category: 'Infrastructure',
  
  source: {
    rpcFunction: 'get_roads_geojson',
    cacheKey: 'roads',
    cacheDuration: 10 * 60 * 1000
  },
  
  styling: {
    mode: 'categorized',
    styleFn: roadTypeCategoryStyles,
    
    hover: {
      line: {
        weight: 6,
        opacity: 1
      }
    }
  },
  
  interaction: {
    popup: {
      enabled: true,
      fields: ['name', 'road_type', 'surface', 'lanes']
    },
    
    tooltip: {
      enabled: true,
      template: roadTooltipWithType
    },
    
    hover: {
      enabled: true,
      highlight: true
    },
    
    click: {
      enabled: true,
      selectMode: 'single'
    }
  },
  
  query: {
    enabled: true,
    filters: [
      {
        id: 'road_type',
        label: 'Road Type',
        field: 'road_type',
        type: 'select',
        operators: ['eq', 'in'],
        options: [
          { value: 'highway', label: 'Highway' },
          { value: 'main', label: 'Main Road' },
          { value: 'local', label: 'Local Road' }
        ]
      }
    ]
  },
  
  editing: {
    enabled: true,
    allowCreate: true,
    allowUpdate: true,
    allowDelete: true,
    
    geometry: {
      editable: true,
      snapping: true,
      snapLayers: ['roads']
    },
    
    operations: {
      create: 'create_road',
      update: 'update_road',
      delete: 'delete_road'
    }
  },
  
  properties: roadFeatureSchema,
  
  display: {
    defaultVisible: true,
    minZoom: 10,
    zIndex: 300
  }
};
```

### Example 2: POI Layer with Icon-Based Categorization

```typescript
// src/lib/layers/configs/poi.config.ts

import type { LayerConfig } from '../schemas/layer-config.types';
import { poiFeatureSchema } from '../schemas/feature-schemas';
import { poiTooltipWithIcon } from '../templates/tooltip-templates';
import { poiCategoryStyles } from '../styles/categorized';

export const poiLayer: LayerConfig = {
  id: 'poi',
  name: 'Points of Interest',
  geometryType: 'Point',
  category: 'Amenities',
  
  source: {
    rpcFunction: 'get_poi_geojson',
    cacheKey: 'poi'
  },
  
  styling: {
    mode: 'categorized',
    styleFn: poiCategoryStyles,
    
    hover: {
      point: {
        radius: 10,
        fillOpacity: 1,
        weight: 3
      }
    },
    
    selection: {
      point: {
        radius: 12,
        fillColor: '#f59e0b',
        fillOpacity: 1
      }
    }
  },
  
  interaction: {
    popup: {
      enabled: true,
      template: (feature) => {
        const { name, category, description, address } = feature.properties || {};
        return `
          <div class="poi-popup">
            <h3>${name}</h3>
            <div class="category">${category}</div>
            ${description ? `<p>${description}</p>` : ''}
            ${address ? `<div class="address">${address}</div>` : ''}
          </div>
        `;
      }
    },
    
    tooltip: {
      enabled: true,
      template: poiTooltipWithIcon
    },
    
    sidePanel: {
      enabled: true
    },
    
    click: {
      enabled: true,
      selectMode: 'multiple'
    },
    
    hover: {
      enabled: true,
      highlight: true
    }
  },
  
  query: {
    enabled: true,
    filters: [
      {
        id: 'category',
        label: 'Category',
        field: 'category',
        type: 'select',
        operators: ['eq', 'in'],
        options: [
          { value: 'park', label: 'Park' },
          { value: 'school', label: 'School' },
          { value: 'hospital', label: 'Hospital' },
          { value: 'library', label: 'Library' }
        ]
      }
    ]
  },
  
  properties: poiFeatureSchema,
  
  display: {
    defaultVisible: false,
    minZoom: 11,
    pane: 'markerPane',
    zIndex: 500
  }
};
```

---

## Best Practices

### 1. Performance Optimization

**For Large Datasets (1000+ features):**

```typescript
// Use clustering for points
import 'leaflet.markercluster';

if (config.geometryType === 'Point' && data.features.length > 500) {
  const clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true
  });
  
  geoJsonLayer.eachLayer((layer) => {
    clusterGroup.addLayer(layer);
  });
  
  clusterGroup.addTo(map);
}

// Use Canvas renderer for better performance
const renderer = L.canvas({ padding: 0.5 });

geoJsonLayer = L.geoJSON(data, {
  renderer: renderer,
  // ... other options
});
```

**Viewport-Based Loading:**

```typescript
// Modify RPC function to accept bbox
const bbox = map.getBounds();
const data = await loader.loadLayer({
  layerId: 'parcels',
  rpcFunction: 'get_parcels_geojson',
  params: {
    bbox: [
      bbox.getWest(),
      bbox.getSouth(),
      bbox.getEast(),
      bbox.getNorth()
    ]
  }
});
```

### 2. Caching Strategy

```typescript
// In layer config - set appropriate cache duration
source: {
  rpcFunction: 'get_parcels_geojson',
  cacheDuration: 5 * 60 * 1000 // 5 minutes for frequently updated data
}

// For static data
source: {
  rpcFunction: 'get_boundaries_geojson',
  cacheDuration: 24 * 60 * 60 * 1000 // 24 hours
}
```

### 3. Type Safety

```typescript
// Always use type definitions
import type { LayerConfig } from '$lib/layers/schemas/layer-config.types';

export const myLayer: LayerConfig = {
  // TypeScript will enforce all required properties
  // and validate the structure
};

// Generate types from Supabase schema
npm run supabase gen types typescript
```

### 4. Error Handling

```typescript
// In load function
try {
  const data = await loader.loadLayer(options);
  return { layers: data };
} catch (err) {
  console.error('Error loading layer:', err);
  // Return empty data rather than throwing
  return {
    layers: {
      type: 'FeatureCollection',
      features: []
    }
  };
}
```

### 5. Accessibility

```typescript
// Add ARIA labels to interactive elements
<button aria-label="Toggle {layer.name} layer">
  {layer.name}
</button>

// Ensure keyboard navigation
<div role="button" tabindex="0" onkeypress={handleKeyPress}>
  Feature info
</div>
```

### 6. Progressive Enhancement

```typescript
// Form actions work without JavaScript
<form method="POST" action="?/updateFeature" use:enhance>
  <!-- Form fields -->
  <button type="submit">Save</button>
</form>

// Enhance with client-side functionality
use:enhance={() => {
  return async ({ result }) => {
    if (result.type === 'success') {
      // Optimistic UI update
      // Show success message
    }
    await applyAction(result);
  };
}}
```

### 7. Security

```typescript
// Always use user-scoped Supabase client
const supabase = createUserSupabaseClient(locals);

// Implement Row Level Security in Supabase
CREATE POLICY "Users can only see their org's parcels"
  ON parcels
  FOR SELECT
  USING (org_id = auth.uid()::text);

// Validate inputs in form actions
if (!layerId || !featureId) {
  return fail(400, { error: 'Missing required fields' });
}
```

---

## Conclusion

This architecture provides a complete, production-ready solution for managing vector map layers in a SvelteKit application with Supabase as the backend. Key strengths include:

✅ **Type-safe** - Full TypeScript coverage  
✅ **Performant** - SSR, caching, efficient rendering  
✅ **Maintainable** - File-based configs, clear separation of concerns  
✅ **Flexible** - Supports multiple styling modes, interactions, and editing  
✅ **Progressive** - Works without JavaScript where possible  
✅ **Scalable** - Handles hundreds to thousands of features efficiently  

### Next Steps

1. Follow the implementation roadmap
2. Start with Phase 1 (Foundation)
3. Test each phase thoroughly
4. Optimize based on real data
5. Extend with custom features as needed

### Support Files

All the supporting files referenced in this document have been created:
- Type definitions
- Feature schemas
- Style utilities (choropleth, categorized)
- Template libraries (popups, tooltips)
- Formatters and utilities

This design is ready for implementation! 🚀
