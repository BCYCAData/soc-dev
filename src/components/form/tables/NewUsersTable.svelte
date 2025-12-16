<script lang="ts">
	import { Tabulator } from 'tabulator-tables';
	import TabulatorTable from '$components/form/tables/TabulatorTable.svelte';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';
	import { onMount, getContext } from 'svelte';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { ComparisonOption } from '$lib/types';

	interface Props {
		newUserColumns: any[];
		usersAdminNewUsersData: any[];
		isLoading?: boolean;
	}

	let { newUserColumns, usersAdminNewUsersData, isLoading = false }: Props = $props();

	let table: Tabulator | undefined = $state();

	const fieldOptions: ComparisonOption[] = [
		{ value: 'email', lable: 'Email' },
		{ lable: 'Name', value: 'name' },
		{ lable: 'Address', value: 'property_address' },
		{ lable: 'Landline', value: 'landline' },
		{ lable: 'Mobile', value: 'mobile' }
	];

	onMount(() => {
		// Get table context after TabulatorTable mounts
		setTimeout(() => {
			table = getContext('tabulatorTable');
		}, 100);
	});

	async function downloadSelected() {
		if (!table) return;
		const now = new Date();
		const timestamp = now.toISOString().replace(/[:.]/g, '-');
		const filename = `new_users_${timestamp}.csv`;
		table.download('csv', filename);
	}
</script>

<TabulatorTable
	columns={newUserColumns}
	tableData={usersAdminNewUsersData}
	{isLoading}
	layout="fitDataStretch"
	paginationSize={20}
	emptyStateTitle="No New Users"
	emptyStateMessage="There are currently no new user signups to review"
	emptyStateIcon="users"
/>

<TabulatorTableSearch searchField="email" comparisonType="like" searchValue="" {fieldOptions} />

<button
	class="bg-tertiary-400 mt-4 w-1/4 rounded-full py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
	onclick={downloadSelected}
	disabled={!table || isLoading}
>
	Download Selected
</button>

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
