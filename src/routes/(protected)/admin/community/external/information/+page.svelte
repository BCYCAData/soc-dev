<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsAccordionItem from '$components/form/CommunityRequestsAccordionItem.svelte';

	import type { PageData } from './$types';
	import type { CellComponent } from 'tabulator-tables';
	import type { ExternalInformationItem } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();

	let externalInformationColumns = [
		{ formatter: 'rownum', hozAlign: 'center', width: 40 },
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'Email', field: 'email' },
		{ title: 'Name', field: 'name' },
		{ title: 'Address', field: 'property_address' },
		{ title: 'Created At', field: 'created_at' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		}
	];
	let externalOtherInformationColumns = [
		{ formatter: 'rownum', hozAlign: 'center', width: 40 },
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'Email', field: 'email' },
		{ title: 'Name', field: 'name' },
		{ title: 'Address', field: 'property_address' },
		{ title: 'Other Information', field: 'other_information' },
		{ title: 'Created At', field: 'created_at' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		}
	];
</script>

<svelte:head>
	<title>External Community Admin-Events</title>
</svelte:head>

<!-- <Accordion autocollapse /> -->

<Accordion spaceY="space-y-1">
	<CommunityRequestsAccordionItem
		value={'1'}
		summary="Pre fire season checklist"
		choice={1}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'2'}
		summary="Lighting fires - facts and responsibilities"
		choice={2}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'3'}
		summary="Fire ready - pets and animals"
		choice={3}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'4'}
		summary="Fire ready - livestock & large animals"
		choice={4}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'5'}
		summary="External Leaflet"
		choice={5}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'6'}
		summary="How to be more active locally"
		choice={6}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'7'}
		summary="Strengthen Our Community Project report"
		choice={7}
		columns={externalInformationColumns}
		data={data?.externalInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'8'}
		summary="Other Information Requests"
		columns={externalOtherInformationColumns}
		data={data?.externalInformationData}
		dataFilter={(item: ExternalInformationItem): boolean => Boolean(item.other_information)}
	/>
	<!-- Repeat for other items -->
</Accordion>
