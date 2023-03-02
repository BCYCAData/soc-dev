<script lang="ts">
	import { AccordionGroup, AccordionItem } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	const summaryOpenStyle =
		'py-2 px-4 text-base font-medium text-gray-800 bg-primary-300 !rounded-t-lg !rounded-b-none';
	const summaryClosedStyle = 'p-1 text-base font-medium text-primary-900 bg-stone-300';
	const contentStyle = '!mt-0 text-base text-gray-800 bg-primary-300 rounded-b-lg';

	const handleCheckClick = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		// if (e.currentTarget.checked) {
		// 	vetted = [...vetted, e.currentTarget.name];
		// } else {
		// 	vetted = vetted.filter((value) => value !== e.currentTarget.name);
		// }
	};

	$: accordion1Open = false;
	$: accordion2Open = false;
	$: accordion3Open = false;
	$: accordion4Open = false;
	$: accordion5Open = false;
	$: accordion6Open = false;
	$: accordion7Open = false;
	$: accordion8Open = false;
	$: accordion9Open = false;
	$: accordion10Open = false;
	$: accordion11Open = false;
	$: accordion12Open = false;
	$: summary1Style = summaryClosedStyle;
	$: summary2Style = summaryClosedStyle;
	$: summary3Style = summaryClosedStyle;
	$: summary4Style = summaryClosedStyle;
	$: summary5Style = summaryClosedStyle;
	$: summary6Style = summaryClosedStyle;
	$: summary7Style = summaryClosedStyle;
	$: summary8Style = summaryClosedStyle;
	$: summary9Style = summaryClosedStyle;
	$: summary10Style = summaryClosedStyle;
	$: summary11Style = summaryClosedStyle;
	$: summary12Style = summaryClosedStyle;

	$: if (accordion1Open) {
		summary1Style = summaryOpenStyle;
	} else {
		summary1Style = summaryClosedStyle;
	}
	$: if (accordion2Open) {
		summary2Style = summaryOpenStyle;
	} else {
		summary2Style = summaryClosedStyle;
	}
	$: if (accordion3Open) {
		summary3Style = summaryOpenStyle;
	} else {
		summary3Style = summaryClosedStyle;
	}
	$: if (accordion4Open) {
		summary4Style = summaryOpenStyle;
	} else {
		summary4Style = summaryClosedStyle;
	}
	$: if (accordion5Open) {
		summary5Style = summaryOpenStyle;
	} else {
		summary5Style = summaryClosedStyle;
	}
	$: if (accordion6Open) {
		summary6Style = summaryOpenStyle;
	} else {
		summary6Style = summaryClosedStyle;
	}
	$: if (accordion7Open) {
		summary7Style = summaryOpenStyle;
	} else {
		summary7Style = summaryClosedStyle;
	}
	$: if (accordion8Open) {
		summary8Style = summaryOpenStyle;
	} else {
		summary8Style = summaryClosedStyle;
	}
	$: if (accordion9Open) {
		summary9Style = summaryOpenStyle;
	} else {
		summary9Style = summaryClosedStyle;
	}
	$: if (accordion10Open) {
		summary10Style = summaryOpenStyle;
	} else {
		summary10Style = summaryClosedStyle;
	}
	$: if (accordion11Open) {
		summary11Style = summaryOpenStyle;
	} else {
		summary11Style = summaryClosedStyle;
	}
	$: if (accordion12Open) {
		summary12Style = summaryOpenStyle;
	} else {
		summary12Style = summaryClosedStyle;
	}

	export let data: PageData;
	$: ({ bcycaEventsData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Events</title>
</svelte:head>

<AccordionGroup spacing="space-y-1">
	<!-- Open -->
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary1Style}
		bind:open={accordion1Open}
	>
		>
		<svelte:fragment slot="summary">Fire season preparation</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="FireSeasonPreparation">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(1)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div>
		</svelte:fragment>
	</AccordionItem>
	<!-- Closed -->
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary2Style}
		bind:open={accordion2Open}
	>
		<svelte:fragment slot="summary">Bands - live music</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BandsLiveMusic">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(2)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary3Style}
		bind:open={accordion3Open}
	>
		<svelte:fragment slot="summary">Monthly social events - tea and chat</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="MonthlySocialEvents">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(3)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary4Style}
		bind:open={accordion4Open}
	>
		<svelte:fragment slot="summary">Indoor bowls</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="IndoorBowls">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(4)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary5Style}
		bind:open={accordion5Open}
	>
		<svelte:fragment slot="summary">Christmas end of year wrap</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="ChristmasEndOfYearWrap">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(5)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary6Style}
		bind:open={accordion6Open}
	>
		<svelte:fragment slot="summary">Youth events</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="YouthEvents">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(6)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary7Style}
		bind:open={accordion7Open}
	>
		<svelte:fragment slot="summary">Table tennis</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="TableTennis">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(7)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary8Style}
		bind:open={accordion8Open}
	>
		<svelte:fragment slot="summary">Bingo</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="Bingo">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(8)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary9Style}
		bind:open={accordion9Open}
	>
		<svelte:fragment slot="summary">Canasta card meet</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="CanastaCardMeet">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(9)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary10Style}
		bind:open={accordion10Open}
	>
		<svelte:fragment slot="summary">Community dinners</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="CommunityDinners">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Will Run Workshops</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(10)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary11Style}
		bind:open={accordion11Open}
	>
		<svelte:fragment slot="summary">Book Club</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BookClub">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.event_choices.includes(11)}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
	<AccordionItem
		regionContent={contentStyle}
		regionSummary={summary12Style}
		bind:open={accordion12Open}
	>
		<svelte:fragment slot="summary">Other Event Suggestions</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherEventSuggestions">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Other Event Suggestions</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaEventsData as row}
							{#if row.other_event?.length > 0}
								<tr class="bg-orange-50">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.other_event}</td>
									<td class="!py-1">{row.created_at}</td>
									<td class="!py-1" style="text-align: center"
										><input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/></td
									>
								</tr>{/if}
						{/each}
					</tbody>
				</table>
			</div></svelte:fragment
		>
	</AccordionItem>
</AccordionGroup>
