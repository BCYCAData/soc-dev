Map.svelte
├── setContext('leaflet-map', map)
├── setContext('layer-registry', writable<Record<string, LayerMeta>>)
│
├── BaseLayerGroup.svelte
│   └── Uses $state or $bindable for activeLayerId
│   └── Registers each base layer in layerRegistry with type: 'base'
│
├── OverlayGroup.svelte
│   └── Uses $effect to register overlays in layerRegistry
│   └── Uses createOverlay() from OverlayFactory.ts
│   └── Sets layer instance + visibility in registry
│
├── OverlayControl.svelte
│   └── Subscribes to layerRegistry store
│   └── Filters overlays by type: 'overlay'
│   └── Toggles visibility via toggleLayer(id, visible)
│
├── LegendPanel.svelte (optional)
│   └── Reads registry for metadata (label, pane, category)
│   └── Displays color swatches, icons, or schema tags
│
├── MetadataAudit.svelte (optional)
│   └── Uses registry to validate schema completeness
│   └── Flags missing attribution, pane, or event bindings
│
└── VolunteerChecklist.svelte (optional)
    └── Maps registry overlays to onboarding tasks
    └── Uses label + category to guide user actions
