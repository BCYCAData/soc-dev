<script lang="ts">
	import { resolve } from '$app/paths';
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
				await goto(resolve('/personal-profile/my-property'), { invalidateAll: true });
				setTimeout(() => {
					onClose();
				}, 2000);
			} else {
				error = result.error;
			}
		} catch {
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

		<h2 id="modal-title" class="mb-4 text-xl font-semibold">Remove Property</h2>

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
			</div>
		{/if}

		<p class="mb-4">Are you sure you want to remove this property?</p>
		<p class="mb-6 font-medium">{propertyAddress}</p>

		<div class="mt-6 flex justify-end space-x-3">
			<button type="button" class="btn btn-sm preset-tonal-surface font-medium" onclick={onClose}>
				Cancel
			</button>
			<button class="btn btn-sm preset-filled-error-500 font-medium" onclick={handleRemoveProperty}>
				Remove Property
			</button>
		</div>
	</div>
</div>
