<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import CurrentKYNGCoordinatorsTable from '$components/form/tables/CurrentKYNGCoordinatorsTable.svelte';
	import AutocompleteSelectWithCurrent from '$components/form/inputs/AutocompleteSelectWithCurrent.svelte';
	import AutocompleteSingleItemInput from '$components/form/inputs/AutocompleteSingleItemInput.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	let value = $state(['']);
	let selectedUser = $state<string[]>([]);
	let selectedKYNG = $state('');
	let selectedUserEmail = $state('');
	let selectedKyngArea = $state('');
	let selectedCoordinator = $state<EditableCoordinator | null>(null);
	let editMode = $state(false);

	interface KyngListItem {
		item_id: string;
		lut_text: string;
		current_value: string;
	}

	interface Coordinator {
		user_id: string;
		email: string;
		kyng?: string;
		kyng_area_id?: string;
	}

	interface KyngArea {
		kyng_area_id: string;
		kyng_area_name: string;
	}

	interface EditableCoordinator {
		user_id: string;
		email: string;
		kyng: string;
		kyng_area_id: string;
		user_name: string;
		phone_number: string;
	}

	const usersListData = data.kyngCoordinators
		.filter((coord: Coordinator) => coord.email)
		.map((coord: Coordinator) => ({
			item_id: coord.user_id,
			lut_text: coord.email || '',
			current_value: coord.kyng || 'No KYNG Area'
		}));

	const kyngListData = data.kyngAreas.map((area: KyngArea) => ({
		item_id: area.kyng_area_id,
		lut_text: area.kyng_area_name,
		current_value: ''
	}));

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				selectedKYNG = '';
				selectedUser = [];
			}
		};
	};

	function handleUserSelect(email: string) {
		const coordinator = data.kyngCoordinators.find((c: EditableCoordinator) => c.email === email);
		if (coordinator) {
			selectedCoordinator = { ...coordinator };
			editMode = true;
		}
	}

	function handleKyngSelect(kyngName: string) {
		const coordinator = data.kyngCoordinators.find((c: EditableCoordinator) => c.kyng === kyngName);
		if (coordinator) {
			selectedCoordinator = { ...coordinator };
			editMode = true;
		}
	}

	const handleEditSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				selectedCoordinator = null;
				editMode = false;
				selectedUserEmail = '';
				selectedKyngArea = '';
			}
		};
	};

	$effect(() => {
		if (selectedUserEmail) {
			handleUserSelect(selectedUserEmail);
		}
	});

	$effect(() => {
		if (selectedKyngArea) {
			handleKyngSelect(selectedKyngArea);
		}
	});
</script>

<svelte:head>
	<title>Site Admin-KYNG Coordinators</title>
</svelte:head>

