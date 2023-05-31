<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { ComparisonOption, TabulatorProps } from '$lib/types';
	import { getTimestamp } from '$lib/utils';

	export let appMessagesColumns: any[], appMessagesData: any[];
	export let selectedIDs: string[] = [];
	export let isSelectionEmpty = true;
	export let selectedRows: any[];
	export let downloadFileName: string;

	let tableComponent: HTMLElement;
	let table: Tabulator;

	const fieldOptions: ComparisonOption[] = [
		{ value: 'id', lable: 'ID' },
		{ value: 'context', lable: 'Context' },
		{ value: 'scope', lable: 'Scope' },
		{ value: 'message', lable: 'Message' },
		{ value: 'created_at', lable: 'Created' },
		{ value: 'revoked', lable: 'Revoked' }
	];

	function makeTable() {
		if (!browser || table) {
			return;
		}
		const props: TabulatorProps = {
			columns: appMessagesColumns,
			data: appMessagesData,
			layout: 'fitColumns',
			responsiveLayout: 'collapse',
			pagination: true,
			paginationSize: 20,
			paginationSizeSelector: [10, 20, 50],
			movableColumns: true,
			paginationCounter: 'pages'
		};
		table = new Tabulator(tableComponent, props);
		table.on('rowSelectionChanged', function (data, rows) {
			isSelectionEmpty = table.getSelectedData().length === 0;
			selectedRows = table.getSelectedData();
			selectedIDs = selectedRows.map((row) => row.id.toString());
		});
	}

	export function downloadSelected() {
		table.download('csv', `${downloadFileName}_${getTimestamp()}.csv`);
	}

	onMount(() => {
		makeTable();
	});
</script>

<TabulatorTableSearch
	{table}
	searchField="message"
	comparisonType="like"
	searchValue=""
	{fieldOptions}
/>
<div id="table_element" bind:this={tableComponent} />
<!-- <div class="flex justify-end">
	<button
		type="button"
		class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
		disabled={isSelectionEmpty}
		on:click={downloadSelected}
	>
		Download Selected
	</button>
</div> -->
