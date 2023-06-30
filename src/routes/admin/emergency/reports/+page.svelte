<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	let tabSet: number = 0;

	import StreetSelectInput from '$components/form/inputs/StreetSelectInput.svelte';

	export let data;
	export let form;

	let classText =
		'class="border mt-0 w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-lg"';
	let nameText = 'property_address_street';
	let requiredValue = true;
	let activeTabValue = '1';

	const handleTabClick = (tabValue: string) => () => {
		activeTabValue = tabValue;
	};

	$: ({ streetList } = data);
	$: selectedStreet = form?.selectedStreet ?? '';
	const date = new Date();

	function getFileName() {
		console.log('selectedStreet', selectedStreet);
		return `${selectedStreet.toLocaleLowerCase().replaceAll(' ', '_')}`;
	}

	// function printPDF(streetData: any, residentData: any) {
	// 	// const printer = new PdfPrinter(fonts);
	// 	// console.log('fonts', pdfMake.fonts);
	// 	// const docDefinition = getRFSStreetReportPDF(streetData, residentData);
	// 	// const doc = new jsPDF();
	// 	// setFrontPage(doc, reportStreet);
	// 	// let lineHeight: number;
	// 	// doc.addPage();
	// 	// let line = 1;
	// 	// streetData.forEach((element: any) => {
	// 	// 	console.log('element', element);
	// 	// 	if (element.address) {
	// 	// 		doc.setFont('Poppins-SemiBold', 'normal');
	// 	// 		doc.setFontSize(18);
	// 	// 		let l18 = doc.getTextDimensions('Property').h;
	// 	// 		let y = pdf.startY + 1 * (line * l18);
	// 	// 		doc.setFillColor(255, 255, 200);
	// 	// 		doc.rect(100, 20, 10, 10, 'F');
	// 	// 		doc.text('Property', pdf.startX, y);
	// 	// 		doc.setFontSize(12);
	// 	// 		let l12 = doc.getTextDimensions('Property').h;
	// 	// 		let bits = element.address.toString().split(', ');
	// 	// 		let x = (doc.internal.pageSize.getWidth() - doc.getTextWidth(bits[0])) / 2;
	// 	// 		doc.text(bits[0], x, y);
	// 	// 		x = (doc.internal.pageSize.getWidth() - doc.getTextWidth(bits[1])) / 2;
	// 	// 		doc.text(bits[1], x, y + l12);
	// 	// doc.setFontSize(14);
	// 	// let l14 = doc.getTextDimensions('Property').h;
	// 	// doc.setFontSize(12);
	// 	// let l12 = doc.getTextDimensions('Property').h;
	// 	// doc.setFontSize(10);
	// 	// let l10 = doc.getTextDimensions('Property').h;
	// 	// doc.text('Property', pdf.startX, pdf.startY);
	// 	// doc.setFont('Poppins-Regular', 'normal');
	// 	// doc.text('Property', pdf.startX, pdf.startY + 1 * (line * l18));
	// 	// doc.setFont('Poppins-Bold', 'normal');
	// 	// doc.text('Property', pdf.startX, pdf.startY + 2 * (line * l18));
	// 	// doc.setFont('Poppins-Regular', 'normal');
	// 	// doc.text('Property', pdf.startX, pdf.startY + 3 * (line * l18));
	// 	// doc.setFont('Poppins-Bold', 'normal');
	// 	// doc.text('Property', pdf.startX, pdf.startY + 4 * (line * l18));
	// 	// doc.setFontSize(12).setFont('Poppins-Regular', 'normal');
	// 	// doc.text(element.address, pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// if (element.agent) {
	// 	// 	doc.text('Property is rented', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// 	line += 1;
	// 	// 	doc.setFontSize(12);
	// 	// 	doc.text(
	// 	// 		`Agent:- ${element.agent.agent_name}`,
	// 	// 		pdf.startX + 2 * pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// 	line += 1;
	// 	// 	doc.text(
	// 	// 		`Agent Mobile:- ${element.agent.agent_mobile}`,
	// 	// 		pdf.startX + 2 * pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// 	line += 1;
	// 	// 	doc.text(
	// 	// 		`Agent Phone:- ${element.agent.agent_phone}`,
	// 	// 		pdf.startX + 2 * pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// 	line += 1.25;
	// 	// }
	// 	// doc.setFontSize(14);
	// 	// doc.text('Identification from the Street:', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(12);
	// 	// doc.text(
	// 	// 	element.property.identification,
	// 	// 	pdf.startX + 2 * pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.setFontSize(14);
	// 	// doc.text('Truck access', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(12);
	// 	// doc.text(element.property.truck_access, pdf.startX + 2 * pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(14);
	// 	// doc.text('Any other critical assets', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(12);
	// 	// doc.text(
	// 	// 	element.property.critical_assets,
	// 	// 	pdf.startX + 2 * pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.text('Contact:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text(
	// 	// 	`Contact Name:- ${element.contacts.name}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Contact Phone:- ${element.contacts.phone}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Contact Mobile:- ${element.contacts.mobile}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.setFontSize(12);
	// 	// doc.text('Residency Profile:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text(`${element.residents_profile.resident}`, pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// if (element.residents_profile.vulnerable === 'true') {
	// 	// 	doc.text(
	// 	// 		'There is at least one resident considered vulnerable.',
	// 	// 		pdf.startX + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// } else {
	// 	// 	doc.text(
	// 	// 		'No resident is considered vulnerable.',
	// 	// 		pdf.startX + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// }
	// 	// line += 1;
	// 	// doc.text("Resident's Age Profile.", pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`0-18    ${element.residents_profile.age_profile.age0_18}`,
	// 	// 	pdf.startX + pdf.tab * 2,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`19-50   ${element.residents_profile.age_profile.age19_50}`,
	// 	// 	pdf.startX + pdf.tab * 2,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`51-70   ${element.residents_profile.age_profile.age51_70}`,
	// 	// 	pdf.startX + pdf.tab * 2,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`71+      ${element.residents_profile.age_profile.age71_}`,
	// 	// 	pdf.startX + pdf.tab * 2,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// if (element.residents_profile.rfs_survival_plan === 'Y') {
	// 	// 	doc.text(
	// 	// 		'There is an RFS Survival Plan in place',
	// 	// 		pdf.startX + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// } else {
	// 	// 	doc.text('No RFS Survival Plan in place', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// }
	// 	// line += 1;
	// 	// doc.text('In case of Fire the residents:', pdf.startX + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`  -${element.residents_profile.plan_to_leave}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.setFontSize(12);
	// 	// doc.text('Onsite Hazards:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text(
	// 	// 	`Solar batteries :-  ${element.onsite_hazards.on_site_hazards.Solar_batteries}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Fuel stores :-  ${element.onsite_hazards.on_site_hazards.Fuel_stores}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Chemical stores :-  ${element.onsite_hazards.on_site_hazards.Chemical_stores}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Bottled gas :-  ${element.onsite_hazards.on_site_hazards.Bottled_gas}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Other site hazards reported :-  ${element.onsite_hazards.other_site_hazards}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.setFontSize(12);
	// 	// doc.text('Adjacent Hazards:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text(
	// 	// 	`Land adjacent reported as Hazard :-  ${element.other_local_hazards.land_adjacent_hazard}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Other local Hazards reported :-  ${element.other_local_hazards.other_local_hazards}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.setFontSize(12);
	// 	// doc.text('Fire fighting Assets:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text(
	// 	// 	`Static Water :-  ${element.fire_fighting_assets.static_water.replace(',', ', ')}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// if (element.fire_fighting_assets.static_water !== 'None') {
	// 	// 	doc.text(
	// 	// 		`Stortz fitting :-  ${element.fire_fighting_assets.stortz_fitting}`,
	// 	// 		pdf.startX + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// 	line += 1;
	// 	// }
	// 	// doc.text(
	// 	// 	`Fire fighting resources :-  ${element.fire_fighting_assets.equipment.replace(
	// 	// 		',',
	// 	// 		', '
	// 	// 	)}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Slashed areas around house/sheds :-  ${element.fire_fighting_assets['Slashed areas around house/sheds']}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`A backup pump (petrol or diesel) :-  ${element.fire_fighting_assets['A backup pump (petrol or diesel)']}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Driveway 3.5m overhead clearance :-  ${element.fire_fighting_assets['Driveway 3.5m overhead clearance']}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Truck access around the property :-  ${element.fire_fighting_assets['Truck access around the property']}`,
	// 	// 	pdf.startX + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 2;
	// 	// doc.setFontSize(12);
	// 	// doc.text('Site Animals:-', pdf.startX, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.setFontSize(10);
	// 	// doc.text('Pets :-  ', pdf.startX + pdf.tab + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Dogs :-  ${element.site_animals.pets.dogs}`,
	// 	// 	pdf.startX + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Cats :-  ${element.site_animals.pets.cats}`,
	// 	// 	pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Birds :-  ${element.site_animals.pets.birds}`,
	// 	// 	pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`Other Pets :-  ${element.site_animals.pets.other_pets}`,
	// 	// 	pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text('Livestock :-  ', pdf.startX + pdf.tab + pdf.tab, pdf.startY + line * l12);
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	`${element.site_animals.livestock}`,
	// 	// 	pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// doc.text(
	// 	// 	'Livestock safe area:-  ',
	// 	// 	pdf.startX + pdf.tab + pdf.tab,
	// 	// 	pdf.startY + line * l12
	// 	// );
	// 	// line += 1;
	// 	// if (element.site_animals.safe_area) {
	// 	// 	doc.text(
	// 	// 		`${element.site_animals.safe_area.status}`,
	// 	// 		pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// 	line += 1;
	// 	// 	if (element.site_animals.safe_area.availability) {
	// 	// 		let strArr = element.site_animals.safe_area.availability.split('/n');
	// 	// 		doc.text(strArr, pdf.startX + pdf.tab + pdf.tab + pdf.tab, pdf.startY + line * l12);
	// 	// 		line += 1;
	// 	// 	}
	// 	// } else {
	// 	// 	doc.text(
	// 	// 		'No livestock safe area identified on property.',
	// 	// 		pdf.startX + pdf.tab + pdf.tab + pdf.tab,
	// 	// 		pdf.startY + line * l12
	// 	// 	);
	// 	// }
	// 	// line += 1;
	// 	// 		doc.addPage();
	// 	// 		line = 1;
	// 	// 	}
	// 	// 	// doc.deletePage(doc.internal.getNumberOfPages());
	// 	// });
	// 	// reportStreet = 'THE BUCKETTS WAY';
	// 	// doc.save(`SOC_RFS_Emergency_Report_${reportStreet.replace(' ', '_')}.pdf`);
	// 	// pdfMake.createPdf(docDefinition).download('filename.pdf');
	// }
