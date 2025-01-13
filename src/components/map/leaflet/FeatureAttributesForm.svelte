<script lang="ts">
	import { editingState, featureAttributes } from '$lib/leaflet/spatialutilities.svelte';
	import type { TemplateField } from '$lib/leaflet/spatial';
	import { enhance } from '$app/forms';

	// Add templateFields state
	let templateFields = $state<Record<string, TemplateField[]>>({});
	let fields = $state<TemplateField[]>([]);
	let attributes = $state<Record<string, string>>({});

	$effect(() => {
		if (editingState.activeTemplate) {
			fields = templateFields[editingState.activeTemplate.id] || [];

			if (editingState.activeFeature && editingState.mode === 'edit') {
				attributes = Object.values(featureAttributes)
					.filter((attr) => attr.feature_id === editingState.activeFeature?.id)
					.reduce(
						(acc, attr) => ({
							...acc,
							[attr.field_id]: attr.value || ''
						}),
						{}
					);
			}
		}
	});

	function handleSubmit() {
		if (editingState.activeFeature && editingState.mode) {
			Object.entries(attributes).forEach(([fieldId, value]) => {
				const attributeId = crypto.randomUUID();
				featureAttributes[attributeId] = {
					id: attributeId,
					feature_id: editingState.activeFeature!.id,
					field_id: fieldId,
					value
				};
			});
		}
	}
</script>

<form
	method="POST"
	action="?/assignCoordinator"
	use:enhance={handleSubmit}
	class="rounded bg-white p-4 shadow"
>
	{#each fields as field}
		<div class="mb-4">
			<label for={field.id} class="block text-sm font-medium text-gray-700">
				{field.field_name}
				{#if field.required}*{/if}
			</label>

			{#if field.field_type === 'text'}
				<input
					id={field.id}
					type="text"
					bind:value={attributes[field.id]}
					required={field.required}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
				/>
			{:else if field.field_type === 'number'}
				<input
					id={field.id}
					type="number"
					bind:value={attributes[field.id]}
					required={field.required}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
				/>
			{/if}
		</div>
	{/each}

	<div class="flex justify-end space-x-2">
		<button
			type="button"
			class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			onclick={() => (editingState.mode = null)}
		>
			Cancel
		</button>
		<button
			type="submit"
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			Save
		</button>
	</div>
</form>
