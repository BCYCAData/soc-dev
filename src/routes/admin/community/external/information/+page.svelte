<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let externalInformationColumns = [
		{ formatter: 'rownum', hozAlign: 'center', width: 40 },
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'Email', field: 'email' },
		{ title: 'Name', field: 'name' },
		{ title: 'Address', field: 'property_address' },
		{ title: 'Created At', field: 'created_at' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		}
	];
	let externalOtherInformationColumns = [
		{ formatter: 'rownum', hozAlign: 'center', width: 40 },
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'Email', field: 'email' },
		{ title: 'Name', field: 'name' },
		{ title: 'Address', field: 'property_address' },
		{ title: 'Other Information', field: 'other_information' },
		{ title: 'Created At', field: 'created_at' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		}
	];
	$: ({ externalInformationData } = data);
</script>

<svelte:head>
	<title>ExternalCommunity Admin-Events</title>
</svelte:head>

<Accordion autocollapse />

<Accordion autocollapse spacing="space-y-1">
	<!-- Open -->
	<AccordionItem open class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Pre fire season checklist</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="PreFireSeasonChecklist">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter(
						(item) => item.informatiion_choices?.includes(1) || false
					)}
				/>
			</div>
		</svelte:fragment>
	</AccordionItem>
	<!-- Closed -->
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Lighting fires - facts and responsibilities</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="LightingFires_FactsResponsibilities">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(2)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Fire ready - pets and animals</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="FireReady_PetsAnimals">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(3)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Fire ready - livestock & large animals</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="FireReady_LivestockLargeAnimals">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(4)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">ExternalCommunity leaflet</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="ExternalCommunityLeaflet">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(5)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to be more active locally</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BeMoreActiveLocally">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(6)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Strengthen Our Community Project Report</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="SOCProjectReport">
				<CommunityRequestsTable
					communityRequestsColumns={externalInformationColumns}
					communityRequestsData={externalInformationData.filter((item) =>
						item.informatiion_choices?.includes(7)
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Other Information Requests</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherInformationRequests">
				<CommunityRequestsTable
					communityRequestsColumns={externalOtherInformationColumns}
					communityRequestsData={externalInformationData.filter(
						(item) => item.other_information?.length > 0
					)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
</Accordion>
