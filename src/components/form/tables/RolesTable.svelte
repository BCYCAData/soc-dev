<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { CellComponent } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	interface Role {
		id: bigint;
		email: string;
		role: string;
	}

	let { data } = $props<{
		data: {
			siteRoles: Role[];
		};
	}>();

	let table: Tabulator;
	let tableElement: HTMLElement;

	const filteredRoles = data.siteRoles.filter((role: { role: string }) => role.role !== 'user');

	onMount(() => {
		table = new Tabulator(tableElement, {
			data: filteredRoles,
			columns: [
				{
					title: 'User',
					field: 'email',
					sorter: 'string'
				},
				{
					title: 'Role',
					field: 'role',
					sorter: 'string'
				},
				{
					title: 'Actions',
					formatter: function (cell: CellComponent) {
						const roleId = cell.getRow().getData().id;
						return `<form method="POST" action="?/removeRole" class="remove-role-form">
                            <input type="hidden" name="roleId" value="${roleId}" />
                            <button type="submit" class="text-red-600 hover:text-red-800">Remove</button>
                        </form>`;
					},
					width: 100,
					hozAlign: 'center'
				}
			],
			layout: 'fitColumns',
			pagination: true,
			paginationSize: 10,
			paginationSizeSelector: [5, 10, 20],
			movableColumns: true
		});

		setContext('rolesTable', table);
	});
</script>

<div bind:this={tableElement}></div>
