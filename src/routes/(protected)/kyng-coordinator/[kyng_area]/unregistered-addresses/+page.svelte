<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let unRegisteredPropertiesData = $derived(data.unRegisteredPropertiesData);
	const kyngId = page.params.kyng_area;
	let baseUrl = `/kyng-coordinator/${kyngId}/map`;
</script>

<div class="text-l container-properties flex flex-col gap-2 pt-2">
	{#if unRegisteredPropertiesData?.features?.length}
		<h2 class="h2 flex justify-around">Un-Registered Properties</h2>
		<ul class="grid-container">
			{#each unRegisteredPropertiesData.features as feature, index (feature.properties.principaladdresssiteoid + '_' + index)}
				<a
					href="{baseUrl}?lat={feature.geometry.coordinates[1]}&lng={feature.geometry
						.coordinates[0]}&zoom=15"
					class="text-blue-600 hover:text-blue-800 hover:underline"
				>
					{feature.properties.address}
				</a>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.container-properties {
		container-type: inline-size;
	}

	.grid-container {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
	}

	@container (min-width: 600px) {
		.grid-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@container (min-width: 900px) {
		.grid-container {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
