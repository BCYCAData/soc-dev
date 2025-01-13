<script lang="ts">
	import {
		editingState,
		spatialFeatures,
		featureTemplates,
		setActiveFeature,
		deleteFeature
	} from '$lib/leaflet/spatialutilities.svelte';

	function handleEdit(featureId: string) {
		const feature = spatialFeatures[featureId];
		if (feature) {
			setActiveFeature(feature);
			editingState.mode = 'edit';
		}
	}

	function handleDelete(featureId: string) {
		if (confirm('Are you sure you want to delete this feature?')) {
			deleteFeature(featureId);
		}
	}
</script>

<div class="max-h-[600px] overflow-y-auto rounded bg-white p-4 shadow">
	<h2 class="mb-4 text-lg font-semibold">Property Features</h2>

	{#each Object.entries(spatialFeatures) as [id, feature]}
		{@const template = featureTemplates[feature.template_id]}
		<div class="border-b border-gray-200 py-2 last:border-0">
			<div class="flex items-center justify-between">
				<div>
					<span class="font-medium">{template?.name || 'Unknown Feature'}</span>
					<span class="ml-2 text-sm text-gray-500">{template?.category}</span>
				</div>
				<div class="space-x-2">
					<button class="text-blue-600 hover:text-blue-800" on:click={() => handleEdit(id)}>
						Edit
					</button>
					<button class="text-red-600 hover:text-red-800" on:click={() => handleDelete(id)}>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>
