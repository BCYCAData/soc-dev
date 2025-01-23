<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import { page } from '$app/state';
	import {
		featureTemplates,
		setActiveTemplate,
		editingState,
		setEditingMode,
		setActiveFeature
	} from '$lib/leaflet/spatialutilities.svelte';

	import {
		type EditControl,
		applyGeometryStyle,
		getLegendSymbol,
		getControlsForGeometryType
	} from '$lib/leaflet/leafleteditutilities';

	import { pointTemplateStyles } from '$lib/leaflet/symbol/leaflet-template-symbol';

	import { captureLayerStyle, applyLayerStyle } from '$lib/leaflet/symbol/leafletstylemanagement';

	import LeafletGeoJSONAttributeEditor from '$components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte';
	import LeafletGeoJSONDeleteEditor from './LeafletGeoJSONDeleteEditor.svelte';

	import type L from 'leaflet';
	import type { LayerInfo } from '$lib/leaflet/types';
	import type { GeometryType } from '$lib/leaflet/spatial';

	const currentPropertyId = page.params.propertyid;

	interface Props {
		position?: L.ControlPosition;
		onSelectLayer: (layer: string) => void;
	}

	let { position = 'topleft', onSelectLayer }: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
	}>('leafletContext');

	let selectElement: HTMLSelectElement;
	let editToolsContainer: HTMLDivElement;
	let attributeEditorContainer: HTMLDivElement;
	let unsubscribe: () => void = () => {};
	let control: L.Control | null = null;
	let previousLayerSelection: string | null = null;

	const map = getLeafletMap();
	const leaflet = getLeaflet();
	const layersStore = getLeafletLayers();

	function setFeatureStyle(layer: any, styleType: 'original' | 'hover' | 'selected') {
		switch (styleType) {
			case 'original':
				if (layer.originalStyle) {
					applyLayerStyle(layer, layer.originalStyle);
				}
				break;
			case 'hover':
			case 'selected':
				layer.lastStyle = captureLayerStyle(layer);
				applyGeometryStyle(leaflet, layer, styleType);
				break;
		}
	}

	function clearFeatureSelection(layer?: LayerInfo) {
		if (layer?.layer) {
			(layer.layer as L.GeoJSON).eachLayer((featureLayer: any) => {
				if (featureLayer.editor) {
					featureLayer.editor.disable();
				}
				setFeatureStyle(featureLayer, 'original');
				delete featureLayer.lastStyle;
			});
		}
		setActiveFeature(null);
		setEditingMode(null);
	}

	function getEditControls(geometryType: GeometryType): EditControl[] {
		const map = getLeafletMap();

		const baseControls = [
			{
				name: 'EditFeatures',
				callback: () => {
					setEditingMode('edit');
					const layers = get(layersStore);
					const currentLayer = layers[selectElement.value];

					// Clear any existing selection
					clearFeatureSelection(currentLayer);

					if (currentLayer?.layer) {
						map.on('contextmenu', () => clearFeatureSelection(currentLayer));
						(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
							if (!layer.originalStyle) {
								const baseStyle = captureLayerStyle(layer);
								const templateStyle = currentLayer.template_id
									? pointTemplateStyles[featureTemplates[currentLayer.template_id].name]
									: null;

								layer.originalStyle = templateStyle
									? { ...baseStyle, ...templateStyle }
									: baseStyle;
							}
							layer.on('mouseover', () => {
								if (
									!editingState.activeFeature ||
									layer.feature.properties.id !== editingState.activeFeature.id
								) {
									layer.lastStyle = captureLayerStyle(layer);
									applyGeometryStyle(leaflet, layer, 'hover');
								}
							});

							layer.on('mouseout', () => {
								if (
									!editingState.activeFeature ||
									layer.feature.properties.id !== editingState.activeFeature.id
								) {
									if (layer.lastStyle) {
										applyLayerStyle(layer, layer.lastStyle);
									}
								}
							});

							layer.on('click', () => {
								console.log('Before setActiveFeature:', {
									mode: editingState.mode,
									template: editingState.activeTemplate
								});
								// Clear previous selection first
								clearFeatureSelection(currentLayer);

								const featureId = layer.feature.properties.id || crypto.randomUUID();
								setEditingMode('edit');
								setActiveFeature({
									id: featureId,
									user_id: layer.feature.properties.user_id || currentPropertyId,
									property_id: currentPropertyId,
									template_id: currentLayer.template_id || '',
									geom: layer.toGeoJSON().geometry,
									properties: layer.feature.properties // Add this line
								});

								layer.lastStyle = captureLayerStyle(layer);
								layer.enableEdit();
								applyGeometryStyle(leaflet, layer, 'selected');
								console.log('After setActiveFeature:', {
									mode: editingState.mode,
									template: editingState.activeTemplate,
									feature: editingState.activeFeature
								});
							});

							layer.on('editable:editing', () => {
								if (
									editingState.activeFeature &&
									layer.feature.properties.id === editingState.activeFeature.id
								) {
									setActiveFeature({
										...editingState.activeFeature,
										geom: layer.toGeoJSON().geometry
									});
								}
							});
						});
					}

					return () => {
						map.off('contextmenu', () => clearFeatureSelection(currentLayer));
						clearFeatureSelection(currentLayer);
					};
				},
				kind: 'edit',
				html: '<span style="font-size: 20px; font-weight: bold;">✎</span>',
				mode: 'edit' as const,
				title: `Edit ${selectElement.value}`
			},
			{
				name: 'DeleteFeatures',
				callback: () => {
					setEditingMode('delete');
					const layers = get(layersStore);
					const currentLayer = layers[selectElement.value];

					if (currentLayer?.template_id) {
						const template = featureTemplates[currentLayer.template_id];
						setActiveTemplate(template);
					}
					map.on('contextmenu', () => clearFeatureSelection(currentLayer));
					if (currentLayer?.layer) {
						(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
							if (!layer.originalStyle) {
								layer.originalStyle = captureLayerStyle(layer);
							}

							layer.on('mouseover', () => {
								if (
									!editingState.activeFeature ||
									layer.feature.properties.id !== editingState.activeFeature.id
								) {
									layer.lastStyle = captureLayerStyle(layer);
									applyGeometryStyle(leaflet, layer, 'delete');
								}
							});

							layer.on('mouseout', () => {
								if (
									!editingState.activeFeature ||
									layer.feature.properties.id !== editingState.activeFeature.id
								) {
									if (layer.lastStyle) {
										applyLayerStyle(layer, layer.lastStyle);
									}
								}
							});
							layer.on('click', () => {
								console.log('Before click handler:', editingState.activeFeature);
								const featureId = layer.feature.properties.id;
								const templateId = currentLayer.template_id;

								if (!featureId || !templateId) {
									console.error('Feature missing required properties');
									return;
								}

								clearFeatureSelection(currentLayer);
								setEditingMode('delete');

								setActiveFeature({
									id: featureId,
									property_id: currentPropertyId,
									template_id: templateId,
									geom: layer.toGeoJSON().geometry,
									properties: layer.feature.properties
								});

								console.log('After setActiveFeature:', editingState.activeFeature);

								layer.lastStyle = captureLayerStyle(layer);
								applyGeometryStyle(leaflet, layer, 'delete');
							});
						});
					}
					return () => {
						map.off('contextmenu', () => clearFeatureSelection(currentLayer));
						if (currentLayer?.layer) {
							(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
								layer.off('mouseover');
								layer.off('mouseout');
								layer.off('click');
								if (layer.lastStyle) {
									applyLayerStyle(layer, layer.lastStyle);
								}
							});
						}
						clearFeatureSelection(currentLayer);
					};
				},
				kind: 'delete',
				html: '<span style="font-size: 20px; font-weight: bold;">🗑</span>',
				mode: 'delete' as const,
				title: `Delete ${selectElement.value}`
			}
		];

		const createControls = getControlsForGeometryType(geometryType).map((control) => ({
			...control,
			title: `Create ${selectElement.value}`,
			callback: () => {
				setEditingMode('create');
				switch (geometryType) {
					case 'point':
						map.editTools.startMarker();
						break;
					case 'line':
						map.editTools.startPolyline();
						break;
					case 'polygon':
						map.editTools.startPolygon();
						break;
				}
			}
		}));

		return [...createControls, ...baseControls];
	}

	function updateEditTools(selectedLayer: string) {
		if (!editToolsContainer) return;
		editToolsContainer.innerHTML = '';
		const layers = get(layersStore);
		const layer = layers[selectedLayer];
		if (layer?.template_id) {
			const template = featureTemplates[layer.template_id];
			if (template) {
				const tools = getEditControls(template.geometry_type as GeometryType);
				const legendSymbol = getLegendSymbol(layer);

				const toolContainer = leaflet.DomUtil.create('div', 'edit-tools-group', editToolsContainer);

				tools.forEach((tool) => {
					const button = leaflet.DomUtil.create(
						'button',
						`edit-tool-button ${tool.mode}`,
						toolContainer
					);
					if (tool.mode === 'create' && legendSymbol) {
						button.innerHTML = legendSymbol;
					} else {
						button.innerHTML = tool.html;
					}
					button.title = tool.title || `${tool.mode.charAt(0).toUpperCase() + tool.mode.slice(1)}`;

					leaflet.DomEvent.on(button, 'click', leaflet.DomEvent.stop).on(
						button,
						'click',
						tool.callback
					);
				});
			}
		}
	}

	const LayerSelectControl = leaflet.Control.extend({
		onAdd(map: L.Map) {
			const container = leaflet.DomUtil.create('div', 'layer-selector-container');

			const label = leaflet.DomUtil.create('label', 'layer-select-label', container);
			label.htmlFor = 'layer-select';
			label.textContent = 'Select a Layer to Edit:';

			selectElement = leaflet.DomUtil.create(
				'select',
				'layer-select',
				container
			) as HTMLSelectElement;
			selectElement.id = 'layer-select';

			const defaultOption = leaflet.DomUtil.create('option', '', selectElement);
			defaultOption.value = '';
			defaultOption.textContent = 'Choose a layer...';
			defaultOption.disabled = true;
			defaultOption.selected = true;

			editToolsContainer = leaflet.DomUtil.create('div', 'edit-tools', container);
			attributeEditorContainer = leaflet.DomUtil.create(
				'div',
				'attribute-editor-container',
				container
			);

			unsubscribe = layersStore.subscribe((layers) => {
				while (selectElement.childNodes.length > 1) {
					if (selectElement.lastChild) {
						selectElement.removeChild(selectElement.lastChild);
					}
				}

				Object.entries(layers).forEach(([name, info]) => {
					if (info && info.editable) {
						const option = leaflet.DomUtil.create('option', '', selectElement);
						option.value = name;
						option.textContent = name;
					}
				});
			});

			leaflet.DomEvent.on(selectElement, 'change', (e) => {
				const newLayerSelection = (e.target as HTMLSelectElement).value;
				const layers = get(layersStore);

				if (previousLayerSelection) {
					const previousLayer = layers[previousLayerSelection];
					clearFeatureSelection(previousLayer);
				}

				const layer = layers[newLayerSelection];

				if (layer?.template_id) {
					const template = featureTemplates[layer.template_id];
					setActiveTemplate(template);
					updateEditTools(newLayerSelection);
					if (layer.layer) {
						(layer.layer as L.GeoJSON).eachLayer((featureLayer: any) => {
							if (!featureLayer.originalStyle) {
								featureLayer.originalStyle = captureLayerStyle(featureLayer);
							}
						});
					}
				} else {
					setActiveTemplate(null);
					editToolsContainer.innerHTML = '';
				}

				previousLayerSelection = newLayerSelection;

				if (onSelectLayer) {
					onSelectLayer(newLayerSelection);
				}
			});

			return container;
		}
	});

	onMount(() => {
		if (map && leaflet) {
			control = new LayerSelectControl({ position });
			map.addControl(control);
			map.on('editable:drawing:end', (e: any) => {
				const layer = e.layer;
				const layers = get(layersStore);
				const currentLayer = layers[selectElement.value];

				if (currentLayer?.template_id) {
					const template = featureTemplates[currentLayer.template_id];
					const templateStyle = pointTemplateStyles[template.name];
					if (templateStyle) {
						layer.originalStyle = templateStyle;
						applyLayerStyle(layer, templateStyle);
					}
				}

				setActiveFeature({
					id: crypto.randomUUID(),
					user_id: '',
					property_id: currentPropertyId,
					template_id: editingState.activeTemplate?.id || '',
					geom: layer.toGeoJSON().geometry
				});
			});

			map.on('editable:editing', (e: any) => {
				const layer = e.layer;
				if (editingState.activeFeature) {
					setActiveFeature({
						...editingState.activeFeature,
						geom: layer.toGeoJSON().geometry
					});
				}
			});
		}
	});

	onDestroy(() => {
		if (map) {
			if (control) {
				map.removeControl(control);
			}
			map.off('editable:drawing:end');
			map.off('editable:editing');
		}
		unsubscribe();
	});
