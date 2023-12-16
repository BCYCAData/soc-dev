<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import {
		staticWaterOptions,
		yesNoMaybeOptions,
		fireFightingResources,
		fireHazardReductionOptions
	} from '$lib/profileOptions';

	import { getModalStore } from '@skeletonlabs/skeleton';

	import type { ModalSettings } from '@skeletonlabs/skeleton';

	let unsaved = false;

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerSaveProfilePrompt();
		}
	});

	const modalStore = getModalStore();

	function triggerSaveProfilePrompt(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSaveProfilePrompt'
		};
		modalStore.trigger(modal);
	}

	let noneChecked = false;

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

	export let data;
	$: ({ propertyProfileData } = data);
</script>

<svelte:head>
	<title>Profile-My Place-Resources</title>
</svelte:head>

<form
	id="profileMyPlaceREsouresForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Are there any static water supplies on the property?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each staticWaterOptions as { value, lable }}
			{#if value < 5}
				<input
					class="w-4 h-4 ml-8"
					name="static_water_available"
					type="checkbox"
					bind:group={propertyProfileData.static_water_available}
					{value}
					on:change={(e) => {
						setStaticWater(e);
					}}
				/>
			{:else}
				<input
					class="w-4 h-4 ml-8"
					name="static_water_available"
					type="checkbox"
					bind:group={propertyProfileData.static_water_available}
					{value}
					on:change={(e) => {
						unCheckAllStaticWater(e);
					}}
					checked={noneChecked}
				/>
			{/if}
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="static_water_available">{lable}</label
			>
		{/each}
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Do you have a Stortz fitting attached to a water tank?
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				on:change={() => {
					propertyProfileData.have_stortz = value;
				}}
				class="w-4 h-4 ml-8"
				name="have_stortz"
				type="radio"
				bind:group={propertyProfileData.have_stortz}
				{value}
			/>
			<label class="ml-2 text-base font-medium text-orange-900 font-Poppins" for="have_stortz"
				>{lable}</label
			>
		{/each}
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">Please include the size (mm)</h2>
	<input
		type="number"
		id="stortz_size"
		name="stortz_size"
		class="border border-orange-700 w-20 rounded ml-4 py-1 sm:text-lg"
		bind:value={propertyProfileData.stortz_size}
	/>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Do you have any of the following at this property?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each fireFightingResources as { value, lable }}
			<input
				class="w-4 h-4 ml-8"
				name="fire_fighting_resources"
				type="checkbox"
				bind:group={propertyProfileData.fire_fighting_resources}
				{value}
			/>
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="fire_fighting_resources">{lable}</label
			>
		{/each}
	</div>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Does your property have?<span class="ml-2 text-sm text-gray-500"> (Check all that apply)</span>
	</h2>
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
	>
		{#each fireHazardReductionOptions as { value, lable }}
			<div class="flex items-center col-span-1">
				<input
					class="w-4 h-4 ml-8"
					name="fire_hazard_reduction"
					type="checkbox"
					bind:group={propertyProfileData.fire_hazard_reduction}
					{value}
				/>
				<label
					class="ml-2 text-base font-medium text-orange-900 font-Poppins"
					for="fire_hazard_reduction">{lable}</label
				>
			</div>
		{/each}
	</div>
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
				form="profileMyPlaceREsouresForm"
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
