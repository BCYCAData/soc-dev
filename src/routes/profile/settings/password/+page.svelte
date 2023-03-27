<script lang="ts">
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/AuthSuccessMessage.svelte';
	import SetPassword from '$components/form/auth/SetPassword.svelte';

	import type { ActionData } from './$types';

	let heading = 'Please enter your new password.';
	let errorMessage = 'There was an error changing your password';
	let successMessage = ['Your password has been changed'];

	export let form: ActionData;

	$: validPassword = false;
	$: canGo = validPassword;
</script>

<svelte:head>
	<title>Profile-Settings-Password</title>
</svelte:head>

<div class="flex flex-col items-center  max-w-container mx-auto justify-center">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center">{heading}</h1>
		<form action="?/resetPassword" method="POST">
			<SetPassword bind:validPassword />
			<button
				type="submit"
				class="w-full text-center rounded-full py-2 my-4 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Update Password
			</button>
		</form>
		{#if form?.success}
			<AuthSuccessMessage message={successMessage} />
		{:else if form?.error}
			<AuthErrorMessage message={errorMessage} />
		{/if}
	</div>
</div>
