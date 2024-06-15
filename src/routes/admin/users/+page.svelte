<script lang="ts">
	import TabulatorTable from '$components/form/tables/TabulatorTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	let columns = [
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
		{ title: 'Unanswered', field: 'unanswered' }
	];

	export let data;
	let tableData = data.usersAdminNewUsersData;
</script>

<svelte:head>
	<title>Users Administration</title>
</svelte:head>
<div>
	<h1>This will probably contain information about how to use the contained pages</h1>
</div>

<TabulatorTable {columns} {tableData} />
