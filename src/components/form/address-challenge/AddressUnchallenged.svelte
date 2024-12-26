<script lang="ts">
	import { checkStreetAddressString, checkSuburbString } from '$lib/utility';
	import Spinner from '$components/page/Spinner.svelte';
	import AddressInput from '$components/form/auth/AddressInput.svelte';
	import ValidationMessage from '$components/form/auth/ValidationMessage.svelte';

	interface Props {
		streetaddress?: string;
		suburb?: string;
	}

	let loading = false;
	let { streetaddress = '', suburb = '' }: Props = $props();

	const canGoStreet = $derived(checkStreetAddressString(streetaddress));
	const canGoSuburb = $derived(checkSuburbString(suburb));
	const canGo = $derived(canGoStreet && canGoSuburb);
</script>

{#if loading}
	<Spinner />
{/if}

<div class="address-container">
	<h1 class="address-title">Membership is restricted to specific Communities</h1>
	<p class="address-subtitle">
		Please enter your Street Address and Suburb to check your qualification
	</p>

	<form action="/auth/signup?/validate" method="POST">
		<AddressInput
			id="streetaddress"
			name="streetaddress"
			placeholder="STREET ADDRESS"
			autocomplete="street-address"
			required={true}
			bind:value={streetaddress}
		/>

		{#if !canGoStreet && streetaddress.length > 0}
			<ValidationMessage>
				The address must have a number and not use abbreviations.
			</ValidationMessage>
		{/if}

		<div class="suburb-section">
			<AddressInput
				id="suburb"
				name="suburb"
				placeholder="SUBURB"
				autocomplete="address-level2"
				required={true}
				className="w-1/2"
				bind:value={suburb}
			/>

			<button type="submit" class="check-button" disabled={!canGo}>Check</button>
		</div>

		{#if !canGoSuburb && suburb.length > 0}
			<ValidationMessage>The suburb must not have State or Postcode.</ValidationMessage>
		{/if}
	</form>
</div>

<style lang="postcss">
	.address-container {
		@apply w-full rounded bg-secondary-50 px-2 py-6 text-surface-950 shadow-md sm:w-5/6 sm:p-6;
	}

	.address-title {
		@apply bg-secondary-200 text-center text-xl font-bold;
	}

	.address-subtitle {
		@apply mb-2 text-center;
	}

	.suburb-section {
		@apply mt-2 flex justify-between sm:mt-4;
	}

	.check-button {
		@apply w-1/3 cursor-pointer rounded-full bg-secondary-500 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none disabled:opacity-25;
	}
</style>
