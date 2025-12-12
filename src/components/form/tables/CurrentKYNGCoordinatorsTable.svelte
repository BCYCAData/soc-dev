<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { CellComponent } from 'tabulator-tables';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$stores/toaststore';
	import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

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
	let tableElement: HTMLElement;
	let showRevokeConfirm = $state(false);
	let coordinatorToRevoke = $state<{ kyng: string; user_name: string; email: string } | null>(null);
	let pendingForm = $state<HTMLFormElement | null>(null);

	const activeCoordinators = $derived(
		data.kyngCoordinators.filter(
			(isKYNGCoordinator: KYNGCoordinator) =>
				isKYNGCoordinator.kyng_area_id !== null && isKYNGCoordinator.end_date === null
		)
	);

	async function handleConfirmRevoke() {
		if (!pendingForm || !coordinatorToRevoke) return;

		const btn = pendingForm.querySelector('.revoke-coordinator-btn') as HTMLButtonElement;
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'Revoking...';
		}

		try {
			const formData = new FormData(pendingForm);
			const response = await fetch(pendingForm.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success(`Coordinator access revoked for ${coordinatorToRevoke.user_name || coordinatorToRevoke.email} successfully`);
				await invalidateAll();
			} else {
				toast.error('Failed to revoke coordinator. Please try again.');
			}
		} catch (error) {
			toast.error('Failed to revoke coordinator. Please try again.');
		} finally {
			showRevokeConfirm = false;
			pendingForm = null;
			coordinatorToRevoke = null;
		}
	}

	onMount(() => {
		table = new Tabulator(tableElement, {
			data: activeCoordinators,
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
					title: 'Actions',
					formatter: function (cell: CellComponent) {
						const rowData = cell.getRow().getData();
						const userId = rowData.user_id;
						const kyngAreaId = rowData.kyng_area_id;
						const kyng = rowData.kyng;
						const userName = rowData.user_name;
						const email = rowData.email;
						return `<form method="POST" action="?/revokeCoordinator" class="revoke-coordinator-form" data-kyng="${kyng}" data-name="${userName}" data-email="${email}">
                        <input type="hidden" name="userId" value="${userId}" />
                        <input type="hidden" name="kyngAreaId" value="${kyngAreaId}" />
                        <button type="button" class="revoke-coordinator-btn text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed">Revoke</button>
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

		// Add event delegation for revoke buttons
		tableElement.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('revoke-coordinator-btn')) {
				e.preventDefault();
				const form = target.closest('form') as HTMLFormElement;
				const kyng = form.dataset.kyng || '';
				const userName = form.dataset.name || '';
				const email = form.dataset.email || '';

				coordinatorToRevoke = { kyng, user_name: userName, email };
				pendingForm = form;
				showRevokeConfirm = true;
			}
		});
	});
</script>

<div bind:this={tableElement}></div>

<ConfirmDialogue
	bind:open={showRevokeConfirm}
	title="Revoke KYNG Coordinator"
	message={`Are you sure you want to revoke ${coordinatorToRevoke?.user_name || coordinatorToRevoke?.email} as coordinator for ${coordinatorToRevoke?.kyng}?`}
	confirmText="Revoke Coordinator"
	variant="danger"
	onConfirm={handleConfirmRevoke}
	onCancel={() => {
		showRevokeConfirm = false;
		pendingForm = null;
		coordinatorToRevoke = null;
	}}
/>
