<script lang="ts">
	import { enhance } from '$app/forms';

	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CustomAddressesTable from '$components/form/tables/CustomAddressesTable.svelte';
	import CustomAddressValidationForm from '$components/form/custom-addresses/CustomAddressValidationForm.svelte';
	import MatchCodesDisplay from '$components/page/tabs/addresses/MatchCodesDisplay.svelte';
	import HelpBadge from '$components/page/HelpBadge.svelte';

	import type { CustomAddress } from '$lib/form.types';

	import { admimHelpMessages } from '$lib/constants';

	const { searhAddressHelp, validatedAddressHelp, gnafAddressHelp } =
		admimHelpMessages.site.data.addresses;

	interface Props {
		customAddresses: CustomAddress[];
	}

	let { customAddresses }: Props = $props();

	let value = $state(['']);
	let validatedData = $state<any>(null);
	let validatedAddress = $derived(
		validatedData
			? {
					validaddressstreet: validatedData[0].validaddressstreet ?? '',
					validaddresssuburb: validatedData[0].validaddresssuburb ?? '',
					validaddresspostcode: validatedData[0].validaddresspostcode ?? '',
					principaladdresssiteoid: validatedData[0].principaladdresssiteoid ?? '',
					community: validatedData[0].community ?? '',
					kyng: validatedData[0].kyng ?? ''
				}
			: null
	);

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

	function handleValidatedAddress(data: any) {
		validatedData = data;
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-2 text-2xl font-bold">Custom Address Management</h1>
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
						<div class="mt-1 flex flex-col gap-y-4">
							<div class="flex justify-between">
								<div class="flex flex-col gap-y-4">
									<div class="flex flex-row items-center">
										<span class="pl-2 text-lg font-semibold">Search Address</span>
										<span
											class="mx-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-lg text-gray-600"
										>
											{validatedData[0].searchaddressstreet}, {validatedData[0].searchaddresssuburb}
										</span>
										<span><HelpBadge helpText={searhAddressHelp} /></span>
									</div>

									<div class="flex flex-row items-center">
										<span class="pl-2 text-lg font-semibold">Validated Address</span>
										<span
											class="mx-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-lg text-gray-600"
										>
											{validatedData[0].validaddressstreet}, {validatedData[0].validaddresssuburb}
											{validatedData[0].validaddresspostcode}
										</span>
										<span><HelpBadge helpText={validatedAddressHelp} /></span>
									</div>

									<div class="flex flex-row items-center">
										<span class="pl-2 text-lg font-semibold">G-NAF Address</span>
										<span
											class="mx-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-lg text-gray-600"
										>
											{validatedData[0].geocoder_result.formattedAddress}
										</span>
										<span><HelpBadge helpText={gnafAddressHelp} /></span>
									</div>

									<div class="flex flex-row items-center">
										<span class="pl-2 text-lg font-semibold">Community</span>
										<span
											class="ml-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-lg text-gray-600"
											>{validatedData[0].community}</span
										>
									</div>

									<div class="flex flex-row items-center">
										<span class="pl-2 text-lg font-semibold">KYNG</span>
										<span
											class="ml-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-lg text-gray-600"
											>{validatedData[0].kyng || 'External'}</span
										>
									</div>
								</div>

								<div>
									<MatchCodesDisplay
										matchType={validatedData[0].geocoder_result.matchType}
										matchQuality={validatedData[0].geocoder_result.matchQuality}
										matchScore={validatedData[0].geocoder_result.matchScore}
										matchcodes={validatedData[0].matchcodes}
									/>
								</div>
							</div>

							<form
								method="POST"
								action="?/upsertAddress"
								use:enhance
								class="mt-1 flex items-center justify-center gap-x-4"
							>
								<input type="hidden" name="address" value={validatedAddress.validaddressstreet} />
								<input type="hidden" name="suburb" value={validatedAddress.validaddresssuburb} />
								<input
									type="hidden"
									name="postcode"
									value={validatedAddress.validaddresspostcode}
								/>
								<input
									type="hidden"
									name="principaladdresssiteoid"
									value={validatedAddress.principaladdresssiteoid}
								/>
								<input type="hidden" name="community" value={validatedAddress.community} />
								<input type="hidden" name="kyng" value={validatedAddress.kyng || 'External'} />

								<div class="text-xs text-gray-500">
									<p>
										© State Government of NSW and Spatial Services (DCS) {new Date().getFullYear()}.
									</p>
									<p>
										G-NAF © Geoscape Australia licensed by the Commonwealth of Australia under the
									</p>
									<p class="ml-4">
										Open Geo-coded National Address File (G-NAF) End User Licence Agreement.
									</p>
									{@html validatedData[0].geocoder_result.attribution.replace(
										/(https?:\/\/[^\s]+)/g,
										'<a href="$1" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
									)}
								</div>

								<button
									type="submit"
									class="rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2 sm:text-sm"
									disabled={validatedData[0].geocoder_result.matchQuality === 'fair' ||
										(validatedData[0].matchcodes.localityName !== 'exact' &&
											validatedData[0].matchcodes.localityName !== 'neighbour')}
								>
									Add Validated Address
								</button>
							</form>
						</div>
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
