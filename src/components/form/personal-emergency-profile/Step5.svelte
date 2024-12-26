<script lang="ts">
	import {
		staticWaterOptions,
		yesNoMaybeOptions,
		fireFightingResourceOptions
	} from '$lib/profile-options';

	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PropertyProfile } from '$lib/form.types';

	type Props = {
		propertyProfile: PropertyProfile;
	};

	let { propertyProfile = $bindable() }: Props = $props();

	propertyProfile.static_water_available = propertyProfile.static_water_available ?? [];
	propertyProfile.fire_fighting_resources = propertyProfile.fire_fighting_resources ?? [];

	let noneChecked = $state(false);
	let have_stortzChecked = $state(propertyProfile.have_stortz === 'Y');

	let selectedStaticSources = new Set<EventTarget & HTMLInputElement>();

	const unCheckAllStaticWater = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			for (const source of selectedStaticSources) {
				source.checked = false;
			}
			selectedStaticSources.clear();
			noneChecked = true;
			propertyProfile.static_water_available = []; // Clear the array when "None" is selected
		}
	};

	const setStaticWater = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			selectedStaticSources.add(e.currentTarget);
		} else {
			selectedStaticSources.delete(e.currentTarget);
		}
		if (noneChecked) {
			noneChecked = false;
		}
	};
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Are there any static water supplies on the property?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each staticWaterOptions as { value, lable }}
		{#if value < 5}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="static_water_available_{value}"
					type="checkbox"
					bind:group={propertyProfile.static_water_available}
					name="static_water_available"
					value={Number(value)}
					checked={propertyProfile.static_water_available?.includes(Number(value))}
					onchange={setStaticWater}
				/>
				<label
					class="text-scale-6 ml-2 font-medium text-orange-900"
					for="static_water_available_{value}">{lable}</label
				>
			</div>
		{:else}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="static_water_available_{value}"
					type="checkbox"
					name="static_water_available"
					bind:group={propertyProfile.static_water_available}
					value={Number(value)}
					onchange={unCheckAllStaticWater}
					checked={noneChecked}
				/>
				<label
					class="text-scale-6 ml-2 font-medium text-orange-900"
					for="static_water_available_{value}">{lable}</label
				>
			</div>
		{/if}
	{/each}
</div>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Do you have a Stortz fitting attached to a water tank?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="have_stortz_{value}"
				type="radio"
				name="have_stortz"
				onchange={(e) => {
					have_stortzChecked = e.currentTarget.value === 'Y';
				}}
				bind:group={propertyProfile.have_stortz}
				{value}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="have_stortz_{value}"
				>{lable}</label
			>
		</div>
	{/each}
</div>

{#if have_stortzChecked}
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">Please include the size</h2>
	<div class="flex flex-wrap justify-between rounded-lg bg-secondary-200 p-2">
		<div class="flex items-center">
			<NumberInput
				name="stortz_size"
				lable="Size (mm)"
				lableClass="min-w-fit mr-3 text-scale-6 font-medium text-orange-900 font-Poppins"
				inputClass="max-w-sm border border-secondary-700 text-center w-20 rounded sm:text-scale-5"
				divClass="flex items-center"
				bind:inputValue={propertyProfile.stortz_size}
			/>
		</div>
	</div>
{/if}

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Do you have any of the following at this property?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each fireFightingResourceOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="fire_fighting_resources_{value}"
				type="checkbox"
				name="fire_fighting_resources"
				bind:group={propertyProfile.fire_fighting_resources}
				value={Number(value)}
				checked={propertyProfile.fire_fighting_resources?.includes(Number(value)) ?? false}
			/>
			<label
				class="text-scale-6 ml-2 font-medium text-orange-900"
				for="fire_fighting_resources_{value}">{lable}</label
			>
		</div>
	{/each}
</div>
