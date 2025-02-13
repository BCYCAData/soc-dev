<script lang="ts">
	import AddPropertyModal from '$components/page/modals/AddPropertyModal.svelte';
	import RemovePropertyModal from '$components/page/modals/RemovePropertyModal.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const properties = $derived(data.properties);
	let showAddPropertyModal = $state(false);
	let showRemovePropertyModal = $state(false);
	let selectedPropertyId = $state<string | null>(null);
	let selectedPropertyAddress = $state<string | null>(null);

	const title = $derived(
		properties.length === 1 ? 'My Property Dashboard' : 'My Properties Dashboard'
	);

	function formatAddress(property: (typeof properties)[0]) {
		return `${property.property_address_street}, ${property.property_address_suburb} ${property.property_address_postcode}`;
	}

	function handleRemoveClick(property: (typeof properties)[0]) {
		selectedPropertyId = property.id;
		selectedPropertyAddress = formatAddress(property);
		showRemovePropertyModal = true;
	}

	let showEmailPopup = $state<string | null>(null);

	$inspect('properties 2', properties);

	function toggleEmailPopup(propertyId: string) {
		showEmailPopup = showEmailPopup === propertyId ? null : propertyId;
	}
	function handleClickOutside(event: MouseEvent) {
		if (showEmailPopup) {
			const target = event.target as HTMLElement;
			if (!target.closest('.badge') && !target.closest('.popup')) {
				showEmailPopup = null;
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if showAddPropertyModal}
	<AddPropertyModal onClose={() => (showAddPropertyModal = false)} />
{/if}
{#if showRemovePropertyModal && selectedPropertyId && selectedPropertyAddress}
	<RemovePropertyModal
		onClose={() => {
			showRemovePropertyModal = false;
			selectedPropertyId = null;
			selectedPropertyAddress = null;
		}}
		propertyId={selectedPropertyId}
		propertyAddress={selectedPropertyAddress}
	/>
{/if}
<div class="mx-auto px-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">{title}</h1>

	<div class="mb-8 grid gap-6">
		{#each properties as property}
			<section class="rounded-lg bg-white p-6 shadow">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<h2 class="text-xl font-semibold">{formatAddress(property)}</h2>
						{#if property.linked_users}
							<div class="relative">
								<button
									type="button"
									class="badge inline-flex items-center gap-1"
									onclick={() => toggleEmailPopup(property.id)}
									onkeydown={(e) => e.key === 'Enter' && toggleEmailPopup(property.id)}
									aria-expanded={showEmailPopup === property.id}
									aria-haspopup="true"
								>
									<span
										>This property has {property.linked_users.length} other Registered Person{property
											.linked_users.length !== 1
											? 's'
											: ''}</span
									>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
								</button>
								{#if showEmailPopup === property.id}
									<div class="popup" role="dialog" aria-label="Linked users">
										<button
											type="button"
											class="w-full text-left"
											onclick={(e) => {
												e.stopPropagation();
											}}
											onkeydown={(e) => e.key === 'Escape' && (showEmailPopup = null)}
										>
											<h3 class="mb-2 text-sm font-medium">Linked Users:</h3>
											<ul class="space-y-1">
												{#each property.linked_users as email}
													<li class="text-sm text-gray-600">{email}</li>
												{/each}
											</ul>
										</button>
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<button
						class="hover:bg-ertiary-600 rounded bg-error-500 px-4 py-2 text-white"
						onclick={() => handleRemoveClick(property)}
					>
						Remove Property
					</button>
				</div>
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

<style>
	.badge {
		@apply inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-2.5 py-2 text-sm font-medium text-blue-800;
	}

	.popup {
		@apply absolute z-50 mt-2 w-64 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5;
	}
</style>
