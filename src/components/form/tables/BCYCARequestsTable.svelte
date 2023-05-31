<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { ComparisonOption, TabulatorProps } from '$lib/types';

	export let bcycaRequestsColumns: any[], bcycaRequestsData: any[];

	let tableComponent: HTMLElement;
	let table: Tabulator;

	const fieldOptions: ComparisonOption[] = [
		{ value: 'email', lable: 'Email' },
		{ lable: 'Name', value: 'name' },
		{ lable: 'Address', value: 'property_address' },
		{ lable: 'Created At', value: 'created_at' }
	];

	function makeTable() {
		if (!browser || table) {
			return;
		}
		const props: TabulatorProps = {
			columns: bcycaRequestsColumns,
			data: bcycaRequestsData,
			layout: 'fitDataStretch',
			responsiveLayout: 'collapse',
			pagination: true,
			paginationSize: 20,
			paginationSizeSelector: [10, 20, 50],
			movableColumns: true,
			paginationCounter: 'pages'
		};
		table = new Tabulator(tableComponent, props);
	}

	onMount(() => {
		makeTable();
	});

	async function downloadSelected() {
		table.download('csv', 'data.csv');
	}
</script>

<TabulatorTableSearch
	{table}
	searchField="email"
	comparisonType="like"
	searchValue=""
	{fieldOptions}
/>
<div id="table_element" bind:this={tableComponent} />
<form on:submit|preventDefault={downloadSelected}>
	<button
		type="submit"
		class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
	>
		Download Selected
	</button>
</form>
