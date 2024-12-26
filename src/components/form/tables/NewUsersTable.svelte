<script lang="ts">
	import { Tabulator } from 'tabulator-tables';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';
	import { onMount } from 'svelte';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { ComparisonOption, TabulatorProps } from '$lib/types';

	interface Props {
		newUserColumns: any[];
		usersAdminNewUsersData: any[];
	}

	let { newUserColumns, usersAdminNewUsersData }: Props = $props();

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
		if (tableComponent) {
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
	}

	onMount(() => {
		makeTable();
	});

	async function downloadSelected() {
		const now = new Date();
		const timestamp = now.toISOString().replace(/[:.]/g, '-');
		const filename = `new_users_${timestamp}.csv`;
		table.download('csv', filename);
	}
</script>

<TabulatorTableSearch searchField="email" comparisonType="like" searchValue="" {fieldOptions} />
<div id="table_element" bind:this={tableComponent}></div>

<button
	class="mt-4 w-1/4 rounded-full bg-tertiary-400 py-2 text-center text-base hover:bg-orange-700 focus:outline-none"
	onclick={downloadSelected}
>
	Download Selected
</button>

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
