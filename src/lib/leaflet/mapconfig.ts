export const aboutMapConfig = {
	baseLayers: [
		{
			name: 'NSW Streets',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'\u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e'
		}
	]
};

export const myMapConfig = {
	baseLayers: [
		{
			name: 'NSW Streets',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'\u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e'
		}
	]
};

export const kyngMapConfig = {
	baseLayers: [
		{
			name: 'Air Photo',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
		},
		{
			name: 'Streets',
			url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}',
			attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
		}
	]
};
