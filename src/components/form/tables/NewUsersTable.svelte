<script lang="ts">
	// import { Tabulator } from 'tabulator-tables';
	import { Tabulator } from 'tabulator-tables';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';
	import { onMount } from 'svelte';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { ComparisonOption, TabulatorProps } from '$lib/types';

	export let newUserColumns: any[], usersAdminNewUsersData: any[];

	let tableComponent: HTMLElement;
	let table: Tabulator;

	const fieldOptions: ComparisonOption[] = [
		{ value: 'email', lable: 'Email' },
		{ lable: 'Name', value: 'name' },
		{ lable: 'Address', value: 'property_address' },
		{ lable: 'Landline', value: 'landline' },
		{ lable: 'Mobile', value: 'mobile' }
	];

	function makeTable() {
		const props: TabulatorProps = {
			columns: newUserColumns,
			data: usersAdminNewUsersData,
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

	async function emailDownloaded() {
		alert('Not Yet');
	}
</script>

<TabulatorTableSearch searchField="email" comparisonType="like" searchValue="" {fieldOptions} />
<div id="table_element" bind:this={tableComponent} />

<button
	class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-tertiary-400 hover:bg-orange-700 focus:outline-none"
	on:click={downloadSelected}
>
	Download Selected
</button>

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
