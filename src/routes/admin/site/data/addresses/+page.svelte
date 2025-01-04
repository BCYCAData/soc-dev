<script lang="ts">
	import CustomAddressesTable from '$components/form/tables/CustomAddressesTable.svelte';
	import CustomAddressValidationForm from '$components/form/custom-addresses/CustomAddressValidationForm.svelte';
	import { Accordion, Tabs } from '@skeletonlabs/skeleton-svelte';
	import Spinner from '$components/page/Spinner.svelte';

	import type { PageData } from './$types';
	import type { CustomAddress } from '$lib/form.types';

	import 'leaflet/dist/leaflet.css';
	import LeafletArcGisFeatureServerLayer from '$components/map/leaflet/layers/LeafletArcGISFeatureServerLayer.svelte';
	import type { PointSymbologyOptions } from '$lib/leaflet/types';
	import {
		convertLeafletBounds,
		getTilesForExtent,
		validateAndClampBounds,
		type Bounds
	} from '$lib/leaflet/geometryUtilities';

	let { data } = $props<{ data: PageData }>();

	const apiBounds = {
		west: 96.821592,
		south: -43.583011,
		east: 167.993847,
		north: -9.230004
	};

	let customAddresses = $derived(data.customAddresses);
	let validatedAddress: any = $state(null);

	function handleAddressEdit(editedAddress: CustomAddress) {
		const formData = new FormData();

		Object.entries(editedAddress).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				formData.append(key, value.toString());
			}
		});

		fetch('?/upsertAddress', {
			method: 'POST',
			body: formData
		});
	}

	function handleValidatedAddress(validatedData: any) {
		validatedAddress = validatedData;
	}

	function handleAddValidatedAddress() {
		if (validatedAddress) {
			const addressData = {
				address: validatedAddress.validaddressstreet,
				suburb: validatedAddress.validaddresssuburb,
				postcode: validatedAddress.validaddresspostcode,
				principaladdresssiteoid: validatedAddress.principaladdresssiteoid,
				community: validatedAddress.community,
				kyng: validatedAddress.kyng
			};

			const formData = new FormData();
			Object.entries(addressData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					formData.append(key, value.toString());
				}
			});

			fetch('?/upsertAddress', {
				method: 'POST',
				body: formData
			});
		}
	}
	let selectedFeature = $state<GeoJSON.GeoJsonProperties | null>(null);

	const gnafAddressPoints = $state<GeoJSON.FeatureCollection>({
		type: 'FeatureCollection',
		features: []
	});

	async function fetchAddressPoints(bounds: Bounds) {
		// Validate and clamp bounds to Geoscape coverage area
		const validBounds = validateAndClampBounds(bounds, apiBounds);

		// Always use zoom 15 for complete GNAF coverage
		const gnafZoom = 15;

		// Get tile coordinates for the validated bounds
		const tileCoords = getTilesForExtent(validBounds, gnafZoom);

		// Fetch data for each tile
		const promises = tileCoords.map(({ x, y, z }) =>
			fetch(`/admin/site/data/addresses?z=${z}&x=${x}&y=${y}`).then((res) => res.json())
		);

		const results = await Promise.all(promises);
		const allFeatures = results.flatMap((result) => result.features);

		// First group by ADDRESS_DETAIL_PID
		const uniqueFeatures = Object.values(
			allFeatures.reduce(
				(groups, feature: GeoJSON.Feature) => {
					const pid = feature.properties?.ADDRESS_DETAIL_PID;
					if (!groups[pid]) {
						groups[pid] = feature;
					}
					return groups;
				},
				{} as Record<string, GeoJSON.Feature>
			)
		) as GeoJSON.Feature[];

		// Then group colocated features
		const colocatedFeatures: Record<string, GeoJSON.Feature[]> = {};
		const DISTANCE_THRESHOLD = 0.00009;

		uniqueFeatures.forEach((feature, i) => {
			const point1 = feature.geometry as GeoJSON.Point;
			const groupKey = `group_${i}`;

			if (!colocatedFeatures[groupKey]) {
				colocatedFeatures[groupKey] = [feature];
			}

			uniqueFeatures.forEach((otherFeature) => {
				if (feature !== otherFeature) {
					const point2 = otherFeature.geometry as GeoJSON.Point;
					const deltaLon = Math.abs(point1.coordinates[0] - point2.coordinates[0]);
					const deltaLat = Math.abs(point1.coordinates[1] - point2.coordinates[1]);

					if (deltaLon <= DISTANCE_THRESHOLD && deltaLat <= DISTANCE_THRESHOLD) {
						colocatedFeatures[groupKey].push(otherFeature);
					}
				}
			});
		});

		// Get significant groups (more than one feature)
		const significantGroups = Object.values(colocatedFeatures).filter((group) => group.length > 1);

		// Get non-colocated features
		const nonColocatedFeatures = uniqueFeatures.filter(
			(feature) =>
				!significantGroups
					.flat()
					.some((g) => g.properties?.ADDRESS_DETAIL_PID === feature.properties?.ADDRESS_DETAIL_PID)
		);

		// Calculate offset positions for colocated features
		const OFFSET_DISTANCE = 0.00015; // Adjust for desired spacing
		significantGroups.forEach((group) => {
			group.forEach((feature, index) => {
				const angle = (2 * Math.PI * index) / group.length;
				const originalPoint = feature.geometry as GeoJSON.Point;

				// Create circular offset pattern
				const offsetX = OFFSET_DISTANCE * Math.cos(angle);
				const offsetY = OFFSET_DISTANCE * Math.sin(angle);

				feature.geometry = {
					type: 'Point',
					coordinates: [
						originalPoint.coordinates[0] + offsetX,
						originalPoint.coordinates[1] + offsetY
					]
				};
			});
		});

		// Combine all features
		gnafAddressPoints.features = [...significantGroups.flat(), ...nonColocatedFeatures];
	}

	const baseLayers = [
		{
			name: 'NSW Streets',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'NSW Aerial',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'OpenStreetMap',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution: '© OpenStreetMap contributors'
		},
		{
			name: 'Satellite',
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
		}
	];

	const mapConfig = {
		centre: [-31.9511, 152.2983] as [number, number],
		// initialExtent: propertyGeometryData.bounds as [[number, number], [number, number]],
		zoom: 15,
		initialExtent: undefined,
		minZoom: undefined,
		maxZoom: undefined,
		zoomable: true,
		zoomSnap: 0.25,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: false, position: 'bottomright' as L.ControlPosition },
		width: '100%',
		height: '99%',
		baseLayers: baseLayers
	};

	let leafletMapInstance = $state<L.Map>();
	let mapLoaded = $state(false);

	function handleMapMoveEnd() {
		if (leafletMapInstance) {
			const bounds = convertLeafletBounds(leafletMapInstance.getBounds());
			fetchAddressPoints(bounds);
		}
	}

	function handleMapInstance(map: L.Map) {
		leafletMapInstance = map;
		map.on('moveend', handleMapMoveEnd);
	}

	function handleMapLoaded() {
		mapLoaded = true;
	}

	const value = $state(['']);
	let tabSet = $state('0');

	const gnafAddressPointsOptions: PointSymbologyOptions = {
		type: 'leaflet',
		options: {
			type: 'textLabel',
			options: {
				html: 'street_number', // This will be processed by createTextLabel
				className: 'text-label',
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			} as L.DivIconOptions
		}
	};

	// const gnafAddressPointsOptions: PointSymbologyOptions = {
	// 	type: 'leaflet',
	// 	options: {
	// 		type: 'circleMarker',
	// 		options: {
	// 			fillColor: '#a5a5a5',
	// 			weight: 0,
	// 			radius: 3,
	// 			fillOpacity: 0.8
	// 		}
	// 	}
	// };

	// const gnafAddressPointsOptions: PointSymbologyOptions = {
	// 	type: 'leaflet',
	// 	options: {
	// 		type: 'circleMarker',
	// 		options: {
	// 			fillColor: '#ff0000', // Bright red
	// 			color: '#000000', // Black border
	// 			weight: 1, // Border width
	// 			radius: 6, // Larger radius
	// 			fillOpacity: 1 // Full opacity
	// 		}
	// 	}
	// };

	$effect(() => {
		if (tabSet === '1' && leafletMapInstance) {
			setTimeout(() => {
				leafletMapInstance?.invalidateSize();
			}, 100);
		}
	});
