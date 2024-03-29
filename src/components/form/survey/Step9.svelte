<script lang="ts">
	import { informationSheetOptions } from '$lib/profileOptions';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { CommunityBCYCAProfileData } from '$lib/custom.types';

	export let communityBCYCAProfile: CommunityBCYCAProfileData;
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	What information would be useful to you?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
{#if communityBCYCAProfile}
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#each informationSheetOptions as { value, lable }}
			<div class="flex items-center col-span-1">
				<input
					class="w-6 h-6 ml-8"
					name="information_sheet_choices"
					type="checkbox"
					bind:group={communityBCYCAProfile.information_sheet_choices}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="information_sheet_choices">{lable}</label
				>
			</div>
		{/each}
	</div>

	<TextAreaInput
		headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
		headingText="Is there other information which you would find useful?"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-orange-300 sm:text-lg"
		nameText="other_information_sheet"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={communityBCYCAProfile.other_information_sheet}
	/>
{/if}
