<script lang="ts">
	import NewMap from '$components/leaflet/NewMap.svelte';
	import BaseLayerGroup from '$components/leaflet/layers/BaseLayerGroup.svelte';
	import OverlayLayerGroup from '$components/leaflet/layers/OverlayLayerGroup.svelte';
	import LayerControl from '$components/leaflet/controls/LayerControl.svelte';

	// Import layer helpers
	import {
		tileLayer,
		wmsLayer,
		esriBasemap,
		esriFeatureLayer,
		esriDynamicMapLayer,
		esriImageMapLayer,
		marker,
		geoJSON,
		customLayer,
		type BaseLayerConfig,
		type OverlayLayerConfig
	} from '$lib/map/layer-factory';

	let activeLayerId = $state('osm');

	// ========================================================================
	// BASE LAYERS - Mix of standard tile layers and ESRI basemaps
	// ========================================================================
	const baseLayers: BaseLayerConfig[] = [
		// Standard tile layers (your existing approach still works!)
		tileLayer('osm', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			label: 'OpenStreetMap',
			attribution: '© OpenStreetMap contributors',
			visible: true
		}),

		tileLayer('carto', 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			label: 'Carto Light',
			attribution: '© CartoDB',
			visible: false
		}),

		// WMS layer example
		wmsLayer('noaa-radar', 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
			label: 'Weather Radar',
			layers: 'nexrad-n0r-900913',
			format: 'image/png',
			transparent: true,
			visible: false
		}),

		// ESRI basemaps (new!)
		esriBasemap('esri-topo', 'Topographic', {
			label: 'ESRI Topographic',
			visible: false
		}),

		esriBasemap('esri-streets', 'Streets', {
			label: 'ESRI Streets',
			visible: false
		}),

		esriBasemap('esri-imagery', 'Imagery', {
			label: 'ESRI Satellite',
			visible: false
		}),

		esriBasemap('esri-gray', 'Gray', {
			label: 'ESRI Gray Canvas',
			visible: false
		})
	];

	// ========================================================================
	// OVERLAY LAYERS - Mix of standard markers and ESRI layers
	// ========================================================================
	const overlays: OverlayLayerConfig[] = [
		// Your existing markers still work the same way!
		marker('batlow', [-35.52, 148.15], {
			label: 'Batlow',
			visible: true,
			title: 'Batlow'
		}),

		marker('young', [-34.31, 148.3], {
			label: 'Young',
			visible: true,
			title: 'Young'
		}),

		// ESRI Feature Layer - US National Parks
		esriFeatureLayer(
			'usa-parks',
			'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Parks/FeatureServer/0',
			{
				label: 'USA National Parks',
				visible: false,
				style: (feature: any): any => ({
					color: '#2ecc71',
					weight: 2,
					fillOpacity: 0.3
				}),
				onEachFeature: (feature: any, layer: any): void => {
					if (feature.properties.NAME) {
						layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br/>National Park`);
					}
				}
			}
		),

		// ESRI Dynamic Map Layer - Census Data
		esriDynamicMapLayer(
			'census',
			'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
			{
				label: 'US Census Data',
				visible: false,
				opacity: 0.7,
				layers: [0, 1, 2]
			}
		),

		// ESRI Image Map Layer - Landsat
		esriImageMapLayer(
			'landsat',
			'https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer',
			{
				label: 'Landsat Imagery',
				visible: false,
				opacity: 0.75
			}
		),

		// Custom layer example - Layer group with multiple sub-layers
		customLayer(
			'custom-group',
			(L: any) => {
				const group = L.layerGroup();

				// Add multiple markers to the group
				const marker1 = L.marker([-35.0, 148.0]).bindPopup('Custom Marker 1');
				const marker2 = L.marker([-35.5, 148.5]).bindPopup('Custom Marker 2');

				group.addLayer(marker1);
				group.addLayer(marker2);

				return group;
			},
			{
				label: 'Custom Marker Group',
				visible: false,
				asBase: false // Explicitly set as overlay
			}
		) as OverlayLayerConfig,

		// Advanced ESRI example - Feature layer with custom queries
		customLayer(
			'filtered-cities',
			(L: any) => {
				if (!L.esri) {
					throw new Error('ESRI not available');
				}

				return L.esri.featureLayer({
					url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3',
					where: 'POP2000 > 100000', // Server-side filter
					style: (feature: any): any => {
						const pop = feature.properties.POP2000;
						return {
							color: pop > 1000000 ? '#e74c3c' : '#3498db',
							weight: 2,
							fillOpacity: 0.5
						};
					},
					onEachFeature: (feature: any, layer: any): void => {
						const props = feature.properties;
						layer.bindPopup(`
							<strong>${props.NAME}</strong><br/>
							Population: ${props.POP2000.toLocaleString()}
						`);
					}
				});
			},
			{
				label: 'Large Cities (>100k)',
				visible: false
			}
		)
	];

	// ========================================================================
	// GeoJSON Example (if you have GeoJSON data)
	// ========================================================================
	const geojsonData = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [
						[148.15, -35.52],
						[148.3, -34.31]
					]
				},
				properties: {
					name: 'Route between Batlow and Young'
				}
			}
		]
	};

	// Create GeoJSON overlay separately with proper type
	const routeOverlay: OverlayLayerConfig = geoJSON('route', geojsonData, {
		label: 'Route',
		visible: false,
		style: {
			color: '#3498db',
			weight: 3,
			opacity: 0.7
		},
		onEachFeature: (feature: any, layer: any): void => {
			if (feature.properties.name) {
				layer.bindPopup(feature.properties.name);
			}
		}
	});

	// Add to overlays array
	overlays.push(routeOverlay);
</script>

<div class="page-container">
	<div class="header">
		<h1>Integrated Leaflet + ESRI Map</h1>
		<p>Seamlessly mix standard Leaflet layers with ESRI services</p>
	</div>

	<div class="map-wrapper">
		<NewMap center={[-35.5, 148.2]} zoom={8}>
			<BaseLayerGroup layers={baseLayers} bind:activeLayerId />
			<OverlayLayerGroup {overlays} />
			<LayerControl position="topright" collapsible={true} />
		</NewMap>
	</div>

	<div class="info-panel">
		<h2>Layer Types Available:</h2>
		<div class="layer-grid">
			<div class="layer-category">
				<h3>Standard Layers</h3>
				<ul>
					<li>Tile Layers (OSM, CartoDB)</li>
					<li>WMS Layers</li>
					<li>Markers</li>
					<li>GeoJSON</li>
					<li>Polylines</li>
				</ul>
			</div>
			<div class="layer-category">
				<h3>ESRI Layers</h3>
				<ul>
					<li>Basemaps (Streets, Topo, Imagery)</li>
					<li>Feature Layers (Vector)</li>
					<li>Dynamic Map Layers</li>
					<li>Image Map Layers (Raster)</li>
					<li>Tiled Map Layers</li>
				</ul>
			</div>
			<div class="layer-category">
				<h3>Custom Layers</h3>
				<ul>
					<li>Layer Groups</li>
					<li>Filtered Feature Layers</li>
					<li>Complex Compositions</li>
					<li>Third-party Plugins</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		font-weight: bold;
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.header p {
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	.map-wrapper {
		height: 600px;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.info-panel {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 8px;
	}

	.info-panel h2 {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2c3e50;
		margin-bottom: 1.5rem;
	}

	.layer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.layer-category h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: #34495e;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #3498db;
	}

	.layer-category ul {
		list-style: none;
		padding: 0;
	}

	.layer-category li {
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
		color: #495057;
	}

	.layer-category li::before {
		content: '▸';
		position: absolute;
		left: 0;
		color: #3498db;
		font-weight: bold;
	}
</style>
