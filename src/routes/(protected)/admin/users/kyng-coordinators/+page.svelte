<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from '$stores/toaststore';
	import CurrentKYNGCoordinatorsTable from '$components/form/tables/CurrentKYNGCoordinatorsTable.svelte';
	import AllKYNGCoordinatorsTable from '$components/form/tables/AllKYNGCoordinatorsTable.svelte';
	import AutocompleteSelectWithCurrent from '$components/form/inputs/AutocompleteSelectWithCurrent.svelte';
	import AutocompleteSingleItemInput from '$components/form/inputs/AutocompleteSingleItemInput.svelte';
	import Spinner from '$components/page/Spinner.svelte';
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
	let isAssigning = $state(false);

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

	const usersListData = $derived(
		data.kyngCoordinators
			.filter((coord: Coordinator) => coord.email)
			.map((coord: Coordinator) => ({
				item_id: coord.user_id,
				lut_text: coord.email || '',
				current_value: coord.kyng || 'No KYNG Area'
			}))
	);

	const kyngListData = $derived(
		data.kyngAreas.map((area: KyngArea) => ({
			item_id: area.kyng_area_id,
			lut_text: area.kyng_area_name,
			current_value: ''
		}))
	);

	const handleSubmit: SubmitFunction = () => {
		isAssigning = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message || 'KYNG Coordinator assigned successfully');
				await invalidateAll();
				selectedKYNG = '';
				selectedUser = [];
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to assign coordinator. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to assign coordinator. Please try again.');
			}
			isAssigning = false;
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
				toast.success(result.data?.message || 'Coordinator details updated successfully');
				await invalidateAll();
				selectedCoordinator = null;
				editMode = false;
				selectedUserEmail = '';
				selectedKyngArea = '';
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to update coordinator. Please try again.');
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update coordinator. Please try again.');
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
	<Accordion.Item
		value="0"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}Current KYNG Coordinators{/snippet}
		{#snippet panel()}
			<CurrentKYNGCoordinatorsTable {data} />
		{/snippet}
	</Accordion.Item>
	<Accordion.Item
		value="1"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
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
						class="bg-tertiary-400 mt-4 rounded-full px-6 py-2 text-center text-base hover:bg-orange-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isAssigning || !(selectedUser && selectedKYNG)}
						aria-busy={isAssigning}
					>
						{#if isAssigning}
							<span class="inline-flex items-center gap-2">
								<Spinner size="16" /> Assigning...
							</span>
						{:else}
							Assign Coordinator
						{/if}
					</button>
				</div>
			</form>
		{/snippet}
	</Accordion.Item>
	<Accordion.Item
		value="2"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}Edit KYNG Coordinator Details{/snippet}
		{#snippet panel()}
			{#if !editMode}
				<div class="space-y-4">
					<div>
						<label for="selectEmail" class="label">Select by Email</label>
						<AutocompleteSingleItemInput
							listData={data.kyngCoordinators
								.filter((c: EditableCoordinator) => c.kyng)
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
							<label for="email" class="label">Email</label>
							<input
								id="email"
								type="text"
								value={selectedCoordinator.email}
								class="input"
								readonly
								disabled
							/>
						</div>
						<div>
							<label for="kyng_area" class="label">KYNG Area</label>
							<input
								id="kyng_area"
								type="text"
								value={selectedCoordinator.kyng}
								class="input"
								readonly
								disabled
							/>
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
							class="bg-surface-300 rounded-md px-4 py-2 text-red-600 hover:text-red-800"
							onclick={() => {
								selectedCoordinator = null;
								editMode = false;
								selectedUserEmail = '';
								selectedKyngArea = '';
							}}
						>
							Cancel
						</button>
						<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white"
							>Save Changes</button
						>
					</div>
				</form>
			{/if}
		{/snippet}
	</Accordion.Item>
	<Accordion.Item
		value="3"
		controlClasses="bg-primary-400 text-xl"
		classes="bg-orange-100 font-medium"
	>
		{#snippet control()}All KYNG Coordinators{/snippet}
		{#snippet panel()}
			<AllKYNGCoordinatorsTable {data} />
		{/snippet}
	</Accordion.Item>
</Accordion>
