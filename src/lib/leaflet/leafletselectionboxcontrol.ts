import type L from 'leaflet';
import { Point, LatLngBounds, rectangle } from 'leaflet';

interface SelectionBoxOptions {
	color?: string;
	weight?: number;
	dashArray?: string;
	fillOpacity?: number;
}
export class SelectionBoxControl {
	private map: L.Map;
	private startPoint: L.Point | null = null;
	private box: L.Rectangle | null = null;
	private onSelection: (bounds: L.LatLngBounds) => void;
	private selectedFeature: L.Layer | null = null;
	private tooltipWasEnabled: boolean = false;
	private isDrawing: boolean = false;

	private preventSelection = (e: Event) => {
		if (this.isDrawing) {
			e.preventDefault();
		}
	};

	constructor(
		map: L.Map,
		onSelection: (bounds: L.LatLngBounds) => void,
		options?: SelectionBoxOptions
	) {
		this.map = map;
		this.onSelection = onSelection;
	}

	enable() {
		this.map.dragging.disable();
		document.addEventListener('selectstart', this.preventSelection);
		document.addEventListener('dragstart', this.preventSelection);
		this.map.on('mousedown', this.onMouseDown, this);
		this.map.on('mousemove', this.onMouseMove, this);
		this.map.on('mouseup', this.onMouseUp, this);
		this.map.getContainer().style.cursor = 'crosshair';
	}

	disable() {
		this.map.dragging.enable();
		document.removeEventListener('selectstart', this.preventSelection);
		document.removeEventListener('dragstart', this.preventSelection);
		this.map.off('mousedown', this.onMouseDown, this);
		this.map.off('mousemove', this.onMouseMove, this);
		this.map.off('mouseup', this.onMouseUp, this);
		this.map.getContainer().style.cursor = '';
		if (this.box) {
			this.box.remove();
			this.box = null;
		}
		this.selectedFeature = null;
	}

	clearCurrentSelection() {
		if (this.selectedFeature) {
			const layer = this.selectedFeature as any;
			if (layer.editor) {
				layer.editor.disable();
			}
			if (layer.originalStyle && typeof layer.setStyle === 'function') {
				layer.setStyle(layer.originalStyle);
			}
			if (this.tooltipWasEnabled && layer.getTooltip()) {
				layer.openTooltip();
			}
			this.selectedFeature = null;
			this.tooltipWasEnabled = false;
		}
	}

	private onMouseDown(e: L.LeafletMouseEvent) {
		this.isDrawing = true;
		this.startPoint = this.map.latLngToContainerPoint(e.latlng);
		this.box = rectangle(
			[
				[0, 0],
				[0, 0]
			],
			{
				color: '#3388ff',
				weight: 1,
				dashArray: '5, 5',
				fillOpacity: 0.2
			}
		).addTo(this.map);
	}

	private onMouseMove(e: L.LeafletMouseEvent) {
		if (!this.startPoint || !this.box) return;

		const currentPoint = this.map.latLngToContainerPoint(e.latlng);
		const bounds = this.getBoxBounds(this.startPoint, currentPoint);
		this.box.setBounds(bounds);
	}

	private onMouseUp(e: L.LeafletMouseEvent) {
		if (!this.startPoint || !this.box) return;

		const endPoint = this.map.latLngToContainerPoint(e.latlng);
		const bounds = this.getBoxBounds(this.startPoint, endPoint);

		// Clear any existing selection before making a new one
		this.clearCurrentSelection();

		// Pass the bounds to the callback
		this.onSelection(bounds);

		if (this.box) {
			this.box.remove();
			this.box = null;
		}
		this.startPoint = null;
		this.isDrawing = false;
	}

	private getBoxBounds(start: L.Point, end: L.Point): L.LatLngBounds {
		const sw = this.map.containerPointToLatLng(
			new Point(Math.min(start.x, end.x), Math.max(start.y, end.y))
		);
		const ne = this.map.containerPointToLatLng(
			new Point(Math.max(start.x, end.x), Math.min(start.y, end.y))
		);
		return new LatLngBounds(sw, ne);
	}

	setSelectedFeature(feature: L.Layer) {
		this.selectedFeature = feature;
		const layer = feature as any;
		if (layer.getTooltip()) {
			this.tooltipWasEnabled = true;
			layer.closeTooltip();
		}
		this.disable();
	}
}
