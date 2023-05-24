<script lang="ts">
	import { stayInTouchOptions } from '$lib/profileOptions';
	import TextAreaInput from '../inputs/TextAreaInput.svelte';

	import type { UserPostalAddressData, UserProfileData } from '$lib/custom.types';

	export let userProfileData: UserProfileData;
	export let userPostalAddressData: UserPostalAddressData;

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	const postalWasChecked = userProfileData?.stay_in_touch_choices?.includes(5);
	let postalChecked: boolean | undefined;
	$: postalChecked = userProfileData?.stay_in_touch_choices?.includes(5);
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	How would you prefer to stay in touch?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
<div
	class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each stayInTouchOptions as { value, lable }}
		<div class="flex items-center col-span-1">
			<input
				class="w-6 h-6 ml-8"
				name="stay_in_touch_choices"
				type="checkbox"
				on:change={() => {
					postalChecked = userProfileData.stay_in_touch_choices?.includes(5);
				}}
				bind:group={userProfileData.stay_in_touch_choices}
				{value}
			/>
			<label
				class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
				for="stay_in_touch_choices"
				>{lable}
			</label>
		</div>
	{/each}
</div>
<input type="text" name="postal_was_rented" value={postalWasChecked} hidden />
<h2 hidden={!postalChecked} class="mb-1 text-xl font-semibold text-gray-900">
	Please enter your postal address:
</h2>
<div hidden={!postalChecked} class="p-2 rounded-lg bg-orange-200">
	<div class="grid sm:grid-cols-12 gap-0">
		<div class="flex items-center">
			<label
				hidden={!postalChecked}
				class="unstyled px-3 text-lg text-primary-700 font-Poppins"
				for="postal_address_street">ADDRESS</label
			>
		</div>
		<div class="flex items-center ml-3 col-span-10">
			<input
				hidden={!postalChecked}
				type="text"
				id="postal_address_street"
				name="postal_address_street"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				placeholder="STREET ADDRESS"
				autocomplete="street-address"
				on:input={setUpperCase}
				style="text-transform:uppercase"
				bind:value={userPostalAddressData.postal_address_street}
			/>
		</div>
	</div>

	<div class="p-2 rounded-lg bg-orange-200">
		<div class="grid sm:grid-cols-12 gap-0">
			<div class="flex items-center">
				<label
					hidden={!postalChecked}
					class="unstyled pl-2 text-lg text-primary-700 font-Poppins"
					for="property_address_suburb">SUBURB</label
				>
			</div>
			<div class="flex items-center col-span-6">
				<input
					hidden={!postalChecked}
					type="text"
					id="postal_address_suburb"
					name="postal_address_suburb"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
					placeholder="SUBURB"
					autocomplete="address-level2"
					on:input={setUpperCase}
					style="text-transform:uppercase"
					bind:value={userPostalAddressData.postal_address_suburb}
				/>
			</div>
			<div class="flex items-center col-span-2">
				<label
					hidden={!postalChecked}
					class="unstyled text-lg text-primary-700 font-Poppins sm:pl-16"
					for="postal_address_postcode">POSTCODE</label
				>
			</div>
			<div class="flex items-center col-span-3 pr-20">
				<input
					hidden={!postalChecked}
					type="text"
					id="postal_address_postcode"
					name="property_address_postcode"
					class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
					placeholder="POSTCODE"
					autocomplete="postal-code"
					style="text-transform:uppercase"
					bind:value={userPostalAddressData.postal_address_postcode}
				/>
			</div>
		</div>
	</div>
</div>
<TextAreaInput
	headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
	headingText="Do you have any other comments that you would like to add?"
	lableClass={null}
	lableText={null}
	divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
	nameText="other_comments"
	textAreaClass="w-full resize-y sm:text-lg"
	bind:inputValue={userProfileData.other_comments}
/>
