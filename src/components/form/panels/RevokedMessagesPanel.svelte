<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic form/table/API/map data */
	import type { ColumnDefinition } from 'tabulator-tables';
	import MessagesTable from '$components/form/tables/MessagesTable.svelte';

	interface MessagesTableComponent {
		downloadSelected: () => void;
	}

	interface Props {
		appMessagesColumns: ColumnDefinition[];
		appMessagesData: any[];
		isSelectionEmpty: boolean;
		selectedIDs: string[];
		selectedRows: any[];
		messagesTable?: MessagesTableComponent;
	}

	let {
		appMessagesColumns,
		appMessagesData,
		isSelectionEmpty = $bindable(),
		selectedIDs = $bindable(),
		selectedRows = $bindable(),
		messagesTable = $bindable()
	}: Props = $props();
</script>

<div class="card bg-secondary-50 p-4">
	<div class="table-container">
		<MessagesTable
			{appMessagesColumns}
			{appMessagesData}
			bind:isSelectionEmpty
			bind:selectedIDs
			bind:selectedRows
			bind:this={messagesTable}
			downloadFileName="revoked_messages_report"
		/>
	</div>
</div>
