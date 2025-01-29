<script lang="ts">
	import { enhance } from '$app/forms';
	import { checkStreetAddressString, checkSuburbString } from '$lib/utility';
	import Spinner from '$components/page/Spinner.svelte';
	import AddressInput from '$components/form/auth/AddressInput.svelte';
	import ValidationMessage from '$components/form/auth/ValidationMessage.svelte';
	import type { ActionResult } from '@sveltejs/kit';

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

	// function isValidationResponse(data: Record<string, unknown>): data is ValidationResponse {
	// 	const validationData = Array.isArray(data.data) ? data.data[0] : null;

	// 	if (!validationData) return false;

	// 	return (
	// 		typeof validationData.status === 'number' &&
	// 		typeof validationData.validaddressstreet === 'string' &&
	// 		typeof validationData.validaddresssuburb === 'string' &&
	// 		typeof validationData.validaddresspostcode === 'string' &&
	// 		typeof validationData.principaladdresssiteoid === 'number'
	// 	);
	// }

	function handleValidationResult(
		result: ActionResult<Record<string, unknown>, Record<string, unknown>>
	) {
		if (result.type === 'success' && result.data) {
			const dataArray = (result.data as any).data; // Access the nested data property
			const responseData = dataArray[0] as ValidationResponse;
			validationData = responseData;
			error = null;
			if (responseData.status === 200) {
				step = 'add';
			} else if (responseData.status === 403) {
				error =
					'Unfortunately we could not find this address. If you are sure it exists please send us a message.';
			} else if (responseData.status === 404) {
				error =
					'Unfortunately this address is not part of any of the communities we are engaging with at the moment.';
			}
		} else if ('error' in result) {
			error = String(result.error);
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
	<button class="fixed inset-0 bg-black bg-opacity-50" onclick={onClose} aria-label="Close modal"
	></button>
	<div class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
		<button
			type="button"
			class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
			onclick={onClose}
		>
			✕
		</button>

		<h2 id="modal-title" class="mb-4 text-xl font-semibold">Add New Property</h2>

		{#if loading}
			<div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
				<Spinner />
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

			{#if error}
				<ValidationMessage>{error}</ValidationMessage>
			{/if}

			<div class="mt-6 flex justify-end space-x-3">
				<button
					type="button"
					class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
					onclick={onClose}
				>
					Cancel
				</button>
				<button
					class="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
					type="submit"
					disabled={!canGo}
				>
					{step === 'validate' ? 'Validate Address' : 'Add Property'}
				</button>
			</div>
		</form>
	</div>
</div>
