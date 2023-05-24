<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		createDataTableStore,
		dataTableHandler,
		tableInteraction,
		tableA11y,
		Paginator
	} from '@skeletonlabs/skeleton';

	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';

	import type { PageData } from './$types';
	import TabWrapper from '$components/tabs/TabWrapper.svelte';
	import TabHead from '$components/tabs/TabHead.svelte';
	import TabHeadItem from '$components/tabs/TabHeadItem.svelte';
	import TabContentItem from '$components/tabs/TabContentItem.svelte';

	export let data: PageData;

	let message: string = '';
	let enumValue: string;
	let messageContext: string;
	let haveMessage = false;
	let selectedValues: string[] = [];
	let buttonDisabled = true;

	let activeTabValue = '1';

	$: {
		const words = message.split(' ');
		haveMessage = message.length > 4 && words.length > 1;
	}

	$: {
		if (enumValue === 'users') {
			messageContext = 'the Profile page';
		} else if (enumValue === 'admins') {
			messageContext = 'the Administrator page';
		} else {
			messageContext = 'the Administrator & Profile pages';
		}
	}
	$: {
		if (selectedValues.length === 0) {
			buttonDisabled = true;
		} else {
			buttonDisabled = !haveMessage;
		}
	}

	const handleTabClick = (tabValue: string) => () => {
		activeTabValue = tabValue;
	};

	const dataTableStore = createDataTableStore(
		// Pass your source data here:
		data.appMessages,
		// Provide optional settings:
		{
			// The current search term.
			search: '',
			// The current sort key.
			sort: '',
			// Paginator component settings.
			pagination: { offset: 0, limit: 5, size: 0, amounts: [1, 2, 5, 10] }
		}
	);

	// This automatically handles search, sort, etc when the model updates.
	dataTableStore.subscribe((model) => dataTableHandler(model));
</script>

<svelte:head>
	<title>Site Messages</title>
</svelte:head>

