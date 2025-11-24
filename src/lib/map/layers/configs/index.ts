import type { LayerRegistry } from '$lib/map/layers/schemas/layer-config.types';
import { parcelsLayer } from '$lib/map/layers/configs/parcels.config';
import { roadsLayer } from '$lib/map/layers/configs/roads.config';
import { poiLayer } from '$lib/map/layers/configs/poi.config';
// Import other layers...

/**
 * Central registry of all layer configurations
 */
export const layerRegistry: LayerRegistry = {
	parcels: parcelsLayer,
	roads: roadsLayer,
	poi: poiLayer
	// Add more layers here
};

/**
 * Get a layer config by ID
 */
export function getLayerConfig(layerId: string) {
	const config = layerRegistry[layerId];
	if (!config) {
		throw new Error(`Layer config not found: ${layerId}`);
	}
	return config;
}

/**
 * Get all layer configs
 */
export function getAllLayerConfigs() {
	return Object.values(layerRegistry);
}

/**
 * Get layers by category
 */
export function getLayersByCategory(category: string) {
	return Object.values(layerRegistry).filter((layer) => layer.category === category);
}

/**
 * Get editable layers
 */
export function getEditableLayers() {
	return Object.values(layerRegistry).filter((layer) => layer.editing?.enabled);
}

/**
 * Get default visible layers
 */
export function getDefaultVisibleLayers() {
	return Object.values(layerRegistry)
		.filter((layer) => layer.display?.defaultVisible)
		.map((layer) => layer.id);
}