<Accordion spaceY="space-y-1" {value} collapsible={true}>
	<Accordion.Item value="0" classes="bg-orange-100 font-medium">
		{#snippet control()}Current KYNG Coordinators{/snippet}
		{#snippet panel()}
			<CurrentKYNGCoordinatorsTable {data} />
		{/snippet}
	</Accordion.Item>

	<Accordion.Item value="1" classes="bg-orange-100 font-medium">
		{#snippet control()}Add KYNG Coordinator{/snippet}
		{#snippet panel()}
			<form method="POST" action="?/assignCoordinator" use:enhance={handleSubmit} class="space-y-4">
				<input
					type="hidden"
					name="userId"
					value={usersListData.find(
						(item: { item_id: string; lut_text: string }) => item.lut_text === selectedUser[0]
					)?.item_id || ''}
					required
				/>
				<input
					type="hidden"
					name="kyngAreaId"
					value={kyngListData.find(
						(item: { item_id: string; lut_text: string }) => item.lut_text === selectedKYNG
					)?.item_id || ''}
					required
				/>
				<div>
					<label for="userId">Select User</label>
					<AutocompleteSelectWithCurrent
						listData={usersListData}
						placeholder="Select User"
						bind:selectedValues={selectedUser}
					/>
				</div>

				<div>
					<label for="kyngArea">Select KYNG Area</label>
					<AutocompleteSingleItemInput
						listData={kyngListData.map((item: KyngListItem) => item.lut_text)}
						placeholder="Select KYNG Area"
						bind:selectedValue={selectedKYNG}
					/>
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						class="mt-4 rounded-full bg-tertiary-400 px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!(selectedUser && selectedKYNG)}
					>
						Assign Coordinator
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
	<Accordion.Item value="2" classes="bg-orange-100 font-medium">
		{#snippet control()}Edit KYNG Coordinator Details{/snippet}
		{#snippet panel()}
			{#if !editMode}
				<div class="space-y-4">
					<div>
						<label for="selectEmail" class="label">Select by Email</label>
						<AutocompleteSingleItemInput
							listData={data.kyngCoordinators
								.filter((c: EditableCoordinator) => c.kyng) // Only includes users who are KYNG Coordinators
								.map((c: EditableCoordinator) => c.email)}
							placeholder="Select User Email"
							bind:selectedValue={selectedUserEmail}
						/>
					</div>

					<div class="divider text-center">OR</div>

					<div>
						<label for="selectKyng" class="label">Select by KYNG Area</label>
						<AutocompleteSingleItemInput
							listData={kyngListData.map((k: { lut_text: string }) => k.lut_text)}
							placeholder="Select KYNG Area"
							bind:selectedValue={selectedKyngArea}
						/>
					</div>

					{#if selectedKyngArea}
						{#if data.kyngCoordinators.some((c: EditableCoordinator) => c.kyng === selectedKyngArea)}
							<div>
								<label for="selectAreaEmail" class="label">Select Coordinator Email</label>
								<AutocompleteSingleItemInput
									listData={data.kyngCoordinators
										.filter((c: EditableCoordinator) => c.kyng === selectedKyngArea)
										.map((c: EditableCoordinator) => c.email)}
									placeholder="Select User Email"
									bind:selectedValue={selectedUserEmail}
								/>
							</div>
						{:else}
							<div class="alert variant-filled-warning">
								No KYNG Coordinator assigned to {selectedKyngArea}
							</div>
						{/if}
					{/if}
				</div>
			{:else if selectedCoordinator}
				<!-- Rest of the form remains unchanged -->
				<form
					method="POST"
					action="?/updateCoordinator"
					use:enhance={handleEditSubmit}
					class="space-y-4"
				>
					<input type="hidden" name="user_id" value={selectedCoordinator.user_id} />
					<input type="hidden" name="kyng_area_id" value={selectedCoordinator.kyng_area_id} />

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="label">Email</label>
							<input
								type="text"
								value={selectedCoordinator.email}
								class="input"
								readonly
								disabled
							/>
						</div>
						<div>
							<label class="label">KYNG Area</label>
							<input type="text" value={selectedCoordinator.kyng} class="input" readonly disabled />
						</div>

						<div>
							<label for="user_name" class="label">Name</label>
							<input
								type="text"
								id="user_name"
								name="user_name"
								bind:value={selectedCoordinator.user_name}
								class="input"
							/>
						</div>
						<div>
							<label for="phone_number" class="label">Phone</label>
							<input
								type="tel"
								id="phone_number"
								name="phone_number"
								bind:value={selectedCoordinator.phone_number}
								class="input"
							/>
						</div>
					</div>

					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="variant-ghost btn"
							onclick={() => {
								selectedCoordinator = null;
								editMode = false;
								selectedUserEmail = '';
								selectedKyngArea = '';
							}}
						>
							Cancel
						</button>
						<button type="submit" class="variant-filled-primary btn">Save Changes</button>
					</div>
				</form>
			{/if}
		{/snippet}
	</Accordion.Item>
</Accordion>
