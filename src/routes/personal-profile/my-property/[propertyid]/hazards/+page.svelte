<script lang="ts">
	import { page } from '$app/state';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormActions from '$components/form/FormActions.svelte';

	import type { ActionData } from './$types';

	import { siteHazardsOptions, yesNoMaybeOptions } from '$lib/profile-options';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let unsaved = $state(false);
	let formError = $state(form?.error || false);
	let formErrorMessage = $state(form?.errorMessage || '');
	let formSuccess = $state(form?.success || false);

	const propertyId = page.params.propertyid;
	const currentProperty = $state(
		page.data.userProfile.property_profile.find(
			(property: { id: string }) => property.id === propertyId
		)
	);

	//@ts-ignore
	let site_hazards = $state(currentProperty.site_hazards);
	let other_site_hazards = $state(currentProperty.other_site_hazards);
	//@ts-ignore
	let land_adjacent_hazard = $state(currentProperty.land_adjacent_hazard);
	let other_hazards = $state(currentProperty.other_hazards);

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			site_hazards = currentProperty.site_hazards;
			other_site_hazards = currentProperty.other_site_hazards;
			land_adjacent_hazard = currentProperty.land_adjacent_hazard;
			other_hazards = currentProperty.other_hazards;
		}
	}
</script>

<svelte:head>
	<title>Profile-My Place-Hazards</title>
</svelte:head>
<form
	id="profileMyPlaceHazardsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">Hazards At My Place</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="unstyled text-base font-semibold text-gray-900">
		Do you have any of the following on your property?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#each siteHazardsOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-4 w-4"
					name="site_hazards"
					type="checkbox"
					bind:group={site_hazards}
					{value}
				/>
				<label class="font-Poppins ml-2 text-base font-medium text-orange-900" for="site_hazards"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="Are there any other hazards on the property that should be noted?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_site_hazards"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={other_site_hazards}
	/>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Does any adjoining land represent a hazard?
	</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="ml-8 h-4 w-4"
				name="land_adjacent_hazard"
				type="radio"
				bind:group={land_adjacent_hazard}
				{value}
			/>
			<label
				class="font-Poppins ml-2 text-base font-medium text-orange-900"
				for="land_adjacent_hazard">{lable}</label
			>
		{/each}
	</div>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="Are there other areas that concern you or represent a potential threat?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_hazards"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={other_hazards}
	/>
	<input type="hidden" name="property_key" value={currentProperty.id} />
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
