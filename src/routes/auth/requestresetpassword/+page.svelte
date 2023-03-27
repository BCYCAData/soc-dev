<script lang="ts">
	import AuthErrorMessage from '$components/form/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/AuthSuccessMessage.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';

	import type { ActionData } from './$types';

	let waiting = false;

	$: canGo = validEmail;
	$: validEmail = false;

	export let form: ActionData;
</script>

<div class="flex flex-col items-center max-w-md mx-auto justify-center">
	<div class="bg-orange-100 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center">Reset Password</h1>
		<p>Please enter the email address you registered with.</p>
		<p>If it is validated you will receive an email with a link to enable your password reset.</p>
		<form class="pt-2" action="?/requestresetpassword" method="POST">
			<SetEmail bind:validEmail />
			{#if form?.incorrect}
				<AuthErrorMessage message={form?.err.message} />
			{/if}
			{#if waiting && !form?.success && !form?.incorrect}
				<p>Please wait while we validate your email address...</p>
			{/if}
			{#if form?.success}
				<AuthSuccessMessage message={['Your request has been lodged. Check your Inbox.']} />
			{/if}
			<button
				type="submit"
				class="w-full text-center text-xl rounded-full py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo}
				on:click={() => (waiting = form === null)}
			>
				Request Password Reset
			</button>
		</form>
	</div>
</div>
