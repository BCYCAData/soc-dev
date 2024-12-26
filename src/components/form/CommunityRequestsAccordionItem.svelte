<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	interface Props {
		value: string;
		summary: string;
		choice?: number;
		columns: any[];
		data: any[];
		dataFilter?: (item: any) => boolean;
	}

	let { value, summary, choice = 0, columns, data, dataFilter = () => true }: Props = $props();

	function getFilteredData(): any[] {
		let standardFilteredData =
			data?.filter((item) => item.informatiion_choices?.includes(choice)) ?? [];

		if (dataFilter) {
			standardFilteredData = data.filter(dataFilter);
		}
		return standardFilteredData;
	}
</script>

<Accordion.Item controlClasses="bg-amber-100 font-medium" {value}>
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
