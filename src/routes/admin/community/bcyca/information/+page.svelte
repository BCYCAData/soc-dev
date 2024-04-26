<!-- <script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let bcycaInformationColumns = [
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
	let bcycaOtherInformationColumns = [
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
	$: ({ bcycaInformationData } = data);
	function getFilteredData(choice: number): any[] {
		return (
			data?.bcycaInformationData?.filter((item) => item.informatiion_choices?.includes(choice)) ??
			[]
		);
	}
</script>

<svelte:head>
	<title>BCYCA Admin-Events</title>
</svelte:head>

<Accordion autocollapse />

<Accordion autocollapse spacing="space-y-1">
	<AccordionItem open class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Pre fire season checklist</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(1).length > 0}
				<div class="table-container" id="PreFireSeasonChecklist">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(1)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>

	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Lighting fires - facts and responsibilities</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(2).length > 0}
				<div class="table-container" id="LightingFires_FactsResponsibilities">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(2)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>

	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Fire ready - pets and animals</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(3).length > 0}
				<div class="table-container" id="FireReady_PetsAnimals">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(3)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Fire ready - livestock & large animals</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(4).length > 0}
				<div class="table-container" id="FireReady_LivestockLargeAnimals">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(4)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">BCYCA leaflet</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(5).length > 0}
				<div class="table-container" id="BCYCALeaflet">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(5)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to be more active locally</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(6).length > 0}
				<div class="table-container" id="BeMoreActiveLocally">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(6)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Strengthen Our Community Project Report</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(7).length > 0}
				<div class="table-container" id="SOCProjectReport">
					<CommunityRequestsTable
						columns={bcycaInformationColumns}
						tableData={getFilteredData(7)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Other Information Requests</svelte:fragment>
		<svelte:fragment slot="content">
			{#if getFilteredData(8).length > 0}
				<div class="table-container" id="OtherInformationRequests">
					<CommunityRequestsTable
						columns={bcycaOtherInformationColumns}
						tableData={getFilteredData(8)}
					/>
				</div>
			{:else}
				<p>No outstanding requests</p>
			{/if}
		</svelte:fragment>
	</AccordionItem>
</Accordion> -->
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import CommunityRequestsAccordionItem from '$components/form/CommunityRequestsAccordionItem.svelte';
	import type { CellComponent } from 'tabulator-tables';

	export let data;
	let bcycaInformationColumns = [
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
	let bcycaOtherInformationColumns = [
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
</script>

<svelte:head>
	<title>BCYCA Admin-Events</title>
</svelte:head>

<Accordion autocollapse />

<Accordion autocollapse spacing="space-y-1">
	<CommunityRequestsAccordionItem
		summary="Pre fire season checklist"
		choice={1}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="Lighting fires - facts and responsibilities"
		choice={2}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="Fire ready - pets and animals"
		choice={3}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="Fire ready - livestock & large animals"
		choice={4}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="BCYCA Leaflet"
		choice={5}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="How to be more active locally"
		choice={6}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="Strengthen Our Community Project report"
		choice={7}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		summary="Other Information Requests"
		columns={bcycaOtherInformationColumns}
		data={data?.bcycaInformationData}
		dataFilter={(item) => item.other_information?.length > 0}
	/>
	<!-- Repeat for other items -->
</Accordion>
