import { generatePropertyMap } from '$lib/server/maps/property-map';
import { createCanvas } from 'canvas';
import type { RequestHandler } from '../$types';
import type { PropertyData } from '$lib/server/maps/property-map';

export const GET: RequestHandler = async ({ url }) => {
	const propertyId = url.searchParams.get('id');

	if (!propertyId) {
		const canvas = createCanvas(800, 600);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, 800, 600);

		ctx.fillStyle = 'black';
		ctx.font = '24px Arial';
		ctx.textAlign = 'center';
		ctx.fillText('No Map Available', 400, 300);

		return new Response(canvas.toBuffer('image/png'), {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	}

	// Create a PropertyData object with the required structure
	const propertyData: PropertyData = {
		boundary: {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [[]]
			},
			properties: {}
		},
		assets: []
	};

	const mapImage = await generatePropertyMap(propertyData);
	return new Response(mapImage, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
