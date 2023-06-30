<script lang="ts">
	import {
		siteHazardsOptions,
		fireHazardReductionOptions,
		yesNoMaybeOptions
	} from '$lib/profileOptions';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { PropertyProfileData } from '$lib/custom.types';

	export let propertyProfileData: PropertyProfileData;
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Do you have any of the following on your property?
</h2>
<div
	class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-4 sm:grid-rows-2 sm:gap-2"
>
	{#each siteHazardsOptions as { value, lable }}
		<div class="flex items-center col-span-1">
			<input class="w-6 h-6 ml-8" name="site_hazards" type="checkbox" {value} />
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="site_hazards"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<TextAreaInput
	headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
	headingText="Are there any other hazards on the property that should be noted?"
	lableClass={null}
	lableText={null}
	divClass="p-3 rounded-lg bg-orange-300 sm:text-lg"
	nameText="other_site_hazards"
	textAreaClass="w-full resize-y sm:text-lg"
	bind:inputValue={propertyProfileData.other_site_hazards}
/>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Does your property have:<span class="ml-2 text-sm text-gray-500"> (Check all that apply)</span>
</h2>
<div
	class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each fireHazardReductionOptions as { value, lable }}
		<div class="flex items-center col-span-1">
			<input
				class="w-6 h-6 ml-8"
				name="fire_hazard_reduction"
				type="checkbox"
				bind:group={propertyProfileData.fire_hazard_reduction}
				{value}
			/>
			<label
				class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
				for="fire_hazard_reduction">{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Does any adjoining land represent a hazard?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="w-6 h-6 ml-8"
				id="land_adjacent_hazard"
				type="radio"
				name="land_adjacent_hazard"
				bind:group={propertyProfileData.land_adjacent_hazard}
				{value}
			/>
			<label
				class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
				for="land_adjacent_hazard">{lable}</label
			>
		</div>
	{/each}
</div>
<TextAreaInput
	headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
	headingText="Are there other areas that concern you or represent a potential threat?"
	lableClass={null}
	lableText={null}
	divClass="p-3 rounded-lg bg-orange-300 sm:text-lg"
	nameText="other_hazards"
	textAreaClass="w-full resize-y sm:text-lg"
	bind:inputValue={propertyProfileData.other_hazards}
/>
