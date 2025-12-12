<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onDestroy, getContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';
	import { SelectionBoxControl } from '$lib/leaflet/leafletselectionboxcontrol';

	import {
		editingState,
		setEditingMode,
		setActiveFeature,
		featureTemplates
	} from '$lib/leaflet/spatialutilities.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { LayerInfo } from '$lib/leaflet/types';
	import type { GeoJSON } from 'leaflet';
	import {
		applyLayerStyle,
		captureLayerStyle,
		generateEditStyle
	} from '$lib/leaflet/symbol/leafletstylemanagement';

	interface Props {
		currentPropertyId: string;
		onCleanup: () => void;
	}

	const { getLeafletLayers, getLeafletMap } = getContext<{
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
		getLeafletMap: () => L.Map;
	}>('leafletContext');

	const layersStore = getLeafletLayers();
	const leafletMap = getLeafletMap();

	let { currentPropertyId, onCleanup }: Props = $props();
	let successMessage = $state('');
	let errorMessage = $state('');
	let updateStatus = $state('');
	let hasConflict = $state(false);
	let isTransitioning = $state(false);
	let isSubmitting = $state(false);

	let selectionBox = $state<SelectionBoxControl | null>(null);

	let feature = $derived(editingState.activeFeature);
	let template = $derived(feature ? featureTemplates[feature.template_id] : null);
	let attributes = $derived(feature?.properties || {});

	function setSuccessMessage(msg: string) {
		successMessage = msg;
		setTimeout(() => (successMessage = ''), 3000);
	}

	function setErrorMessage(msg: string) {
		errorMessage = msg;
		setTimeout(() => (errorMessage = ''), 3000);
	}

	function getAttributeValue(fieldId: string) {
		return attributes[fieldId] || '';
	}

	function handleFieldChange(fieldId: string, value: string | boolean) {
		if (feature) {
			feature.properties = {
				...feature.properties,
				[`attr_${fieldId}`]: value
			};
			setActiveFeature(feature);
			const layers = get(layersStore);
			const currentLayer = layers[feature.template_id];
			if (currentLayer?.layer) {
				(currentLayer.layer as GeoJSON).eachLayer((layer: any) => {
					if (layer.feature.properties.id === feature.id) {
						layer.feature.properties = feature.properties;
						updateStatus = 'Changes pending...';
						if (!layer.originalStyle) {
							layer.originalStyle = captureLayerStyle(layer);
						}
						const editStyle = generateEditStyle(layer.originalStyle);
						applyLayerStyle(layer, editStyle);
					}
				});
			}
		}
	}

	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;
		cleanup();
		return async ({ result }) => {
			if (hasConflict) {
				isSubmitting = false;
				return;
			}
			if (result.type === 'success') {
				const action = editingState.mode === 'create' ? 'created' : 'updated';
				setSuccessMessage(`Successfully ${action} feature`);
				toast.success(`Attribute ${action} successfully`);
				setEditingMode(null);
				setActiveFeature(null);
				await invalidateAll();
			} else if (result.type === 'error') {
				const action = editingState.mode === 'create' ? 'create' : 'update';
				setErrorMessage('Failed to save feature');
				toast.error(result.error?.message || `Failed to ${action} GeoJSON feature. Please try again.`);
			} else if (result.type === 'failure') {
				const action = editingState.mode === 'create' ? 'create' : 'update';
				setErrorMessage(result.data?.message || 'Failed to save feature');
				toast.error(result.data?.message || `Failed to ${action} GeoJSON feature. Please try again.`);
			}
			isSubmitting = false;
		};
	};
	function getFieldComponent(type: string) {
		switch (type) {
			case 'select':
				return 'select';
			case 'boolean':
				return 'input-checkbox';
			case 'date':
				return 'input-date';
			case 'number':
				return 'input-number';
			default:
				return 'input-text';
		}
	}
	function cleanup(e?: Event) {
		leafletMap.editTools.stopDrawing();
		leafletMap.editable = false;
		updateStatus = '';
		const layers = get(layersStore);
		const currentLayer = layers[feature?.template_id || ''];
		if (selectionBox) {
			selectionBox.disable();
			selectionBox = null;
		}
		if (currentLayer?.layer) {
			(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
				if (layer.feature.properties.id === feature?.id) {
					if (layer.editor) {
						layer.editor.disable();
					}
					if (layer.originalStyle && typeof layer.setStyle === 'function') {
						layer.setStyle(layer.originalStyle);
					}
				}
			});
		}
		setEditingMode(null);
		setActiveFeature(null);
		onCleanup();
		invalidateAll();
	}
	onDestroy(cleanup);
