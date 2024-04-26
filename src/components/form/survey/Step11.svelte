<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { CommunityTinoneeProfileData } from '$lib/custom.types';

	export let communityTinoneeProfile: CommunityTinoneeProfileData;
	export let communityTinoneeWorkshopOptions: { value: string; lable: string }[] = [];
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Which of these Tinonee Community initiated workshops would be useful to you?<span
		class="text-sm text-gray-700"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityTinoneeProfile}
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
	>
		{#each communityTinoneeWorkshopOptions as { value, lable }}
			<div class="flex items-center col-span-1">
				<input
					class="w-6 h-6 ml-8"
					name="community_workshop_choices"
					type="checkbox"
					bind:group={communityTinoneeProfile.community_workshop_choices}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="community_workshop_choices">{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
		headingText="If there are other workshops that you would like to see run, please add
			the details here:"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={communityTinoneeProfile.other_community_workshop}
	/>
	<TextAreaInput
		headingClass="unstyled mb-1 text-xl font-semibold text-gray-900"
		headingText="If you would like to help run any of the workshops, please indicate which
			ones below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
		nameText="will_run_community_workshops"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={communityTinoneeProfile.will_run_community_workshops}
	/>
{/if}
