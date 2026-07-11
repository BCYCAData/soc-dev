<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON/external-library data structures */
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';
	import TemplateEditForm from './TemplateEditForm.svelte';
	import TemplateStyleEditor from './TemplateStyleEditor.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	interface Template {
		id: string;
		name: string;
		description: string | null;
		geometry_type: string;
		category: string;
		is_active: boolean | null;
		/** feature_templates.style jsonb override (null = code default). */
		style?: unknown;
		template_fields?: any[];
	}

	let { data }: Props = $props();
	let showFieldsModal = $state(false);
	let templateFields = $state<any[]>([]);
	let currentTemplate = $state<Template | null>(null);
	let isCreating = $state(false);
	let isSavingFields = $state(false);
	let showCreateForm = $state(false);

	let templates = $derived(data.templates);
	let { geometryTypes, fieldTypes, categories } = $derived(data.initialData);

	// New template state
	let newTemplate = $state({
		name: '',
		description: '',
		geometry_type: '',
		category: '',
		is_active: true
	});

	$effect(() => {
		if (geometryTypes.length > 0 && !newTemplate.geometry_type) {
			newTemplate.geometry_type = geometryTypes[0];
		}
		if (categories.length > 0 && !newTemplate.category) {
			newTemplate.category = categories[0];
		}
	});

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

	function resetNewTemplate() {
		newTemplate = {
			name: '',
			description: '',
			geometry_type: geometryTypes[0],
			category: categories[0],
			is_active: true
		};
	}

	const handleCreateSubmit: SubmitFunction = () => {
		isCreating = true;
		const templateName = newTemplate.name;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success(
					result.data?.message || `New template '${templateName}' created successfully`
				);
				await invalidateAll();
				await update();
				resetNewTemplate();
				showCreateForm = false;
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to create template. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to create template. Please try again.');
			}
			isCreating = false;
		};
	};

	const handleFieldsSubmit: SubmitFunction = () => {
		isSavingFields = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidateAll();
				await update();
				showFieldsModal = false;
			}
			isSavingFields = false;
		};
	};
</script>

