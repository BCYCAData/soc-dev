<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CustomAddressesTable from '$components/form/tables/CustomAddressesTable.svelte';
	import CustomAddressValidationForm from '$components/form/custom-addresses/CustomAddressValidationForm.svelte';
	import type { CustomAddress } from '$lib/form.types';

	interface Props {
		customAddresses: CustomAddress[];
	}

	let { customAddresses }: Props = $props();

	let value = $state(['']);
	let validatedAddress = $state<any>(null);

	function handleAddressEdit(editedAddress: CustomAddress) {
		const formData = new FormData();
		Object.entries(editedAddress).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				formData.append(key, value.toString());
			}
		});

		fetch('?/upsertAddress', {
			method: 'POST',
			body: formData
		});
	}

	function handleValidatedAddress(validatedData: any) {
		validatedAddress = validatedData;
	}

	function handleAddValidatedAddress() {
		if (validatedAddress) {
			const addressData = {
				address: validatedAddress.validaddressstreet,
				suburb: validatedAddress.validaddresssuburb,
				postcode: validatedAddress.validaddresspostcode,
				principaladdresssiteoid: validatedAddress.principaladdresssiteoid,
				community: validatedAddress.community,
				kyng: validatedAddress.kyng
			};

			const formData = new FormData();
			Object.entries(addressData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					formData.append(key, value.toString());
				}
			});

			fetch('?/upsertAddress', {
				method: 'POST',
				body: formData
			});
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Custom Address Management</h1>
	<Accordion {value} collapsible={true} spaceY="space-y-1">
		<Accordion.Item
			value={'0'}
			controlClasses="bg-primary-400 text-xl"
			classes="bg-orange-100 font-medium"
		>
			{#snippet control()}All Custom Addresses{/snippet}
			{#snippet panel()}
				<div class="table-container" id="custom-address-table">
					<CustomAddressesTable {customAddresses} onAddressEdit={handleAddressEdit} />
				</div>
			{/snippet}
		</Accordion.Item>

		<Accordion.Item
			value={'1'}
			controlClasses="bg-primary-400 text-xl"
			classes="bg-orange-100 font-medium"
		>
			{#snippet control()}Edit Custom Address Details{/snippet}
			{#snippet panel()}
				<div class="table-container" id="custom-address-table">
					<CustomAddressesTable {customAddresses} onAddressEdit={handleAddressEdit} />
				</div>
			{/snippet}
		</Accordion.Item>

		<Accordion.Item
			value={'2'}
			controlClasses="bg-primary-400 text-xl"
			classes="bg-orange-100 font-medium"
		>
			{#snippet control()}Add New Custom Address{/snippet}
			{#snippet panel()}
				<div class="form-container" id="custom-address-form">
					<CustomAddressValidationForm onValidatedAddress={handleValidatedAddress} />

					{#if validatedAddress}
						<div class="mt-4">
							<button
								class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
								onclick={handleAddValidatedAddress}
							>
								Add Validated Address
							</button>
						</div>
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