</script>

{#if editingState.mode && editingState.activeTemplate}
	{console.log('Form Display Debug:', {
		mode: editingState.mode,
		activeTemplate: editingState.activeTemplate,
		activeFeature: editingState.activeFeature
	})}
	{#if editingState.mode === 'delete' && editingState.activeFeature}
		<div class="delete-editor-wrapper">
			<LeafletGeoJSONDeleteEditor {currentPropertyId} />
		</div>
	{:else if ['create', 'edit'].includes(editingState.mode)}
		<div class="attribute-editor-wrapper">
			<LeafletGeoJSONAttributeEditor {currentPropertyId} />
		</div>
	{/if}
{/if}

<style>
	:global(.delete-marker) {
		filter: hue-rotate(140deg) saturate(200%);
	}

	:global(.leaflet-marker-icon.delete) {
		border: 2px solid #ff0000;
		border-radius: 50%;
	}

	:global(.leaflet-interactive.delete) {
		stroke: #ff0000;
		stroke-width: 3px;
		fill-opacity: 0.3;
	}

	.delete-editor-wrapper {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1000;
		max-width: 300px;
		width: 100%;
	}

	.attribute-editor-wrapper {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1000;
		max-width: 300px;
		width: 100%;
	}

	:global(.layer-selector-container) {
		background-color: white;
		padding: 5px;
		border-radius: 4px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
	}

	:global(.layer-select-label) {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
		font-size: 14px;
	}

	:global(.layer-select) {
		width: 100%;
		padding: 5px;
		font-size: 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f8f8f8;
		margin-bottom: 10px;
	}

	:global(.layer-select:focus) {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}

	:global(.edit-tools-group) {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		padding: 5px;
	}

	:global(.edit-tool-button) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 4px;
		cursor: pointer;
	}

	:global(.edit-tool-button.create) {
		background-color: #e8f5e9;
	}

	:global(.edit-tool-button.edit) {
		background-color: #e3f2fd;
	}

	:global(.edit-tool-button.delete) {
		background-color: #ffebee;
	}

	:global(.edit-tool-button:hover) {
		opacity: 0.8;
		transform: scale(1.05);
	}

	:global(.edit-tool-button svg) {
		width: 20px;
		height: 20px;
		vertical-align: middle;
	}
</style>
