<script lang="ts">
	import { setContext } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { getTimestamp } from '$lib/utils';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	export let appMessagesColumns: any[], appMessagesData: any[];
	export let selectedIDs: string[] = [];
	export let isSelectionEmpty = true;
	export let selectedRows: any[];
	export let downloadFileName: string;

	let table: Tabulator;

	function createMessageTable(node: HTMLElement) {
		table = new Tabulator(node, {
			columns: appMessagesColumns,
			data: appMessagesData,
			layout: 'fitColumns',
			responsiveLayout: 'collapse',
			pagination: true,
			paginationSize: 20,
			paginationSizeSelector: [10, 20, 50],
			movableColumns: true,
			paginationCounter: 'pages'
		});
		table.setFilter('message', 'like', '');
		table.on('rowSelectionChanged', () => {
			const selectedData = table.getSelectedData();
			isSelectionEmpty = selectedData.length === 0;
			selectedRows = selectedData;
			selectedIDs = selectedData.map((row) => row.id.toString());
		});
		setContext('messageTable', table);
	}

	export function downloadSelected() {
		table.download('csv', `${downloadFileName}_${getTimestamp()}.csv`);
	}
</script>

<div use:createMessageTable />
<div class="flex justify-end">
	<button
		type="button"
		class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
		disabled={isSelectionEmpty}
		on:click={downloadSelected}
	>
		Download Selected
	</button>
</div>
