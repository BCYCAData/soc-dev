<script lang="ts">
	import TabulatorTable from '$components/form/tables/TabulatorTable.svelte';
	import TabulatorTableSearch from '$components/form/tables/TabulatorTableSearch.svelte';

	import type { ComparisonOption } from '$lib/types';

	interface Props {
		columns: any[];
		tableData: any[];
		isLoading?: boolean;
	}

	let { columns, tableData, isLoading = false }: Props = $props();

	const fieldOptions: ComparisonOption[] = [
		{ value: 'email', lable: 'Email' },
		{ lable: 'Name', value: 'name' },
		{ lable: 'Address', value: 'property_address' },
		{ lable: 'Created At', value: 'created_at' }
	];
</script>

<TabulatorTable
	{columns}
	{tableData}
	{isLoading}
	emptyStateTitle="No Community Requests"
	emptyStateMessage="There are currently no community membership requests"
	emptyStateIcon="users"
/>
<TabulatorTableSearch searchField="email" comparisonType="like" searchValue="" {fieldOptions} />
