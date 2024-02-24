<script lang="ts">
	import SetPassword from '$components/form/auth/SetPassword.svelte';
	import SetEmail from '$components/form/auth/SetEmail.svelte';
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';
	import type { APIData } from '$lib/types';

	export let apiData: APIData;

	$: validPassword = false;
	$: validEmail = false;
	$: canGo = validPassword && validEmail;

	let errorMessage = '';

	$: searchaddress = `${apiData.searchaddressstreet} ${apiData.searchaddresssuburb}`;
	$: validaddress = `${apiData.validaddressstreet} ${apiData.validaddresssuburb}`;
	$: apiDataJson = JSON.stringify(apiData);
</script>

<div>
	<div class="bg-green-100 rounded-lg">
		<p class="font-semibold text-center text-lg">
			{searchaddress}
		</p>
		{#if searchaddress !== validaddress}
			<p class="text-center">( {validaddress} )</p>
		{/if}
		<p class="text-center">
			is part of the
			<span class="font-semibold">{apiData.community}</span>
			community.
		</p>
	</div>
	<div class="flex flex-col items-center max-w-container mx-auto justify-center">
		<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
			<h1 class="unstyled text-2xl text-center">
				Please enter your email address and a password to complete the registration process.
			</h1>
			<form action="/auth/validateaddress?/signup" method="POST">
				<input id="data" type="hidden" name="apiDatajson" bind:value={apiDataJson} />
				<SetEmail bind:validEmail />
				<SetPassword bind:validPassword />
				<button
					type="submit"
					class="w-full text-center rounded-full py-2 my-4 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
					value=""
					disabled={!canGo}
				>
					Create Account
				</button>
			</form>
			<div class="text-center text-gray-900">
				By signing up, you agree to the
				<a class="no-underline text-orange-600" href="/policies/termsofservice">Terms of Service</a>
				and
				<a class="no-underline text-orange-600" href="/policies/privacy">Privacy Policy</a>
			</div>
		</div>
		{#if errorMessage !== ''}
			<AuthErrorMessage message={errorMessage} />
		{/if}
	</div>
</div>
