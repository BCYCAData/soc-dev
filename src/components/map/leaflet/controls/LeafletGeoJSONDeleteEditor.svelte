<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onDestroy, getContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import {
		editingState,
		setEditingMode,
		setActiveFeature,
		featureTemplates
	} from '$lib/leaflet/spatialutilities.svelte';
	import { applyLayerStyle } from '$lib/leaflet/symbol/leafletstylemanagement';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { LayerInfo } from '$lib/leaflet/types';

	interface Props {
		currentPropertyId: string;
		featuresByTemplate: Record<string, GeoJSON.FeatureCollection>;
	}

	// const { getLeafletLayers, getLeafletMap } = getContext<{
	const { getLeafletLayers } = getContext<{
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
		// getLeafletMap: () => L.Map;
	}>('leafletContext');

	const layersStore = getLeafletLayers();
	// const leafletMap = getLeafletMap();

	let { currentPropertyId, featuresByTemplate }: Props = $props();
	let successMessage = $state('');
	let errorMessage = $state('');

	let feature = $derived(editingState.activeFeature);
	let template = $derived(feature ? featureTemplates[feature.template_id] : null);

	function setSuccessMessage(msg: string) {
		successMessage = msg;
		setTimeout(() => (successMessage = ''), 3000);
	}

	function setErrorMessage(msg: string) {
		errorMessage = msg;
		setTimeout(() => (errorMessage = ''), 3000);
	}

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				const layers = get(layersStore);
				const currentLayer = layers[feature?.template_id || ''];
				if (currentLayer?.layer) {
					// Clear the GeoJSON data
					(currentLayer.layer as L.GeoJSON).clearLayers();

					// Update featuresByTemplate with empty feature collection
					featuresByTemplate[feature?.template_id || ''] = {
						type: 'FeatureCollection',
						features: []
					};
				}
				setSuccessMessage('Feature successfully deleted');
				setEditingMode(null);
				setActiveFeature(null);
				await invalidateAll();
			} else {
				setErrorMessage('Failed to delete feature');
			}
		};
	};

	function cleanup() {
		const layers = get(layersStore);
		const currentLayer = layers[feature?.template_id || ''];
		if (currentLayer?.layer) {
			(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
				if (layer.feature.properties.id === feature?.id) {
					if (layer.editor) {
						layer.editor.disable();
					}
					if (layer.originalStyle) {
						applyLayerStyle(layer, layer.originalStyle);
					}
				}
			});
		}
		setEditingMode(null);
		setActiveFeature(null);
		invalidateAll();
	}

	onDestroy(cleanup);
</script>

<div class="delete-editor">
	<div class="header">
		<h3>Delete {editingState.activeTemplate?.name}</h3>
		<button class="close-button" onclick={cleanup}>×</button>
	</div>

	<form method="POST" action="?/deleteFeature" use:enhance={handleSubmit}>
		<input type="hidden" name="featureId" value={feature?.id} />
		<input type="hidden" name="propertyId" value={currentPropertyId} />
		<input type="hidden" name="templateId" value={template?.id} />

		{#if editingState.activeTemplate && !feature}
			<div class="geometry-notice">
				{#if editingState.mode === 'delete'}
					Hold down the left mouse button and drag a box around a {editingState.activeTemplate.name}
					to select it for deletion. Right click to clear selection
				{/if}
			</div>
		{:else}
			<p class="warning">Are you sure you want to delete this {template?.name}?</p>
		{/if}

		{#if successMessage}
			<div class="message success">{successMessage}</div>
		{/if}
		{#if errorMessage}
			<div class="message error">{errorMessage}</div>
		{/if}

		<div class="actions">
			<button type="button" class="cancel" onclick={cleanup}>Cancel</button>
			{#if feature}
				<button type="submit" class="delete">Delete</button>
			{/if}
		</div>
	</form>
</div>

<style>
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
	.delete-editor {
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
	.warning {
		color: #c62828;
		margin: 1rem 0;
		text-align: center;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	.cancel {
		background: #9e9e9e;
	}
	.delete {
		background: #c62828;
	}
	button {
		padding: 0.5rem 1rem;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		opacity: 0.9;
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
</style>
