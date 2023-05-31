<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// import 'tabulator-tables/dist/css/tabulator.css';
	// import './custom_tabulator.css';

	// tabulator-header
	// tabulator-col-title
	// tabulator-col-title
	// tabulator-row tabulator-selectable tabulator-row-even tabulator-selected

	export let columns: any[], tableData: any[];

	let tableComponent: HTMLElement;
	let table: Tabulator;

	function makeTable() {
		if (browser) {
			table = new Tabulator(tableComponent, {
				data: tableData,
				columns: columns,
				layout: 'fitDataFill',
				responsiveLayout: 'collapse',
				pagination: true,
				paginationSize: 20
			});
		}
	}

	onMount(() => {
		makeTable();
	});
</script>

<div bind:this={tableComponent} />
