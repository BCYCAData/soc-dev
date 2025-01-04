<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		onValidatedAddress: (validatedData: any) => void;
	}

	let { onValidatedAddress }: Props = $props();
	let address = $state('');
	let suburb = $state('');
	let validationResult: any = $state(null);
	let isLoading = $state(false);
	let error = $state('');

	function handleValidation(result: any) {
		if (result.data.success) {
			validationResult = result.data.validatedAddressData;
			onValidatedAddress(result.data.validatedAddressData);
			error = '';
		} else {
			error = result.data.message || 'Validation failed';
			validationResult = null;
		}
	}
</script>

<form
	method="POST"
	action="?/validateAddress"
	use:enhance={({ formElement, formData, action, cancel }) => {
		isLoading = true;
		error = '';

		return async ({ result }) => {
			handleValidation(result);
			isLoading = false;
		};
	}}
>
	<div class="flex items-end gap-4">
		<div class="form-group flex-1">
			<label for="address" class="label">Street Address</label>
			<input
				type="text"
				name="address"
				id="address"
				bind:value={address}
				class="input w-full"
				required
			/>
		</div>

		<div class="form-group" style="width: 200px">
			<label for="suburb" class="label">Suburb</label>
			<input
				type="text"
				name="suburb"
				id="suburb"
				bind:value={suburb}
				class="input w-full"
				required
			/>
		</div>

		<button
			type="submit"
			class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
			disabled={isLoading}
		>
			{#if isLoading}
				Validating...
			{:else}
				Validate Address
			{/if}
		</button>
	</div>

	{#if error}
		<div class="mt-4 rounded bg-error-500/20 p-4 text-error-500">
			{error}
		</div>
	{/if}

	{#if validationResult}
		<div class="mt-4">
			<h3 class="text-lg font-semibold">Validation Result:</h3>
			<pre class="bg-surface-100-800-token rounded p-4">
                {JSON.stringify(validationResult, null, 2)}
            </pre>
		</div>
	{/if}
</form>
