<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';

	import Spinner from '$components/page/Spinner.svelte';

	const { onClose, propertyId, propertyAddress } = $props<{
		onClose: () => void;
		propertyId: string;
		propertyAddress: string;
	}>();

	let loading = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	async function handleRemoveProperty(event: Event) {
		event.preventDefault();
		loading = true;

		try {
			const response = await fetch('?/removeproperty', {
				method: 'POST',
				body: JSON.stringify({ propertyId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.type === 'success') {
				successMessage = 'Property removed successfully!';
				await invalidateAll();
				await goto('/personal-profile/my-property', { invalidateAll: true });
				setTimeout(() => {
					onClose();
				}, 2000);
			} else {
				error = result.error;
			}
		} catch (e) {
			error = 'Failed to remove property';
		} finally {
			loading = false;
		}
	}
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

		<h2 id="modal-title" class="mb-4 text-xl font-semibold">Remove Property</h2>

		{#if loading}
			<div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
				<Spinner />
			</div>
		{/if}

		{#if successMessage}
			<div class="mb-4 rounded-md bg-green-100 p-4 text-green-700">
				<p>{successMessage}</p>
			</div>
		{/if}

		{#if error}
			<div class="mb-4 rounded-md bg-red-100 p-4 text-red-700">
				<p>{error}</p>
			</div>
		{/if}

		<p class="mb-4">Are you sure you want to remove this property?</p>
		<p class="mb-6 font-medium">{propertyAddress}</p>

		<div class="mt-6 flex justify-end space-x-3">
			<button
				type="button"
				class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				onclick={onClose}
			>
				Cancel
			</button>
			<button
				class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				onclick={handleRemoveProperty}
			>
				Remove Property
			</button>
		</div>
	</div>
</div>
