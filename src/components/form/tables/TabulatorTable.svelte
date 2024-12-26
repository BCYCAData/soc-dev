<script lang="ts">
	import { setContext } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import './custom_tabulator.css';

	interface Props {
		columns: any[];
		tableData: any[];
		layout?: string;
		responsiveLayout?: string;
		pagination?: boolean;
		paginationSize?: number;
		initialSort?: { column: string; dir: 'asc' | 'desc' }[];
	}

	let {
		columns,
		tableData,
		layout = 'fitDataFill',
		responsiveLayout = 'collapse',
		pagination = true,
		paginationSize = 20,
		initialSort = []
	}: Props = $props();

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

<div use:createTabulatorTable></div>
