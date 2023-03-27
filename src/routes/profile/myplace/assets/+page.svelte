<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { yesNoOptions, yesNoMaybeOptions } from '$lib/profileOptions';
	import { modalStore } from '@skeletonlabs/skeleton';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import SaveProfilePrompt from '$components/form/SaveProfilePrompt.svelte';

	import type { PageData } from './$types';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	let unsaved = false;

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: SaveProfilePrompt
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			modalClasses: '!overflow-y-auto !max-h-full !relative'
		};
		modalStore.trigger(d);
	}

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerCustomModal();
		}
	});

	export let data: PageData;
	$: ({ propertyProfileData } = data);
</script>

<svelte:head>
	<title>Profile-My Place-Assets</title>
</svelte:head>

<form
	id="profileMyPlaceAssetsForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="text-base font-semibold text-gray-900">
		How many pets do you usually have at this property?
	</h2>
	<div class="flex flex-row justify-around p-2 rounded-lg bg-orange-300 sm:text-lg">
		<NumberInput
			name="number_dogs"
			lable="Dogs"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded py-1 sm:text-base"
			bind:inputValue={propertyProfileData.number_dogs}
		/>
		<NumberInput
			name="number_cats"
			lable="Cats"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded py-1 sm:text-base"
			bind:inputValue={propertyProfileData.number_cats}
		/>
		<NumberInput
			name="number_birds"
			lable="Birds"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded py-1 sm:text-base"
			bind:inputValue={propertyProfileData.number_birds}
		/>
		<NumberInput
			name="number_other_pets"
			lable="Other"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded py-1 sm:text-base"
			bind:inputValue={propertyProfileData.number_other_pets}
		/>
	</div>
	<h2 class="text-base font-semibold text-gray-900">Do you have livestock?</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each yesNoOptions as { value, lable }}
			<input
				class="w-4 h-4 ml-8"
				name="live_stock_present"
				type="radio"
				bind:group={propertyProfileData.live_stock_present}
				{value}
			/>
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="live_stock_present">{lable}</label
			>
		{/each}
	</div>
	<h2 class="text-base font-semibold text-gray-900">
		Do you have a safe area for stock in the event of a bushfire or flood?
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="w-4 h-4 ml-8"
				name="live_stock_safe_area"
				type="radio"
				bind:group={propertyProfileData.live_stock_safe_area}
				{value}
			/>
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="live_stock_safe_area">{lable}</label
			>
		{/each}
	</div>
	<h2 class="text-base font-semibold text-gray-900">
		Would you let others leave their stock in your safe area, for a short time, in an emergency?
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="w-4 h-4 ml-8"
				name="share_livestock_safe_area"
				type="radio"
				bind:group={propertyProfileData.share_livestock_safe_area}
				{value}
			/>
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="share_livestock_safe_area">{lable}</label
			>
		{/each}
	</div>
	<TextAreaInput
		headingClass="text-base font-semibold pt-2 text-gray-900"
		headingText="If there are assets, other than the residence, that you consider essential (eg crops, sheds with equipment or antique cars) please describe them here."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_essential_assets"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={propertyProfileData.other_essential_assets}
	/>
	<input type="text" name="property_key" value={propertyProfileData.id} hidden />
	<div class="sticky mt-5 bottom-2">
		<div class="flex flex-row">
			<div class="w-1/2" />
			<button
				class="w-1/4 mx-3 mb-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
				on:click={() => {
					unsaved = false;
				}}
				hidden={!unsaved}
				type="submit"
				form="profileMyPlaceAssetsForm"
			>
				Save My Answers
			</button>
			<button
				class="w-1/4 mx-auto mb-3 rounded-lg text-base font-semibold bg-[#27C7BD] text-stone-100 border border-purple-700"
				on:click={() => {
					unsaved = false;
					location.reload();
				}}
				hidden={!unsaved}
				type="button"
			>
				Cancel
			</button>
		</div>
	</div>
</form>
