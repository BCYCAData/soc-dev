<script lang="ts">
	import {
		staticWaterOptions,
		yesNoMaybeOptions,
		fireFightingResources
	} from '$lib/profileOptions';

	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PropertyProfileData } from '$lib/custom.types';

	export let propertyProfile: PropertyProfileData;

	let noneChecked = false;
	let have_stortzChecked = propertyProfile.have_stortz == 'Y';

	let selectedStaticSources = new Set<EventTarget & HTMLInputElement>();

	const unCheckAllStaticWater = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			for (const source of selectedStaticSources) {
				source.checked = false;
			}
			selectedStaticSources.clear();
			noneChecked = true;
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

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Are there any static water supplies on the property?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each staticWaterOptions as { value, lable }}
		{#if value < 5}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8"
					id="static_water_available"
					type="checkbox"
					bind:group={propertyProfile.static_water_available}
					name="static_water_available"
					{value}
					on:change={(e) => {
						setStaticWater(e);
					}}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="static_water_available">{lable}</label
				>
			</div>
		{:else}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8"
					id="static_water_available"
					type="checkbox"
					name="static_water_available"
					bind:group={propertyProfile.static_water_available}
					{value}
					on:change={(e) => {
						unCheckAllStaticWater(e);
					}}
					checked={noneChecked}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="static_water_available">{lable}</label
				>
			</div>
		{/if}
	{/each}
</div>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Do you have a Stortz fitting attached to a water tank?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoMaybeOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="w-6 h-6 ml-8"
				id="have_stortz"
				type="radio"
				name="have_stortz"
				on:change={(e) => {
					have_stortzChecked = e.currentTarget.value == 'Y';
				}}
				bind:group={propertyProfile.have_stortz}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="have_stortz"
				>{lable}</label
			>
		</div>
	{/each}
</div>
{#if have_stortzChecked}
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">Please include the size</h2>
	<div class="p-2 flex flex-wrap justify-between rounded-lg bg-orange-200">
		<div class="flex items-center">
			<NumberInput
				name="stortz_size"
				lable="Size (mm)"
				lableClass="min-w-fit mr-3 text-xl font-medium text-orange-900 font-Poppins"
				inputClass="max-w-sm border border-orange-700 w-20 rounded sm:text-lg"
				divClass="flex items-center"
				bind:inputValue={propertyProfile.stortz_size}
			/>
		</div>
	</div>
{/if}

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Do you have any of the following at this property?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each fireFightingResources as { value, lable }}
		<div class="flex items-center">
			<input
				class="w-6 h-6 ml-8"
				id="fire_fighting_resources"
				type="checkbox"
				name="fire_fighting_resources"
				bind:group={propertyProfile.fire_fighting_resources}
				{value}
			/>
			<label
				class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
				for="fire_fighting_resources">{lable}</label
			>
		</div>
	{/each}
</div>
