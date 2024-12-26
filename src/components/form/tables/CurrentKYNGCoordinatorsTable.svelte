<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { CellComponent } from 'tabulator-tables';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	interface KYNGCoordinator {
		user_id: string;
		kyng: string;
		email: string;
		user_name: string;
		phone_number: string;
		kyng_area_id: string;
		start_date: string;
		end_date: string | null;
	}

	let { data } = $props<{
		data: {
			kyngCoordinators: KYNGCoordinator[];
		};
	}>();

	let table: Tabulator;
	let tableElement: HTMLElement;

	const activeCoordinators = data.kyngCoordinators.filter(
		(coord) => coord.kyng_area_id !== null && coord.end_date === null
	);

	console.log('kyngCoordinators', data.kyngCoordinators);

	onMount(() => {
		table = new Tabulator(tableElement, {
			data: activeCoordinators,
			columns: [
				{
					title: 'KYNG',
					field: 'kyng',
					sorter: 'string'
				},
				{
					title: 'Email',
					field: 'email',
					sorter: 'string'
				},
				{
					title: 'Name',
					field: 'user_name',
					sorter: 'string'
				},
				{
					title: 'Phone',
					field: 'phone_number',
					sorter: 'string'
				},
				{
					title: 'Start Date',
					field: 'start_date',
					sorter: 'datetime'
				},
				{
					title: 'End Date',
					field: 'end_date',
					sorter: 'datetime'
				},
				{
					title: 'Actions',
					formatter: function (cell: CellComponent) {
						const userId = cell.getRow().getData().user_id;
						const kyngAreaId = cell.getRow().getData().kyng_area_id;
						return `<form method="POST" action="?/revokeCoordinator" class="revoke-coordinator-form">
                            <input type="hidden" name="userId" value="${userId}" />
                            <input type="hidden" name="kyngAreaId" value="${kyngAreaId}" />
                            <button type="submit" class="text-red-600 hover:text-red-800">Revoke</button>
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

		setContext('coordinatorsTable', table);
	});
</script>

<div bind:this={tableElement}></div>
