<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic template field rows */
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';
	import TemplateStyleEditor from './TemplateStyleEditor.svelte';

	export interface Template {
		id: string;
		name: string;
		description: string | null;
		geometry_type: string;
		category: string;
		is_active: boolean | null;
		style?: unknown;
		template_fields?: any[];
	}

	interface Props {
		template: Template;
		geometryTypes: string[];
		categories: string[];
		onManageFields: (template: Template) => void;
	}

	let { template, geometryTypes, categories, onManageFields }: Props = $props();

	// Bound so TemplateStyleEditor tracks live geometry/category changes; the
	// initial snapshot from the row is intentional (refreshed via invalidateAll)
	// and read via a closure so svelte-check doesn't flag it.
	const init = (() => ({ geometry: template.geometry_type, category: template.category }))();
	let geometryType = $state(init.geometry);
	let category = $state(init.category);
	let isUpdating = $state(false);

	const handleUpdateSubmit: SubmitFunction = ({ formData }) => {
		isUpdating = true;
		const templateName = formData.get('name') as string;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || `Template '${templateName}' updated successfully`);
				await invalidateAll();
				await update();
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to update template. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update template. Please try again.');
			}
			isUpdating = false;
		};
	};
</script>

<form
	method="POST"
	action="?/updateTemplate"
	use:enhance={handleUpdateSubmit}
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
				class="border-surface-300 mt-1 block w-full rounded-md shadow-sm"
				required
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium">Description</label>
			<textarea
				id="description"
				name="description"
				value={template.description}
				class="border-surface-300 mt-1 block w-full rounded-md shadow-sm"
				rows="3"
			></textarea>
		</div>

		<div>
			<label for="geometry_type" class="block text-sm font-medium">Geometry Type</label>
			<select
				id="geometry_type"
				name="geometry_type"
				bind:value={geometryType}
				class="border-surface-300 bg-surface-50-950 mt-1 block w-full rounded-md shadow-sm"
				required
			>
				{#each geometryTypes as type (type)}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="category" class="block text-sm font-medium">Category</label>
			<select
				id="category"
				name="category"
				bind:value={category}
				class="border-surface-300 bg-surface-50-950 mt-1 block w-full rounded-md shadow-sm"
				required
			>
				{#each categories as cat (cat)}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
		</div>

		{#key `${geometryType}:${category}`}
			<TemplateStyleEditor {geometryType} {category} initial={template.style} />
		{/key}

		<div>
			<label class="flex items-center">
				<input
					type="checkbox"
					name="is_active"
					value="true"
					checked={template.is_active}
					class="border-surface-300 rounded"
				/>
				<span class="ml-2 text-sm">Active</span>
			</label>
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				class="btn preset-filled-tertiary-500 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isUpdating}
				aria-busy={isUpdating}
			>
				{#if isUpdating}
					<span class="inline-flex items-center gap-2">
						<Spinner size="16" /> Updating...
					</span>
				{:else}
					Update Template
				{/if}
			</button>

			<button
				type="button"
				onclick={() => onManageFields(template)}
				class="btn preset-filled-success-500"
			>
				Manage Fields
			</button>
		</div>
	</div>
</form>
