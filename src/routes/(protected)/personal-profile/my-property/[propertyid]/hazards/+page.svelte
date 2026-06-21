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
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">Hazards At My Place</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Do you have any of the following on your property?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<div class="bg-secondary-300 flex justify-start rounded-lg p-1">
		{#each siteHazardsOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-4 w-4"
					name="site_hazards"
					type="checkbox"
					bind:group={site_hazards}
					{value}
				/>
				<label class="font-Poppins text-secondary-900 ml-2 text-base font-medium" for="site_hazards"
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
	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Does any adjoining land represent a hazard?
	</h2>
	<div class="bg-secondary-300 flex justify-start rounded-lg p-1">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="ml-8 h-4 w-4"
				name="land_adjacent_hazard"
				type="radio"
				bind:group={land_adjacent_hazard}
				{value}
			/>
			<label
				class="font-Poppins text-secondary-900 ml-2 text-base font-medium"
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
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
