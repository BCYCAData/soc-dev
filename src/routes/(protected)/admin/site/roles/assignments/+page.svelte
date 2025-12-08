<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import RolesTable from '$components/form/tables/RolesTable.svelte';
	import AutocompleteSingleItemInput from '$components/form/inputs/AutocompleteSingleItemInput.svelte';
	import AutocompleteSelectWithCurrent from '$components/form/inputs/AutocompleteSelectWithCurrent.svelte';

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

	const usersListData = data.siteRoles.map((role: Role) => ({
		item_id: role.user_id,
		lut_text: role.email,
		current_value: role.role
	}));

	const rolesListData = [
		...new Set(data.sitePermissions.map((p: Permission) => p.role))
	] as string[];

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				selectedRole = '';
				selectedUser = [];
			}
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
						class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!(selectedUser && selectedRole)}
						>Assign Role
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
</Accordion>
