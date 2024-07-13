<script lang="ts">
	import { featuresStore } from '$stores/leaflet';
	// import { highlightFeature } from '$lib/map/map';

	function castFeatureToGeoJSON(feature: any) {
		console.log('List feature', feature);
		// return feature as L.GeoJSON;
	}
</script>

<ul>
	{#each $featuresStore as feature}
		<!-- <li class:highlight={$featuresStore.find((f) => f.id === feature.id)?.highlight}>
			<button
				on:click={() => {
					// Implement logic to select and highlight the feature
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter') {
						// Implement logic to select and highlight the feature
					}
				}}
				tabindex="0"
			>
				{feature.properties && feature.properties.name}
			</button>
		</li> -->
		<!-- <li on:mouseenter={() => highlightFeature(feature)}>
			{feature.options.onEachFeature?.caller}
		</li> -->
	{/each}
</ul>

<style>
	li.highlight button {
		color: red; /* Style for highlighted items */
	}
</style>
