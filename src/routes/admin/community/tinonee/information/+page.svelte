<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CommunityRequestsAccordionItem from '$components/form/CommunityRequestsAccordionItem.svelte';

	import type { PageData } from './$types';
	import type { CellComponent } from 'tabulator-tables';
	import type { TinoneeInformationItem } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();

	let tinoneeInformationColumns = [
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
	let tinoneeOtherInformationColumns = [
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
	<title>Tinonee Community Admin-Events</title>
</svelte:head>

<!-- <Accordion autocollapse /> -->

<Accordion spaceY="space-y-1">
	<CommunityRequestsAccordionItem
		value={'1'}
		summary="Pre fire season checklist"
		choice={1}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'2'}
		summary="Lighting fires - facts and responsibilities"
		choice={2}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'3'}
		summary="Fire ready - pets and animals"
		choice={3}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'4'}
		summary="Fire ready - livestock & large animals"
		choice={4}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'5'}
		summary="Tinonee Leaflet"
		choice={5}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'6'}
		summary="How to be more active locally"
		choice={6}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'7'}
		summary="Strengthen Our Community Project report"
		choice={7}
		columns={tinoneeInformationColumns}
		data={data?.tinoneeInformationData}
	/>
	<CommunityRequestsAccordionItem
		value={'8'}
		summary="Other Information Requests"
		columns={tinoneeOtherInformationColumns}
		data={data?.tinoneeInformationData}
		dataFilter={(item: TinoneeInformationItem): boolean => Boolean(item.other_information)}
	/>
	<!-- Repeat for other items -->
</Accordion>