</script>

<div class="attribute-editor" class:transitioning={isTransitioning}>
	<div class="header">
		<h3>
			{editingState.mode === 'create' ? 'Create a ' : 'Edit a '}
			{editingState.activeTemplate?.name}
		</h3>
		<button
			class="close-button"
			onclick={(e) => {
				cleanup();
			}}>×</button
		>
	</div>

	<form method="POST" action="?/saveFeature" use:enhance={handleSubmit}>
		<input type="hidden" name="featureId" value={feature?.id || undefined} />
		<input type="hidden" name="propertyId" value={currentPropertyId} />
		<input type="hidden" name="templateId" value={template?.id || undefined} />
		<input type="hidden" name="geometry" value={JSON.stringify(feature?.geom || null)} />
		{#if template}
			{#each template.attributes as field}
				<div class="field">
					<label for={field.id}>
						{field.name}
						{#if field.required}*{/if}
					</label>
					{#if field.type === 'select'}
						<select
							id={field.id}
							name={`attr_${field.id}`}
							required={field.required}
							value={getAttributeValue(field.id)}
							onchange={(e) => handleFieldChange(field.id, e.currentTarget.value)}
						>
							<option value="">Select...</option>
							{#each field.validation?.split(',') || [] as option}
								<option value={option.trim()}>{option.trim()}</option>
							{/each}
						</select>
					{:else if field.type === 'boolean'}
						<input
							type="checkbox"
							id={field.id}
							name={`attr_${field.id}`}
							checked={getAttributeValue(field.id) === 'true'}
							onchange={(e) => handleFieldChange(field.id, e.currentTarget.checked)}
						/>
					{:else}
						<input
							type={getFieldComponent(field.type)}
							id={field.id}
							name={`attr_${field.id}`}
							required={field.required}
							pattern={field.validation || undefined}
							value={getAttributeValue(field.id)}
							oninput={(e) => handleFieldChange(field.id, e.currentTarget.value)}
						/>
					{/if}
				</div>
			{/each}
			{#if editingState.activeTemplate}
				<div class="geometry-notice">
					{#if editingState.mode === 'create'}
						{#if editingState.activeTemplate.geometry_type === 'point'}
							Using the left mouse button <br /> Click and hold on the point to move it.
						{:else if editingState.activeTemplate.geometry_type === 'line'}
							To change the line before you save it<br />you can left click and hold on a bend to
							move it.<br />Single left click on a bend to remove it.<br />
							Using the left mouse button <br /> Click and hold on a mid-point to add a new bend.
						{:else if editingState.activeTemplate.geometry_type === 'polygon'}
							To change the boundary before you save it<br />you can left click and hold on a bend
							to move it.<br />Single left click on a bend to remove it.<br />
							Using the left mouse button <br /> Click and hold on a mid-point to add a new bend.
						{/if}
					{:else if editingState.mode === 'edit'}
						{#if editingState.activeTemplate.geometry_type === 'point'}
							Using the left mouse button <br /> Click and hold on the point to move it to another location.
						{:else if editingState.activeTemplate.geometry_type === 'line'}
							To change the {editingState.activeTemplate.name} line you can left click and hold on a
							bend to move it.<br />Single left click on a bend to remove it.<br />
							Using the left mouse button <br /> Click and hold on a mid-point to add a new bend.
						{:else if editingState.activeTemplate.geometry_type === 'polygon'}
							To change the boundary you can left click and hold on a bend to move it.<br />Single
							left click on a bend to remove it.<br />
							Using the left mouse button <br /> Click and hold on a mid-point to add a new bend.
						{/if}
					{:else if editingState.mode === 'delete'}
						Hold down the left mouse button and drag a box around a {editingState.activeTemplate
							.name} to select it for deletion. Right click to clear selection
					{/if}
				</div>
			{/if}
		{/if}
		{#if editingState.activeTemplate && !feature}
			<div class="geometry-notice">
				{#if editingState.mode === 'create'}
					{#if editingState.activeTemplate.geometry_type === 'point'}
						Using the left mouse button <br /> Click on the map to create a new {editingState
							.activeTemplate.name} point
					{:else if editingState.activeTemplate.geometry_type === 'line'}
						Using the left mouse button <br /> Click on the map to start drawing a new<br
						/>{editingState.activeTemplate.name} line.<br />
						Using the left mouse button <br /> Click again for each bend.<br /> Double-click on the last
						bend to finish.
					{:else if editingState.activeTemplate.geometry_type === 'polygon'}
						Using the left mouse button <br /> Click on the map to draw a new {editingState
							.activeTemplate.name} area. Click again for each bend. Double-click to finish
					{/if}
				{:else if editingState.mode === 'edit'}
					Hold down the left mouse button and drag a box around a {editingState.activeTemplate.name}
					to select it for editing. Right click to clear selection.
				{:else if editingState.mode === 'delete'}
					Hold down the left mouse button and drag a box around a {editingState.activeTemplate.name}
					to select it for deletion. Right click to clear selection
				{/if}
			</div>
		{/if}
		{#if successMessage}
			<div class="message success">{successMessage}</div>
		{/if}
		{#if errorMessage}
			<div class="message error">{errorMessage}</div>
		{/if}
		{#if updateStatus}
			<div class="update-status">{updateStatus}</div>
		{/if}
		<div class="actions">
			<button
				type="button"
				class="cancel-button"
				onclick={(e) => {
					e.stopPropagation();
					cleanup();
				}}
			>
				Cancel
			</button>
			{#if editingState.mode === 'create' && feature?.geometryComplete && feature?.geom}
				<button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
					{#if isSubmitting}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Creating...
						</span>
					{:else}
						Create
					{/if}
				</button>
			{/if}
			{#if editingState.mode === 'edit' && feature}
				<button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
					{#if isSubmitting}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Updating...
						</span>
					{:else}
						Update
					{/if}
				</button>
			{/if}
		</div>
	</form>
</div>

<style>
	.attribute-editor {
		background: white;
		padding: 0.5rem;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.field {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}
	input,
	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.actions {
		margin-top: 1rem;
		text-align: right;
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.cancel-button {
		background: #666;
	}

	.cancel-button:hover {
		background: #555;
	}

	button {
		padding: 0.5rem 1rem;
		background: #4a90e2;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover:not(:disabled) {
		background: #357abd;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem 0.25rem;
		color: #666;
	}
	.close-button:hover {
		color: #000;
	}
	.message {
		padding: 0.5rem;
		margin: 1rem 0;
		border-radius: 4px;
	}
	.success {
		background-color: #e8f5e9;
		color: #2e7d32;
	}
	.error {
		background-color: #ffebee;
		color: #c62828;
	}
	.update-status {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: #fff8e1;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #ff6f00;
	}
	.transitioning {
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}
	.geometry-notice {
		text-align: center;
		color: #2c3e50;
		padding: 0.75rem;
		font-style: italic;
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		margin: 0.5rem 0;
		line-height: 1.4;
	}
	.flex {
		display: flex;
	}
	.items-center {
		align-items: center;
	}
	.gap-2 {
		gap: 0.5rem;
	}
</style>
