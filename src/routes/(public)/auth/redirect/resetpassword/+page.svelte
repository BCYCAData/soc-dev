<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import SetPassword from '$components/form/auth/SetPassword.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();

	let heading = 'Please enter your new password to complete the process.';
	let errorMessage = $derived(form?.message ?? '');
	let validPassword = $state(false);
	let password = $state('');
	let isSubmitting = $state(false);
	let canGo = $derived(validPassword && !isSubmitting);
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="bg-secondary-100 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-6 text-center text-2xl">{heading}</h1>

		<form
			action="?/resetpassword"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<SetPassword bind:password bind:validPassword />

			<button
				type="submit"
				class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 mt-6 w-full rounded-full py-2 text-center focus:outline-none disabled:opacity-25"
				disabled={!canGo}
				aria-busy={isSubmitting}
			>
				{#if isSubmitting}
					<Spinner size="16" /> Updating...
				{:else}
					Update Password
				{/if}
			</button>

			{#if errorMessage !== ''}
				<div class="mt-4">
					<AuthErrorMessage {errorMessage} />
				</div>
			{/if}
		</form>
	</div>
</div>
