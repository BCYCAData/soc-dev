declare global {
	// need this declaration if in a module
	interface Object {
		hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, string>;
	}
}

export type ComparisonOption = {
	value: string;
	lable: string;
};

export interface TabulatorProps {
	columns: any[];
	data: any[];
	layout: 'fitDataFill' | 'fitData' | 'fitColumns' | 'fitDataStretch' | 'fitDataTable' | undefined;
	responsiveLayout?: boolean | 'collapse' | 'hide';
	pagination?: boolean;
	paginationSize?: number;
	paginationSizeSelector?: any[];
	movableColumns?: boolean;
	paginationCounter?:
		| 'rows'
		| 'pages'
		| ((
				pageSize: number,
				currentRow: number,
				currentPage: number,
				totalRows: number,
				totalPages: number
		  ) => string | HTMLElement)
		| undefined;
	// add other properties as needed
}

export type Crumb = {
	label: string;
	href: string;
};

export type MapDataJSON = {
	jsonLayers: any;
};

export type PGPoint = {
	type: 'Point';
	crs: {
		type: 'name';
		properties: {
			name: string;
		};
	};
	coordinates: [number, number];
};

export type APIData = {
	status: number;
	searchaddressstreet: string;
	searchaddresssuburb: string;
	validaddressstreet: string;
	validaddresssuburb: string;
	validaddresspostcode: string;
	principaladdresssiteoid: number;
	community: string;
	kyng: string;
};

export type MapObject = {
	divId: string;
	centre: number[]; //-31.955814913,152.300883592
	zoomControl: boolean;
	doubleClickZoom: boolean;
	scrollWheelZoom: boolean;
	zoomSnap: number;
	zoom: number;
	minZoom: number;
	maxZoom: number;
	maxBounds?: undefined;
	dragging: boolean;
	mapTiler: boolean;
};

export type AddressPointType = {
	addresspointtype: string;
	geom: {
		coordinates: [number, number];
	};
};

export type MapTileLayerObject = {
	url: string;
	layerOptions: TileLayerOptions;
};

export type PropertyGeometryGeoJSON = {
	id: string;
	principaladdresssiteoid: number;
	address_point: GeometryObject;
	way_point: GeometryObject;
	property: GeometryObject;
	created_at: string;
	last_updated: string;
};

export interface FeatureCollection<G = Geometry | GeometryCollection, P = Properties>
	extends GeoJSONObject {
	type: 'FeatureCollection';
	features: Array<Feature<G, P>>;
}

export interface Feature<G = Geometry | GeometryCollection, P = Properties> extends GeoJSONObject {
	type: 'Feature';
	geometry: G;
	id?: Id;
	properties: P;
}

export interface GeoJSONObject {
	type: string;
	bbox?: BBox;
}

export declare type Properties = {
	[name: string]: any;
} | null;
