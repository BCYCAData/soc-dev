<script lang="ts">
	import MessagesTable from '$components/form/tables/MessagesTable.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	import type { ColumnDefinition } from 'tabulator-tables';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface MessagesTableComponent {
		downloadSelected: () => void;
		clearSelection: () => void;
	}

	interface Props {
		action: string;
		isSelectionEmpty: boolean;
		currentMessages?: MessagesTableComponent;
		appMessagesColumns: ColumnDefinition[];
		appMessagesData: any[];
	}

	let {
		action,
		isSelectionEmpty = $bindable(),
		currentMessages = $bindable(),
		appMessagesColumns,
		appMessagesData
	}: Props = $props();

	let selectedIDs: string[] = $state([]);
	let selectedRows: any[] = $state([]);
	let successMessage = $state('');
	let errorMessage = $state('');

	export function clearForm() {
		currentMessages?.clearSelection();
		isSelectionEmpty = true;
		successMessage = '';
		errorMessage = '';
	}

	export function setSuccessMessage(msg: string) {
		successMessage = msg;
	}

	export function setErrorMessage(msg: string) {
		errorMessage = msg;
	}

	const handleSubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				clearForm();
				setSuccessMessage('Message sent successfully!');
				await invalidateAll();
				await update();
			} else if (result.type === 'failure') {
				if (result.data?.message) {
					setErrorMessage(result.data.message);
				} else {
					setErrorMessage('Failed to send message. Please try again.');
				}
			}
		};
	};
</script>

<form method="POST" class="card bg-orange-50 p-4" {action} use:enhance={handleSubmit}>
	<div class="table-container">
		<MessagesTable
			{appMessagesColumns}
			{appMessagesData}
			bind:isSelectionEmpty
			bind:selectedIDs
			bind:selectedRows
			bind:this={currentMessages}
			downloadFileName="current_messages_report"
			showDownloadButton={false}
		/>
	</div>

	<div class="mt-4 flex justify-end gap-4">
		<input type="hidden" name="revoke_ids" value={selectedIDs.join(',')} />

		{#if successMessage}
			<div class="text-green-600">{successMessage}</div>
		{/if}

		{#if errorMessage}
			<div class="text-red-600">{errorMessage}</div>
		{/if}

		<button
			type="button"
			class="bg-tertiary-400 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isSelectionEmpty}
			onclick={() => currentMessages?.downloadSelected()}
		>
			Download Selected
		</button>

		<button
			type="submit"
			formaction="?/revokeMessages"
			class="bg-tertiary-400 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isSelectionEmpty}
		>
			Revoke Selected
		</button>
	</div>
</form>
