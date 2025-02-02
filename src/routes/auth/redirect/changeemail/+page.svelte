<script lang="ts">
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import AuthSuccessMessage from '$components/form/auth/AuthSuccessMessage.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';

	let errorMessage = 'There was an error changing your email address';
	let successMessage = [
		'Your request has been submitted.',
		'Please check the mailbox of your old address for a confirmation email.'
	];

	let { form } = $props();

	let email = $state('');
	let validEmail = $state(false);

	let canGo = $derived(validEmail);
</script>

<svelte:head>
	<title>Profile-Settings-Email</title>
</svelte:head>
<div class="max-w-container mx-auto flex flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-orange-50 p-6 text-gray-900 shadow-md sm:ml-0 sm:w-full">
		<h1 class="unstyled text-center text-2xl">
			Make sure you enter the correct address. THERE IS NO WAY TO UNDO THIS.
		</h1>
		<h1 class="unstyled text-center text-2xl">Please enter your new email address.</h1>
		<form action="?/changeEmail" method="POST">
			<SetEmail bind:email bind:validEmail />
			<button
				type="submit"
				class="my-4 w-full rounded-full bg-orange-500 py-2 text-center text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				value=""
				disabled={!canGo}
			>
				Change Email Address
			</button>
		</form>
		{#if form?.success}
			<AuthSuccessMessage message={successMessage} />
		{:else if form?.error}
			<AuthErrorMessage {errorMessage} />
		{/if}
	</div>
</div>
