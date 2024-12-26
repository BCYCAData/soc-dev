<script lang="ts">
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';

	interface ListItem {
		user_id: string;
		lut_text: string;
	}

	interface Props {
		emailList: ListItem[];
		selectedValues: string[];
		message: string;
	}

	let { emailList, selectedValues = $bindable(), message = $bindable() }: Props = $props();

	let successMessage = $state('');
	let errorMessage = $state('');

	export function clearForm() {
		message = '';
		selectedValues = [];
		successMessage = '';
		errorMessage = '';
	}

	export function setSuccessMessage(msg: string) {
		successMessage = msg;
	}

	export function setErrorMessage(msg: string) {
		errorMessage = msg;
	}
</script>

<label class="flex flex-grow flex-col items-start">
	<p>Enter the message here:</p>
	<input
		class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
		name="inputMessage"
		type="text"
		placeholder="Message"
		bind:value={message}
	/>
</label>

<AutoCompleteSelect
	listData={emailList}
	placeholder="Start typing to select one or more Email Addresses"
	bind:selectedValues
/>

{#if successMessage}
	<div class="mt-2 text-green-600">{successMessage}</div>
{/if}

{#if errorMessage}
	<div class="mt-2 text-red-600">{errorMessage}</div>
{/if}

<div class="flex items-center justify-end">
	<p class="mr-2">Send this message to the selected users</p>
	<button
		type="submit"
		class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
		disabled={selectedValues.length === 0}
		onclick={() => {
			successMessage = '';
			errorMessage = '';
		}}
	>
		Send Message
	</button>
</div>