</script>

<Tabs bind:value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="0">Maintain Custom Addresses</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="1">New Custom Addresses</Tabs.Control
		>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="0">
			<div class="container mx-auto p-4">
				<h1 class="mb-6 text-2xl font-bold">Custom Address Management</h1>
				<Accordion {value} collapsible={true} spaceY="space-y-1">
					<Accordion.Item
						value={'0'}
						controlClasses="bg-primary-400 text-xl"
						classes="bg-orange-100 font-medium"
					>
						{#snippet control()}All Custom Addresses{/snippet}
						{#snippet panel()}
							<div class="table-container" id="custom-address-table">
								<CustomAddressesTable {customAddresses} onAddressEdit={handleAddressEdit} />
							</div>
						{/snippet}
					</Accordion.Item>
					<Accordion.Item
						value={'1'}
						controlClasses="bg-primary-400 text-xl"
						classes="bg-orange-100 font-medium"
					>
						{#snippet control()}Edit Custom Address Details{/snippet}
						{#snippet panel()}
							<div class="table-container" id="custom-address-table">
								<CustomAddressesTable {customAddresses} onAddressEdit={handleAddressEdit} />
							</div>
						{/snippet}
					</Accordion.Item>
					<Accordion.Item
						value={'2'}
						controlClasses="bg-primary-400 text-xl"
						classes="bg-orange-100 font-medium"
					>
						{#snippet control()}Add New Custom Address{/snippet}
						{#snippet panel()}
							<div class="form-container" id="custom-address-form">
								<CustomAddressValidationForm onValidatedAddress={handleValidatedAddress} />

								{#if validatedAddress}
									<div class="mt-4">
										<button
											class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
											onclick={handleAddValidatedAddress}
										>
											Add Validated Address
										</button>
									</div>
								{/if}
							</div>
						{/snippet}
					</Accordion.Item>
				</Accordion>
			</div>
		</Tabs.Panel>
		<Tabs.Panel value="1">
			<div class="map-container">
				{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: Leafletmap }}
					{#if !mapLoaded}
						<div class="spinner-overlay">
							<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
						</div>
					{/if}
					<Leafletmap {...mapConfig} onMapReady={handleMapLoaded} onMapInstance={handleMapInstance}>
						<LeafletArcGisFeatureServerLayer
							url="https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme/FeatureServer/12"
							name="Property Theme"
							visible={true}
							onFeatureClick={(feature) => (selectedFeature = feature.properties)}
						/>
						{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
							<LeafletGeoJSONPointLayer
								geojsonData={gnafAddressPoints}
								layerName="GNAF Addresses"
								visible={true}
								editable={false}
								showInLegend={true}
								staticLayer={false}
								symbology={gnafAddressPointsOptions}
							/>
						{/await}
						{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
							<LeafletScaleControl position="bottomleft" />
						{/await}
					</Leafletmap>
				{/await}
			</div>
		</Tabs.Panel>
	{/snippet}
</Tabs>

<style>
	.map-container {
		height: 65vh;
		min-height: 400px;
		position: relative;
		width: 100%;
		margin: 1rem auto;
	}
</style>
