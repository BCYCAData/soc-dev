<script lang="ts">
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import ConfirmDialogue from '$components/page/modals/ConfirmDialogue.svelte';

	type MessageContext = 'users' | 'admins' | 'both';

	interface Props {
		message: string;
		messageContext: MessageContext;
	}

	let { message = $bindable(), messageContext = $bindable() }: Props = $props();

	let touched = $state(false);

	let haveMessage = $derived(() => {
		const words = message.trim().split(/\s+/);
		return message.length > 4 && words.length > 1;
	});

	const messageError = $derived(
		touched && !haveMessage()
			? 'Message must be at least 5 characters and contain multiple words'
			: undefined
	);

	let successMessage = $state('');
	let errorMessage = $state('');
	let isSending = $state(false);
	let showSendConfirm = $state(false);
	let pendingSendForm = $state<HTMLFormElement | null>(null);

	export function clearForm() {
		message = '';
		successMessage = '';
		errorMessage = '';
	}

	export function setSuccessMessage(msg: string) {
		successMessage = msg;
	}

	export function setErrorMessage(msg: string) {
		errorMessage = msg;
	}

	function getRecipientCount(): string {
		if (messageContext === 'both') return 'all users and admins';
		if (messageContext === 'admins') return 'all admins';
		return 'all users';
	}
</script>

<input type="hidden" name="messageContext" value={messageContext} />
<div class="flex items-center">
	<label class="flex grow flex-col items-start">
		<p>Enter the message here:</p>
		<input
			id="all-users-message"
			class="focus:ring-primary-500 mr-2 w-full rounded-md border px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
			class:border-gray-300={!messageError}
			class:border-error-500={!!messageError}
			name="inputMessage"
			type="text"
			placeholder="Message"
			aria-invalid={!!messageError}
			aria-describedby={messageError ? 'all-users-message-error' : undefined}
			bind:value={message}
			oninput={() => (touched = true)}
		/>
		{#if messageError}
			<span id="all-users-message-error" class="text-error-500 mt-1 block text-sm" role="alert">
				{messageError}
			</span>
		{/if}
	</label>
	<EnumOptionSelect bind:messageContext header="Pick a context:" />
</div>

{#if successMessage}
	<div class="mt-2 text-green-600">{successMessage}</div>
{/if}

{#if errorMessage}
	<div class="mt-2 text-red-600">{errorMessage}</div>
{/if}

<div class="flex items-center justify-end">
	<p class="mr-2">Send this message to {messageContext} of all users</p>
	<button
		type="button"
		class="bg-tertiary-500 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
		disabled={isSending || !haveMessage}
		aria-busy={isSending}
		onclick={(e) => {
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
	title="Send Message to All Users"
	message={`Are you sure you want to send this message to ${getRecipientCount()}?

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
