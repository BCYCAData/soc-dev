<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$stores/toaststore';
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
	let isSubmitting = $state(false);
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
	<div class="bg-secondary-100 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
		{#if loading}
			<Spinner />
		{/if}

		<h1 class="bg-secondary-200 mb-4 text-center text-2xl font-bold">
			Membership is restricted to specific Communities
		</h1>
		<p class="mb-4 text-center">
			Please enter your Street Address and Suburb to check your qualification
		</p>

		<form
			action="/auth/signup?/validate"
			use:enhance={() => {
				loading = true;
				isSubmitting = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Address validated successfully!');
					} else if (result.type === 'error') {
						toast.error(result.error?.message || 'Failed to validate address. Please try again.');
					} else if (result.type === 'failure') {
						toast.error(String(result.data?.message || 'Address validation failed. Please check your input.'));
					}
					await update();
					loading = false;
					isSubmitting = false;
				};
			}}
		>
			<AddressInput
				id="streetaddress"
				name="streetaddress"
				placeholder="STREET ADDRESS"
				autocomplete="street-address"
				required={true}
				className="mb-4 w-full rounded border! border-secondary-700! py-3"
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
					className="w-2/3 rounded border! border-secondary-700! py-3"
					bind:value={suburb}
				/>

				<button
					type="submit"
					class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 w-1/3 rounded-full py-2 text-center focus:outline-none disabled:opacity-25"
					disabled={!canGo || loading || isSubmitting}
					aria-busy={isSubmitting}
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
