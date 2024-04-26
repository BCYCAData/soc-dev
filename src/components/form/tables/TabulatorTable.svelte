<script lang="ts">
	import { setContext } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import './custom_tabulator.css';

	export let columns: any[], tableData: any[];
	export let layout = 'fitDataFill';
	export let responsiveLayout = 'collapse';
	export let pagination = true;
	export let paginationSize = 20;
	export let initialSort: { column: string; dir: 'asc' | 'desc' }[] = [];

	function createTabulatorTable(node: HTMLElement) {
		let table = new Tabulator(node, {
			data: tableData,
			columns: columns,
			layout: layout as
				| 'fitDataFill'
				| 'fitData'
				| 'fitColumns'
				| 'fitDataStretch'
				| 'fitDataTable',
			responsiveLayout: responsiveLayout as 'collapse' | 'hide',
			pagination: pagination,
			paginationSize: paginationSize,
			initialSort: initialSort
		});
		setContext('tabulatorTable', table);
	}
</script>

<div use:createTabulatorTable />
