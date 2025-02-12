<script lang="ts">
	import { enhance } from '$app/forms';
	import { checkStreetAddressString, checkSuburbString } from '$lib/utility';
	import Spinner from '$components/page/Spinner.svelte';
	import AddressInput from '$components/form/auth/AddressInput.svelte';
	import ValidationMessage from '$components/form/auth/ValidationMessage.svelte';

	interface Props {
		streetaddress?: string;
		suburb?: string;
		form?: any;
	}

	let loading = $state(false);
	let { streetaddress = '', suburb = '', form }: Props = $props();

	$effect(() => {
		if (form?.formInputs) {
			streetaddress = form.formInputs.streetaddress;
			suburb = form.formInputs.suburb;
		}
	});

	const canGoStreet = $derived(checkStreetAddressString(streetaddress));
	const canGoSuburb = $derived(checkSuburbString(suburb));
	const canGo = $derived(canGoStreet && canGoSuburb);
</script>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="w-5/6 rounded bg-secondary-100 p-6 text-surface-950 shadow-md sm:ml-0 sm:w-full">
		{#if loading}
			<Spinner />
		{/if}

		<h1 class="mb-4 bg-secondary-200 text-center text-2xl font-bold">
			Membership is restricted to specific Communities
		</h1>
		<p class="mb-4 text-center">
			Please enter your Street Address and Suburb to check your qualification
		</p>

		<form
			action="/auth/signup?/validate"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<AddressInput
				id="streetaddress"
				name="streetaddress"
				placeholder="STREET ADDRESS"
				autocomplete="street-address"
				required={true}
				className="mb-4 w-full rounded !border !border-secondary-700 py-3"
				bind:value={streetaddress}
			/>

			{#if !canGoStreet && streetaddress.length > 0}
				<ValidationMessage>
					The address must have a number and not use abbreviations.
				</ValidationMessage>
			{/if}

			<div class="mb-4 flex gap-4">
				<AddressInput
					id="suburb"
					name="suburb"
					placeholder="SUBURB"
					autocomplete="address-level2"
					required={true}
					className="w-2/3 rounded !border !border-secondary-700 py-3"
					bind:value={suburb}
				/>

				<button
					type="submit"
					class="w-1/3 rounded-full bg-secondary-500 py-2 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25"
					disabled={!canGo}
				>
					Check
				</button>
			</div>

			{#if !canGoSuburb && suburb.length > 0}
				<ValidationMessage>The suburb must not have State or Postcode.</ValidationMessage>
			{/if}

			{#if form?.error}
				<ValidationMessage>{form.message}</ValidationMessage>
			{/if}
		</form>
	</div>
</div>
