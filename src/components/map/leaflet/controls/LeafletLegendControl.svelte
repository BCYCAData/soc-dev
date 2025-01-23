<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type L from 'leaflet';
	import { LeafletLegendControlClass } from '$lib/leaflet/leafletlegendcontrol';
	import type { Writable } from 'svelte/store';
	import type { LegendItem, LegendInfo, LayerInfo } from '$lib/leaflet/types';

	interface Props {
		position?: L.ControlPosition;
	}

	let { position = 'bottomleft' }: Props = $props();
	let leafletMap: L.Map;
	const { getLeafletMap, getLeaflet, getLeafletLayers } = getContext<{
		getLeafletMap: () => L.Map;
		getLeaflet: () => typeof L;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
	}>('leafletContext');

	const layersStore: Writable<Record<string, LayerInfo>> = getLeafletLayers();
	const leafletModule: typeof L = getLeaflet();

	let addedLayers = new Set<string>();
	let customControl: LeafletLegendControlClass;

	onMount(() => {
		let unsubscribe: (() => void) | undefined;
		leafletMap = getLeafletMap();
		customControl = new LeafletLegendControlClass(leafletMap, leafletModule, layersStore, {
			position
		});
		leafletMap.addControl(customControl);

		unsubscribe = layersStore.subscribe((layers: Record<string, LayerInfo>) => {
			Object.entries(layers).forEach(([name, layerInfo]) => {
				if (layerInfo.showInLegend && !addedLayers.has(name)) {
					updateLegend(name, layerInfo.legendInfo, layerInfo.visible);
					addedLayers.add(name);
				}
			});
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	function updateLegend(name: string, legendInfo: LegendInfo, visible: boolean) {
		legendInfo.items.forEach((item) => {
			if ('groupName' in item) {
				const groupElement = document.createElement('div');
				groupElement.className = 'legend-group';
				const groupTitle = document.createElement('h4');
				groupTitle.textContent = item.groupName;
				groupElement.appendChild(groupTitle);

				item.items.forEach((subItem) => {
					const itemElement = createLegendItemElement(subItem, visible);
					groupElement.appendChild(itemElement);
				});

				customControl.addLegendContent(name, groupElement);
			} else {
				const itemElement = createLegendItemElement(item, visible);
				customControl.addLegendContent(name, itemElement);
			}
		});
	}

	function createLegendItemElement(
		item: LegendItem,
		visible: boolean,
		verticalSpacing: number = 0
	): HTMLElement {
		const itemElement = document.createElement('div');
		itemElement.className = 'legend-item';
		itemElement.style.cssText = `
                opacity: ${visible ? '1' : '0.5'};
                display: flex;
                align-items: center;
                margin-bottom: ${verticalSpacing}px;
                padding: ${verticalSpacing / 2}px 0;
            `;

		const symbolContainer = document.createElement('div');
		symbolContainer.className = 'symbol-container';
		symbolContainer.style.cssText = `
            width: 30px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
        `;

		const symbolElement = document.createElement('span');
		symbolElement.className = 'legend-symbol';
		symbolElement.innerHTML = item.symbol;

		symbolContainer.appendChild(symbolElement);

		const descriptionElement = document.createElement('span');
		descriptionElement.className = 'legend-description';
		descriptionElement.textContent = item.description;
		descriptionElement.style.flex = '1';

		itemElement.appendChild(symbolContainer);
		itemElement.appendChild(descriptionElement);

		return itemElement;
	}

	onDestroy(() => {
		if (leafletMap && customControl) {
			leafletMap.removeControl(customControl);
		}
	});
</script>
