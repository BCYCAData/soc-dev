<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic table/API data */
	import { invalidateAll } from '$app/navigation';

	import TabulatorTable from '$components/form/tables/TabulatorTable.svelte';
	import { toastStore } from '$stores/toaststore';

	import 'tabulator-tables/dist/css/tabulator.css';
	import '$components/form/tables/custom_tabulator.css';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Delivery date applied when a row's "Mark delivered" button is clicked.
	let kitDate = $state(new Date().toISOString().slice(0, 10));
	let isSaving = $state(false);

	async function markDelivered(userId: string) {
		if (isSaving) return;
		isSaving = true;
		const body = new FormData();
		body.set('user_ids', userId);
		body.set('kit_date', kitDate);
		try {
			const response = await fetch('?/markDelivered', { method: 'POST', body });
			if (response.ok) {
				toastStore.success('Kit marked as delivered.');
				await invalidateAll();
			} else {
				toastStore.error('Could not record the kit delivery. Please try again.');
			}
		} catch (err) {
			console.error('Error marking kit delivered:', err);
			toastStore.error('Could not record the kit delivery. Please check your connection.');
		} finally {
			isSaving = false;
		}
	}

	const columns: any[] = [
		{ title: 'Email', field: 'email', minWidth: 180 },
		{
			title: 'Name',
			field: 'first_name',
			minWidth: 140,
			formatter: (cell: any) => {
				const row = cell.getRow().getData();
				return [row.first_name, row.family_name].filter(Boolean).join(' ') || 'Not provided';
			}
		},
		{
			title: 'Address',
			field: 'property_address_street',
			minWidth: 200,
			formatter: (cell: any) => {
				const row = cell.getRow().getData();
				return [row.property_address_street, row.property_address_suburb]
					.filter(Boolean)
					.join(', ');
			}
		},
		{
			title: 'Confirmed',
			field: 'email_confirmed_at',
			minWidth: 110,
			formatter: (cell: any) => {
				const value = cell.getValue();
				return value ? new Date(value).toLocaleDateString() : '';
			}
		},
		{ title: 'Landline', field: 'landline', minWidth: 110 },
		{ title: 'Mobile', field: 'mobile', minWidth: 110 },
		{ title: 'Unanswered Questions', field: 'unanswered', minWidth: 220 },
		{
			title: '',
			field: 'id',
			hozAlign: 'center',
			headerSort: false,
			minWidth: 140,
			formatter: () =>
				'<button type="button" class="btn btn-sm preset-filled-primary-500">Mark delivered</button>',
			cellClick: (_e: any, cell: any) => markDelivered(cell.getRow().getData().id)
		}
	];
</script>

<svelte:head>
	<title>Users Admin-Kits</title>
</svelte:head>

<div class="mx-auto flex w-full flex-col px-4 py-2">
	<div class="bg-secondary-300 text-secondary-900 mb-2 rounded-lg p-3">
		<h3 class="mb-1 font-semibold">Kits Delivered</h3>
		<p class="mb-2">
			Confirmed users who have not yet received their welcome kit. Marking a user removes them from
			this list.
		</p>
		<label class="flex items-center gap-2 text-sm">
			Delivery date to record:
			<input
				type="date"
				bind:value={kitDate}
				class="border-secondary-700 bg-secondary-50 rounded border py-1"
			/>
		</label>
	</div>

	{#key data.usersAwaitingKits}
		<TabulatorTable
			{columns}
			tableData={data.usersAwaitingKits}
			layout="fitDataStretch"
			paginationSize={20}
			emptyStateTitle="No Kits Outstanding"
			emptyStateMessage="Every confirmed user has received their welcome kit."
			emptyStateIcon="users"
		/>
	{/key}
</div>
