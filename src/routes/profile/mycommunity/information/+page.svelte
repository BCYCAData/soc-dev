<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { informationSheetOptions } from '$lib/profileOptions';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import SaveProfilePrompt from '$components/form/SaveProfilePrompt.svelte';

	import type { PageData } from './$types';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton/utilities/Modal/types';
	import { modalStore } from '@skeletonlabs/skeleton/utilities/Modal/stores';

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
	$: ({ userBCYCAData } = data);
</script>

<svelte:head>
	<title>Profile-Community-Information</title>
</svelte:head>

<form
	id="profileMyCommunityInformationForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		What information would be useful to you?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#each informationSheetOptions as { value, lable }}
			<div class="flex items-center col-span-1">
				<input
					class="w-4 h-4 ml-8"
					name="information_sheet_choices"
					type="checkbox"
					bind:group={userBCYCAData.information_sheet_choices}
					{value}
				/>
				<label
					class="ml-2 text-base font-medium text-orange-900 font-Poppins"
					for="information_sheet_choices">{lable}</label
				>
			</div>
		{/each}
	</div>

	<!-- other_information_sheet -->
	<TextAreaInput
		headingClass="unstyled pt-2 text-base font-semibold text-gray-900"
		headingText="Is there other information which you would find useful?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_information_sheet"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={userBCYCAData.other_information_sheet}
	/>
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
				form="profileMyCommunityInformationForm"
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
