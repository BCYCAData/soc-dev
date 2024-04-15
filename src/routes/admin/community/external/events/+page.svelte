<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let externalEventsColumns = [
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
	let externalOtherEventsColumns = [
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

	$: ({ externalEventsData } = data);
</script>

<svelte:head>
	<title>External Community Admin-Events</title>
</svelte:head>
<div>
	<Accordion autocollapse spacing="space-y-1">
		<!-- Open -->
		<AccordionItem open class="bg-orange-100 font-medium !overflow-y-auto !max-h-full">
			<svelte:fragment slot="summary">Fire season preparation</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="FireSeasonPreparation">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(1)
						)}
					/>
					<div class="flex items-center justify-end">
						<p class="mr-2">Do something with selected Users</p>
						<button
							type="submit"
							formaction="?/sendToAllUsers"
							class="px-4 py-2 bg-tertiary-500 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500 sm:text-sm"
						>
							Do Something
						</button>
					</div>
				</div>
			</svelte:fragment>
		</AccordionItem>
		<!-- Closed -->
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Bands - live music</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="BandsLiveMusic">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(2)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Monthly social events - tea and chat</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="MonthlySocialEvents">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(3)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Indoor bowls</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="IndoorBowls">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(4)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Christmas end of year wrap</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="ChristmasEndOfYearWrap">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(5)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Youth events</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="YouthEvents">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(6)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Table tennis</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="TableTennis">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(7)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Bingo</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="Bingo">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(8)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Canasta card meet</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="CanastaCardMeet">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(9)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Community dinners</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="CommunityDinners">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(10)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Book Club</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="BookClub">
					<CommunityRequestsTable
						communityRequestsColumns={externalEventsColumns}
						communityRequestsData={externalEventsData.filter((item) =>
							item.event_choices?.includes(11)
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem class="bg-orange-100 font-medium">
			<svelte:fragment slot="summary">Other Event Suggestions</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="table-container" id="OtherEventSuggestions">
					<CommunityRequestsTable
						communityRequestsColumns={externalOtherEventsColumns}
						communityRequestsData={externalEventsData.filter(
							(item) => item.other_event?.length > 0
						)}
					/>
				</div></svelte:fragment
			>
		</AccordionItem>
	</Accordion>
</div>
