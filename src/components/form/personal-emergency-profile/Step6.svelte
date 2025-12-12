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

	let { propertyProfile }: Props = $props();

	let formState = $state({
		site_hazards: [] as number[],
		fire_hazard_reduction: [] as number[],
		other_site_hazards: '',
		other_hazards: '',
		land_adjacent_hazard: undefined as string | undefined
	});

	$effect(() => {
		formState.site_hazards = propertyProfile.site_hazards ?? [];
		formState.fire_hazard_reduction = propertyProfile.fire_hazard_reduction ?? [];
		formState.other_site_hazards = propertyProfile.other_site_hazards ?? '';
		formState.other_hazards = propertyProfile.other_hazards ?? '';
		formState.land_adjacent_hazard = propertyProfile.land_adjacent_hazard ?? undefined;
	});

	$effect(() => {
		propertyProfile.site_hazards = formState.site_hazards;
		propertyProfile.fire_hazard_reduction = formState.fire_hazard_reduction;
		propertyProfile.other_site_hazards = formState.other_site_hazards;
		propertyProfile.other_hazards = formState.other_hazards;
		propertyProfile.land_adjacent_hazard = formState.land_adjacent_hazard ?? null;
	});
</script>

<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	Do you have any of the following on your property?
</h2>
<div
	class="bg-secondary-200 grid grid-flow-col gap-2 rounded-lg p-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-2"
>
	{#each siteHazardsOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6"
				name="site_hazards"
				type="checkbox"
				bind:group={formState.site_hazards}
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
	bind:inputValue={formState.other_site_hazards}
/>

<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	Does your property have:<span class="ml-2 text-sm text-gray-500"> (Check all that apply)</span>
</h2>
<div
	class="bg-secondary-200 grid grid-flow-col gap-2 rounded-lg p-2 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each fireHazardReductionOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6"
				name="fire_hazard_reduction"
				type="checkbox"
				bind:group={formState.fire_hazard_reduction}
				value={Number(value)}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="fire_hazard_reduction"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	Does any adjoining land represent a hazard?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="land_adjacent_hazard"
				type="radio"
				name="land_adjacent_hazard"
				bind:group={formState.land_adjacent_hazard}
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
	bind:inputValue={formState.other_hazards}
/>
