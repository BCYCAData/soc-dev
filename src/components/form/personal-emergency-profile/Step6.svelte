<script lang="ts">
	import {
		siteHazardsOptions,
		fireHazardReductionOptions,
		yesNoMaybeOptions
	} from '$lib/profile-options';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		propertyProfile: PropertyProfile;
	}

	let { propertyProfile = $bindable() }: Props = $props();

	propertyProfile.site_hazards = propertyProfile.site_hazards ?? [];
	propertyProfile.fire_hazard_reduction = propertyProfile.fire_hazard_reduction ?? [];
	propertyProfile.other_site_hazards = propertyProfile.other_site_hazards ?? '';
	propertyProfile.other_hazards = propertyProfile.other_hazards ?? '';
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Do you have any of the following on your property?
</h2>
<div
	class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-2"
>
	{#each siteHazardsOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6"
				name="site_hazards"
				type="checkbox"
				bind:group={propertyProfile.site_hazards}
				value={Number(value)}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="site_hazards">{lable}</label
			>
		</div>
	{/each}
</div>

<TextAreaInput
	headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
	headingText="Are there any other hazards on the property that should be noted?"
	lableClass={null}
	lableText={null}
	divClass="p-3 rounded-lg bg-secondary-300 sm:text-scale-5"
	nameText="other_site_hazards"
	textAreaClass="w-full resize-y sm:text-scale-5"
	bind:inputValue={propertyProfile.other_site_hazards}
/>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Does your property have:<span class="text-scale-3 ml-2 text-surface-500">
		(Check all that apply)</span
	>
</h2>
<div
	class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each fireHazardReductionOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6"
				name="fire_hazard_reduction"
				type="checkbox"
				bind:group={propertyProfile.fire_hazard_reduction}
				value={Number(value)}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="fire_hazard_reduction"
				>{lable}</label
			>
		</div>
	{/each}
</div>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Does any adjoining land represent a hazard?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="land_adjacent_hazard"
				type="radio"
				name="land_adjacent_hazard"
				bind:group={propertyProfile.land_adjacent_hazard}
				{value}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="land_adjacent_hazard"
				>{lable}</label
			>
		</div>
	{/each}
</div>

<TextAreaInput
	headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
	headingText="Are there other areas that concern you or represent a potential threat?"
	lableClass={null}
	lableText={null}
	divClass="p-3 rounded-lg bg-secondary-300 sm:text-scale-5"
	nameText="other_hazards"
	textAreaClass="w-full resize-y sm:text-scale-5"
	bind:inputValue={propertyProfile.other_hazards}
/>
