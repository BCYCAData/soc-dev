<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { getTimestamp } from '$lib/utility';

	import type { CellComponent } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	interface Props {
		appMessagesColumns: any[];
		appMessagesData: any[];
		selectedIDs?: string[];
		isSelectionEmpty?: boolean;
		selectedRows: any[];
		downloadFileName: string;
		showDownloadButton?: boolean;
	}

	let {
		appMessagesColumns,
		appMessagesData,
		//@ts-ignore
		selectedIDs = $bindable([]),
		isSelectionEmpty = $bindable(true),
		//@ts-ignore
		selectedRows = $bindable(),
		downloadFileName,
		showDownloadButton = true
	}: Props = $props();

	let table: Tabulator;
	let tableElement: HTMLElement;

	onMount(() => {
		table = new Tabulator(tableElement, {
			columns: [
				{
					formatter: 'rowSelection',
					titleFormatter: 'rowSelection',
					hozAlign: 'center',
					headerSort: false,
					width: 30
				},
				...appMessagesColumns.map((col) => {
					if (col.field === 'scope') {
						return {
							...col,
							formatter: (cell: CellComponent) => {
								const scope = cell.getValue();
								if (!scope) return 'All Users';
								return Object.values(scope).join(', ');
							}
						};
					}
					return col;
				})
			],
			data: appMessagesData,
			layout: 'fitColumns',
			responsiveLayout: 'collapse',
			pagination: true,
			paginationSize: 20,
			paginationSizeSelector: [10, 20, 50],
			movableColumns: true,
			paginationCounter: 'pages',
			selectableRows: true,
			selectableRowsRangeMode: 'click'
		});

		table.on('tableBuilt', function () {
			table.setFilter('message', 'like', '');
		});

		table.on('rowSelectionChanged', () => {
			const selectedData = table.getSelectedData();
			isSelectionEmpty = selectedData.length === 0;
			selectedRows = selectedData;
			selectedIDs = selectedData.map((row) => row.id.toString());
		});

		setContext('messageTable', table);
	});

	export function clearSelection() {
		table?.deselectRow();
	}

	export function downloadSelected() {
		// Get selected data and transform it
		const downloadData = table.getSelectedData().map((row) => ({
			id: row.id,
			message: row.message,
			context: row.context,
			scope: row.scope ? Object.values(row.scope).join(', ') : 'All Users',
			created_at: row.created_at,
			revoked: row.revoked
		}));

		// Update the main table temporarily with transformed data
		const originalData = table.getData();
		table.setData(downloadData);

		table.getColumns().forEach((column) => {
			const currentDefinition = column.getDefinition();
			column.updateDefinition({
				...currentDefinition,
				download: true
			});
		});

		table.download('csv', `${downloadFileName}_${getTimestamp()}.csv`, {
			delimiter: ',',
			bom: true
		});

		// Restore original data
		table.setData(originalData);
	}
</script>

<div bind:this={tableElement}></div>
{#if showDownloadButton}
	<div class="flex justify-end">
		<button
			type="button"
			class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isSelectionEmpty}
			onclick={downloadSelected}
		>
			Download Selected
		</button>
	</div>
{/if}
