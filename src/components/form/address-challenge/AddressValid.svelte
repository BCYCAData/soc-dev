<script lang="ts">
	import { enhance } from '$app/forms';
	import SetPassword from '$components/form/auth/SetPassword.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import type { APIData } from '$lib/types';

	interface Props {
		apiData: APIData;
		form: any;
	}

	let { apiData = $bindable(), form }: Props = $props();
	let email = $state('');
	let password = $state('');
	let validPassword = $state(false);
	let validEmail = $state(false);
	//@ts-ignore
	let loading = $state(false);

	let canGo = $derived(validPassword && validEmail);
	let searchAddress = $derived(`${apiData.searchaddressstreet} ${apiData.searchaddresssuburb}`);
	let validAddress = $derived(`${apiData.validaddressstreet} ${apiData.validaddresssuburb}`);
	let apiDataJson = $derived(JSON.stringify(apiData));
	$effect(() => {
		if (form?.formInputs) {
			email = form.formInputs.email;
			password = form.formInputs.password;
		}
	});
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
		<div class="bg-secondary-50 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
			<h1 class="h1 mb-6 text-center text-2xl">
				Please enter your email address and a password to complete the registration process.
			</h1>

			<form
				action="/auth/signup?/signup"
				method="POST"
				class="flex flex-col gap-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<input id="data" type="hidden" name="apiDatajson" value={apiDataJson} />
				<SetEmail bind:email bind:validEmail />
				<SetPassword bind:password bind:validPassword />

				<button
					type="submit"
					class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 my-4 w-full rounded-full py-2 text-center focus:outline-none disabled:opacity-25"
					disabled={!canGo}
				>
					Create Account
				</button>

				<div class="text-surface-950 text-center">
					By signing up, you agree to the
					<a class="text-orange-600 no-underline hover:underline" href="/policies/termsofservice"
						>Terms of Service</a
					>
					and
					<a class="text-orange-600 no-underline hover:underline" href="/policies/privacy"
						>Privacy Policy</a
					>
				</div>
			</form>
		</div>

		{#if form?.error}
			<AuthErrorMessage errorMessage={form?.message ?? ''} />
		{/if}
		<div class="text-surface-950 text-center">
			By signing up, you agree to the
			<a class="text-orange-600 no-underline hover:underline" href="/policies/termsofservice"
				>Terms of Service</a
			>
			and
			<a class="text-orange-600 no-underline hover:underline" href="/policies/privacy"
				>Privacy Policy</a
			>
		</div>
	</div>
</div>
