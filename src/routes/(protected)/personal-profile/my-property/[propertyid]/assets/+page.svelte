<script lang="ts">
	import { page } from '$app/state';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormActions from '$components/form/FormActions.svelte';

	import type { ActionData } from './$types';

	import { yesNoOptions, yesNoMaybeOptions } from '$lib/profile-options';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let unsaved = $state(false);
	let isSubmitting = $state(false);
	let formError = $derived(form?.error || false);
	let formErrorMessage = $derived(form?.errorMessage || '');
	let formSuccess = $derived(form?.success || false);
	const propertyId = page.params.propertyid;
	const currentProperty = $state(
		page.data.userProfile.property_profile.find(
			(property: { id: string }) => property.id === propertyId
		)
	);
	//@ts-ignore
	let live_stock_present = $state(currentProperty.live_stock_present);
	//@ts-ignore
	let live_stock_safe_area = $state(currentProperty.live_stock_safe_area);
	//@ts-ignore
	let share_livestock_safe_area = $state(currentProperty.share_livestock_safe_area);
	let number_birds = $state(currentProperty.number_birds);
	let number_cats = $state(currentProperty.number_cats);
	let number_dogs = $state(currentProperty.number_dogs);
	let number_other_pets = $state(currentProperty.number_other_pets);
	let other_essential_assets = $state(currentProperty.other_essential_assets);

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			live_stock_present = currentProperty.live_stock_present;
			live_stock_safe_area = currentProperty.live_stock_safe_area;
			share_livestock_safe_area = currentProperty.share_livestock_safe_area;
			number_birds = currentProperty.number_birds;
			number_cats = currentProperty.number_cats;
			number_dogs = currentProperty.number_dogs;
			number_other_pets = currentProperty.number_other_pets;
			other_essential_assets = currentProperty.other_essential_assets;
		}
	}
</script>

<svelte:head>
	<title>Profile-My Place-Assets</title>
</svelte:head>

<form
	id="profileMyPlaceAssetsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">Assets At My Place</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="unstyled text-base font-semibold text-gray-900">
		How many pets do you usually have at this property?
	</h2>
	<div class="flex flex-row justify-around rounded-lg bg-orange-300 p-2 sm:text-lg">
		<NumberInput
			name="number_dogs"
			lable="Dogs"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
			bind:inputValue={number_dogs}
		/>
		<NumberInput
			name="number_cats"
			lable="Cats"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
			bind:inputValue={number_cats}
		/>
		<NumberInput
			name="number_birds"
			lable="Birds"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
			bind:inputValue={number_birds}
		/>
		<NumberInput
			name="number_other_pets"
			lable="Other"
			lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
			bind:inputValue={number_other_pets}
		/>
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">Do you have livestock?</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#each yesNoOptions as { value, lable }}
			<input
				class="ml-8 h-4 w-4"
				name="live_stock_present"
				type="radio"
				bind:group={live_stock_present}
				{value}
			/>
			<label
				class="font-Poppins ml-2 text-base font-medium text-orange-900"
				for="live_stock_present">{lable}</label
			>
		{/each}
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Do you have a safe area for stock in the event of a bushfire or flood?
	</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="ml-8 h-4 w-4"
				name="live_stock_safe_area"
				type="radio"
				bind:group={live_stock_safe_area}
				{value}
			/>
			<label
				class="font-Poppins ml-2 text-base font-medium text-orange-900"
				for="live_stock_safe_area">{lable}</label
			>
		{/each}
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Would you let others leave their stock in your safe area, for a short time, in an emergency?
	</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="ml-8 h-4 w-4"
				name="share_livestock_safe_area"
				type="radio"
				bind:group={share_livestock_safe_area}
				{value}
			/>
			<label
				class="font-Poppins ml-2 text-base font-medium text-orange-900"
				for="share_livestock_safe_area">{lable}</label
			>
		{/each}
	</div>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If there are assets, other than the residence, that you consider essential (eg crops, sheds with equipment or antique cars) please describe them here."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_essential_assets"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={other_essential_assets}
	/>
	<input type="hidden" name="property_key" value={currentProperty.id} />
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
