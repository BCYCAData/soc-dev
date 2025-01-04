<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';

	import type { CellComponent, Options } from 'tabulator-tables';
	import type { CustomAddress } from '$lib/form.types';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	interface Props {
		customAddresses: CustomAddress[];
		onAddressEdit: (address: CustomAddress) => void;
	}

	let { customAddresses, onAddressEdit }: Props = $props();

	let table: Tabulator;
	let tableElement: HTMLElement;

	onMount(() => {
		const options: Options = {
			data: customAddresses,
			columns: [
				{
					title: 'ID',
					field: 'id',
					sorter: 'number',
					editor: undefined
				},
				{
					title: 'Address',
					field: 'address',
					sorter: 'string',
					editor: 'input',
					validator: 'required',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Suburb',
					field: 'suburb',
					sorter: 'string',
					editor: 'input',
					validator: 'required',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Postcode',
					field: 'postcode',
					sorter: 'string',
					editor: 'input',
					validator: 'required',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Community',
					field: 'community',
					sorter: 'string',
					editor: 'input',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'KYNG',
					field: 'kyng',
					sorter: 'string',
					editor: 'input',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Principal Address Site OID',
					field: 'principaladdresssiteoid',
					sorter: 'number',
					editor: 'input',
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Start Date',
					field: 'startdate',
					sorter: 'datetime',
					editor: undefined,
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'End Date',
					field: 'enddate',
					sorter: 'datetime',
					editor: undefined,
					tooltip: function (e: MouseEvent, cell: CellComponent) {
						const content = cell.getValue();
						const element = cell.getElement();
						return element.scrollWidth > element.clientWidth ? content : '';
					}
				},
				{
					title: 'Last Updated',
					field: 'last_updated',
					sorter: 'datetime',
					editor: undefined,
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
		};
		table = new Tabulator(tableElement, options);

		table.on('cellEdited', function (cell: CellComponent) {
			const row = cell.getRow();
			const data = row.getData() as CustomAddress;
			onAddressEdit(data);
		});

		setContext('customAddressesTable', table);
	});
</script>

<div bind:this={tableElement}></div>
