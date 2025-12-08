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

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-secondary-100 p-6 text-surface-950 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-4 text-center text-2xl font-bold text-red-600">
			Make sure you enter the correct address.
		</h1>
		<h2 class="mb-6 text-center text-lg font-semibold">THERE IS NO WAY TO UNDO THIS.</h2>
		<h3 class="mb-4 text-center text-lg">Please enter your new email address.</h3>

		<form action="?/changeEmail" method="POST">
			<SetEmail bind:email bind:validEmail />

			<button
				type="submit"
				class="mt-6 w-full rounded-full bg-secondary-500 py-2 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo}
			>
				Change Email Address
			</button>

			{#if form?.success}
				<div class="mt-4">
					<AuthSuccessMessage message={successMessage} />
				</div>
			{:else if form?.error}
				<div class="mt-4">
					<AuthErrorMessage {errorMessage} />
				</div>
			{/if}
		</form>
	</div>
</div>
