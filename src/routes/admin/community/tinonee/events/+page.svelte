<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';
	import type { CellComponent } from 'tabulator-tables';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();

	let tinoneeEventsColumns = [
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

	let tinoneeOtherEventsColumns = [
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

	let { tinoneeEventsData } = $derived(data);

	const value = $state(['FireSeasonPreparation']);

	const accordionItems = [
		{
			id: 'FireSeasonPreparation',
			summary: 'Fire season preparation',
			eventId: 1,
			columns: tinoneeEventsColumns
		},
		{
			id: 'BandsLiveMusic',
			summary: 'Bands - live music',
			eventId: 2,
			columns: tinoneeEventsColumns
		},
		{
			id: 'MonthlySocialEvents',
			summary: 'Monthly social events - tea and chat',
			eventId: 3,
			columns: tinoneeEventsColumns
		},
		{
			id: 'IndoorBowls',
			summary: 'Indoor bowls',
			eventId: 4,
			columns: tinoneeEventsColumns
		},
		{
			id: 'ChristmasEndOfYearWrap',
			summary: 'Christmas end of year wrap',
			eventId: 5,
			columns: tinoneeEventsColumns
		},
		{
			id: 'YouthEvents',
			summary: 'Youth events',
			eventId: 6,
			columns: tinoneeEventsColumns
		},
		{
			id: 'TableTennis',
			summary: 'Table tennis',
			eventId: 7,
			columns: tinoneeEventsColumns
		},
		{
			id: 'Bingo',
			summary: 'Bingo',
			eventId: 8,
			columns: tinoneeEventsColumns
		},
		{
			id: 'CanastaCardMeet',
			summary: 'Canasta card meet',
			eventId: 9,
			columns: tinoneeEventsColumns
		},
		{
			id: 'CommunityDinners',
			summary: 'Community dinners',
			eventId: 10,
			columns: tinoneeEventsColumns
		},
		{
			id: 'BookClub',
			summary: 'Book Club',
			eventId: 11,
			columns: tinoneeEventsColumns
		},
		{
			id: 'OtherEventSuggestions',
			summary: 'Other Event Suggestions',
			columns: tinoneeOtherEventsColumns,
			isOther: true
		}
	];
</script>

<svelte:head>
	<title>Tinonee Admin-Events</title>
</svelte:head>

<div>
	<Accordion {value} collapsible={true} spaceY="space-y-1">
		{#each accordionItems as item}
			<Accordion.Item controlClasses="bg-amber-100 font-medium" value={item.id}>
				{#snippet control()}{item.summary}{/snippet}
				{#snippet panel()}
					<div class="table-container" id={item.id}>
						<CommunityRequestsTable
							columns={item.columns}
							tableData={item.isOther
								? tinoneeEventsData.filter(
										(row: { other_event: string | any[] }) => row.other_event?.length > 0
									)
								: tinoneeEventsData.filter((row: { event_choices: (number | undefined)[] }) =>
										row.event_choices?.includes(item.eventId)
									)}
						/>
						{#if item.id === 'FireSeasonPreparation'}
							<div class="flex items-center justify-end">
								<p class="mr-2">Do something with selected Users</p>
								<button
									type="submit"
									formaction="?/sendToAllUsers"
									class="rounded-md border border-transparent bg-tertiary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
								>
									Do Something
								</button>
							</div>
						{/if}
					</div>
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>
</div>
