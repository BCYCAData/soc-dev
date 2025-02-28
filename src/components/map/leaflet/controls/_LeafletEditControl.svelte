<script lang="ts">
	import { onDestroy, getContext } from 'svelte';
	import type L from 'leaflet';
	import 'leaflet-editable';
	import { editingState, setEditingMode } from '$lib/leaflet/spatialutilities.svelte';
	import type { GeometryType } from '$lib/leaflet/spatial';

	interface Props {
		position?: L.ControlPosition;
	}

	let { position = 'topleft' }: Props = $props();

	const { getLeaflet, getLeafletMap } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
	}>('leafletContext');

	// Track active controls
	let activeControls: L.Control[] = [];

	function getControlsForGeometryType(geometryType: GeometryType) {
		const map = getLeafletMap();

		switch (geometryType) {
			case 'point':
				return [
					{
						name: 'NewMarkerControl',
						callback: map.editTools.startMarker,
						kind: 'marker',
						html: '🖈'
					}
				];
			case 'line':
				return [
					{
						name: 'NewLineControl',
						callback: map.editTools.startPolyline,
						kind: 'line',
						html: '\\/\\'
					}
				];
			case 'polygon':
				return [
					{
						name: 'NewPolygonControl',
						callback: map.editTools.startPolygon,
						kind: 'polygon',
						html: '▰'
					}
				];
			default:
				return [];
		}
	}

	function updateControls() {
		const map = getLeafletMap();
		const leaflet = getLeaflet();

		if (!map || !leaflet) return;

		// Remove existing controls
		activeControls.forEach((control) => control.remove());
		activeControls = [];

		// If no active template, don't add any controls
		if (!editingState.activeTemplate) return;

		const geometryType = editingState.activeTemplate.geometry_type;
		const controls = getControlsForGeometryType(geometryType as GeometryType);

		const EditControl = leaflet.Control.extend({
			options: {
				position: 'topleft',
				callback: null as (() => void) | null,
				kind: '',
				html: ''
			},

			onAdd: function (map: L.Map) {
				const container = leaflet.DomUtil.create('div', 'leaflet-control leaflet-bar');
				const link = leaflet.DomUtil.create('a', '', container);

				link.href = '#';
				link.title = 'Create a new ' + this.options.kind;
				link.innerHTML = this.options.html;

				leaflet.DomEvent.on(link, 'click', leaflet.DomEvent.stop).on(
					link,
					'click',
					() => {
						if (this.options.callback) {
							setEditingMode('create');
							this.options.callback.call(map.editTools);
						}
					},
					this
				);

				return container;
			}
		});

		// Add new controls based on geometry type
		controls.forEach((ctrl) => {
			const SpecificControl = EditControl.extend({
				options: {
					position: position,
					callback: ctrl.callback,
					kind: ctrl.kind,
					html: ctrl.html
				}
			});
			const control = new SpecificControl();
			map.addControl(control);
			activeControls.push(control);
		});
	}

	// Watch for changes in editing state
	$effect(() => {
		if (editingState.activeTemplate) {
			updateControls();
		}
	});

	onDestroy(() => {
		const map = getLeafletMap();
		if (map) {
			activeControls.forEach((control) => control.remove());
			(map as any).editTools = undefined;
			(map as any).editable = false;
		}
	});
</script>

<div class="leaflet-edit-control"></div>

<style>
	:global(.leaflet-control a) {
		background-color: white;
		padding: 5px 10px;
		cursor: pointer;
	}

	:global(.leaflet-control a:hover) {
		background-color: #f4f4f4;
	}
</style>
