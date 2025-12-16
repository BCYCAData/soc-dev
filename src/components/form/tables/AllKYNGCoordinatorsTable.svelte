<script lang="ts">
	import { setContext } from 'svelte';
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
		updated_at: string;
		end_date: string | null;
		admin_email: string;
		admin_user_id: string;
	}

	let { data } = $props<{
		data: {
			kyngCoordinators: KYNGCoordinator[];
		};
	}>();

	let table: Tabulator;
	let tableElement: HTMLElement = $state()!;
	let isLoading = $state(false);

	const allCoordinators = $derived(
		data.kyngCoordinators.filter(
			(isKYNGCoordinator: KYNGCoordinator) => isKYNGCoordinator.kyng_area_id !== null
		)
	);

	$effect(() => {
		if (tableElement && !table) {
			createTable();
		} else if (table) {
			table.setData(allCoordinators);
		}
	});

	function createTable() {
		table = new Tabulator(tableElement, {
			data: allCoordinators,
			rowFormatter: function (row) {
				const data = row.getData();
				if (data.end_date !== null) {
					const cells = row.getCells();
					cells.forEach((cell) => {
						cell.getElement().style.color = '#F97316';
					});
				}
			},
			columns: [
				{
					title: 'KYNG',
					field: 'kyng',
					sorter: 'string',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Email',
					field: 'email',
					sorter: 'string',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Name',
					field: 'user_name',
					sorter: 'string',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Phone',
					field: 'phone_number',
					sorter: 'string',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Start Date',
					field: 'start_date',
					sorter: 'datetime',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Last Updated',
					field: 'updated_at',
					sorter: 'datetime',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Updated By',
					field: 'admin_email',
					sorter: 'string',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'End Date',
					field: 'end_date',
					sorter: 'datetime',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				}
			],
			layout: 'fitColumns',
			pagination: true,
			paginationSize: 10,
			paginationSizeSelector: [5, 10, 20],
			movableColumns: true
		});

		setContext('allCoordinatorsTable', table);
	}
</script>

{#if isLoading}
	<div class="flex items-center justify-center p-8">
		<div
			class="text-surface-600 dark:text-surface-400"
			role="status"
			aria-label="Loading coordinators"
		>
			Loading coordinators...
		</div>
	</div>
{:else if allCoordinators.length === 0}
	<div
		class="border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800 border p-8 text-center shadow-sm"
		style="border-radius: var(--radius-container, 0.75rem);"
		role="status"
	>
		<div class="text-tertiary-400 dark:text-tertiary-600 mb-3">
			<svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		</div>
		<h3
			class="text-surface-900 dark:text-surface-100 mb-1 text-lg font-semibold"
			style="font-family: var(--heading-font-family, 'Raleway', sans-serif);"
		>
			No Coordinator History
		</h3>
		<p class="text-surface-600 dark:text-surface-400 text-sm">
			No coordinator assignments have been made yet
		</p>
	</div>
{:else}
	<div bind:this={tableElement}></div>
{/if}
