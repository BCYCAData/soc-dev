<script lang="ts">
	import { beforeNavigate } from '$app/navigation';

	import SaveProfilePrompt from '$components/form/SaveProfilePrompt.svelte';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { PageData } from './$types';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton/utilities/Modal/types';
	import { modalStore } from '@skeletonlabs/skeleton/utilities/Modal/stores';
	import { siteHazardsOptions, yesNoMaybeOptions } from '$lib/profileOptions';

	let unsaved = false;

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerCustomModal();
		}
	});

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: SaveProfilePrompt
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			modalClasses: '!overflow-y-auto !max-h-full !relative'
		};
		modalStore.trigger(d);
	}
	export let data: PageData;
	$: ({ propertyProfileData } = data);
</script>

<svelte:head>
	<title>Profile-My Place-Hazards</title>
</svelte:head>
<form
	id="profileMyPlaceHazardsForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="text-base font-semibold text-gray-900">
		Do you have any of the following on your property?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each siteHazardsOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-4 h-4 ml-8"
					name="site_hazards"
					type="checkbox"
					bind:group={propertyProfileData.site_hazards}
					{value}
				/>
				<label class="ml-2 text-base font-medium text-orange-900 font-Poppins" for="site_hazards"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="pt-2 text-base font-semibold text-gray-900"
		headingText="Are there any other hazards on the property that should be noted?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_site_hazards"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={propertyProfileData.other_site_hazards}
	/>
	<h2 class="text-base font-semibold text-gray-900">Does any adjoining land represent a hazard?</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each yesNoMaybeOptions as { value, lable }}
			<input
				class="w-4 h-4 ml-8"
				name="land_adjacent_hazard"
				type="radio"
				bind:group={propertyProfileData.land_adjacent_hazard}
				{value}
			/>
			<label
				class="ml-2 text-base font-medium text-orange-900 font-Poppins"
				for="land_adjacent_hazard">{lable}</label
			>
		{/each}
	</div>
	<TextAreaInput
		headingClass="pt-2 text-base font-semibold text-gray-900"
		headingText="Are there other areas that concern you or represent a potential threat?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_hazards"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={propertyProfileData.other_hazards}
	/>
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
				form="profileMyPlaceHazardsForm"
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
