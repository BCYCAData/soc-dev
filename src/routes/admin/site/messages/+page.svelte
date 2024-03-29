<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';
	import MessagesTable from '$components/form/tables/MessagesTable.svelte';

	import type { PageData } from './$types';
	import type { CellComponent } from 'tabulator-tables';

	let tabSet: number = 0;

	export let data: PageData;

	let message = '';
	let enumValue: string;
	let messageContext: string;
	let haveMessage = false;
	let selectedValues: string[] = [];
	let selectedIDs: string[] = [];
	let selectedRows: any[] = [];
	let buttonDisabled = true;

	let activeTabValue = 'add_messages';

	let isSelectionEmpty = true;

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

	$: ({ appMessages } = data);

	$: {
		if (activeTabValue !== 'add_messages') {
			isSelectionEmpty = true;
		}
	}
	let currentMessages: MessagesTable;
	let revokedMessages: MessagesTable;

	let appMessagesColumns = [
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			width: 20,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'ID', field: 'id', hozAlign: 'center', width: 80 },
		{ title: 'Context', field: 'context', hozAlign: 'center', width: 100 },
		{ title: 'Scope', field: 'scope', formatter: 'textarea' },
		{ title: 'Message', field: 'message', formatter: 'textarea' },
		{ title: 'Created', field: 'created_at', width: 150 },
		{ title: 'Revoked', field: 'revoked', width: 150 }
	];
</script>

<svelte:head>
	<title>Site Messages</title>
</svelte:head>

<TabGroup
	justify="justify-left"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded="rounded-tl-lg rounded-tr-lg"
	border=""
	class="w-full !space-y-0"
	regionList="bg-primary-200"
	regionPanel="variant-filled-primary p-2"
>
	<Tab bind:group={tabSet} name="add_messages" value={0}>Add Messages</Tab>
	<Tab bind:group={tabSet} name="current_messages" value={1}>Current Messages</Tab>
	<Tab bind:group={tabSet} name="revoked_messages" value={2}>Revoked Messages</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
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
		{:else if tabSet === 1}
			<form method="POST" class="card p-4 bg-orange-50" action="">
				<div class="table-container">
					<MessagesTable
						{appMessagesColumns}
						appMessagesData={appMessages.filter((item) => !item.revoked)}
						bind:selectedIDs
						bind:selectedRows
						bind:isSelectionEmpty
						downloadFileName="current_messages_report"
						bind:this={currentMessages}
					/>
				</div>
				<input name="revoke_ids" type="hidden" bind:value={selectedIDs} />
				<button
					type="submit"
					formaction="?/revokeMessages"
					class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
					disabled={isSelectionEmpty}
				>
					Revoke Selected
				</button>
				<button
					name="download_selected"
					type="button"
					class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
					disabled={isSelectionEmpty}
					on:click={() => currentMessages.downloadSelected()}
				>
					Download Selected
				</button>
			</form>
		{:else if tabSet === 2}
			<div class="card p-4 bg-orange-50">
				<div class="table-container">
					<MessagesTable
						{appMessagesColumns}
						appMessagesData={appMessages.filter((item) => item.revoked)}
						bind:isSelectionEmpty
						bind:selectedIDs
						bind:selectedRows
						downloadFileName="revoked_messages_report"
						bind:this={revokedMessages}
					/>
				</div>
				<button
					type="button"
					class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
					disabled={isSelectionEmpty}
					on:click={() => revokedMessages.downloadSelected()}
				>
					Download Selected
				</button>
			</div>
		{/if}
	</svelte:fragment>
</TabGroup>
