<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';

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

	function flattenPermissions(tree: object, prefix = ''): string[] {
		return Object.entries(tree).flatMap(([key, value]) => {
			const currentPath = prefix ? `${prefix}.${key}` : key;
			if (Object.keys(value).length === 0) {
				return [currentPath];
			}
			return [currentPath, ...flattenPermissions(value, currentPath)];
		});
	}

	const allPermissions = flattenPermissions(data.permissionTree);

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

	$effect(() => {
		const roleData = data.rolePermissions.find((r: RolePermission) => r.role === selectedRole);
		selectedPermissions = roleData?.permission.split(',') || [];
	});

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				isLoading = true;
				if (result.type === 'success') {
					await invalidateAll();
				}
				isLoading = false;
			}
		};
	};

	let isLoading = $state(false);
	const value = $state(['']);
</script>

<Accordion spaceY="space-y-1" {value} collapsible={true}>
	<Accordion.Item value="0" classes="bg-orange-100 font-medium">
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
						<form method="POST" action="?/deleteRole" use:enhance={handleSubmit}>
							<input type="hidden" name="role" value={role} />
							<button type="submit" class="text-red-600 hover:text-red-800">Delete</button>
						</form>
					</div>

					{#if selectedRole === role}
						<div class="card bg-orange-50 p-4">
							<h2 class="mb-4 text-xl font-bold">Edit Permissions for {selectedRole}</h2>
							<form method="POST" action="?/updatePermissions" use:enhance class="space-y-4">
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
										class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										disabled={isLoading}
									>
										{#if isLoading}
											<span class="spinner">🔄</span>
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

	<Accordion.Item value="1" classes="bg-orange-100 font-medium">
		{#snippet control()}Add New Role{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/addRole" use:enhance class="space-y-4">
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
							class="rounded-full bg-tertiary-400 px-4 py-2 text-center hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
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
						class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!selectedPermissions.length || !newRole}
					>
						Add Role
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>

<style>
	.spinner {
		display: inline-block;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
