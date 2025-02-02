<script lang="ts">
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import SetPassword from '$components/form/auth/SetPassword.svelte';

	let heading = 'Please enter your new password to complete the process.';
	let errorMessage = '';

	let validPassword = $state(false);
	let password = $state('');

	let canGo = $derived(validPassword);
</script>

<div class="max-w-container mx-auto flex flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-orange-50 p-6 text-gray-900 shadow-md sm:ml-0 sm:w-full">
		<h1 class="unstyled text-center text-2xl">{heading}</h1>
		<form action="?/resetpassword" method="POST">
			<SetPassword bind:password bind:validPassword />
			<button
				type="submit"
				class="my-4 w-full rounded-full bg-orange-500 py-2 text-center text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Update Password
			</button>
		</form>
		{#if errorMessage !== ''}
			<AuthErrorMessage {errorMessage} />
		{/if}
	</div>
</div>
