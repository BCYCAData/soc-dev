<script lang="ts">
	import TextAreaInput from '../inputs/TextAreaInput.svelte';

	import type { CommunityBCYCAProfileData } from '$lib/custom.types';

	export let communityBCYCAProfile: CommunityBCYCAProfileData;
	export let communityBCYCAMeetingOptions: { value: string; lable: string }[] = [];
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	What BCYCA Community Events are you interested in?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
{#if communityBCYCAProfile}
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-6 sm:gap-2"
	>
		{#each communityBCYCAMeetingOptions as { value, lable }}
			<div class="flex items-center col-span-1">
				<input
					class="w-6 h-6 ml-8"
					name="community_meeting_choices"
					type="checkbox"
					bind:group={communityBCYCAProfile.community_meeting_choices}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="community_meeting_choices">{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
		headingText="If there are other events you would be interested in, please add them
			below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
		nameText="other_community_meeting"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={communityBCYCAProfile.other_community_meeting}
	/>
{/if}
