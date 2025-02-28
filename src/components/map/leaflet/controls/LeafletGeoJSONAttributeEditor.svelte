<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
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
	}

	const { getLeafletLayers } = getContext<{
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
	}>('leafletContext');

	const layersStore = getLeafletLayers();

	let { currentPropertyId }: Props = $props();
	let successMessage = $state('');
	let errorMessage = $state('');
	let updateStatus = $state('');
	let hasConflict = $state(false);
	let isTransitioning = $state(false);

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
		// Access the property directly by fieldId instead of prefixing with attr_
		return attributes[fieldId] || '';
	}

	function persistState() {
		if (browser && feature) {
			sessionStorage.setItem(
				'lastFeatureState',
				JSON.stringify({
					properties: feature.properties,
					mode: editingState.mode
				})
			);
		}
	}

	function restoreState() {
		if (browser) {
			const savedState = sessionStorage.getItem('lastFeatureState');
			if (savedState && feature) {
				const { properties, mode } = JSON.parse(savedState);
				feature.properties = properties;
				setEditingMode(mode);
			}
		}
	}

	function resolveStateConflict() {
		if (browser && feature && feature.properties) {
			const savedState = sessionStorage.getItem('lastFeatureState');
			const currentState = {
				properties: feature.properties,
				mode: editingState.mode
			};

			if (savedState) {
				const { properties: savedProperties } = JSON.parse(savedState);
				const differences = Object.keys(savedProperties).filter(
					(key) => savedProperties[key] !== currentState.properties[key]
				);

				if (differences.length > 0) {
					hasConflict = true;
					return { savedProperties, currentProperties: currentState.properties };
				}
			}
		}
		return null;
	}

	function handleFieldChange(fieldId: string, value: string | boolean) {
		if (feature) {
			feature.properties = {
				...feature.properties,
				[`attr_${fieldId}`]: value
			};
			setActiveFeature(feature);
			persistState();

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

	function handleConflictResolution(choice: 'previous' | 'current') {
		isTransitioning = true;
		const resolution = resolveStateConflict();

		if (resolution) {
			const properties =
				choice === 'previous' ? resolution.savedProperties : resolution.currentProperties;

			setTimeout(() => {
				if (feature) {
					feature.properties = properties;
					setActiveFeature(feature);
				}
				hasConflict = false;
				isTransitioning = false;
				persistState();
			}, 300);
		}
	}

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (hasConflict) {
				return;
			}
			if (result.type === 'success') {
				if (browser) {
					sessionStorage.removeItem('lastFeatureState');
				}
				updateStatus = '';
				const layers = get(layersStore);
				const currentLayer = layers[feature?.template_id || ''];
				if (currentLayer?.layer) {
					(currentLayer.layer as GeoJSON).eachLayer((layer: any) => {
						if (layer.feature.properties.id === feature?.id) {
							layer.setStyle(layer.originalStyle);
						}
					});
				}

				setSuccessMessage(
					`Successfully ${editingState.mode === 'create' ? 'created' : 'updated'} feature`
				);
				setEditingMode(null);
				setActiveFeature(null);
				await invalidateAll();
			} else {
				setErrorMessage(
					result.type === 'failure'
						? result.data?.message || 'Failed to save feature'
						: 'Failed to save feature'
				);
			}
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
	function cleanup() {
		persistState();
		updateStatus = '';
		const layers = get(layersStore);
		const currentLayer = layers[feature?.template_id || ''];

		// Disable selection box if active
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
		if (!template) {
			setEditingMode(null);
		}
		setActiveFeature(null);
	}

	onMount(() => {
		restoreState();
		return () => {
			if (browser) {
				sessionStorage.removeItem('lastFeatureState');
			}
		};
	});

	onDestroy(cleanup);
</script>

<div class="attribute-editor" class:transitioning={isTransitioning}>
	<div class="header">
		<h3>
			{editingState.mode === 'create' ? 'Create' : 'Edit'}
			{template?.name}
		</h3>
		<button class="close-button" onclick={cleanup}>×</button>
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
		{/if}

		{#if hasConflict}
			<div class="conflict-dialog" class:transitioning={isTransitioning}>
				<h4>Unsaved Changes Found</h4>
				<div class="conflict-preview">
					<div class="previous">
						<h5>Previous Version</h5>
						<pre>{JSON.stringify(resolveStateConflict()?.savedProperties, null, 2)}</pre>
					</div>
					<div class="current">
						<h5>Current Version</h5>
						<pre>{JSON.stringify(resolveStateConflict()?.currentProperties, null, 2)}</pre>
					</div>
				</div>
				<div class="conflict-actions">
					<button type="button" onclick={() => handleConflictResolution('previous')}>
						Restore Previous
					</button>
					<button type="button" onclick={() => handleConflictResolution('current')}>
						Keep Current
					</button>
				</div>
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
			<button type="button" class="cancel-button" onclick={cleanup}> Cancel </button>
			<button type="submit">
				{editingState.mode === 'create' ? 'Create' : 'Update'}
			</button>
		</div>
	</form>
</div>

<style>
	.attribute-editor {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
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
	button:hover {
		background: #357abd;
	}
	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
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
	.conflict-dialog {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	.conflict-preview {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1rem 0;
	}
	.conflict-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}
</style>
