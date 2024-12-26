<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion, Tabs } from '@skeletonlabs/skeleton-svelte';

	// Component imports
	import AllUsersPanel from '$components/form/panels/AllUsersPanel.svelte';
	import IndividualUsersPanel from '$components/form/panels/IndividualUsersPanel.svelte';
	import LocationBasedSelectors from '$components/form/inputs/LocationBasedSelectors.svelte';
	import MessagesActionPanel from '$components/form/panels/MessagesActionPanel.svelte';
	import RevokedMessagesPanel from '$components/form/panels/RevokedMessagesPanel.svelte';

	import type { PageData } from './$types';
	import type { ColumnDefinition } from 'tabulator-tables';

	// Types
	interface Props {
		data: PageData;
	}

	interface AppMessage {
		id: number;
		message: string;
		context: string;
		scope: string;
		created_at: string;
		revoked: boolean;
	}

	type TabValue = 'add_messages' | 'current_messages' | 'revoked_messages';
	type MessageContext = 'users' | 'admins' | 'both';

	// Props
	let { data }: Props = $props();

	// State Management
	let tabSet = $state<TabValue>('add_messages');
	let message = $state('');
	let messageContext = $state<MessageContext>('both');
	//@ts-ignore
	let haveMessage = $state(false);
	let selectedValues: string[] = $state([]);
	let selectedIDs: string[] = $state([]);
	let selectedRows: any[] = $state([]);
	let isSelectionEmpty = $state(true);

	// Derived values
	let revokedMessagesData = $derived(data.appMessages.filter((item: AppMessage) => item.revoked));

	// Column definitions
	const appMessagesColumns: ColumnDefinition[] = [
		{ title: 'ID', field: 'id', sorter: 'number', width: 60 },
		{ title: 'Message', field: 'message', sorter: 'string', width: 300 },
		{ title: 'Context', field: 'context', sorter: 'string', width: 100 },
		{ title: 'Scope', field: 'scope', sorter: 'string', width: 100 },
		{ title: 'Created', field: 'created_at', sorter: 'datetime', width: 150 },
		{ title: 'Revoked', field: 'revoked', sorter: 'datetime', width: 150 }
	];

	// Effects
	$effect(() => {
		const words = message.trim().split(/\s+/);
		haveMessage = message.length > 4 && words.length > 1;
	});

	$effect(() => {
		if (tabSet !== 'add_messages') {
			isSelectionEmpty = true;
		}
	});

	let individualUsersPanel: any = $state(null);
	let allUsersPanel: any = $state(null);
	//@ts-ignore
	let currentMessages = $state();
	//@ts-ignore
	let revokedMessages = $state();

	const handleSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				individualUsersPanel?.clearForm();
				allUsersPanel?.clearForm();
				if (result.data?.message) {
					individualUsersPanel?.setSuccessMessage(result.data.message);
					allUsersPanel?.setSuccessMessage(result.data.message);
				} else {
					individualUsersPanel?.setSuccessMessage('Message sent successfully!');
					allUsersPanel?.setSuccessMessage('Message sent successfully!');
				}
				await invalidateAll();
				await update();
			} else if (result.type === 'failure') {
				if (result.data?.message) {
					individualUsersPanel?.setErrorMessage(result.data.message);
					allUsersPanel?.setErrorMessage(result.data.message);
				} else {
					individualUsersPanel?.setErrorMessage('Failed to send message. Please try again.');
					allUsersPanel?.setErrorMessage('Failed to send message. Please try again.');
				}
			}
		};
	};
</script>

<svelte:head>
	<title>Site Messages</title>
</svelte:head>

<Tabs bind:value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="add_messages"
		>
			Add Messages
		</Tabs.Control>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="current_messages"
		>
			Current Messages
		</Tabs.Control>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="revoked_messages"
		>
			Revoked Messages
		</Tabs.Control>
	{/snippet}

	{#snippet content()}
		<Tabs.Panel value="add_messages">
			<Accordion collapsible={true} spaceY="space-y-1">
				<Accordion.Item value="0" classes="bg-orange-100 font-medium">
					{#snippet control()}All Users{/snippet}
					{#snippet panel()}
						<form
							method="POST"
							class="card bg-orange-50 p-4"
							action="?/sendMessageToAllUsers"
							use:enhance={handleSubmit}
						>
							<AllUsersPanel {message} {messageContext} bind:this={allUsersPanel} />
						</form>
					{/snippet}
				</Accordion.Item>

				<Accordion.Item value="1" classes="bg-orange-100 font-medium">
					{#snippet control()}Individual Users{/snippet}
					{#snippet panel()}
						<form
							method="POST"
							class="card bg-orange-50 p-4"
							action="?/sendMessageToEmailList"
							use:enhance={handleSubmit}
						>
							<IndividualUsersPanel
								emailList={data.emailList}
								{message}
								bind:selectedValues
								bind:this={individualUsersPanel}
							/>
						</form>
					{/snippet}
				</Accordion.Item>

				<LocationBasedSelectors {data} bind:selectedValues />
			</Accordion>
		</Tabs.Panel>

		<Tabs.Panel value="current_messages">
			<MessagesActionPanel
				{appMessagesColumns}
				appMessagesData={data.appMessages}
				action="?/revokeMessages"
				bind:isSelectionEmpty
				bind:this={currentMessages}
			/>
		</Tabs.Panel>

		<Tabs.Panel value="revoked_messages">
			<RevokedMessagesPanel
				{appMessagesColumns}
				appMessagesData={revokedMessagesData}
				bind:isSelectionEmpty
				bind:selectedIDs
				bind:selectedRows
				bind:this={revokedMessages}
			/>
		</Tabs.Panel>
	{/snippet}
</Tabs>

<style lang="postcss">
	:global(.tabulator) {
		@apply font-sans;
	}

	:global(.tabulator-row.tabulator-selected) {
		@apply bg-orange-100;
	}
</style>
