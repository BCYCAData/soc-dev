<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$components/page/Spinner.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import CustomAddressesTable from '$components/form/tables/CustomAddressesTable.svelte';
	import CustomAddressValidationForm from '$components/form/custom-addresses/CustomAddressValidationForm.svelte';
	import MatchCodesDisplay from '$components/page/tabs/addresses/MatchCodesDisplay.svelte';
	import HelpBadge from '$components/page/HelpBadge.svelte';

	import type { CustomAddress } from '$lib/form.types';

	import { admimHelpMessages } from '$lib/constants';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$stores/toaststore';

	const { searhAddressHelp, validatedAddressHelp, gnafAddressHelp } =
		admimHelpMessages.site.data.addresses;

	interface Props {
		customAddresses: CustomAddress[];
	}

	let { customAddresses }: Props = $props();

	let value = $state(['']);
	let validatedData = $state<any>(null);
	let formMessage = $state('');
	let formStatus = $state<'success' | 'error' | ''>('');
	let isSubmitting = $state(false);
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
	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				const data = result.data;
				if (data?.success) {
					formStatus = 'success';
					formMessage = 'Address successfully added';
					toast.success('Custom address added successfully');
					validatedData = null;
					await invalidateAll();
				} else {
					formStatus = 'error';
					formMessage = data?.message || 'Failed to add address';
					toast.error(data?.message || 'Failed to add address. Please try again.');
				}
			} else if (result.type === 'error') {
				formStatus = 'error';
				formMessage = 'An unexpected error occurred';
				toast.error(result.error?.message || 'Failed to add address. Please try again.');
			} else if (result.type === 'failure') {
				formStatus = 'error';
				formMessage = result.data?.message || 'Failed to add address';
				toast.error(result.data?.message || 'Failed to add address. Please try again.');
			}
			isSubmitting = false;
		};
	};
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
					{#if formMessage}
						<div
							class={`mt-4 rounded p-2 text-center ${formStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
						>
							{formMessage}
						</div>
					{/if}
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
								use:enhance={handleSubmit}
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
								<input
									type="hidden"
									name="addresspoint_geom"
									value={`SRID=7844;POINT(${validatedData[0].geojson.coordinates[0]} ${validatedData[0].geojson.coordinates[1]})`}
								/>
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
								{#if validatedData[0].geocoder_result.matchQuality === 'fair' || (validatedData[0].matchcodes.localityName !== 'exact' && validatedData[0].matchcodes.localityName !== 'neighbour')}
									<button
										type="button"
										onclick={() => (validatedData = null)}
										class="flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-base font-medium text-red-500 shadow-sm sm:text-sm"
									>
										This address cannot be validated
									</button>
								{:else}
									<button
										type="submit"
										class="bg-tertiary-600 hover:bg-tertiary-700 focus:ring-tertiary-500 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
										disabled={isSubmitting}
										aria-busy={isSubmitting}
									>
										{#if isSubmitting}
											<span class="flex items-center gap-2">
												<Spinner size="16" />
												Adding...
											</span>
										{:else}
											Add Validated Address
										{/if}
									</button>
								{/if}
							</form>
						</div>
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
