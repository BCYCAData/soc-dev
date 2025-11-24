<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	interface Props {
		data: any;
		selectedValues: string[];
	}

	let { data, selectedValues = $bindable() }: Props = $props();

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	};
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
			use:enhance={handleSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
					class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
					disabled={selectedValues.length === 0}
				>
					Send Message
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
			use:enhance={handleSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
					class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
					disabled={selectedValues.length === 0}
				>
					Send Message
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
<Accordion.Item value="4"  controlClasses="bg-primary-400 text-xl" classes="bg-orange-100 font-medium">
	{#snippet control()}All in a Community{/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersInCommunity"
			use:enhance={handleSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
					class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
					disabled={selectedValues.length === 0}
				>
					Send Message
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
<Accordion.Item value="5" classes="bg-orange-100 font-medium">
	{#snippet control()}All in a Suburb{/snippet}
	{#snippet panel()}
		<form
			method="POST"
			class="card bg-orange-50 p-4"
			action="?/sendMessageToAllUsersInSuburb"
			use:enhance={handleSubmit}
		>
			<label class="flex grow flex-col items-start">
				<p>Enter the message here:</p>
				<input
					class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
					class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
					disabled={selectedValues.length === 0}
				>
					Send Message
				</button>
			</div>
		</form>
	{/snippet}
</Accordion.Item>
