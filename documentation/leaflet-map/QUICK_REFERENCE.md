# Quick Reference: New File Structure

## 📁 File Organization

```typescript
// ============================================================================
// 1️⃣  map-types.ts - All Types & Context Utilities
// ============================================================================

// Layer Descriptors
import { 
  MapLayerDescriptor,     // Legacy layer descriptor
  LayerMeta,              // Context-based layer metadata
  MapLayerRegistry        // Record of layers
} from '$lib/map/map-types';

// Type Predicates
import { 
  hasSetOpacity,          // Check if layer supports opacity
  hasSetZIndex            // Check if layer supports z-index
} from '$lib/map/map-types';

// Context System
import { 
  MapContext,             // Context interface
  MAP_CONTEXT_KEY,        // Context key symbol
  getMapContext,          // Get context in component
  setMapContext           // Set context (internal use)
} from '$lib/map/map-types';

// ============================================================================
// 2️⃣  layer-factory.ts - All Layer Creation Functions
// ============================================================================

// Leaflet Loading
import { 
  getLeaflet,             // Load Leaflet dynamically
  isEsriAvailable,        // Check if ESRI is loaded
  getEsri                 // Get ESRI module
} from '$lib/map/layer-factory';

// Low-level Creation (for advanced use)
import { 
  createTileLayer,        // Create tile layer directly
  createOverlay,          // Create overlay from config
  createPane              // Create custom pane
} from '$lib/map/layer-factory';

// Base Layers (map backgrounds)
import { 
  tileLayer,              // OSM, CartoDB, etc.
  wmsLayer,               // WMS services
  imageOverlay,           // Static images
  esriBasemap,            // ESRI basemaps
  esriTiledMapLayer       // ESRI cached tiles
} from '$lib/map/layer-factory';

// Standard Overlays (data layers)
import { 
  marker,                 // Single markers
  geoJSON,                // GeoJSON features
  polyline                // Lines/paths
} from '$lib/map/layer-factory';

// ESRI Overlays (ArcGIS services)
import { 
  esriFeatureLayer,       // Vector features
  esriDynamicMapLayer,    // Dynamic map service
  esriImageMapLayer       // Image service
} from '$lib/map/layer-factory';

// Custom Layers
import { 
  customLayer             // Any custom layer type
} from '$lib/map/layer-factory';

// ============================================================================
// 3️⃣  map-constants.ts - Event Names
// ============================================================================

import { MAP_EVENT_NAMES } from '$lib/map/map-constants';

// ============================================================================
// 4️⃣  createLeafletMap.ts - Map Initialization
// ============================================================================

import { 
  createLeafletMap,       // Initialize map instance
  LEAFLET_CONTEXT_KEY,    // Context key symbol
  LeafletContext          // Context type
} from '$lib/map/createLeafletMap';
```

## 🎯 When to Use Which File

### Use `map-types.ts` when you need:
- Type definitions for layers
- Type predicates for checking layer capabilities
- Map context utilities for Svelte components

### Use `layer-factory.ts` when you need:
- To create any type of layer (base or overlay)
- To load Leaflet dynamically
- Layer configuration helpers
- ESRI integration

### Use `map-constants.ts` when you need:
- List of valid Leaflet event names
- TypeScript checking for event handlers

### Use `createLeafletMap.ts` when you need:
- To initialize a new Leaflet map
- To set up the map context
- Core map creation logic

## 💡 Common Patterns

### Creating a Basic Map
```typescript
import { createLeafletMap } from '$lib/map/createLeafletMap';

const { map, leaflet } = await createLeafletMap({
  center: [51.505, -0.09],
  zoom: 13,
  mapDiv: containerElement
});
```

### Adding a Tile Layer
```typescript
import { tileLayer } from '$lib/map/layer-factory';

const osm = tileLayer(
  'osm',
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { 
    label: 'OpenStreetMap',
    visible: true,
    attribution: '© OpenStreetMap contributors'
  }
);
```

### Adding a GeoJSON Layer
```typescript
import { geoJSON } from '$lib/map/layer-factory';

const features = geoJSON(
  'my-data',
  geojsonData,
  {
    label: 'My Features',
    visible: true,
    style: { color: '#ff0000' }
  }
);
```

### Using Map Context
```typescript
import { getMapContext } from '$lib/map/map-types';

// Inside a Svelte component
const { getMap, registerLayer } = getMapContext();
const map = getMap();
```

### Type Checking Layers
```typescript
import { hasSetOpacity } from '$lib/map/map-types';

if (hasSetOpacity(layer)) {
  layer.setOpacity(0.5); // TypeScript knows this is safe
}
```

### Working with ESRI Layers
```typescript
import { esriFeatureLayer, isEsriAvailable } from '$lib/map/layer-factory';

if (isEsriAvailable()) {
  const esriLayer = esriFeatureLayer(
    'my-service',
    'https://services.arcgis.com/.../FeatureServer/0',
    {
      label: 'My ArcGIS Data',
      visible: true
    }
  );
}
```

## 🔍 Finding What You Need

| I want to... | Import from... | Function/Type |
|-------------|---------------|---------------|
| Define layer types | `map-types.ts` | `MapLayerDescriptor`, `LayerMeta` |
| Check layer capabilities | `map-types.ts` | `hasSetOpacity`, `hasSetZIndex` |
| Use Svelte context | `map-types.ts` | `getMapContext`, `setMapContext` |
| Create base layers | `layer-factory.ts` | `tileLayer`, `wmsLayer`, `esriBasemap` |
| Create overlays | `layer-factory.ts` | `marker`, `geoJSON`, `polyline` |
| Use ESRI services | `layer-factory.ts` | `esriFeatureLayer`, etc. |
| Load Leaflet | `layer-factory.ts` | `getLeaflet` |
| Handle events | `map-constants.ts` | `MAP_EVENT_NAMES` |
| Initialize map | `createLeafletMap.ts` | `createLeafletMap` |

## 📦 Export Summary

### map-types.ts exports
- 3 interfaces: `MapLayerDescriptor`, `LayerMeta`, `MapContext`
- 1 type: `MapLayerRegistry`
- 2 type predicates: `hasSetOpacity`, `hasSetZIndex`
- 2 context functions: `getMapContext`, `setMapContext`
- 1 constant: `MAP_CONTEXT_KEY`

### layer-factory.ts exports
- 3 loader functions: `getLeaflet`, `isEsriAvailable`, `getEsri`
- 3 low-level creators: `createTileLayer`, `createOverlay`, `createPane`
- 4 base layer helpers: `tileLayer`, `wmsLayer`, `imageOverlay`, `esriBasemap`
- 1 flexible helper: `esriTiledMapLayer` (base or overlay)
- 3 standard overlay helpers: `marker`, `geoJSON`, `polyline`
- 3 ESRI overlay helpers: `esriFeatureLayer`, `esriDynamicMapLayer`, `esriImageMapLayer`
- 1 custom helper: `customLayer`
- 4 type definitions: `OverlayType`, `OverlayConfig`, `BaseLayerConfig`, `OverlayLayerConfig`

### map-constants.ts exports
- 1 constant array: `MAP_EVENT_NAMES`

### createLeafletMap.ts exports
- 1 function: `createLeafletMap`
- 2 types: `LeafletInitOptions`, `LeafletContext`
- 1 constant: `LEAFLET_CONTEXT_KEY`

---

**Pro Tip:** Use your IDE's autocomplete! Type `import {` and let your editor suggest available exports from each file.
