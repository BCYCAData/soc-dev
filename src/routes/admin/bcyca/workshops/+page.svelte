<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
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

	export let data: PageData;
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(1)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Using online video calls</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OnlineVideoCalls">
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(2)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to develop a good emergency pack and plan</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="EmergencyPackAndPlan">
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(3)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Making a fire trailer</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="MakingFireTrailer">
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(4)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Bushfire safety training</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BushfireSafetyTraining">
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(5)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">How to do a small pile burn safely</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="SmallPileBurn">
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
						{#each bcycaWorkshopsData as row}
							{#if row.workshop_choices.includes(6)}
								<tr class="bg-orange-50 font-normal">
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Other Workshop Suggestions</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherWorkshopSuggestions">
				<table class="table table-hover">
					<thead>
						<tr class="bg-orange-400">
							<th class="!p-1 text-center !font-semibold">Email</th>
							<th class="!p-1 text-center !font-semibold">Name</th>
							<th class="!p-1 text-center !font-semibold">Address</th>
							<th class="!p-1 text-center !font-semibold">Workshop</th>
							<th class="!p-1 text-center !font-semibold">Created At</th>
							<th class="!p-1 text-center !font-semibold">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each bcycaWorkshopsData as row}
							{#if row.other_wokshop?.length > 0}
								<tr class="bg-orange-50 font-normal">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.other_wokshop}</td>
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
	<AccordionItem class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Will Run Workshops</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="WillRunWorkshops">
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
						{#each bcycaWorkshopsData as row}
							{#if row.will_run_wokshop?.length > 0}
								<tr class="bg-orange-50 font-normal">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.will_run_wokshop}</td>
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
</Accordion>
