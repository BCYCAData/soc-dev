<script lang="ts">
	import EnumOptionSelect from '$components/form/inputs/EnumOptionSelect.svelte';

	type MessageContext = 'users' | 'admins' | 'both';

	interface Props {
		message: string;
		messageContext: MessageContext;
	}

	let { message = $bindable(), messageContext = $bindable() }: Props = $props();

	let haveMessage = $derived(() => {
		const words = message.trim().split(/\s+/);
		return message.length > 4 && words.length > 1;
	});

	let successMessage = $state('');
	let errorMessage = $state('');

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
</script>

<input type="hidden" name="messageContext" value={messageContext} />
<div class="flex items-center">
	<label class="flex grow flex-col items-start">
		<p>Enter the message here:</p>
		<input
			class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
			name="inputMessage"
			type="text"
			placeholder="Message"
			bind:value={message}
		/>
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
		type="submit"
		class="rounded-md border border-transparent bg-tertiary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
		disabled={!haveMessage}
	>
		Send Message
	</button>
</div>
