<script lang="ts">
	import TabulatorTable from '$components/form/tables/TabulatorTable.svelte';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';

	import type { ComparisonOption, TabulatorProps } from '$lib/types';

	export let columns: any[], tableData: any[];

	const fieldOptions: ComparisonOption[] = [
		{ value: 'email', lable: 'Email' },
		{ lable: 'Name', value: 'name' },
		{ lable: 'Address', value: 'property_address' },
		{ lable: 'Created At', value: 'created_at' }
	];
</script>

<TabulatorTableSearch searchField="email" comparisonType="like" searchValue="" {fieldOptions} />
<TabulatorTable {columns} {tableData} />
