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
	let touched = $state(false);

	const messageError = $derived(
		touched && message.trim().length < 5 ? 'Message must be at least 5 characters' : undefined
	);

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
		id="individual-message"
		class="focus:ring-primary-500 mr-2 w-full rounded-md border px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
		class:border-surface-300={!messageError}
		class:border-error-500={!!messageError}
		name="inputMessage"
		type="text"
		placeholder="Message"
		aria-invalid={!!messageError}
		aria-describedby={messageError ? 'individual-message-error' : undefined}
		bind:value={message}
		oninput={() => (touched = true)}
	/>
	{#if messageError}
		<span id="individual-message-error" class="text-error-500 mt-1 text-sm" role="alert">
			{messageError}
		</span>
	{/if}
</label>

<AutoCompleteSelect
	listData={emailList}
	placeholder="Start typing to select one or more Email Addresses"
	bind:selectedValues
/>

{#if successMessage}
	<div class="text-success-600 mt-2">{successMessage}</div>
{/if}

{#if errorMessage}
	<div class="text-error-600 mt-2">{errorMessage}</div>
{/if}

<div class="flex items-center justify-end">
	<p class="mr-2">Send this message to the selected users</p>
	<button
		type="button"
		class="btn preset-filled-tertiary-500 disabled:cursor-not-allowed disabled:opacity-50"
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
