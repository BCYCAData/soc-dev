<script lang="ts">
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/AuthSuccessMessage.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';

	import type { ActionData } from './$types';

	let heading = 'Please enter your new email address.';
	let caution = 'Make sure you enter the correct address. THERE IS NO WAY TO UNDO THIS.';
	let errorMessage = 'There was an error changing your email address';
	let successMessage = [
		'Your request has been submitted.',
		'Please check the mailbox of your old address for a confirmation email.'
	];

	export let form: ActionData;

	$: validEmail = false;
	$: canGo = validEmail;
</script>

<svelte:head>
	<title>Profile-Settings-Email</title>
</svelte:head>
<div class="flex flex-col items-center  max-w-container mx-auto justify-center">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center">Please enter your new email address.</h1>
		<form action="?/changeEmail" method="POST">
			<SetEmail bind:validEmail />
			<button
				type="submit"
				class="w-full text-center rounded-full py-2 my-4 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Change Email Address
			</button>
		</form>
		{#if form?.success}
			<AuthSuccessMessage message={successMessage} />
		{:else if form?.error}
			<AuthErrorMessage message={errorMessage} />
		{/if}
	</div>
</div>
