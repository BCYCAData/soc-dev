<script lang="ts">
	//TODO: Refactor this route to:
	//TODO: 	Implement the logic for managing custom addresses
	//TODO: 	Implement the logic for managing project spatial data source tables
	import { enhance } from '$app/forms';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	interface Template {
		id: number;
		name: string;
		description: string;
		geometry_type: string;
		category: string;
		is_active: boolean;
		template_fields?: any[];
	}

	let { data }: Props = $props();
	let showFieldsModal = $state(false);
	let templateFields = $state<any[]>([]);
	let currentTemplate = $state<Template | null>(null);

	let templates = $derived(data.templates);
	let { geometryTypes, fieldTypes, categories } = $derived(data.initialData);

	function openFieldsModal(template: any) {
		currentTemplate = template;
		templateFields = [...(template.template_fields || [])];
		showFieldsModal = true;
	}

	function addNewField() {
		templateFields = [
			...templateFields,
			{ field_name: '', field_type: fieldTypes[0], default_value: '' }
		];
	}

	function removeField(index: number) {
		templateFields = templateFields.filter((_, i) => i !== index);
	}

	const value = $state(['']);
</script>
<svelte:head>
	<title>Site Admin-Data-FeatureTemplates</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Feature Templates Management</h1>

	<Accordion {value} collapsible={true} spaceY="space-y-1">
		{#each templates as template}
			<Accordion.Item controlClasses="bg-amber-100 font-medium" value={template.id.toString()}>
				{#snippet control()}
					<div class="flex items-center justify-between">
						<span>{template.name}</span>
						<div class="flex gap-2">
							<span class="rounded bg-blue-100 px-2 py-1 text-xs">
								{template.geometry_type}
							</span>
							<span class="rounded bg-green-100 px-2 py-1 text-xs">
								{template.category}
							</span>
						</div>
					</div>
				{/snippet}
				{#snippet panel()}
					<form
						method="POST"
						action="?/updateTemplate"
						use:enhance
						class="mx-auto max-w-lg rounded-lg border p-6"
					>
						<input type="hidden" name="id" value={template.id} />

						<div class="space-y-4">
							<div>
								<label for="name" class="block text-sm font-medium">Name</label>
								<input
									type="text"
									id="name"
									name="name"
									value={template.name}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
									required
								/>
							</div>

							<div>
								<label for="description" class="block text-sm font-medium">Description</label>
								<textarea
									id="description"
									name="description"
									value={template.description}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
									rows="3"
								></textarea>
							</div>

							<div>
								<label for="geometry_type" class="block text-sm font-medium">Geometry Type</label>
								<select
									id="geometry_type"
									name="geometry_type"
									value={template.geometry_type}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
									required
								>
									{#each geometryTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="category" class="block text-sm font-medium">Category</label>
								<select
									id="category"
									name="category"
									value={template.category}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
									required
								>
									{#each categories as category}
										<option value={category}>{category}</option>
									{/each}
								</select>
							</div>

							<div>
								<label class="flex items-center">
									<input
										type="checkbox"
										name="is_active"
										checked={template.is_active}
										class="rounded border-gray-300"
									/>
									<span class="ml-2 text-sm">Active</span>
								</label>
							</div>

							<div class="flex gap-4">
								<button
									type="submit"
									class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
								>
									Update Template
								</button>

								<button
									type="button"
									onclick={() => openFieldsModal(template)}
									class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
								>
									Manage Fields
								</button>
							</div>
						</div>
					</form>
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>

	<!-- Fields Modal -->
	{#if showFieldsModal && currentTemplate}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
				<h2 class="mb-4 text-xl font-bold">Manage Template Fields for {currentTemplate.name}</h2>
				<form method="POST" action="?/manageFields" use:enhance class="space-y-4">
					<input type="hidden" name="template_id" value={currentTemplate.id ?? ''} />
					<div class="space-y-4">
						{#each templateFields as field, index}
							<div class="grid grid-cols-3 gap-4">
								<input
									type="text"
									bind:value={field.field_name}
									placeholder="Field Name"
									class="rounded border p-2"
								/>
								<input
									type="text"
									bind:value={field.default_value}
									placeholder="Default Value"
									class="rounded border p-2"
								/>
								<select bind:value={field.field_type} class="rounded border p-2">
									{#each fieldTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
								<button
									type="button"
									class="text-red-600 hover:text-red-800"
									onclick={() => removeField(index)}
								>
									Remove
								</button>
							</div>
						{/each}
					</div>

					<button
						type="button"
						onclick={addNewField}
						class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Add Field
					</button>

					<input type="hidden" name="fields" value={JSON.stringify(templateFields)} />

					<div class="flex justify-end gap-4">
						<button
							type="button"
							onclick={() => (showFieldsModal = false)}
							class="rounded-md bg-gray-200 px-4 py-2 text-gray-800"
						>
							Close
						</button>
						<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white">
							Save Fields
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
