<script lang="ts">
	import TextAreaInput from '../inputs/TextAreaInput.svelte';
	import type { BCYCACommunityProfile } from '$lib/form.types';

	interface Props {
		communityBCYCAProfile: BCYCACommunityProfile;
		communityBCYCAMeetingOptions?: { value: string; lable: string }[];
	}

	let { communityBCYCAProfile, communityBCYCAMeetingOptions = [] }: Props = $props();

	let formState = $state({
		community_meeting_choices: communityBCYCAProfile?.community_meeting_choices ?? [],
		other_community_meeting: communityBCYCAProfile?.other_community_meeting ?? ''
	});

	$effect(() => {
		if (communityBCYCAProfile) {
			communityBCYCAProfile.community_meeting_choices = formState.community_meeting_choices;
			communityBCYCAProfile.other_community_meeting = formState.other_community_meeting;
		}
	});
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What BCYCA Community Events are you interested in?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityBCYCAProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-6 sm:gap-2"
	>
		{#each communityBCYCAMeetingOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="community_meeting_choices"
					type="checkbox"
					bind:group={formState.community_meeting_choices}
					value={Number(value)}
					checked={formState.community_meeting_choices.includes(Number(value))}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="community_meeting_choices"
					>{lable}</label
				>
			</div>
		{/each}
	</div>

	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If there are other events you would be interested in, please add them below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="other_community_meeting"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={formState.other_community_meeting}
	/>
{/if}
