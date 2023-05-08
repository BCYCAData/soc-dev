<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// import 'tabulator-tables/dist/css/tabulator.css';
	import './tabulator.css';

	export let newUserColumns: any[], usersAdminNewUsersData: any[];

	interface TabulatorProps {
		columns: any[];
		data: any[];
		layout:
			| 'fitDataFill'
			| 'fitData'
			| 'fitColumns'
			| 'fitDataStretch'
			| 'fitDataTable'
			| undefined;
		responsiveLayout?: boolean | 'collapse' | 'hide';
		pagination?: boolean;
		paginationSize?: number;
		// add other properties as needed
	}

	let tableComponent: HTMLElement;
	let table: Tabulator;

	function makeTable(newUserColumns: any[], usersAdminNewUsersData: any[]) {
		if (!browser || table) {
			return;
		}
		const props: TabulatorProps = {
			columns: newUserColumns,
			data: usersAdminNewUsersData,
			layout: 'fitDataStretch',
			responsiveLayout: 'collapse',
			pagination: true,
			paginationSize: 10
		};
		table = new Tabulator(tableComponent, props);
	}

	onMount(() => {
		makeTable(newUserColumns, usersAdminNewUsersData);
	});

	async function downloadSelected() {
		table.download('csv', 'data.csv');
	}
</script>

<div bind:this={tableComponent} />
<form on:submit|preventDefault={downloadSelected}>
	<button
		type="submit"
		class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none"
	>
		Download Selected
	</button>
</form>
<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
