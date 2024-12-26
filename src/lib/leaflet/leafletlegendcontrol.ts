import L from 'leaflet';
import { writable, get } from 'svelte/store';

import type { LayerInfo } from './types';

export class LeafletLegendControlClass extends L.Control {
	private container: HTMLElement;
	private legendContent: { [key: string]: HTMLElement } = {};
	private legendContentWrapper: HTMLElement;
	private map: L.Map;
	private isExpanded: boolean = false;
	private icon: HTMLElement;
	private layersStore: ReturnType<typeof writable<Record<string, LayerInfo>>>;

	constructor(
		map: L.Map,
		layersStore: ReturnType<typeof writable<Record<string, LayerInfo>>>,
		options?: L.ControlOptions
	) {
		super(options);
		this.map = map;
		this.layersStore = layersStore;

		// Initialize container
		this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-legend');
		this.container.style.cssText = `
            background-color: white;
            padding: 0;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.45);
        `;

		// Create icon
		this.icon = L.DomUtil.create('div', 'legend-icon', this.container);
		this.icon.innerHTML = `
            <svg class="legend-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect class="dot-1" x="2" y="6" width="3" height="3"></rect>
                <line x1="11" y1="7.5" x2="22" y2="7.5"></line>
                <rect class="dot-2" x="2" y="12" width="3" height="3"></rect>
                <line x1="11" y1="13.5" x2="22" y2="13.5"></line>
                <rect class="dot-3" x="2" y="18" width="3" height="3"></rect>
                <line x1="11" y1="19.5" x2="22" y2="19.5"></line>
            </svg>
        `;
		this.icon.style.cssText = `
            padding: 5px;
            cursor: pointer;
            display: flex;
        `;

		// Initialize content wrapper
		this.legendContentWrapper = L.DomUtil.create('div', 'legend-content-wrapper', this.container);
		this.legendContentWrapper.style.cssText = `
            display: none;
            max-height: 80vh;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: white;
        `;

		this.layersStore.subscribe((layers) => {
			this.updateLegendVisibility(layers);
		});
	}

	onAdd(map: L.Map): HTMLElement {
		L.DomEvent.disableClickPropagation(this.container);
		L.DomEvent.disableScrollPropagation(this.container);

		const title = L.DomUtil.create('h3', 'leaflet-legend-title', this.legendContentWrapper);
		title.textContent = 'Legend';
		title.style.margin = '0 0 10px 0';

		L.DomEvent.on(this.container, 'mouseenter', this._expand, this);
		L.DomEvent.on(this.container, 'mouseleave', this._collapse, this);

		this.map = map;
		return this.container;
	}

	private _expand() {
		if (!this.isExpanded) {
			L.DomUtil.addClass(this.container, 'leaflet-control-legend-expanded');
			this.legendContentWrapper.style.display = 'block';
			this.icon.style.display = 'none';

			const mapHeight = this.map.getSize().y;
			const maxHeight = Math.min(mapHeight * 0.8, 500); // 80% of map height or 500px, whichever is smaller
			const topOffset = this.container.offsetTop;
			const availableHeight = mapHeight - topOffset - 20;

			this.legendContentWrapper.style.maxHeight = `${Math.min(maxHeight, availableHeight)}px`;
			this.container.style.maxHeight = `${Math.min(maxHeight + 40, availableHeight + 20)}px`;

			this.isExpanded = true;
		}
	}

	private _collapse() {
		if (this.isExpanded) {
			L.DomUtil.removeClass(this.container, 'leaflet-control-legend-expanded');
			this.legendContentWrapper.style.display = 'none';
			this.icon.style.display = 'flex';
			this.isExpanded = false;
		}
	}

	addLegendContent(layerName: string, content: HTMLElement): void {
		// Create or get existing layer group
		let wrapper = this.legendContent[layerName];
		if (!wrapper) {
			wrapper = L.DomUtil.create('div', 'leaflet-legend-layer', this.legendContentWrapper);
			wrapper.style.cssText = `
            margin-bottom: 5px;
            background-color: #f8f8f8;
            border-radius: 4px;
        `;

			// Add layer heading
			const layerTitle = L.DomUtil.create('div', 'leaflet-legend-layer-title', wrapper);
			layerTitle.textContent = layerName;
			layerTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 2px;
            padding-bottom: 0px;
            border-bottom: 2px solid #ddd;
        `;

			this.legendContent[layerName] = wrapper;
		}

		// Add content under the layer heading
		const itemContainer = L.DomUtil.create('div', 'legend-item-container');
		itemContainer.appendChild(content);
		wrapper.appendChild(itemContainer);

		const layers = get(this.layersStore);
		this.updateLegendVisibility(layers);
	}

	removeLegendContent(layerName: string): void {
		if (this.legendContent[layerName]) {
			this.legendContentWrapper.removeChild(this.legendContent[layerName]);
			delete this.legendContent[layerName];
		}
	}

	updateLegendVisibility(layers: Record<string, LayerInfo>): void {
		Object.entries(layers).forEach(([layerName, layerInfo]) => {
			if (this.legendContent[layerName]) {
				this.legendContent[layerName].style.display = layerInfo.visible ? 'block' : 'none';
			}
		});
	}
}
