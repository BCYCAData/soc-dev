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
	let tableElement: HTMLElement = $state()!;
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

	let isLoading = $state(false);

	$effect(() => {
		if (tableElement && !table) {
			createTable();
		} else if (table) {
			table.setData(filteredRoles);
		}
	});

	function createTable() {
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
	}

	onMount(() => {
		// Add event delegation for remove buttons
		tableElement?.addEventListener('click', (e) => {
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

{#if isLoading}
	<div class="flex items-center justify-center p-8">
		<div class="text-surface-600 dark:text-surface-400" role="status" aria-label="Loading roles">
			Loading roles...
		</div>
	</div>
{:else if filteredRoles.length === 0}
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
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		</div>
		<h3
			class="text-surface-900 dark:text-surface-100 mb-1 text-lg font-semibold"
			style="font-family: var(--heading-font-family, 'Raleway', sans-serif);"
		>
			No Role Assignments
		</h3>
		<p class="text-surface-600 dark:text-surface-400 text-sm">
			Use the form above to assign roles to users
		</p>
	</div>
{:else}
	<div bind:this={tableElement}></div>
{/if}

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
