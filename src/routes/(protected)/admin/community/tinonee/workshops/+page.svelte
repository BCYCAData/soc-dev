<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { PageData } from './$types';
	import type { CellComponent } from 'tabulator-tables';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();
	let tinoneeWorkshopsData = data?.tinoneeWorkshopsData;

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

	const value = $state(['CompletingFirePlan']); // Default open section

	const workshopItems = [
		{
			id: 'CompletingFirePlan',
			summary: 'Completing your fire plan',
			choice: 1,
			columns: tinoneeWorkshopsColumns
		},
		{
			id: 'OnlineVideoCalls',
			summary: 'Using online video calls',
			choice: 2,
			columns: tinoneeWorkshopsColumns
		}
		// ... add other workshop items
	];
</script>

<svelte:head>
	<title>Tinonee Community Admin-Workshops</title>
</svelte:head>

<Accordion {value} collapsible={true} spaceY="space-y-1">
	{#each workshopItems as item}
		<Accordion.Item controlClasses="bg-amber-100 font-medium" value={item.id}>
			{#snippet control()}{item.summary}{/snippet}
			{#snippet panel()}
				<div class="table-container" id={item.id}>
					<CommunityRequestsTable
						columns={item.columns}
						tableData={tinoneeWorkshopsData.filter((row: { workshop_choices: number[] }) =>
							row.workshop_choices?.includes(item.choice)
						)}
					/>
				</div>
			{/snippet}
		</Accordion.Item>
	{/each}

	<Accordion.Item controlClasses="bg-amber-100 font-medium" value="OtherWorkshopSuggestions">
		{#snippet control()}{'Other Workshop Suggestions'}{/snippet}
		{#snippet panel()}"
			<div class="table-container" id="OtherWorkshopSuggestions">
				<CommunityRequestsTable
					columns={tinoneeOtherWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter(
						(item: { other_wokshop: string | any[] }) => item.other_wokshop?.length > 0
					)}
				/>
			</div>
		{/snippet}
	</Accordion.Item>

	<Accordion.Item controlClasses="bg-amber-100 font-medium" value="WillRunWorkshops">
		{#snippet control()}{'Will Run Workshops'}{/snippet}
		{#snippet panel()}"
			<div class="table-container" id="WillRunWorkshops">
				<CommunityRequestsTable
					columns={tinoneeWillRunWorkshopsColumns}
					tableData={tinoneeWorkshopsData.filter(
						(item: { will_run_wokshop: string | any[] }) => item.will_run_wokshop?.length > 0
					)}
				/>
			</div>
		{/snippet}
	</Accordion.Item>
</Accordion>
