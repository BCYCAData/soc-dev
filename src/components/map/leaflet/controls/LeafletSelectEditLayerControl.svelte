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
	import { SelectionBoxControl } from '$lib/leaflet/leafletselectionboxcontrol';

	import LeafletGeoJSONAttributeEditor from '$components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte';
	import LeafletGeoJSONDeleteEditor from '$components/map/leaflet/controls/LeafletGeoJSONDeleteEditor.svelte';

	import type L from 'leaflet';
	import type { LayerInfo } from '$lib/leaflet/types';
	import type { GeometryType } from '$lib/leaflet/spatial';
	import { invalidateAll } from '$app/navigation';

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
	//@ts-ignore
	let attributeEditorContainer: HTMLDivElement;
	let unsubscribe: () => void = () => {};
	let control: L.Control | null = null;
	let previousLayerSelection: string | null = null;
	let selectionBox = $state<SelectionBoxControl | null>(null);
	let isSelectionActive = $state(false);
	let currentDrawnLayer = $state<L.Layer | null>(null);

	const map = getLeafletMap();
	const leaflet = getLeaflet();
	const layersStore = getLeafletLayers();

	$effect(() => {
		if (isSelectionActive && selectionBox) {
			return () => {
				selectionBox?.disable();
				selectionBox = null;
			};
		}
	});

	$effect(() => {
		if (editToolsContainer) {
			const titleDisplay = editToolsContainer.querySelector('.tool-title-display');
			const buttons = editToolsContainer.querySelectorAll('.edit-tool-button');

			if (!editingState.mode) {
				if (titleDisplay) {
					titleDisplay.innerHTML = 'Select a tool';
				}
				buttons.forEach((btn) => btn.classList.remove('active'));
			}
		}
	});

	$effect(() => {
		if (!editingState.mode) {
			cleanup();
		}
	});

	function setupSelectionBox(currentLayer: LayerInfo | undefined, mode: 'edit' | 'delete') {
		selectionBox = new SelectionBoxControl(map, async (bounds) => {
			if (currentLayer?.layer) {
				let firstMatchFound = false;
				(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
					if (!layer.originalStyle) {
						layer.originalStyle = captureLayerStyle(layer);
					}
					const isInBounds = layer.getLatLng
						? bounds.contains(layer.getLatLng())
						: bounds.contains(layer.getBounds());

					if (!firstMatchFound && isInBounds) {
						layer.lastStyle = captureLayerStyle(layer);
						applyGeometryStyle(leaflet, layer, mode === 'edit' ? 'selected' : 'delete');

						if (mode === 'edit') {
							layer.enableEdit();
						}

						const featureId = layer.feature.properties.id || crypto.randomUUID();

						setActiveFeature({
							id: featureId,
							user_id: layer.feature.properties.user_id || currentPropertyId,
							property_id: currentPropertyId,
							template_id: currentLayer.template_id || '',
							geom: layer.toGeoJSON().geometry,
							properties: layer.feature.properties
						});

						selectionBox?.setSelectedFeature(layer);
						firstMatchFound = true;
					}
				});
			}
		});

		selectionBox.enable();
		isSelectionActive = true;
	}

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
				featureLayer.options.cursor = undefined;
			});
		}

		setActiveFeature(null);
	}

	function getEditControls(geometryType: GeometryType): EditControl[] {
		const map = getLeafletMap();
		let selectionBox: SelectionBoxControl | null = null;

		const baseControls = [
			{
				name: 'EditFeatures',
				callback: async () => {
					setEditingMode('edit');
					const layers = get(layersStore);
					const currentLayer = layers[selectElement.value];

					clearFeatureSelection(currentLayer);

					if (currentLayer?.template_id) {
						const template = featureTemplates[currentLayer.template_id];
						setActiveTemplate(template);
					}

					selectionBox = new SelectionBoxControl(map, async (bounds) => {
						if (currentLayer?.layer) {
							let firstMatchFound = false;

							(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
								if (!layer.originalStyle) {
									layer.originalStyle = captureLayerStyle(layer);
								}

								// Check if point or other geometry type
								const isInBounds = layer.getLatLng
									? bounds.contains(layer.getLatLng())
									: bounds.contains(layer.getBounds());

								if (!firstMatchFound && isInBounds) {
									layer.lastStyle = captureLayerStyle(layer);
									applyGeometryStyle(leaflet, layer, 'selected');
									layer.enableEdit();

									const featureId = layer.feature.properties.id || crypto.randomUUID();
									invalidateAll();
									setActiveFeature({
										id: featureId,
										user_id: layer.feature.properties.user_id || currentPropertyId,
										property_id: currentPropertyId,
										template_id: currentLayer.template_id || '',
										geom: layer.toGeoJSON().geometry,
										properties: layer.feature.properties
									});

									selectionBox?.setSelectedFeature(layer);
									firstMatchFound = true;
								}
							});
						}
					});

					setupSelectionBox(currentLayer, 'edit');

					map.on('contextmenu', () => clearFeatureSelection(currentLayer));

					return () => {
						if (selectionBox) {
							selectionBox.disable();
							selectionBox = null;
						}
						map.off('contextmenu', () => clearFeatureSelection(currentLayer));
						clearFeatureSelection(currentLayer);
					};
				},
				kind: 'edit',
				html: '<span style="font-size: 20px; font-weight: bold; position: relative; display: inline-block;">✎<span style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 1px; font-size: 12px; font-weight: normal;">Edit</span></span>',
				mode: 'edit' as const,
				title: `Select a ${selectElement.value} to Edit`
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

					selectionBox = new SelectionBoxControl(map, (bounds) => {
						if (currentLayer?.layer) {
							let firstMatchFound = false;

							(currentLayer.layer as L.GeoJSON).eachLayer((layer: any) => {
								if (!layer.originalStyle) {
									layer.originalStyle = captureLayerStyle(layer);
								}

								const isInBounds = layer.getLatLng
									? bounds.contains(layer.getLatLng())
									: bounds.contains(layer.getBounds());

								if (!firstMatchFound && isInBounds) {
									layer.lastStyle = captureLayerStyle(layer);
									applyGeometryStyle(leaflet, layer, 'delete');

									const featureId = layer.feature.properties.id;
									const templateId = currentLayer.template_id;

									if (featureId && templateId) {
										setActiveFeature({
											id: featureId,
											property_id: currentPropertyId,
											template_id: templateId,
											geom: layer.toGeoJSON().geometry,
											properties: layer.feature.properties
										});
									}

									selectionBox?.setSelectedFeature(layer);
									firstMatchFound = true;
								}
							});
						}
					});
					setupSelectionBox(currentLayer, 'delete');

					map.on('contextmenu', () => clearFeatureSelection(currentLayer));

					return () => {
						if (selectionBox) {
							selectionBox.disable();
							selectionBox = null;
						}
						map.off('contextmenu', () => clearFeatureSelection(currentLayer));
						clearFeatureSelection(currentLayer);
					};
				},
				kind: 'delete',
				html: '<span style="font-size: 20px; font-weight: bold; position: relative; display: inline-block;">🗑<span style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 1px; font-size: 12px; font-weight: normal;">Delete</span></span>',
				mode: 'delete' as const,
				title: `Select a ${selectElement.value} to Delete`
			}
		];

		const createControls = getControlsForGeometryType(geometryType).map((control) => ({
			...control,
			title: `Click on the map to Create a ${selectElement.value}`,
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
				const titleDisplay = leaflet.DomUtil.create(
					'div',
					'tool-title-display',
					editToolsContainer
				);
				titleDisplay.textContent = 'Select a tool';

				tools.forEach((tool) => {
					const button = leaflet.DomUtil.create(
						'button',
						`edit-tool-button ${tool.mode}`,
						toolContainer
					);

					if (tool.mode === 'create' && legendSymbol) {
						button.innerHTML = `<span style="font-size: 20px; font-weight: bold; position: relative; display: inline-block;">${legendSymbol}<span style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px; font-size: 12px; font-weight: normal;">Create</span></span>`;
						button.setAttribute('title', 'Create a new ' + selectedLayer);
					}
					if (tool.mode === 'edit') {
						button.innerHTML = tool.html;
						button.setAttribute(
							'title',
							'Select a ' + selectedLayer + ' to Edit\nRight click the mouse to clear the selection'
						);
					}
					if (tool.mode === 'delete') {
						button.innerHTML = tool.html;
						button.setAttribute(
							'title',
							'Select a ' +
								selectedLayer +
								' to Delete\nRight click the mouse to clear the selection'
						);
					}

					leaflet.DomEvent.on(button, 'click', leaflet.DomEvent.stop).on(button, 'click', () => {
						toolContainer
							.querySelectorAll('.edit-tool-button')
							.forEach((btn) => btn.classList.remove('active'));
						button.classList.add('active');
						tool.callback();
					});
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
				currentDrawnLayer = layer;
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
					geom: layer.toGeoJSON().geometry,
					geometryComplete: true
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

	function handleEditorCleanup() {
		if (currentDrawnLayer && map) {
			map.removeLayer(currentDrawnLayer);
			currentDrawnLayer = null;
		}
	}

	function cleanup(currentLayer?: LayerInfo) {
		isSelectionActive = false;
		if (selectionBox) {
			selectionBox.disable();
			selectionBox = null;
		}
		handleEditorCleanup();
		map?.off('contextmenu', () => clearFeatureSelection(currentLayer));
		clearFeatureSelection(currentLayer);

		if (editToolsContainer) {
			editToolsContainer
				.querySelectorAll('.edit-tool-button')
				.forEach((btn) => btn.classList.remove('active'));
		}
	}

	onDestroy(() => {
		if (map) {
			if (control) {
				map.removeControl(control);
			}
			map.off('editable:drawing:end');
			map.off('editable:editing');
		}
		cleanup();
		unsubscribe();
	});
</script>

{#if editingState.mode && editingState.activeTemplate}
	{#if editingState.mode === 'delete' && editingState.activeFeature}
		<div class="delete-editor-wrapper">
			<LeafletGeoJSONDeleteEditor {currentPropertyId} />
		</div>
	{:else if ['create', 'edit'].includes(editingState.mode)}
		<div class="attribute-editor-wrapper">
			<LeafletGeoJSONAttributeEditor {currentPropertyId} onCleanup={handleEditorCleanup} />
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
		z-index: 1001;
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
	:global(.tool-title-display) {
		text-align: center;
		padding: 5px;
		font-size: 12px;
		color: #666;
		min-height: 24px;
		margin-top: 14px;
		border-top: 1px solid #eee;
	}

	:global(.edit-tools-group) {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		padding: 5px;
		border-bottom: none;
	}

	:global(.edit-tool-button.active) {
		border: 2px solid #4a90e2;
		transform: scale(1.05);
	}
</style>
