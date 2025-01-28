import * as L from 'leaflet';
import { Canvas, createCanvas } from 'canvas';
import { JSDOM } from 'jsdom';

interface Asset {
	type: 'water_tank' | 'pump';
	lat: number;
	lng: number;
	label: string;
}

export interface PropertyData {
	boundary: GeoJSON.Feature;
	assets: Asset[];
}

// Setup canvas and DOM environment
function setupVirtualEnvironment(width: number, height: number) {
	const canvas = createCanvas(width, height);
	const dom = new JSDOM(
		`<!DOCTYPE html><div id="map" style="width: ${width}px; height: ${height}px;"></div>`
	);

	// Setup virtual browser environment
	(global as any).window = dom.window;
	(global as any).document = dom.window.document;
	(global as any).navigator = dom.window.navigator;
	(global as any).HTMLElement = dom.window.HTMLElement;

	return { canvas, dom };
}

// Convert map to image
async function mapToImage(map: L.Map, canvas: Canvas): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		map.whenReady(() => {
			setTimeout(() => {
				const dataUrl = canvas.toBuffer('image/png');
				resolve(dataUrl);
			}, 1000);
		});
	});
}

// Custom icons for different asset types
const assetIcons: Record<Asset['type'], L.Icon> = {
	water_tank: L.icon({
		iconUrl: 'path/to/water-icon.png',
		iconSize: [25, 25]
	}),
	pump: L.icon({
		iconUrl: 'path/to/pump-icon.png',
		iconSize: [25, 25]
	})
};

// Main map generation function
export async function generatePropertyMap(property: PropertyData): Promise<Buffer> {
	const width = 800;
	const height = 600;
	const { canvas, dom } = setupVirtualEnvironment(width, height);

	const mapElement = dom.window.document.getElementById('map');
	if (!mapElement) throw new Error('Map element not found');

	// Initialize map
	const map = L.map(mapElement, {
		center: calculatePropertyCenter(property.boundary),
		zoom: calculateOptimalZoom(property.boundary),
		preferCanvas: true
	});

	// Add OpenStreetMap tiles
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19
	}).addTo(map);

	// Add property boundary
	L.geoJSON(property.boundary, {
		style: {
			color: '#ff0000',
			weight: 2,
			fillColor: '#ff0000',
			fillOpacity: 0.2
		}
	}).addTo(map);

	// Add asset markers
	property.assets.forEach((asset: Asset) => {
		L.marker([asset.lat, asset.lng], {
			icon: assetIcons[asset.type] || new L.Icon.Default(),
			title: asset.label
		})
			.bindPopup(asset.label)
			.addTo(map);
	});

	// Generate and return image
	return await mapToImage(map, canvas);
}

// Helper function to calculate property center
function calculatePropertyCenter(boundary: GeoJSON.Feature): L.LatLng {
	const bounds = L.geoJSON(boundary).getBounds();
	return bounds.getCenter();
}

// Helper function to calculate optimal zoom
function calculateOptimalZoom(boundary: GeoJSON.Feature): number {
	const bounds = L.geoJSON(boundary).getBounds();
	const map = L.map(document.createElement('div'));
	return map.getBoundsZoom(bounds);
}
