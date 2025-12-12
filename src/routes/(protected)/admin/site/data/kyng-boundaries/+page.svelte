<script lang="ts">
	import type { PageData } from './$types';
	import { kyngAreasMapConfig } from '$lib/leaflet/mapconfig';
	import Spinner from '$components/page/Spinner.svelte';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();
	// let siteSuburbsData = data?.siteSuburbsData;
	// let siteRoadsData = data?.siteRoadsData;
	let projectBoundary = $derived(data?.siteBoundaryData); // GeoJSON polygon

	let mapLoaded = $state(false);

	const handleMapLoaded = () => (mapLoaded = true);
</script>

<article class="grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 overflow-hidden">
	<section
		class="mx-auto flex h-[calc(100vh-400px)] w-full max-w-3xl flex-col overflow-hidden px-4"
	>
		{#if projectBoundary}
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				{#if !mapLoaded}
					<div class="flex items-center justify-center">
						<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
					</div>
				{/if}

				<LeafletMap
					{...kyngAreasMapConfig(
						projectBoundary.initialExtent as [[number, number], [number, number]]
					)}
					onMapReady={handleMapLoaded}
				>
					<!-- {#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.allAddresspoints}
							layerName="Project Address Points"
							visible={true}
							symbology={projectAddresspointsOptions}
							staticLayer={false}
							showInLegend={true}
							editable={false}
						/>
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.registeredAddresspoints}
							layerName="Registered Address Points"
							visible={true}
							symbology={registeredAddresspointsOptions}
							staticLayer={false}
							showInLegend={true}
							editable={false}
						/>
					{/await} -->

					{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
						<LeafletScaleControl position="bottomleft" />
					{/await}
				</LeafletMap>
			{/await}
		{:else}
			<p class="text-surface-500 mt-4 text-center">Unable to load map data</p>
		{/if}
	</section>
</article>
