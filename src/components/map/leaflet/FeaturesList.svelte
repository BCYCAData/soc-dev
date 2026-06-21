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

<div class="bg-surface-50-950 max-h-[600px] overflow-y-auto rounded p-4 shadow">
	<h2 class="mb-4 text-lg font-semibold">Property Features</h2>
	{#each Object.entries(spatialFeatures) as [id, feature]}
		{@const template = featureTemplates[feature.template_id]}
		<div class="border-surface-200 border-b py-2 last:border-0">
			<div class="flex items-center justify-between">
				<div>
					<span class="font-medium">{template?.name || 'Unknown Feature'}</span>
					<span class="text-surface-500 ml-2 text-sm">{template?.category}</span>
				</div>
				<div class="space-x-2">
					<button class="text-tertiary-600 hover:text-tertiary-800" on:click={() => handleEdit(id)}>
						Edit
					</button>
					<button class="text-error-600 hover:text-error-800" on:click={() => handleDelete(id)}>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>
