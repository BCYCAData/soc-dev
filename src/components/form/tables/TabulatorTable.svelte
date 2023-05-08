<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// import 'tabulator-tables/dist/css/tabulator.css';
	import './tabulator.css';

	// tabulator-header
	// tabulator-col-title
	// tabulator-col-title
	// tabulator-row tabulator-selectable tabulator-row-even tabulator-selected

	export let columns: any[], tableData: any[];

	let tableComponent: HTMLElement;
	let table: Tabulator;

	function makeTable(columns: any[], tableData: any[]) {
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
		makeTable(columns, tableData);
	});

	function beforeUpdate() {
		if (!table) {
			makeTable(columns, tableData);
		}
	}
</script>

<div bind:this={tableComponent} />

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
