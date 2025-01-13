import type {
	EditingState,
	FeatureTemplate,
	SpatialFeature,
	FeatureAttribute
} from '$lib/leaflet/spatial';

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
	deleteFeature
};
