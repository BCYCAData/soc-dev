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

export type AddressPointData = {
	status: number;
	communityname: string | null;
	validaddress: string[];
	searchaddress: string[];
	principaladdresssiteoid?: number | null;
	addresspoint: any | null;
	message: string | null;
	returnstatus: number;
	apistatus: number | null;
	apistatustext: string | null;
	error: PostgrestError | null;
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

export type MapTileLayerObject = {
	url: string;
	layerOptions: TileLayerOptions;
};