<svelte:head>
	<title>Site Admin-Data-FeatureTemplates</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Feature Templates Management</h1>
		<button
			type="button"
			onclick={() => (showCreateForm = !showCreateForm)}
			class="bg-tertiary-400 hover:bg-secondary-700 rounded-full px-6 py-2 text-center text-base focus:outline-none"
		>
			{showCreateForm ? 'Cancel' : 'Create New Template'}
		</button>
	</div>

	<!-- Create Template Form -->
	{#if showCreateForm}
		<div class="bg-secondary-50-950 mb-6 rounded-lg border p-6">
			<h2 class="mb-4 text-xl font-bold">Create New Template</h2>
			<form
				method="POST"
				action="?/createTemplate"
				use:enhance={handleCreateSubmit}
				class="space-y-4"
			>
				<div>
					<label for="new_name" class="block text-sm font-medium">Name</label>
					<input
						type="text"
						id="new_name"
						name="name"
						bind:value={newTemplate.name}
						class="border-surface-300 mt-1 block w-full rounded-md shadow-sm"
						required
					/>
				</div>

				<div>
					<label for="new_description" class="block text-sm font-medium">Description</label>
					<textarea
						id="new_description"
						name="description"
						bind:value={newTemplate.description}
						class="border-surface-300 mt-1 block w-full rounded-md shadow-sm"
						rows="3"
					></textarea>
				</div>

				<div>
					<label for="new_geometry_type" class="block text-sm font-medium">Geometry Type</label>
					<select
						id="new_geometry_type"
						name="geometry_type"
						bind:value={newTemplate.geometry_type}
						class="border-surface-300 bg-surface-50-950 mt-1 block w-full rounded-md shadow-sm"
						required
					>
						{#each geometryTypes as type (type)}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="new_category" class="block text-sm font-medium">Category</label>
					<select
						id="new_category"
						name="category"
						bind:value={newTemplate.category}
						class="border-surface-300 bg-surface-50-950 mt-1 block w-full rounded-md shadow-sm"
						required
					>
						{#each categories as category (category)}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>

				{#if newTemplate.geometry_type && newTemplate.category}
					{#key `${newTemplate.geometry_type}:${newTemplate.category}`}
						<TemplateStyleEditor
							geometryType={newTemplate.geometry_type}
							category={newTemplate.category}
						/>
					{/key}
				{/if}

				<div>
					<label class="flex items-center">
						<input
							type="checkbox"
							name="is_active"
							bind:checked={newTemplate.is_active}
							class="border-surface-300 rounded"
						/>
						<span class="ml-2 text-sm">Active</span>
					</label>
				</div>

				<div class="flex justify-end gap-4">
					<button
						type="button"
						onclick={() => {
							showCreateForm = false;
							resetNewTemplate();
						}}
						class="bg-surface-200 text-surface-800 rounded-md px-4 py-2"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="btn preset-filled-tertiary-500 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isCreating}
						aria-busy={isCreating}
					>
						{#if isCreating}
							<span class="inline-flex items-center gap-2">
								<Spinner size="16" /> Creating...
							</span>
						{:else}
							Create Template
						{/if}
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Existing Templates Accordion -->
	<Accordion defaultValue={[]} collapsible={true} spaceY="space-y-1">
		{#each templates as template (template)}
			<Accordion.Item
				controlClasses="bg-secondary-100-900 font-medium"
				value={template.id.toString()}
			>
				{#snippet control()}
					<div class="flex items-center justify-between">
						<span>{template.name}</span>
						<div class="flex gap-2">
							<span class="bg-tertiary-100-900 rounded px-2 py-1 text-xs">
								{template.geometry_type}
							</span>
							<span class="bg-success-100-900 rounded px-2 py-1 text-xs">
								{template.category}
							</span>
						</div>
					</div>
				{/snippet}
				{#snippet panel()}
					<TemplateEditForm
						{template}
						{geometryTypes}
						{categories}
						onManageFields={openFieldsModal}
					/>
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>

	<!-- Fields Modal -->
	{#if showFieldsModal && currentTemplate}
		<div class="bg-surface-950/50 fixed inset-0 z-50 flex items-center justify-center">
			<div class="bg-surface-50-950 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-6">
				<h2 class="mb-4 text-xl font-bold">Manage Template Fields for {currentTemplate.name}</h2>
				<form
					method="POST"
					action="?/manageFields"
					use:enhance={handleFieldsSubmit}
					class="space-y-4"
				>
					<input type="hidden" name="template_id" value={currentTemplate.id ?? ''} />
					<div class="space-y-4">
						{#each templateFields as field, index (index)}
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
								<select bind:value={field.field_type} class="bg-surface-50-950 rounded border p-2">
									{#each fieldTypes as type (type)}
										<option value={type}>{type}</option>
									{/each}
								</select>
								<button
									type="button"
									class="text-error-600 hover:text-error-800"
									onclick={() => removeField(index)}
								>
									Remove
								</button>
							</div>
						{/each}
					</div>

					<button type="button" onclick={addNewField} class="btn preset-filled-success-500">
						Add Field
					</button>

					<input type="hidden" name="fields" value={JSON.stringify(templateFields)} />

					<div class="flex justify-end gap-4">
						<button
							type="button"
							onclick={() => (showFieldsModal = false)}
							class="bg-surface-200 text-surface-800 rounded-md px-4 py-2"
						>
							Close
						</button>
						<button
							type="submit"
							class="btn preset-filled-tertiary-500 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={isSavingFields}
							aria-busy={isSavingFields}
						>
							{#if isSavingFields}
								<span class="inline-flex items-center gap-2">
									<Spinner size="16" /> Saving...
								</span>
							{:else}
								Save Fields
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
