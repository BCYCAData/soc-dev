// Feature loading limits
export const MAX_FEATURES = 10000;
export const LOAD_CHUNK_SIZE = 500;

// Spatial parameters
export const BUFFER_RATIO = 0.5;
export const CACHE_CELL_SIZE = 10;

// Timing and performance
export const DEBOUNCE_DELAY = 250;
export const CACHE_PRUNE_THRESHOLD = 1000;

// Default styles
export const DEFAULT_FEATURE_STYLE = {
	color: '#FF0000',
	weight: 4,
	opacity: 1,
	fillColor: '#FF0000',
	fillOpacity: 0.7
};

// Cache settings
export const MAX_CACHED_BOUNDS = 5;
export const OVERLAP_THRESHOLD = 0.7;

// Query parameters
export const DEFAULT_WHERE_CLAUSE = '1=1';
export const DEFAULT_ZOOM_RANGE = {
	min: 0,
	max: 22
};
