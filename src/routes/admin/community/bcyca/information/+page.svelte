<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsAccordionItem from '$components/form/CommunityRequestsAccordionItem.svelte';

	import type { PageData } from './$types';
	import type { CellComponent } from 'tabulator-tables';
	import type { BCYCAInformationItem } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();

	let bcycaInformationColumns = [
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
	let bcycaOtherInformationColumns = [
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
	<title>BCYCA Admin-Events</title>
</svelte:head>

<!-- <Accordion autocollapse /> -->

<Accordion spaceY="space-y-1">
	<CommunityRequestsAccordionItem
		value={'1'}
		summary="Pre fire season checklist"
		choice={1}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'2'}
		summary="Lighting fires - facts and responsibilities"
		choice={2}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'3'}
		summary="Fire ready - pets and animals"
		choice={3}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'4'}
		summary="Fire ready - livestock & large animals"
		choice={4}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'5'}
		summary="BCYCA Leaflet"
		choice={5}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'6'}
		summary="How to be more active locally"
		choice={6}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'7'}
		summary="Strengthen Our Community Project report"
		choice={7}
		columns={bcycaInformationColumns}
		data={data?.bcycaInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'8'}
		summary="Other Information Requests"
		columns={bcycaOtherInformationColumns}
		data={data?.bcycaInformationData}
		dataFilter={(item: BCYCAInformationItem): boolean => Boolean(item.other_information)}
	/>
	<!-- Repeat for other items -->
</Accordion>
