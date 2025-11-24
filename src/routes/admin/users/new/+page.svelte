<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import NewUsersTable from '$components/form/tables/NewUsersTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	let tabSet: string = $state('0');

	let { data } = $props();

	let { usersAdminNewUsersData } = $derived(data);

	let newUserColumns = [
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
		{ title: 'Landline', field: 'landline', contextPopup: 'Im a Popup' },
		{ title: 'Mobile', field: 'mobile' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		},
		{
			title: 'Unanswered',
			field: 'unanswered',
			tooltip: function (cell: CellComponent) {
				let el = document.createElement('div');
				el.style.backgroundColor = 'red';
				el.innerText = cell.getValue(); //return cells "field - value";
				return el;
			}
		}
	];
</script>

<svelte:head>
	<title>Users Admin-NewUsers</title>
</svelte:head>

<Tabs value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value={'0'}>Review Answers</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value={'1'}>Something Else</Tabs.Control
		>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="0">
			<NewUsersTable {newUserColumns} {usersAdminNewUsersData} />
		</Tabs.Panel>
		<Tabs.Panel value="1">
			<div>Okay</div>
		</Tabs.Panel>
	{/snippet}
</Tabs>
