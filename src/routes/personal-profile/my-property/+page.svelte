<script lang="ts">
	import AddPropertyModal from '$components/page/modals/AddPropertyModal.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const properties = $derived(data.properties);
	let showAddPropertyModal = $state(false);

	const title = $derived(
		properties.length === 1 ? 'My Property Dashboard' : 'My Properties Dashboard'
	);

	function formatAddress(property: (typeof properties)[0]) {
		return `${property.property_address_street}, ${property.property_address_suburb} ${property.property_address_postcode}`;
	}
</script>

//TODO: Implement AddPropertyModal

<svelte:head>
	<title>{title}</title>
</svelte:head>
{#if showAddPropertyModal}
	<AddPropertyModal onClose={() => (showAddPropertyModal = false)} />
{/if}
<div class="mx-auto max-w-4xl px-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">{title}</h1>

	<div class="mb-8 grid gap-6">
		{#each properties as property}
			<section class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold">{formatAddress(property)}</h2>
				<div class="grid grid-cols-2 gap-4">
					<a
						href="my-property/{property.id}/assets"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Property Assets
					</a>
					<a
						href="my-property/{property.id}/hazards"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Property Hazards
					</a>
					<a
						href="my-property/{property.id}/my-map"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Property Map
					</a>
					<a
						href="my-property/{property.id}/resources"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Property Resources
					</a>
				</div>
			</section>
		{/each}
	</div>

	<button
		class="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
		onclick={() => (showAddPropertyModal = true)}
	>
		Add New Property
	</button>
</div>
