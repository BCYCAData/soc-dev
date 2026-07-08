<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormWell from '$components/form/FormWell.svelte';

	import {
		staticWaterOptions,
		yesNoMaybeOptions,
		fireFightingResourceOptions,
		fireHazardReductionOptions
	} from '$lib/profile-options';

	import type { ActionData } from './$types';

	let noneChecked = $state(false);

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

	let staticWaterAvailable = $state(currentProperty.static_water_available);
	let haveStortz = $state(currentProperty.have_stortz);
	let stortzSize = $state(currentProperty.stortz_size);
	let fireFightingResources = $state(currentProperty.fire_fighting_resources);
	let fireHazardReduction = $state(currentProperty.fire_hazard_reduction);

	function handleReset() {
		unsaved = false;
		// Reset form to initial state
		staticWaterAvailable = currentProperty.static_water_available;
		haveStortz = currentProperty.have_stortz;
		stortzSize = currentProperty.stortz_size;
		fireFightingResources = currentProperty.fire_fighting_resources;
		fireHazardReduction = currentProperty.fire_hazard_reduction;
	}
</script>

<svelte:head>
	<title>Profile-My Place-Resources</title>
</svelte:head>

<form
	id="profileMyPlaceREsouresForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update, result }) => {
			await update({ reset: false });
			isSubmitting = false;
			if (result.type === 'success' && result.data?.success !== false) {
				unsaved = false;
			}
		};
	}}
>
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">Resources At My Place</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Are there any static water supplies on the property?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<FormWell>
		{#each staticWaterOptions as { value, lable } (value)}
			{#if value < 5}
				<input
					class="ml-8 h-4 w-4"
					name="static_water_available"
					type="checkbox"
					bind:group={staticWaterAvailable}
					value={Number(value)}
					checked={staticWaterAvailable?.includes(Number(value)) && !noneChecked}
				/>
			{:else}
				<input
					class="ml-8 h-4 w-4"
					name="static_water_available"
					type="checkbox"
					bind:group={staticWaterAvailable}
					value={Number(value)}
					onchange={() => (noneChecked = !noneChecked)}
					checked={noneChecked}
				/>
			{/if}
			<label
				class="font-Poppins text-secondary-900 ml-2 text-base font-medium"
				for="static_water_available">{lable}</label
			>
		{/each}
	</FormWell>
	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Do you have a Stortz fitting attached to a water tank?
	</h2>
	<FormWell>
		{#each yesNoMaybeOptions as { value, lable } (value)}
			<input class="ml-8 h-4 w-4" name="have_stortz" type="radio" bind:group={haveStortz} {value} />
			<label class="font-Poppins text-secondary-900 ml-2 text-base font-medium" for="have_stortz"
				>{lable}</label
			>
		{/each}
	</FormWell>
	{#if haveStortz === 'Y'}
		<h2 class="unstyled text-surface-900 text-base font-semibold">Please include the size (mm)</h2>
		<input
			type="number"
			id="stortz_size"
			name="stortz_size"
			class="border-secondary-700 ml-4 w-20 rounded border py-1 text-center sm:text-lg"
			bind:value={stortzSize}
		/>
	{/if}
	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Do you have any of the following at this property?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<FormWell>
		{#each fireFightingResourceOptions as { value, lable } (value)}
			<input
				class="ml-8 h-4 w-4"
				name="fire_fighting_resources"
				type="checkbox"
				bind:group={fireFightingResources}
				value={Number(value)}
				checked={fireFightingResources?.includes(Number(value))}
			/>
			<label
				class="font-Poppins text-secondary-900 ml-2 text-base font-medium"
				for="fire_fighting_resources">{lable}</label
			>
		{/each}
	</FormWell>
	<h2 class="unstyled text-surface-900 text-base font-semibold">
		Does your property have?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<FormWell layout="grid-2">
		{#each fireHazardReductionOptions as { value, lable } (value)}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-4 w-4"
					name="fire_hazard_reduction"
					type="checkbox"
					bind:group={fireHazardReduction}
					value={Number(value)}
					checked={fireHazardReduction?.includes(Number(value))}
				/>
				<label
					class="font-Poppins text-secondary-900 ml-2 text-base font-medium"
					for="fire_hazard_reduction">{lable}</label
				>
			</div>
		{/each}
	</FormWell>
	<input type="hidden" name="property_key" value={currentProperty.id} />
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
