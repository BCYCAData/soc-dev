<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from '$stores/toaststore';
	import Spinner from '$components/page/Spinner.svelte';

	let { onAddressChecked } = $props<{
		onAddressChecked: (data: any) => void;
	}>();

	let checking = $state(false);
	let result = $state<{ is_match: boolean; geojson: any } | null>(null);
	let touched = $state(false);

	let formData = $state({
		number: '',
		street: '',
		streetType: '',
		locality: ''
	});

	const handleSubmit: SubmitFunction = () => {
		checking = true;
		return async ({ result: actionResult }) => {
			checking = false;
			if (actionResult.type === 'success') {
				result = actionResult.data?.checkedAddressData;
				onAddressChecked(result);

				if (result?.is_match) {
					toast.success('Address found in GNAF database');
				} else {
					toast.warning('Address not found in GNAF database');
				}
			} else if (actionResult.type === 'error') {
				toast.error(actionResult.error?.message || 'Failed to check address. Please try again.');
			} else if (actionResult.type === 'failure') {
				toast.error(actionResult.data?.message || 'Failed to check address. Please try again.');
			}
		};
	};
</script>

<form method="POST" action="?/checkGNAFAddress" use:enhance={handleSubmit}>
	<div class="flex w-full flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-4">
			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Number</span>
				<input
					class="input w-12"
					name="number"
					type="text"
					bind:value={formData.number}
					aria-invalid={touched && !formData.number}
					onfocus={() => (touched = true)}
					required
				/>
			</label>

			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Street</span>
				<input
					class="input w-48"
					name="street"
					type="text"
					bind:value={formData.street}
					aria-invalid={touched && !formData.street}
					onfocus={() => (touched = true)}
					required
				/>
			</label>

			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Street Type</span>
				<input
					class="input w-32"
					name="streetType"
					type="text"
					bind:value={formData.streetType}
					aria-invalid={touched && !formData.streetType}
					onfocus={() => (touched = true)}
					required
				/>
			</label>

			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Locality</span>
				<input
					class="input w-40"
					name="locality"
					type="text"
					bind:value={formData.locality}
					aria-invalid={touched && !formData.locality}
					onfocus={() => (touched = true)}
					required
				/>
			</label>
		</div>

		<button
			type="submit"
			class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-1 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
			disabled={checking}
			aria-busy={checking}
		>
			{#if checking}
				<span class="flex items-center gap-2">
					<Spinner size="16" />
					Checking...
				</span>
			{:else}
				Check
			{/if}
		</button>
	</div>
	{#if result}
		<div class=" {result.is_match ? 'bg-success-50' : 'bg-error-50'}">
			<p>Match: {result.is_match ? 'Yes' : 'No'}</p>
			{#if result.geojson}
				<p>Address: {result.geojson.formattedAddress}</p>
				<p>Cadastral ID: {result.geojson.cadastralIdentifier}</p>
			{/if}
		</div>
	{/if}
</form>