<TabWrapper>
	<TabHead>
		<TabHeadItem
			id={'1'}
			on:click={handleTabClick('1')}
			on:keypress={handleTabClick('1')}
			{activeTabValue}>Add Messages</TabHeadItem
		>
		<TabHeadItem
			id={'2'}
			on:click={handleTabClick('2')}
			on:keypress={handleTabClick('2')}
			{activeTabValue}>Revoke Messages</TabHeadItem
		>
		<TabHeadItem
			id={'3'}
			on:click={handleTabClick('3')}
			on:keypress={handleTabClick('3')}
			{activeTabValue}>Message Reports</TabHeadItem
		>
	</TabHead>
	<TabContentItem id={'1'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<form method="POST" class="card p-4 bg-orange-50" action="">
			<div class="flex items-center">
				<label class="flex flex-col items-start flex-grow">
					<p>Enter the message here:</p>
					<input
						class="border border-gray-300 rounded-md px-3 py-1 mr-2 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
						name="inputMessage"
						type="text"
						placeholder="Message"
						bind:value={message}
					/>
				</label>
				<EnumOptionSelect bind:enumValue header="Pick a context:" />
			</div>
			<p class="mt-2">Choose the recipients here:</p>
			<Accordion autocollapse spacing="space-y-1">
				<!-- Open -->
				<AccordionItem open class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">All Users</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="flex items-center justify-end">
							<p class="mr-2">Send this message to {messageContext} of all users</p>
							<button
								type="submit"
								formaction="?/sendToAllUsers"
								class="px-4 py-2 bg-tertiary-500 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500 sm:text-sm"
								disabled={!haveMessage}>Send Message</button
							>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<!-- Closed -->
				<AccordionItem class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">Individual Users - (email address)</svelte:fragment>
					<svelte:fragment slot="content">
						<AutoCompleteSelect
							listData={data.emailList}
							placeholder="Select one or more Email Addresses"
							bind:selectedValues
						/>
						<div class="flex items-center justify-end">
							<p class="mr-2">Send this message to {messageContext} of the selected users</p>
							<button
								type="submit"
								formaction="?/sendToEmailList"
								class="px-4 py-2 bg-tertiary-600 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500 sm:text-sm"
								disabled={buttonDisabled}>Send Message</button
							>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">Individual Property - (street address)</svelte:fragment>
					<svelte:fragment slot="content">
						<AutoCompleteSelect
							listData={data.addressList}
							placeholder="Select one or more Street Addresses"
							bind:selectedValues
						/>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">All in a Street</svelte:fragment>
					<svelte:fragment slot="content">
						<AutoCompleteSelect
							listData={data.streetList}
							placeholder="Select one or more Streets"
							bind:selectedValues
						/>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">All in a Community</svelte:fragment>
					<svelte:fragment slot="content">
						<AutoCompleteSelect
							listData={data.communityList}
							placeholder="Select one or more Communities"
							bind:selectedValues
						/>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem class="bg-orange-100 font-medium">
					<svelte:fragment slot="summary">All in a Suburb</svelte:fragment>
					<svelte:fragment slot="content">
						<AutoCompleteSelect
							listData={data.suburbList}
							placeholder="Select one or more Suburbs"
							bind:selectedValues
						/>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</form>
	</TabContentItem>
	<TabContentItem id={'2'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<!-- Revoke here. - Table showing all Messages -- replace id by email -- Search by email, address,
		street, suburb, community, date range, revoked/not-revoked -- Filter by email, address, street,
		suburb, community, date range, revoked/not-revoked -- Order by Button to revoke selected -->
		<!-- <div class="table-container" id="RevokeSiteMessages">
			<table class="table table-hover">
				<thead>
					<tr class="bg-orange-400">
						<th class="!p-1 text-center !font-semibold">ID</th>
						<th class="!p-1 text-center !font-semibold">Message</th>
						<th class="!p-1 text-center !font-semibold">Context</th>
						<th class="!p-1 text-center !font-semibold">Scope</th>
						<th class="!p-1 text-center !font-semibold">Created</th>
						<th class="!p-1 text-center !font-semibold">Recalled</th>
					</tr>
				</thead>
				<tbody class="table-row-checked">
					{#each data.appMessages as row}
						{#if row.event_choices.includes(1)}
						<tr class="bg-orange-50 font-normal">
							<td class="!py-1">{row.id}</td>
							<td class="!py-1">{row.message}</td>
							<td class="!py-1">{row.context}</td>
							<td class="!py-1">{row.scope}</td>
							<td class="!py-1">{row.created_at}</td>
							<td class="!py-1">{row.recalled}</td>
							<td class="!py-1" style="text-align: center">
							<input
											type="checkbox"
											name={row.email}
											on:change={(e) => {
												handleCheckClick(e);
											}}
										/>
							</td>
						</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div> -->
		<div class="card-header">
			<input bind:value={$dataTableStore.search} type="search" placeholder="Search..." />
		</div>
		<div class="table-container">
			<table class="table table-hover" use:tableInteraction role="grid" use:tableA11y>
				<thead
					on:click={(e) => {
						dataTableStore.sort(e);
					}}
					on:keypress
				>
					<tr>
						<th
							><input
								type="checkbox"
								on:click={(e) => {
									dataTableStore.selectAll(e.currentTarget.checked);
								}}
							/></th
						>
						<th>ID</th>
						<th data-sort="message">Message</th>
						<th data-sort="context">Context</th>
						<th data-sort="scope">Scope</th>
						<th data-sort="created_at">Sent</th>
						<th data-sort="recalled">Recalled</th>
					</tr>
				</thead>
				<tbody>
					{#each $dataTableStore.filtered as row, rowIndex}
						<tr class:table-row-checked={row.dataTableChecked} aria-rowindex={rowIndex + 1}>
							<td role="gridcell" aria-colindex={1} tabindex="0" class="table-cell-fit"
								><input type="checkbox" bind:checked={row.dataTableChecked} /></td
							>
							<td role="gridcell" aria-colindex={2} tabindex="0" class="table-cell-fit">{row.id}</td
							>
							<td role="gridcell" aria-colindex={3} tabindex="0" class="table-cell-fit"
								>{row.message}</td
							>
							<td role="gridcell" aria-colindex={4} tabindex="0" class="table-cell-fit"
								>{row.context}</td
							>
							<td role="gridcell" aria-colindex={5} tabindex="0" class="table-cell-fit"
								>{row.scope}</td
							>
							<td role="gridcell" aria-colindex={6} tabindex="0" class="table-cell-fit"
								>{row.created_at}</td
							>
							<td role="gridcell" aria-colindex={7} tabindex="0" class="table-cell-fit"
								>{row.recalled}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			{#if $dataTableStore.pagination}<Paginator
					class="pt-3"
					bind:settings={$dataTableStore.pagination}
				/>{/if}
		</div>
	</TabContentItem>
	<TabContentItem id={'3'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		Report Here
	</TabContentItem>
</TabWrapper>
