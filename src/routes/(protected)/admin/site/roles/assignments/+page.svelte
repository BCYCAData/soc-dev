<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from '$stores/toaststore';
	import RolesTable from '$components/form/tables/RolesTable.svelte';
	import AutocompleteSingleItemInput from '$components/form/inputs/AutocompleteSingleItemInput.svelte';
	import AutocompleteSelectWithCurrent from '$components/form/inputs/AutocompleteSelectWithCurrent.svelte';
	import Spinner from '$components/page/Spinner.svelte';

	interface Role {
		id: bigint;
		user_id: string;
		role: string;
		email: string;
	}
	interface Permission {
		role: string;
		permission: string;
	}
	interface User {
		id: string;
		email: string;
	}

	let { data } = $props<{
		data: {
			siteRoles: Role[];
			sitePermissions: Permission[];
			siteUsers: User[];
		};
	}>();

	let selectedRole: string = $state('');
	let selectedUser: string[] = $state([]);
	let isAssigning = $state(false);

	const usersListData = $derived(
		data.siteRoles.map((role: Role) => ({
			item_id: role.user_id,
			lut_text: role.email,
			current_value: role.role
		}))
	);

	const rolesListData = $derived([
		...new Set(data.sitePermissions.map((p: Permission) => p.role))
	] as string[]);

	const handleSubmit: SubmitFunction = () => {
		isAssigning = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || 'Role assigned successfully');
				await invalidateAll();
				selectedRole = '';
				selectedUser = [];
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to assign role. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to assign role. Please try again.');
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
		{#snippet control()}Current Role Assignments{/snippet}
		{#snippet panel()}
			<RolesTable {data} />
		{/snippet}
	</Accordion.Item>

	<Accordion.Item
		value="1"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}Assign New Role{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/assignRole" use:enhance={handleSubmit} class="space-y-4">
				<input
					type="hidden"
					name="userId"
					value={selectedUser.length > 0 ? selectedUser[0] : ''}
					required
				/>
				<input type="hidden" name="role" value={selectedRole} required />
				<div>
					<label for="userId">User to Change</label>
					<AutocompleteSelectWithCurrent
						listData={usersListData}
						placeholder="Select User"
						bind:selectedValues={selectedUser}
					/>
				</div>
				<div>
					<label for="role">Role to Assign</label>
					<AutocompleteSingleItemInput
						listData={rolesListData}
						placeholder="Select Role"
						bind:selectedValue={selectedRole}
					/>
				</div>
				<div class="flex justify-end">
					<button
						type="submit"
						class="bg-tertiary-400 mt-4 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isAssigning || !(selectedUser && selectedRole)}
						aria-busy={isAssigning}
					>
						{#if isAssigning}
							<span class="inline-flex items-center gap-2">
								<Spinner size="16" /> Assigning...
							</span>
						{:else}
							Assign Role
						{/if}
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>