</script>

<svelte:head>
	<title>Emergency Admin-Reports</title>
</svelte:head>

<TabGroup
	justify="justify-left"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded="rounded-tl-lg rounded-tr-lg"
	border=""
	class="w-full !space-y-0"
	regionList="bg-primary-200"
	regionPanel="variant-filled-primary p-2"
>
	<Tab bind:group={tabSet} name="tab1" value={0}>RFS Street Report</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>RFS Property Report</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<form
				id="reportRFSByStreetForm"
				class="flex flex-col py-3 mx-auto w-full text-orange-900 bg-orange-300"
			>
				<div class="flex flex-col basis-full mx-5">
					<h3 class="mb-2">
						This report lists reported information for all registered Users in a given street.
					</h3>
					<p class="mb-0">Select a street to report on</p>
					<StreetSelectInput
						{streetList}
						{nameText}
						{requiredValue}
						{classText}
						bind:selectedStreet
					/>
					<a
						href={`/api/reports/rfs/street/${selectedStreet}`}
						download={`${selectedStreet
							?.toLocaleLowerCase()
							.replaceAll(' ', '_')}_${date.toLocaleDateString()}.pdf`}
						class="btn w-1/4 m-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
						>Generate Report</a
					>
				</div>
			</form>
		{:else if tabSet === 1}
			<div>Okay</div>
		{/if}
	</svelte:fragment>
</TabGroup>
