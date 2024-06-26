<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let tinoneeWorkshopsColumns = [
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
	let tinoneeOtherWorkshopsColumns = [
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
		{ title: 'Other Event Suggestions', field: 'other_event' },
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
	let tinoneeWillRunWorkshopsColumns = [
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
		{ title: 'Will Run Wokshops', field: 'will_run_wokshop' },
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

	$: ({ tinoneeWorkshopsData } = data);
</script>

<svelte:head>
	<title>Tinonee Admin-Workshops</title>
</svelte:head>

<Accordion autocollapse spacing="space-y-1">
	<!-- Open -->
	<AccordionItem open class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Completing your fire plan</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="CompletingFirePlan">
				<CommunityRequestsTable
					columns={tinoneeWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(1))}
				/>
			</div>
		</svelte:fragment>
	</AccordionItem>
	<!-- Closed -->
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Using online video calls</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OnlineVideoCalls">
				<table class="table table-hover">
					<CommunityRequestsTable
						columns={tinoneeWorkshopsColumns}
						tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(2))}
					/>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to develop a good emergency pack and plan</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="EmergencyPackAndPlan">
				<CommunityRequestsTable
					columns={tinoneeWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(3))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Making a fire trailer</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="MakingFireTrailer">
				<CommunityRequestsTable
					columns={tinoneeWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(4))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Bushfire safety training</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BushfireSafetyTraining">
				<CommunityRequestsTable
					columns={tinoneeWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(5))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to do a small pile burn safely</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="SmallPileBurn">
				<CommunityRequestsTable
					columns={tinoneeWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.workshop_choices?.includes(6))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Other Workshop Suggestions</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherWorkshopSuggestions">
				<CommunityRequestsTable
					columns={tinoneeOtherWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.other_wokshop?.length > 0)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Will Run Workshops</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="WillRunWorkshops">
				<CommunityRequestsTable
					columns={tinoneeWillRunWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter((item) => item.will_run_wokshop?.length > 0)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
</Accordion>
