<script lang="ts">
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import SetPassword from '$components/form/auth/SetPassword.svelte';

	let heading = 'Please enter your new password to complete the process.';
	let errorMessage = '';
	let validPassword = $state(false);
	let password = $state('');
	let canGo = $derived(validPassword);
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-secondary-100 p-6 text-surface-950 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-6 text-center text-2xl">{heading}</h1>

		<form action="?/resetpassword" method="POST">
			<SetPassword bind:password bind:validPassword />

			<button
				type="submit"
				class="mt-6 w-full rounded-full bg-secondary-500 py-2 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo}
			>
				Update Password
			</button>

			{#if errorMessage !== ''}
				<div class="mt-4">
					<AuthErrorMessage {errorMessage} />
				</div>
			{/if}
		</form>
	</div>
</div>
