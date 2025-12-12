<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	interface Props {
		data: any;
		selectedValues: string[];
	}

	let { data, selectedValues = $bindable() }: Props = $props();

	let isSubmittingAddress = $state(false);
	let isSubmittingStreet = $state(false);
	let isSubmittingCommunity = $state(false);
	let isSubmittingSuburb = $state(false);

	function createSubmitHandler(setter: (value: boolean) => void): SubmitFunction {
		return () => {
			setter(true);
			return async ({ result }) => {
				if (result.type === 'success') {
					await invalidateAll();
				}
				setter(false);
			};
		};
	}

	const handleAddressSubmit = createSubmitHandler((val) => (isSubmittingAddress = val));
	const handleStreetSubmit = createSubmitHandler((val) => (isSubmittingStreet = val));
	const handleCommunitySubmit = createSubmitHandler((val) => (isSubmittingCommunity = val));
	const handleSuburbSubmit = createSubmitHandler((val) => (isSubmittingSuburb = val));
</script>

<Accordion.Item
	value="2"
	controlClasses="bg-primary-400 text-xl"
	classes="bg-orange-100 font-medium"
>
	{#snippet control()}Individual Property - (street address){/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersAtAddress"
			use:enhance={handleAddressSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="focus:ring-primary-500 mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					name="inputMessage"
					type="text"
					placeholder="Message"
				/>
			</label>
			<AutoCompleteSelect
				listData={data.addressList}
				placeholder="Select one or more Street Addresses"
				bind:selectedValues
			/>
			<div class="flex items-center justify-end">
				<p class="mr-2">Send this message to all Users at the selected addresses</p>
				<button
					type="submit"
					class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
					disabled={selectedValues.length === 0 || isSubmittingAddress}
					aria-busy={isSubmittingAddress}
				>
					{#if isSubmittingAddress}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Sending...
						</span>
					{:else}
						Send Message
					{/if}
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>

<Accordion.Item
	value="3"
	controlClasses="bg-primary-400 text-xl"
	classes="bg-orange-100 font-medium"
>
	{#snippet control()}All in a Street{/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersInStreet"
			use:enhance={handleStreetSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="focus:ring-primary-500 mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					name="inputMessage"
					type="text"
					placeholder="Message"
				/>
			</label>
			<AutoCompleteSelect
				listData={data.streetList}
				placeholder="Select one or more Streets"
				bind:selectedValues
			/>
			<div class="flex items-center justify-end">
				<p class="mr-2">Send this message to all Users at the selected streets</p>
				<button
					type="submit"
					class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
					disabled={selectedValues.length === 0 || isSubmittingStreet}
					aria-busy={isSubmittingStreet}
				>
					{#if isSubmittingStreet}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Sending...
						</span>
					{:else}
						Send Message
					{/if}
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
<Accordion.Item
	value="4"
	controlClasses="bg-primary-400 text-xl"
	classes="bg-orange-100 font-medium"
>
	{#snippet control()}All in a Community{/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersInCommunity"
			use:enhance={handleCommunitySubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="focus:ring-primary-500 mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					name="inputMessage"
					type="text"
					placeholder="Message"
				/>
			</label>
			<AutoCompleteSelect
				listData={data.communityList}
				placeholder="Select one or more Communities"
				bind:selectedValues
			/>
			<div class="flex items-center justify-end">
				<p class="mr-2">Send this message to all Users at the selected communities</p>
				<button
					type="submit"
					class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
					disabled={selectedValues.length === 0 || isSubmittingCommunity}
					aria-busy={isSubmittingCommunity}
				>
					{#if isSubmittingCommunity}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Sending...
						</span>
					{:else}
						Send Message
					{/if}
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
<Accordion.Item
	value="5"
	controlClasses="bg-primary-400 text-xl"
	classes="bg-orange-100 font-medium"
>
	{#snippet control()}All in a Suburb{/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersInSuburb"
			use:enhance={handleSuburbSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="focus:ring-primary-500 mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					name="inputMessage"
					type="text"
					placeholder="Message"
				/>
			</label>
			<AutoCompleteSelect
				listData={data.suburbList}
				placeholder="Select one or more Suburbs"
				bind:selectedValues
			/>
			<div class="flex items-center justify-end">
				<p class="mr-2">Send this message to all Users at the selected suburbs</p>
				<button
					type="submit"
					class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
					disabled={selectedValues.length === 0 || isSubmittingSuburb}
					aria-busy={isSubmittingSuburb}
				>
					{#if isSubmittingSuburb}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							Sending...
						</span>
					{:else}
						Send Message
					{/if}
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
