import type {
	EditingState,
	FeatureTemplate,
	SpatialFeature,
	FeatureAttribute
} from '$lib/leaflet/spatial';

interface CustomProperties {
	template_id: string;
	[key: string]: any;
}

export type CustomFeature = GeoJSON.Feature<GeoJSON.Geometry, CustomProperties>;

// Active editing state
let editingState = $state<EditingState>({
	activeTemplate: null,
	activeFeature: null,
	mode: null
});

// Feature collections
let spatialFeatures = $state<Record<string, SpatialFeature>>({});
let featureAttributes = $state<Record<string, FeatureAttribute>>({});
let featureTemplates = $state<Record<string, FeatureTemplate>>({});

// Feature management functions
function setActiveTemplate(template: FeatureTemplate | null) {
	editingState.activeTemplate = template;
}

function setActiveFeature(feature: SpatialFeature | null) {
	editingState.activeFeature = feature;
}

function setEditingMode(mode: EditingState['mode']) {
	editingState.mode = mode;
}

function addFeature(feature: SpatialFeature) {
	spatialFeatures[feature.id] = feature;
}

function updateFeature(featureId: string, geometry: GeoJSON.Geometry) {
	if (spatialFeatures[featureId]) {
		spatialFeatures[featureId].geom = geometry;
	}
}

function deleteFeature(featureId: string) {
	delete spatialFeatures[featureId];
	Object.keys(featureAttributes).forEach((key) => {
		if (featureAttributes[key].feature_id === featureId) {
			delete featureAttributes[key];
		}
	});
}

function transformFeaturesToGeoJSON(
	features: Record<string, any>,
	attributes: Record<string, any>
) {
	// Group features by template_id
	const featuresByTemplate: Record<string, GeoJSON.FeatureCollection> = {};

	// Process features
	Object.values(features).forEach((feature) => {
		if (!featuresByTemplate[feature.template_id]) {
			featuresByTemplate[feature.template_id] = {
				type: 'FeatureCollection',
				features: []
			};
		}

		// Group attributes for this feature
		const featureAttributes = Object.values(attributes)
			.filter((attr) => attr.feature_id === feature.id)
			.reduce(
				(acc, attr) => ({
					...acc,
					[attr.field_id]: attr.value
				}),
				{}
			);

		featuresByTemplate[feature.template_id].features.push({
			type: 'Feature',
			geometry: feature.geom,
			properties: {
				id: feature.id,
				...featureAttributes
			}
		});
	});

	return featuresByTemplate;
}

function createTooltipContent(feature: CustomFeature, template_id: string | undefined): string {
	if (!feature.properties?.id) return '';
	if (!template_id) return '';

	const template = featureTemplates[template_id];
	if (!template) return '';
	const attributes = template.attributes
		.map((field) => {
			const value = feature.properties[field.id] || '';
			return `<strong>${field.name}:</strong> ${value}`;
		})
		.filter((text) => text)
		.join('<br>');
	const header = `<div style="display: flex; justify-content: space-between; font-size: 1.2em; margin-bottom: 8px;">
						<div><strong>${template.name}</strong></div>
						<div style="margin-left: 20px;">${template.category}</div>
					</div>`;
	return `<div>${header}${attributes}</div>`;
}

export {
	editingState,
	spatialFeatures,
	featureAttributes,
	featureTemplates,
	setActiveTemplate,
	setActiveFeature,
	setEditingMode,
	addFeature,
	updateFeature,
	deleteFeature,
	transformFeaturesToGeoJSON,
	createTooltipContent
};
