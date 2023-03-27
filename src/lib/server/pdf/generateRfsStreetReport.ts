import PdfPrinter from 'pdfmake';
import blobStream, { type IBlobStream } from 'blob-stream';

import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

const fonts: TFontDictionary = {
	Poppins: {
		normal: 'src/lib/server/pdf/fonts/Poppins-Regular.ttf',
		bold: 'src/lib/server/pdf/fonts/Poppins-Medium.ttf',
		italics: 'src/lib/server/pdf/fonts/Poppins-Italic.ttf',
		bolditalics: 'src/lib/server/pdf/fonts/Poppins-MediumItalic.ttf'
	}
};
const printer = new PdfPrinter(fonts);

async function generateRfsStreetReport(streetname: string, propertyData: any): Promise<Blob> {
	const logoImageDataURL =
		'data:image/png;base64,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';

	let content: TDocumentDefinitions['content'] = [];
	debugger;
	content.push(
		{
			image: logoImageDataURL,
			margin: [0, 10, 0, 0],
			alignment: 'center'
		},
		{ text: 'RFS Emergency Report', style: 'title_h2' },
		{ text: 'for', style: 'title_h2' },
		{ text: streetname, style: 'title_h1', pageBreak: 'after' }
	);
	for (let item of propertyData) {
		let body: any = [];
		body.push(
			[
				{ text: 'Property', style: 'tableHeader', colSpan: 2, alignment: 'center' },
				{},
				{ text: `${item.address}`, style: 'tableHeader', colSpan: 3, alignment: 'center' },
				{},
				{}
			],
			[
				{ text: '', style: 'tableHeader', colSpan: 2, alignment: 'center' },
				{},
				{ text: `Landline  ${item.phone}`, style: 'tableHeader', colSpan: 3, alignment: 'center' },
				{},
				{}
			]
		);
		if (item.agentinformation) {
			body.push(
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Property is rented:', colSpan: 2 },
					{},
					{ text: 'Agent' },
					{ text: item.agentinformation.agentname, alignment: 'left' }
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: '', colSpan: 2 },
					{},
					{ text: 'Mobile' },
					{ text: item.agentinformation.agentmobile, alignment: 'left' }
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: '', colSpan: 2 },
					{},
					{ text: 'Phone' },
					{ text: item.agentinformation.agentphone, alignment: 'left' }
				]
			);
		}
		body.push(
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Identification:', colSpan: 2 },
				{},
				{ text: item.property.identification, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Truck Access:', colSpan: 2 },
				{},
				{ text: item.property.truck_access, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Vulnerable Residents:', colSpan: 2 },
				{},
				{ text: item.property.vulnerable, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: "Resident's Age Profile:", colSpan: 2 },
				{},
				{
					table: {
						body: [
							['Ages 0-18', 'Ages 19-50', 'Ages 51-70', 'Ages 71+'],
							[
								{ text: item.property.age_profile.age0_18, alignment: 'center' },
								{ text: item.property.age_profile.age19_50, alignment: 'center' },
								{ text: item.property.age_profile.age51_70, alignment: 'center' },
								{ text: item.property.age_profile.age71_, alignment: 'center' }
							]
						]
					},
					layout: 'noBorders',
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Other Critical Assets:', colSpan: 2 },
				{},
				{ text: item.property.critical_assets, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Hazards', style: 'tableHeader2', colSpan: 2 },
				{},
				{ text: '', colSpan: 2, style: 'tableHeader3' },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Solar Batteries:', colSpan: 2 },
				{},
				{
					text: item.onsite_hazards.on_site_hazards.Chemical_stores,
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Fuel Stores:', colSpan: 2 },
				{},
				{ text: item.onsite_hazards.on_site_hazards.Fuel_stores, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Chemical Stores:', colSpan: 2 },
				{},
				{
					text: item.onsite_hazards.on_site_hazards.Chemical_stores,
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Bottled Gas:', colSpan: 2 },
				{},
				{ text: item.onsite_hazards.on_site_hazards.Bottled_gas, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Other Site Hazards:', colSpan: 2 },
				{},
				{ text: item.onsite_hazards.other_site_hazards, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Fire Fighting Assets', style: 'tableHeader2', colSpan: 2 },
				{},
				{ text: '', colSpan: 2, style: 'tableHeader3' },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Static Water:', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.static_water, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Stortz Fitting:', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.stortz_fitting, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Equipment:', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.equipment, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Firebreaks:', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.firebreaks, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Slashed APZ(s):', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.slashed_apz_s, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Backup Pump:', colSpan: 2 },
				{},
				{ text: item.fire_fighting_assets.backup_pump, alignment: 'left', colSpan: 2 },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Driveway 3.5m height clearance:', colSpan: 2 },
				{},
				{
					text: item.fire_fighting_assets.driveway_overhead_clearance,
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Truck access around the property:', colSpan: 2 },
				{},
				{
					text: item.fire_fighting_assets.truck_access_around_property,
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Site Animals', style: 'tableHeader2', colSpan: 2 },
				{},
				{ text: '', colSpan: 2, style: 'tableHeader3' },
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Pets:', colSpan: 2 },
				{},
				{
					table: {
						body: [
							['Dogs', 'Cats', 'Birds', 'Other Pets'],
							[
								{ text: item.site_animals.pets.dogs, alignment: 'center' },
								{ text: item.site_animals.pets.cats, alignment: 'center' },
								{ text: item.site_animals.pets.birds, alignment: 'center' },
								{ text: item.site_animals.pets.other_pets, alignment: 'center' }
							]
						]
					},
					layout: 'noBorders',
					alignment: 'left',
					colSpan: 2
				},
				{}
			],
			[
				{ text: '', style: 'tableHeader2' },
				{ text: 'Livestock:', colSpan: 2 },
				{},
				{
					text: item.site_animals.livestock,
					alignment: 'left',
					colSpan: 2
				},
				{}
			]
		);
		if (item.site_animals.safe_area) {
			body.push(
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Safe Area:', colSpan: 2 },
					{},
					{
						text: item.site_animals.safe_area.status,
						alignment: 'left',
						colSpan: 2
					},
					{}
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Availability:', colSpan: 2, alignment: 'center' },
					{},
					{
						text: item.site_animals.safe_area.availability,
						alignment: 'left',
						colSpan: 2,
						border: [false, false, true, false]
					},
					{}
				]
			);
		} else {
			body.push([
				{ text: '', style: 'tableHeader2' },
				{ text: 'Livestock safe area:', colSpan: 2 },
				{},
				{
					text: 'None reported',
					alignment: 'left',
					colSpan: 2,
					border: [false, false, true, false]
				},
				{}
			]);
		}
		console.log('item', item);
		body.push([
			{ text: '', style: 'tableHeader2' },
			{ text: `Residents (${item.residents.length})`, style: 'tableHeader2', colSpan: 2 },
			{},
			{ text: '', colSpan: 2, style: 'tableHeader3' },
			{}
		]);
		for (let resident of item.residents) {
			body.push(
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Name:', style: 'nameHeader2', colSpan: 2 },
					{},
					{
						text: resident.name,
						alignment: 'left',
						colSpan: 2,
						style: 'nameHeader2'
					},
					{}
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Mobile:', colSpan: 2 },
					{},
					{
						text: resident.mobile,
						alignment: 'left',
						colSpan: 2
					},
					{}
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Occupancy:', colSpan: 2 },
					{},
					{
						text: resident.resident,
						alignment: 'left',
						colSpan: 2
					},
					{}
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Survival Plan:', colSpan: 2 },
					{},
					{
						text: resident.survival_plan,
						alignment: 'left',
						colSpan: 2
					},
					{}
				],
				[
					{ text: '', style: 'tableHeader2' },
					{ text: 'Plan to Leave:', colSpan: 2 },
					{},
					{
						text: resident.plan_to_leave,
						alignment: 'left',
						colSpan: 2
					},
					{}
				]
			);
		}
		content.push({
			table: {
				widths: [10, 50, 85, 60, '*'],
				body: body
			},
			layout: {
				hLineWidth: function (i, node) {
					return 1;
				},
				vLineWidth: function (i, node) {
					return 0;
				},
				hLineColor: function (i, node) {
					return '#c2410c';
				},
				vLineColor: function (i, node) {
					return '#c2410c';
				},
				hLineStyle: function (i, node) {
					// if (i === 0 || i === node.table.body.length) {
					return null;
					// }
					// return { dash: { length: 10, space: 4 } };
				},
				vLineStyle: function (i, node) {
					// if (i === 0 || i === node.table.widths.length) {
					return null;
					// }
					// return { dash: { length: 4 } };
				}
			}
		});
	}

	const file: TDocumentDefinitions = {
		content: content,
		styles: {
			title_h1: {
				fontSize: 26,
				bold: true,
				alignment: 'center'
			},
			title_h2: {
				fontSize: 22,
				margin: [0, 20, 0, 20],
				alignment: 'center'
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'white',
				fillColor: '#c2410c',
				margin: [0, 0, 0, 0]
			},
			tableHeader2: {
				bold: true,
				fontSize: 11,
				color: 'white',
				fillColor: '#c2410c',
				margin: [0, 0, 0, 0]
			},
			nameHeader2: {
				bold: true,
				fontSize: 11,
				color: 'black',
				fillColor: '#ffedd5',
				margin: [0, 0, 0, 0]
			},
			tableHeader3: {
				bold: true,
				fontSize: 11,
				color: 'white',
				fillColor: '#ffedd5',
				margin: [0, 0, 0, 0]
			},
			link: {
				decoration: 'underline',
				color: 'blue'
			}
		},
		defaultStyle: {
			font: 'Poppins',
			fontSize: 11
		}
	};

	return new Promise((resolve, reject) => {
		const pdf = printer.createPdfKitDocument(file);
		// pdf.pipe(fs.createWriteStream('name.pdf'));
		pdf
			.pipe(blobStream())
			.on('finish', function (this: IBlobStream) {
				console.log('Finished generating PDF');
				resolve(this.toBlob('application/pdf'));
			})
			.on('error', (err) => {
				console.error('err', err);
				reject(err);
			});

		pdf.end();
	});
}

export default generateRfsStreetReport;
