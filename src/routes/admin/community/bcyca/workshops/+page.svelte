<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let bcycaWorkshopsColumns = [
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
	let bcycaOtherWorkshopsColumns = [
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
	let bcycaWillRunWorkshopsColumns = [
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

	$: ({ bcycaWorkshopsData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Workshops</title>
</svelte:head>

<Accordion autocollapse spacing="space-y-1">
	<!-- Open -->
	<AccordionItem open class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Completing your fire plan</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="CompletingFirePlan">
				<CommunityRequestsTable
					columns={bcycaWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(1))}
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
						columns={bcycaWorkshopsColumns}
						tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(2))}
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
					columns={bcycaWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(3))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Making a fire trailer</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="MakingFireTrailer">
				<CommunityRequestsTable
					columns={bcycaWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(4))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Bushfire safety training</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BushfireSafetyTraining">
				<CommunityRequestsTable
					columns={bcycaWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(5))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to do a small pile burn safely</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="SmallPileBurn">
				<CommunityRequestsTable
					columns={bcycaWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.workshop_choices?.includes(6))}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Other Workshop Suggestions</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherWorkshopSuggestions">
				<CommunityRequestsTable
					columns={bcycaOtherWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.other_wokshop?.length > 0)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Will Run Workshops</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="WillRunWorkshops">
				<CommunityRequestsTable
					columns={bcycaWillRunWorkshopsColumns}
					tableData={bcycaWorkshopsData.filter((item) => item.will_run_wokshop?.length > 0)}
				/>
			</div></svelte:fragment
		>
	</AccordionItem>
</Accordion>
