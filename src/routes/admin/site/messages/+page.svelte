<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';

	import type { PageData } from './$types';

	let tabSet: number = 0;

	export let data: PageData;

	let message = '';
	let enumValue: string;
	let messageContext: string;
	let haveMessage = false;
	let selectedValues: string[] = [];
	let selectedIDs: string[] = [];
	let selectedRows: any[] = [];
	// let buttonDisabled = true;

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
	// $: {
	// 	if (selectedValues.length === 0) {
	// 		buttonDisabled = true;
	// 	} else {
	// 		buttonDisabled = !haveMessage;
	// 	}
	// }

	// const handleTabClick = (tabValue: string) => () => {
	// 	activeTabValue = tabValue;
	// };

	// $: ({ appMessages } = data);

	$: {
		if (activeTabValue !== 'add_messages') {
			isSelectionEmpty = true;
		}
	}
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
			<Accordion autocollapse spacing="space-y-1">
				<form method="POST" class="card p-4 bg-orange-50" action="?/sendToAllUsers">
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
					<AccordionItem open class="bg-orange-100 font-medium">
						<svelte:fragment slot="summary">All Users</svelte:fragment>
						<svelte:fragment slot="content">
							<!-- <form method="POST" class="card p-4 bg-orange-50" action="?/sendToAllUsers"> -->
							<!-- <div class="flex items-center">
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
							</div> -->
							<!-- <p class="mt-2">Choose the recipients here:</p> -->
							<div class="flex items-center justify-end">
								<p class="mr-2">Send this message to {messageContext} of all users</p>
								<button
									class="px-4 py-2 bg-tertiary-500 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500 sm:text-sm"
									disabled={!haveMessage}>Send Message</button
								>
							</div>
							<!-- </form> -->
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem class="bg-orange-100 font-medium">
						<svelte:fragment slot="summary">Individual Users - (email address)</svelte:fragment>
						<svelte:fragment slot="content">
							<!-- <form method="POST" class="card p-4 bg-orange-50" action="?/sendToEmailList"> -->
							<AutoCompleteSelect
								listData={data.emailList}
								placeholder="Select one or more Email Addresses"
								bind:selectedValues
							/>
							<div class="flex items-center justify-end">
								<p class="mr-2">Send this message to {messageContext} of the selected users</p>
								<button
									formaction="?/sendToEmailList"
									class="px-4 py-2 bg-tertiary-600 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500 sm:text-sm"
									disabled={selectedValues.length === 0}>Send Message</button
								>
							</div>
							<p>{selectedValues.length === 0}</p>
							<!-- </form> -->
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
				</form>
			</Accordion>
		{:else if tabSet === 1}
			<!-- <form method="POST" class="card p-4 bg-orange-50" action=""> -->
			<!-- <button
					type="submit"
					formaction="?/revokeMessages"
					class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
					disabled={isSelectionEmpty}
				>
					Revoke Selected
				</button> -->
			<!-- <button
					name="download_selected"
					type="button"
					class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
					disabled={isSelectionEmpty}
					on:click={() => currentMessages.downloadSelected()}
				>
					Download Selected
				</button> -->
			<!-- </form> -->
		{:else if tabSet === 2}
			<div class="card p-4 bg-orange-50">
				<!-- <div class="table-container">
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
				</button> -->
			</div>
		{/if}
	</svelte:fragment>
</TabGroup>
