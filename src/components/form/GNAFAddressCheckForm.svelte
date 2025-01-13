<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { onAddressChecked } = $props<{
		onAddressChecked: (data: any) => void;
	}>();

	let checking = $state(false);
	let result = $state<{ is_match: boolean; geojson: any } | null>(null);

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
			}
		};
	};
</script>

<form method="POST" action="?/checkGNAFAddress" use:enhance={handleSubmit}>
	<div class="flex w-full flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-4">
			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Number</span>
				<input class="input w-12" name="number" type="text" bind:value={formData.number} required />
			</label>

			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Street</span>
				<input class="input w-48" name="street" type="text" bind:value={formData.street} required />
			</label>

			<label class="label flex flex-row items-center gap-2">
				<span class="whitespace-nowrap">Street Type</span>
				<input
					class="input w-32"
					name="streetType"
					type="text"
					bind:value={formData.streetType}
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
					required
				/>
			</label>
		</div>

		<button
			type="submit"
			class="rounded-md border border-transparent bg-tertiary-600 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
			disabled={checking}
		>
			{checking ? 'Checking...' : 'Check'}
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
