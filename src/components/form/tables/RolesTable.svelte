<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { CellComponent } from 'tabulator-tables';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$stores/toaststore';
	import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

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
	let showRemoveConfirm = $state(false);
	let roleToRemove = $state<{ id: bigint; email: string; role: string } | null>(null);
	let pendingForm = $state<HTMLFormElement | null>(null);

	const filteredRoles = $derived(
		data.siteRoles.filter((role: { role: string }) => role.role !== 'user')
	);

	async function handleConfirmRemove() {
		if (!pendingForm || !roleToRemove) return;

		const btn = pendingForm.querySelector('.remove-role-btn') as HTMLButtonElement;
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'Removing...';
		}

		try {
			const formData = new FormData(pendingForm);
			const response = await fetch(pendingForm.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success(`Role removed from ${roleToRemove.email} successfully`);
				await invalidateAll();
			} else {
				toast.error('Failed to remove role. Please try again.');
			}
		} catch (error) {
			toast.error('Failed to remove role. Please try again.');
		} finally {
			showRemoveConfirm = false;
			pendingForm = null;
			roleToRemove = null;
		}
	}

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
						const email = cell.getRow().getData().email;
						const role = cell.getRow().getData().role;
						return `<form method="POST" action="?/removeRole" class="remove-role-form" data-role-id="${roleId}" data-email="${email}" data-role="${role}">
                            <input type="hidden" name="roleId" value="${roleId}" />
                            <button type="button" class="remove-role-btn text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed">Remove</button>
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

		// Add event delegation for remove buttons
		tableElement.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('remove-role-btn')) {
				e.preventDefault();
				const form = target.closest('form') as HTMLFormElement;
				const roleId = form.dataset.roleId;
				const email = form.dataset.email;
				const role = form.dataset.role;

				if (roleId && email && role) {
					roleToRemove = { id: BigInt(roleId), email, role };
					pendingForm = form;
					showRemoveConfirm = true;
				}
			}
		});
	});
</script>

<div bind:this={tableElement}></div>

<ConfirmDialogue
	bind:open={showRemoveConfirm}
	title="Remove Role"
	message={`Are you sure you want to remove the "${roleToRemove?.role}" role from ${roleToRemove?.email}?`}
	confirmText="Remove Role"
	variant="danger"
	onConfirm={handleConfirmRemove}
	onCancel={() => {
		showRemoveConfirm = false;
		pendingForm = null;
		roleToRemove = null;
	}}
/>
