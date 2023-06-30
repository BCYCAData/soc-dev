<script lang="ts">
	import { TabGroup } from '@skeletonlabs/skeleton';
	import { Tab } from '@skeletonlabs/skeleton';
	import NewUsersTable from '$components/form/tables/NewUsersTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	let tabSet: number = 0;

	export let data;

	$: ({ usersAdminNewUsersData } = data);

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

<TabGroup
	justify="justify-left"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded="rounded-tl-lg rounded-tr-lg"
	border=""
	class="w-full !space-y-0"
	regionList="bg-primary-200"
	regionPanel="variant-filled-primary p-2"
>
	<Tab bind:group={tabSet} name="tab1" value={0}>Review Answers</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>Something Else</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<NewUsersTable {newUserColumns} {usersAdminNewUsersData} />
		{:else if tabSet === 1}
			<div>Okay</div>
		{/if}
	</svelte:fragment>
</TabGroup>
