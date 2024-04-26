<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import CommunityRequestsTable from '$components/form/tables/CommunityRequestsTable.svelte';

	export let summary: string;
	export let choice: number = 0;
	export let columns: any[];
	export let data: any[];
	export let dataFilter: (item: any) => boolean = () => true; // Default to no filtering

	function getFilteredData(): any[] {
		// Apply the standard filtering based on the choice value
		let standardFilteredData =
			data?.filter((item) => item.informatiion_choices?.includes(choice)) ?? [];

		// If a custom filter function is provided, apply it to the already filtered data
		if (dataFilter) {
			console.log('dataFilter', dataFilter);
			standardFilteredData = data.filter(dataFilter);
		}
		return standardFilteredData;
	}
</script>

<AccordionItem class="bg-orange-100 font-medium">
	<svelte:fragment slot="summary">{summary}</svelte:fragment>
	<svelte:fragment slot="content">
		{#if getFilteredData().length > 0}
			<div class="table-container">
				<CommunityRequestsTable {columns} tableData={getFilteredData()} />
			</div>
		{:else}
			<p>No outstanding requests</p>
		{/if}
	</svelte:fragment>
</AccordionItem>
