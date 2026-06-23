<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic form/table/API/map data */
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';
	import { checkStreetAddressString, checkSuburbString } from '$lib/utility';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';
	import MailtoButton from '$components/page/MailtoButton.svelte';
	import AddressInput from '$components/form/auth/AddressInput.svelte';
	import ValidationMessage from '$components/form/auth/ValidationMessage.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll, goto } from '$app/navigation';

	interface ValidationResponse {
		status: number;
		validaddressstreet: string;
		validaddresssuburb: string;
		validaddresspostcode: string;
		principaladdresssiteoid: number;
		[key: string | number]: string | number;
	}

	const { onClose } = $props<{
		onClose: () => void;
	}>();

	let loading = $state(false);
	let streetaddress = $state('');
	let suburb = $state('');
	let error = $state<string | null>(null);
	let step = $state<'validate' | 'add'>('validate');

	const canGoStreet = $derived(checkStreetAddressString(streetaddress));
	const canGoSuburb = $derived(checkSuburbString(suburb));

	let validationData = $state<ValidationResponse | null>(null);
	let successMessage = $state<string | null>(null);

	let encodedRef = $derived(
		encodeURIComponent(`SOC Address not found: '${streetaddress}, ${suburb}'`)
	);
	let mailtoUrl = $derived(`mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`);

	async function handleValidationResult(
		result: ActionResult<Record<string, unknown>, Record<string, unknown>>
	) {
		if (result.type === 'success' && result.data) {
			if (step === 'validate') {
				const dataArray = (result.data as any).data;
				const responseData = dataArray[0] as ValidationResponse;
				validationData = responseData;
				error = null;
				if (responseData.status === 200) {
					step = 'add';
					toast.success('Address validated successfully');
				} else if (responseData.status === 403) {
					error = 'Unfortunately we could not find this address.';
					toast.error('Address not found. Please check and try again.');
				} else if (responseData.status === 404) {
					error =
						'Unfortunately this address is not part of any of the communities we are engaging with at the moment.';
					toast.warning('Address is not part of our service communities');
				}
			} else {
				successMessage = 'Property added successfully!';
				toast.success('Property added successfully');
				await invalidateAll();
				await goto(resolve('/personal-profile/my-property'), { invalidateAll: true });
				setTimeout(() => {
					onClose();
				}, 2000);
			}
		} else if ('error' in result) {
			error = String(result.error);
			toast.error('Failed to add property. Please check the form and try again.');
			validationData = null;
		}
	}

	const canGo = $derived(
		step === 'validate' ? canGoStreet && canGoSuburb : validationData?.status === 200
	);
</script>

<div
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	class="fixed inset-0 z-50 flex items-center justify-center"
>
	<button class="bg-surface-950/50 fixed inset-0" onclick={onClose} aria-label="Close modal"
	></button>
	<div class="card bg-surface-50-950 relative w-full max-w-md p-6 shadow-xl">
		<button
			type="button"
			class="text-surface-500 hover:bg-surface-100 hover:text-surface-700 absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
			onclick={onClose}
		>
			✕
		</button>

		<h2 id="modal-title" class="mb-4 text-xl font-semibold">Add New Property</h2>

		{#if loading}
			<div class="bg-surface-50-950/75 absolute inset-0 flex items-center justify-center">
				<Spinner />
			</div>
		{/if}

		{#if successMessage}
			<div class="bg-success-100 text-success-700 mb-4 rounded-md p-4">
				<p>{successMessage}</p>
			</div>
		{/if}

		{#if error}
			<div class="bg-error-100 text-error-700 mb-4 rounded-md p-4">
				<p>{error}</p>
				{#if error.includes('could not find this address')}
					<MailtoButton href={mailtoUrl} />
				{/if}
			</div>
		{/if}

		<form
			action={step === 'validate' ? '?/validate' : '?/addproperty'}
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					handleValidationResult(result);
					loading = false;
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-3">
				<div>
					<AddressInput
						id="streetaddress"
						name="streetaddress"
						placeholder="Street Address"
						autocomplete="street-address"
						required={true}
						bind:value={streetaddress}
					/>
					{#if !canGoStreet && streetaddress.length > 0}
						<ValidationMessage>
							The address must have a number and not use abbreviations.
						</ValidationMessage>
					{/if}
				</div>

				<div>
					<AddressInput
						id="suburb"
						name="suburb"
						placeholder="Suburb"
						autocomplete="address-level2"
						required={true}
						bind:value={suburb}
					/>
					{#if !canGoSuburb && suburb.length > 0}
						<ValidationMessage>The suburb must not have State or Postcode.</ValidationMessage>
					{/if}
				</div>
			</div>

			{#if validationData}
				<input type="hidden" name="validaddressstreet" value={validationData.validaddressstreet} />
				<input type="hidden" name="validaddresssuburb" value={validationData.validaddresssuburb} />
				<input
					type="hidden"
					name="validaddresspostcode"
					value={validationData.validaddresspostcode}
				/>
				<input
					type="hidden"
					name="principaladdresssiteoid"
					value={validationData.principaladdresssiteoid}
				/>
			{/if}

			<div class="mt-6 flex justify-end space-x-3">
				<button type="button" class="btn btn-sm preset-tonal-surface font-medium" onclick={onClose}>
					Cancel
				</button>
				<button
					class="btn btn-sm preset-filled-secondary-500 font-medium disabled:cursor-not-allowed disabled:opacity-50"
					type="submit"
					disabled={!canGo || loading}
					aria-busy={loading}
				>
					{#if loading}
						<span class="flex items-center gap-2">
							<Spinner size="16" />
							{step === 'validate' ? 'Validating...' : 'Adding...'}
						</span>
					{:else}
						{step === 'validate' ? 'Validate Address' : 'Add Property'}
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
