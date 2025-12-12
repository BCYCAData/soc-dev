<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';
	import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

	interface RolePermission {
		role: string;
		permission: string;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selectedRole = $state('');
	let newRole = $state('');
	let selectedPermissions = $state<string[]>([]);
	let newPermission = $state('');
	let customPermissions = $state<string[]>([]);
	let isAssigning = $state(false);
	let isUpdating = $state(false);
	let isDeleting = $state(false);
	let showDeleteConfirm = $state(false);
	let roleToDelete = $state('');
	let pendingDeleteForm = $state<HTMLFormElement | null>(null);

	function flattenPermissions(tree: object, prefix = ''): string[] {
		return Object.entries(tree).flatMap(([key, value]) => {
			const currentPath = prefix ? `${prefix}.${key}` : key;
			if (Object.keys(value).length === 0) {
				return [currentPath];
			}
			return [currentPath, ...flattenPermissions(value, currentPath)];
		});
	}

	const allPermissions = $derived(flattenPermissions(data.permissionTree));

	$effect(() => {
		const roleData = data.rolePermissions.find((r: RolePermission) => r.role === selectedRole);
		selectedPermissions = roleData?.permission.split(',') || [];
	});

	function handleRoleSelect(role: string) {
		selectedRole = role;
		const roleData = data.rolePermissions.find((r: RolePermission) => r.role === role);
		selectedPermissions = roleData?.permission.split(',') || [];
	}

	function addCustomPermission() {
		if (newPermission && !customPermissions.includes(newPermission)) {
			customPermissions = [...customPermissions, newPermission];
			selectedPermissions = [...selectedPermissions, newPermission];
			newPermission = '';
		}
	}

	function removeCustomPermission(permission: string) {
		customPermissions = customPermissions.filter((p) => p !== permission);
		selectedPermissions = selectedPermissions.filter((p) => p !== permission);
	}

	const handleDeleteSubmit: SubmitFunction = () => {
		isDeleting = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || `Role '${roleToDelete}' deleted successfully`);
				await invalidateAll();
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to delete role. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to delete role. Please try again.');
			}
			isDeleting = false;
			showDeleteConfirm = false;
			pendingDeleteForm = null;
		};
	};

	const handleUpdateSubmit: SubmitFunction = () => {
		isUpdating = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || `Permissions updated for '${selectedRole}'`);
				await invalidateAll();
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to update permissions. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update permissions. Please try again.');
			}
			isUpdating = false;
		};
	};

	const handleAddSubmit: SubmitFunction = () => {
		isAssigning = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || `New role '${newRole}' created successfully`);
				await invalidateAll();
				newRole = '';
				selectedPermissions = [];
				customPermissions = [];
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to create role. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to create role. Please try again.');
			}
			isAssigning = false;
		};
	};

	const value = $state(['']);
</script>

<Accordion spaceY="space-y-1" {value} collapsible={true}>
	<Accordion.Item
		value="0"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}Current Roles{/snippet}
		{#snippet panel()}
			{#each data.rolePermissions as { role }}
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<button
							class="text-left {selectedRole === role ? 'font-bold' : ''}"
							onclick={() => handleRoleSelect(role)}
						>
							{role}
						</button>
						<form method="POST" action="?/deleteRole" use:enhance={handleDeleteSubmit}>
							<input type="hidden" name="role" value={role} />
							<button
								type="button"
								class="text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={isDeleting}
								onclick={(e) => {
									roleToDelete = role;
									pendingDeleteForm = e.currentTarget.closest('form');
									showDeleteConfirm = true;
								}}
							>
								{#if isDeleting}
									<span class="inline-flex items-center gap-1">
										<Spinner size="12" /> Deleting...
									</span>
								{:else}
									Delete
								{/if}
							</button>
						</form>
					</div>

					{#if selectedRole === role}
						<div class="card bg-orange-50 p-4">
							<h2 class="mb-4 text-xl font-bold">Edit Permissions for {selectedRole}</h2>
							<form
								method="POST"
								action="?/updatePermissions"
								use:enhance={handleUpdateSubmit}
								class="space-y-4"
							>
								<input type="hidden" name="role" value={selectedRole} />
								<div class="max-h-96 space-y-2 overflow-y-auto">
									{#each allPermissions as permission}
										<label class="flex items-center">
											<input
												type="checkbox"
												name="permissions"
												value={permission}
												bind:group={selectedPermissions}
											/>
											<span class="ml-2">{permission}</span>
										</label>
									{/each}
								</div>
								<div class="flex justify-end">
									<button
										type="submit"
										class="bg-tertiary-400 mt-4 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										disabled={isUpdating}
										aria-busy={isUpdating}
									>
										{#if isUpdating}
											<span class="inline-flex items-center gap-2">
												<Spinner size="16" /> Updating...
											</span>
										{:else}
											Update Permissions
										{/if}
									</button>
								</div>
							</form>
						</div>
					{/if}
				</div>
			{/each}
		{/snippet}
	</Accordion.Item>

	<Accordion.Item
		value="1"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}Add New Role{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/addRole" use:enhance={handleAddSubmit} class="space-y-4">
				<div>
					<label for="role">Role Name</label>
					<input
						type="text"
						id="role"
						name="role"
						bind:value={newRole}
						class="w-full rounded border p-2"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="customPermission">Add Custom Permission</label>
					<div class="flex gap-2">
						<input
							type="text"
							id="customPermission"
							bind:value={newPermission}
							placeholder="Enter custom permission (e.g., admin.custom.action)"
							class="flex-1 rounded border p-2"
						/>
						<button
							type="button"
							class="bg-tertiary-400 rounded-full px-4 py-2 text-center hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
							onclick={addCustomPermission}
							disabled={!newPermission}
						>
							Add
						</button>
					</div>
				</div>

				{#if customPermissions.length > 0}
					<div class="space-y-2">
						<span>Custom Permissions</span>
						<div class="space-y-1">
							{#each customPermissions as permission}
								<div class="flex items-center justify-between rounded bg-orange-50 p-2">
									<span>{permission}</span>
									<button
										type="button"
										class="text-red-600 hover:text-red-800"
										onclick={() => removeCustomPermission(permission)}
									>
										Remove
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div>
					<span>Existing Permissions</span>
					<div class="max-h-96 space-y-2 overflow-y-auto">
						{#each allPermissions as permission}
							<label class="flex items-center">
								<input
									type="checkbox"
									name="permissions"
									value={permission}
									bind:group={selectedPermissions}
								/>
								<span class="ml-2">{permission}</span>
							</label>
						{/each}
					</div>
				</div>

				<input type="hidden" name="permissions" value={selectedPermissions.join(',')} />

				<div class="flex justify-end">
					<button
						type="submit"
						class="bg-tertiary-400 mt-4 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isAssigning || !(selectedPermissions.length && newRole)}
						aria-busy={isAssigning}
					>
						{#if isAssigning}
							<span class="inline-flex items-center gap-2">
								<Spinner size="16" /> Adding...
							</span>
						{:else}
							Add Role
						{/if}
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>

<ConfirmDialogue
	bind:open={showDeleteConfirm}
	title="Delete Role"
	message={`Are you sure you want to delete the role "${roleToDelete}"? This action cannot be undone.`}
	confirmText="Delete Role"
	variant="danger"
	onConfirm={() => {
		pendingDeleteForm?.requestSubmit();
	}}
	onCancel={() => {
		showDeleteConfirm = false;
		pendingDeleteForm = null;
	}}
/>
