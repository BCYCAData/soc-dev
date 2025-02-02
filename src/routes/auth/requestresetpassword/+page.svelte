<script lang="ts">
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/auth/AuthSuccessMessage.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();
	let email = $state('');
	let validEmail = $state(false);
	let waiting = $state(false);

	let canGo = $derived(validEmail);

	const handleSubmit: SubmitFunction = () => {
		waiting = true;
		return async ({ result }) => {
			waiting = false;
			if (result.type === 'success') {
				email = '';
				validEmail = false;
			}
		};
	};
</script>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-orange-100 p-6 text-gray-900 shadow-md sm:ml-0 sm:w-full">
		<h1 class="unstyled text-center text-2xl">Reset Password</h1>
		<p>Please enter the email address you registered with.</p>
		<p>If it is validated you will receive an email with a link to enable your password reset.</p>

		<form class="pt-2" method="POST" use:enhance={handleSubmit}>
			<SetEmail bind:email bind:validEmail />

			{#if form?.error}
				<AuthErrorMessage errorMessage={form.message} />
			{/if}

			{#if waiting}
				<p class="text-orange-700">Please wait while we validate your email address...</p>
			{/if}

			{#if form?.success}
				<AuthSuccessMessage message={[form.message]} />
			{/if}

			<input type="hidden" name="email" value={email} />

			<button
				type="submit"
				class="w-full rounded-full bg-orange-500 py-2 text-center text-xl text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo || waiting}
			>
				Request Password Reset
			</button>
		</form>
	</div>
</div>
