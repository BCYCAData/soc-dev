<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	import type { ColumnDefinition } from 'tabulator-tables';
	import type { CommunityInformationItem } from '$lib/types';

	interface Props {
		value: string;
		summary: string;
		choice?: number;
		// Partial: Tabulator's @types mark `title` required, but formatter-only
		// columns (rownum/rowSelection/responsiveCollapse) legitimately omit it.
		columns: Partial<ColumnDefinition>[];
		data: CommunityInformationItem[] | null;
		dataFilter?: (item: CommunityInformationItem) => boolean;
	}

	let { value, summary, choice = 0, columns, data, dataFilter }: Props = $props();

	function getFilteredData(): CommunityInformationItem[] {
		const rows = data ?? [];
		// When an explicit dataFilter is supplied (e.g. the "Other Information" item)
		// use it; otherwise filter rows by the information-sheet choice.
		return dataFilter
			? rows.filter(dataFilter)
			: rows.filter((item) => item.informatiion_choices?.includes(choice));
	}
</script>

<Accordion.Item controlClasses="bg-secondary-100-900 font-medium" {value}>
	{#snippet control()}{summary}{/snippet}
	{#snippet panel()}
		{#if getFilteredData().length > 0}
			<div class="table-container">
				<CommunityRequestsTable {columns} tableData={getFilteredData()} />
			</div>
		{:else}
			<p>No outstanding requests</p>
		{/if}
	{/snippet}
</Accordion.Item>
