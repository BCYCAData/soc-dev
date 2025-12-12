<script lang="ts">
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

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
	let isSending = $state(false);
	let showSendConfirm = $state(false);
	let pendingSendForm = $state<HTMLFormElement | null>(null);

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

<label class="flex grow flex-col items-start">
	<p>Enter the message here:</p>
	<input
		class="focus:ring-primary-500 mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
		type="button"
		class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
		disabled={isSending || selectedValues.length === 0}
		aria-busy={isSending}
		onclick={(e) => {
			successMessage = '';
			errorMessage = '';
			pendingSendForm = e.currentTarget.closest('form');
			showSendConfirm = true;
		}}
	>
		{#if isSending}
			<span class="inline-flex items-center gap-2">
				<Spinner size="16" /> Sending...
			</span>
		{:else}
			Send Message
		{/if}
	</button>
</div>

<ConfirmDialogue
	bind:open={showSendConfirm}
	title="Send Message to Selected Users"
	message={`Are you sure you want to send this message to ${selectedValues.length} user${selectedValues.length !== 1 ? 's' : ''}?

Message: "${message}"`}
	confirmText="Send Message"
	variant="warning"
	onConfirm={() => {
		isSending = true;
		pendingSendForm?.requestSubmit();
	}}
	onCancel={() => {
		showSendConfirm = false;
		pendingSendForm = null;
	}}
/>
