<script lang="ts">
	import SetPassword from '$components/form/auth/SetPassword.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import type { APIData } from '$lib/types';

	interface Props {
		apiData: APIData;
	}

	let { apiData = $bindable() }: Props = $props();

	let validPassword = $state(false);
	let validEmail = $state(false);
	let errorMessage = $state('');

	let canGo = $derived(validPassword && validEmail);
	let searchAddress = $derived(`${apiData.searchaddressstreet} ${apiData.searchaddresssuburb}`);
	let validAddress = $derived(`${apiData.validaddressstreet} ${apiData.validaddresssuburb}`);
	let apiDataJson = $derived(JSON.stringify(apiData));
</script>

<div class="flex flex-col gap-4">
	<div class="rounded-lg bg-green-100 p-4 text-center">
		<p class="text-scale-5 font-semibold">
			{searchAddress}
		</p>
		{#if searchAddress !== validAddress}
			<p>( {validAddress} )</p>
		{/if}
		<p>
			is part of the
			<span class="font-semibold">{apiData.community}</span>
			community.
		</p>
	</div>

	<div class="max-w-container mx-auto flex flex-col items-center justify-center">
		<div class="w-5/6 rounded bg-secondary-50 p-6 text-surface-950 shadow-md sm:ml-0 sm:w-full">
			<h1 class="h1 mb-6 text-center text-2xl">
				Please enter your email address and a password to complete the registration process.
			</h1>

			<form action="/auth/signup?/signup" method="POST" class="flex flex-col gap-4">
				<input id="data" type="hidden" name="apiDatajson" value={apiDataJson} />
				<SetEmail bind:validEmail />
				<SetPassword bind:validPassword />

				<button type="submit" class="btn-primary" disabled={!canGo}> Create Account </button>

				<div class="text-center text-surface-950">
					By signing up, you agree to the
					<a class="link" href="/policies/termsofservice">Terms of Service</a>
					and
					<a class="link" href="/policies/privacy">Privacy Policy</a>
				</div>
			</form>
		</div>

		{#if errorMessage}
			<AuthErrorMessage {errorMessage} />
		{/if}
	</div>
</div>

<style lang="postcss">
	.btn-primary {
		@apply my-4 w-full rounded-full bg-secondary-500 py-2 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25;
	}

	.link {
		@apply text-orange-600 no-underline hover:underline;
	}
</style>
