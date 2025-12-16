<script lang="ts">
	import { setContext } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import './custom_tabulator.css';
	import TableSkeleton from '$components/page/TableSkeleton.svelte';
	import EmptyState from '$components/page/EmptyState.svelte';

	interface Props {
		columns: any[];
		tableData: any[];
		layout?: string;
		responsiveLayout?: string;
		pagination?: boolean;
		paginationSize?: number;
		initialSort?: { column: string; dir: 'asc' | 'desc' }[];
		isLoading?: boolean;
		emptyStateTitle?: string;
		emptyStateMessage?: string;
		emptyStateIcon?: 'inbox' | 'search' | 'filter' | 'users' | 'database';
		emptyStateAction?: { label: string; onClick: () => void } | null;
	}

	let {
		columns,
		tableData,
		layout = 'fitDataFill',
		responsiveLayout = 'collapse',
		pagination = true,
		paginationSize = 20,
		initialSort = [],
		isLoading = false,
		emptyStateTitle = 'No data found',
		emptyStateMessage = 'There are no records to display',
		emptyStateIcon = 'inbox',
		emptyStateAction = null
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

{#if isLoading}
	<TableSkeleton rows={5} columns={columns.length} />
{:else if tableData.length === 0}
	<EmptyState
		title={emptyStateTitle}
		message={emptyStateMessage}
		icon={emptyStateIcon}
		actionLabel={emptyStateAction?.label}
		onAction={emptyStateAction?.onClick}
	/>
{:else}
	<div use:createTabulatorTable></div>
{/if}
