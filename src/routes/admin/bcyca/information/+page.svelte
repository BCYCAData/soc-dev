<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	const summaryOpenStyle =
		'py-2 px-4 text-base font-medium text-gray-800 bg-primary-700 !rounded-t-lg !rounded-b-none';
	const summaryClosedStyle = 'p-1 text-base font-medium text-primary-900 bg-stone-300';
	const contentStyle = '!mt-0 text-base text-gray-800 bg-primary-300 rounded-b-lg';

	const handleCheckClick = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		// if (e.currentTarget.checked) {
		// 	vetted = [...vetted, e.currentTarget.name];
		// } else {
		// 	vetted = vetted.filter((value) => value !== e.currentTarget.name);
		// }
	};

	export let data;
	$: ({ bcycaInformationData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Events</title>
</svelte:head>

<Accordion autocollapse />

<Accordion autocollapse spacing="space-y-1">
	<!-- Open -->
	<AccordionItem open class="bg-orange-100 font-medium">
		<svelte:fragment slot="summary">Pre fire season checklist</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="PreFireSeasonChecklist">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(1)}
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
		<svelte:fragment slot="summary">Lighting fires - facts and responsibilities</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="LightingFires_FactsResponsibilities">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(2)}
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
		<svelte:fragment slot="summary">Fire ready - pets and animals</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="FireReady_PetsAnimals">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(3)}
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
		<svelte:fragment slot="summary">Fire ready - livestock & large animals</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="FireReady_LivestockLargeAnimals">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(4)}
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
		<svelte:fragment slot="summary">BCYCA leaflet</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BCYCALeaflet">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(5)}
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
		<svelte:fragment slot="summary">How to be more active locally</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="BeMoreActiveLocally">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(6)}
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
		<svelte:fragment slot="summary">Strengthen Our Community Project Report</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="SOCProjectReport">
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
						{#each bcycaInformationData as row}
							{#if row.informatiion_choices.includes(7)}
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
		<svelte:fragment slot="summary">Other Information Requests</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container" id="OtherInformationRequests">
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
						{#each bcycaInformationData as row}
							{#if row.other_information?.length > 0}
								<tr class="bg-orange-50 font-normal">
									<td class="!py-1">{row.email}</td>
									<td class="!py-1">{row.name}</td>
									<td class="!py-1">{row.address}</td>
									<td class="!py-1">{row.other_information}</td>
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
